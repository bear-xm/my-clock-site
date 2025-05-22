// src/components/WorldMap.tsx
import React, { useEffect, useState } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
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

  // SVG viewBox 大小
  const viewWidth = 800;
  const viewHeight = 400;

  // 与 <ComposableMap> 保持一致的投影
  const projection = geoMercator()
    .scale(100)
    .center([0, 20])
    .translate([viewWidth / 2, viewHeight / 2]);

  // 加载拓扑数据
  useEffect(() => {
    const geo = feature(
      worldData as any,
      (worldData as any).objects.countries
    ).features;
    setFeatures(geo);
  }, []);

  // 每秒更新时间
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // 重叠检测与偏移参数
  const thresholdPx = 30;   // 屏幕像素阈值：小于此距离视为重叠
  const baseOffset = -22;   // 基础垂直偏移（px）
  const deltaY = 16;        // 每次错开增量（px）

  // 计算每个 zone 的像素坐标
  const zonePoints = zones.map(zone => {
    const city = cityCoords[zone];
    const [lng, lat] = city?.coordinates ?? [0, 0];
    const [x, y] = projection([lng, lat]);
    return { zone, lng, lat, x, y };
  });

  // 计算竖向偏移，依次累加错开
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
        {/* 世界地图底图 */}
        <Geographies geography={features}>
          {({ geographies }) =>
            geographies.map((geo: any) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                className="fill-slate-800 stroke-slate-600"
              />
            ))
          }
        </Geographies>

        {/* 城市标记与自动错开标签 */}
        {zonePoints.map(({ zone, lng, lat }) => {
          const city = cityCoords[zone];
          const cityName = city?.name ?? zone.split('/').pop()!.replace(/_/g, ' ');
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
              <circle r={2} fill="#22d3ee" stroke="#fff" strokeWidth={1} />
              <g transform={`translate(-16, ${offsetY})`}>
                <rect
                  width={32}
                  height={20}
                  rx={3}
                  fill="#0f172a"
                  opacity={0.88}
                />
                <text
                  x={16}
                  y={6}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-[0.25rem] font-semibold fill-cyan-300"
                  style={{ fontFamily: 'monospace', lineHeight: 1 }}
                >
                  {cityName}
                </text>
                <text
                  x={16}
                  y={14}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-[0.375rem] fill-gray-300"
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
