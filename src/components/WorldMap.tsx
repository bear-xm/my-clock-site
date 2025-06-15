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

  // 宽高：为底部标签预留额外空间
  const viewWidth = 800;
  const viewHeight = 450;

  // 标签尺寸与行高
  const rectWidth = 60;
  const rectHeight = 44;
  const nameY = 14;
  const timeY = 28;

  // 投影
  const projection = geoMercator()
    .scale(100)
    .center([0, 20])
    .translate([viewWidth / 2, viewHeight / 2]);

  // 加载地图
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
  const baseOffset = -24;
  const deltaY = 20;

  // 计算各点屏幕坐标
  const zonePoints = zones.map((zone) => {
    const city = cityCoords[zone];
    const coords = city?.coordinates ?? [0, 0];
    const [lng, lat] = coords;
    const [x, y] = projection([lng, lat]) ?? [0, 0];
    return { zone, lng, lat, x, y };
  });

  // 计算纵向偏移并防止超出上下边界
  const labelOffsets: Record<string, number> = {};
  zonePoints.forEach((pt, i) => {
    let overlap = 0;
    for (let j = 0; j < i; j++) {
      const prev = zonePoints[j];
      if (
        Math.abs(pt.x - prev.x) < thresholdPx &&
        Math.abs(pt.y - prev.y) < thresholdPx
      ) {
        overlap++;
      }
    }
    let yOffset = baseOffset - overlap * deltaY;

    // 上边界：不要跑到画布上方
    if (pt.y + yOffset < 0) {
      yOffset = -pt.y + 2;
    }
    // 下边界：不要跑到画布底部
    const bottomY = pt.y + yOffset + rectHeight;
    if (bottomY > viewHeight) {
      yOffset -= bottomY - viewHeight + 2;
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

        {zonePoints.map(({ zone, lng, lat }) => {
          const city = cityCoords[zone];
          const name =
            city?.name ?? zone.split('/').pop()!.replace(/_/g, ' ');
          const timeStr = now.toLocaleTimeString(undefined, {
            timeZone: zone,
            hour12: false,
          });
          const offsetY = labelOffsets[zone];

          return (
            <Marker
              key={zone}
              coordinates={[lng, lat]}
              onClick={() => onSelectZone?.(zone)}
              style={{ cursor: 'pointer' }}
            >
              <circle r={3} fill="#22d3ee" stroke="#fff" strokeWidth={1} />
              <g transform={`translate(${-rectWidth / 2}, ${offsetY})`}>
                <rect
                  width={rectWidth}
                  height={rectHeight}
                  rx={4}
                  fill="#0f172a"
                  opacity={0.88}
                />
                <text
                  x={rectWidth / 2}
                  y={nameY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-xs sm:text-sm font-semibold fill-cyan-300"
                  style={{ fontFamily: 'monospace', lineHeight: 1 }}
                >
                  {name}
                </text>
                <text
                  x={rectWidth / 2}
                  y={timeY}
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
