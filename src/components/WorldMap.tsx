// src/components/WorldMap.tsx
import React, { useEffect, useState } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from 'react-simple-maps';
import { feature } from 'topojson-client';
import { geoMercator } from 'd3-geo';
import worldData from '../data/world-110m.json';
import { cityCoords } from '../data/cityCoords';

interface WorldMapProps {
  onSelectZone?: (zoneId: string) => void;
  zones: string[];
}

const WorldMap: React.FC<WorldMapProps> = ({ onSelectZone, zones }) => {
  const [features, setFeatures] = useState<any[]>([]);
  const [now, setNow] = useState<Date>(new Date());

  const viewWidth = 800;
  const viewHeight = 400;
  const rectWidth = 60;
  const rectHeight = 52; // 增高以增大行距

  const projection = geoMercator()
    .scale(100)
    .center([0, 20])
    .translate([viewWidth / 2, viewHeight / 2]);

  // 加载世界地图
  useEffect(() => {
    const geo = feature(
      worldData as any,
      (worldData as any).objects.countries
    ).features;
    setFeatures(geo);
  }, []);

  // 更新时间
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // 重叠检测参数
  const thresholdPx = 40;
  const baseOffset = -30;
  const deltaY = 24;

  // 计算每个时区的投影点
  const zonePoints = zones.map((zone) => {
    const city = cityCoords[zone];
    const coords = city?.coordinates ?? [0, 0];
    const [lng, lat] = coords;
    const [x, y] = projection([lng, lat]) ?? [0, 0];
    return { zone, lng, lat, x, y };
  });

  // 计算每个标签的纵向偏移，并做边界（上下）限制
  const labelOffsets: Record<string, number> = {};
  zonePoints.forEach((pt, i) => {
    let overlapCount = 0;
    for (let j = 0; j < i; j++) {
      const prev = zonePoints[j];
      if (
        Math.abs(pt.x - prev.x) < thresholdPx &&
        Math.abs(pt.y - prev.y) < thresholdPx
      ) {
        overlapCount++;
      }
    }
    // 基准偏移
    let yOffset = baseOffset - overlapCount * deltaY;

    // 如果标签顶部跑到画布外，则下移到在顶部之内
    if (pt.y + yOffset < 0) {
      yOffset = -pt.y + 2; // 留一点边距
    }
    // 如果标签底部跑到画布外，则上移到在底部之内
    const bottomY = pt.y + yOffset + rectHeight;
    if (bottomY > viewHeight) {
      yOffset -= bottomY - viewHeight + 2; // 留一点边距
    }

    labelOffsets[pt.zone] = yOffset;
  });

  return (
    <div className="w-full h-screen bg-slate-900">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 100, center: [0, 20] }}
        viewBox={`0 0 ${viewWidth} ${viewHeight}`}
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-full"
      >
        {/* 地理要素 */}
        <Geographies geography={features}>
          {({ geographies }: { geographies: any[] }) =>
            geographies.map((geo: any) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                className="fill-slate-800 stroke-slate-600"
              />
            ))
          }
        </Geographies>

        {/* 时区标签 */}
        {zonePoints.map(({ zone, lng, lat }) => {
          const city = cityCoords[zone];
          const name =
            city?.name ?? zone.split('/').pop()!.replace(/_/g, ' ');
          const timeStr = now.toLocaleTimeString(undefined, {
            timeZone: zone,
            hour12: false,
          });
          const offsetY = labelOffsets[zone] ?? baseOffset;

          return (
            <Marker
              key={zone}
              coordinates={[lng, lat]}
              onClick={() => onSelectZone?.(zone)}
              style={{ cursor: 'pointer' }}
            >
              {/* 圆点 */}
              <circle r={3} fill="#22d3ee" stroke="#fff" strokeWidth={1} />
              {/* 标签框与文字 */}
              <g transform={`translate(${-rectWidth / 2}, ${offsetY})`}>
                <rect
                  width={rectWidth}
                  height={rectHeight}
                  rx={4}
                  fill="#0f172a"
                  opacity={0.88}
                />
                {/* 城市名：上行 */}
                <text
                  x={rectWidth / 2}
                  y={14}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-xs sm:text-sm font-semibold fill-cyan-300"
                  style={{ fontFamily: 'monospace', lineHeight: 1 }}
                >
                  {name}
                </text>
                {/* 时间：下行，y=14+24=38 */}
                <text
                  x={rectWidth / 2}
                  y={38}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-sm sm:text-base fill-gray-300"
                  style={{ fontFamily: 'monospace', lineHeight: 1 }}
                >
                  {timeStr}
                </text>
              </g>
            </Marker>
          );
        })}
      </ComposableMap>
    </div>
  );
};

export default WorldMap;
