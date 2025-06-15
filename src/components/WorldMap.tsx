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

  // 投影
  const projection = geoMercator()
    .scale(100)
    .center([0, 20])
    .translate([viewWidth / 2, viewHeight / 2]);

  // 加载地理数据
  useEffect(() => {
    const geo = feature(
      worldData as any,
      (worldData as any).objects.countries
    ).features;
    setFeatures(geo);
  }, []);

  // 每秒更新时间
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 重叠检测与标签偏移参数
  const thresholdPx = 40;   // 检测距离增大
  const baseOffset = -25;   // 基准垂直偏移
  const deltaY = 20;        // 每次叠加的垂直步长

  // 计算每个 zone 的屏幕坐标
  const zonePoints = zones.map((zone) => {
    const city = cityCoords[zone];
    const coords = city?.coordinates ?? [0, 0];
    const [lng, lat] = coords;
    const proj = projection([lng, lat]) ?? [0, 0];
    const [x, y] = proj;
    return { zone, lng, lat, x, y };
  });

  // 计算每个标签的垂直错开量，避免重叠
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
    labelOffsets[pt.zone] = baseOffset - overlapCount * deltaY;
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
        {/* 地图底图 */}
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

        {/* 城市标签 */}
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
              <circle r={3} fill="#22d3ee" stroke="#fff" strokeWidth={1} />
              {/* transform x 调整到 -30，以增大水平距离 */}
              <g transform={`translate(-30, ${offsetY})`}>
                <rect
                  width={60}
                  height={32}
                  rx={4}
                  fill="#0f172a"
                  opacity={0.88}
                />
                <text
                  x={30}
                  y={10}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-sm sm:text-base font-semibold fill-cyan-300"
                  style={{ fontFamily: 'monospace', lineHeight: 1 }}
                >
                  {name}
                </text>
                <text
                  x={30}
                  y={22}
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
