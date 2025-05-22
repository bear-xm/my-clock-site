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

  const viewWidth = 800;
  const viewHeight = 400;

  const projection = geoMercator()
    .scale(100)
    .center([0, 20])
    .translate([viewWidth / 2, viewHeight / 2]);

  // 加载 topojson
  useEffect(() => {
    const geo = feature(
      worldData as any,
      (worldData as any).objects.countries
    ).features;
    setFeatures(geo);
  }, []);

  // 更新时间
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 重叠检测参数
  const thresholdPx = 30;
  const baseOffset = -22;
  const deltaY = 16;

  // 计算每个时区在 SVG 上的像素位置，并安全解构
  const zonePoints = zones.map(zone => {
    const city = cityCoords[zone];
    const coords = city?.coordinates ?? [0, 0];
    const [lng, lat] = coords;
    // projection 可能返回 null，必须处理
    const proj = projection([lng, lat]) ?? [0, 0];
    const [x, y] = proj;
    return { zone, lng, lat, x, y };
  });

  // 为重叠标签计算垂直偏移
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
