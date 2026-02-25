import { SalesPoint } from "@/lib/api";

interface SalesChartProps {
  data: SalesPoint[];
}

const CHART_WIDTH = 1080;
const CHART_HEIGHT = 240;

const normalize = (data: SalesPoint[]) => {
  const max = Math.max(...data.map((item) => item.total), 1);
  const min = Math.min(...data.map((item) => item.total), 0);
  const spread = max - min || 1;

  return data.map((item, index) => {
    const x = (index / Math.max(data.length - 1, 1)) * CHART_WIDTH;
    const y = CHART_HEIGHT - ((item.total - min) / spread) * (CHART_HEIGHT - 30) - 10;
    return { x, y };
  });
};

const lineFromPoints = (points: Array<{ x: number; y: number }>) =>
  points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

export function SalesChart({ data }: SalesChartProps) {
  const points = normalize(data);
  const linePath = lineFromPoints(points);
  const areaPath = `${linePath} L ${CHART_WIDTH} ${CHART_HEIGHT} L 0 ${CHART_HEIGHT} Z`;

  return (
    <div className="mt-6">
      <svg viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT + 32}`} className="h-[260px] w-full">
        <defs>
          <linearGradient id="salesArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {Array.from({ length: 5 }).map((_, index) => {
          const y = (index / 4) * CHART_HEIGHT;
          return <line key={index} x1={0} y1={y} x2={CHART_WIDTH} y2={y} stroke="#e3e8f2" strokeWidth={1} />;
        })}

        <path d={areaPath} fill="url(#salesArea)" />
        <path d={linePath} stroke="#4f46e5" strokeWidth={3} fill="none" />

        {data.map((item, index) => (
          <text
            key={`${item.month}-${index}`}
            x={(index / Math.max(data.length - 1, 1)) * CHART_WIDTH}
            y={CHART_HEIGHT + 24}
            textAnchor="middle"
            className="fill-[#6e7a89] text-[11px]"
          >
            {item.month}
          </text>
        ))}
      </svg>
    </div>
  );
}
