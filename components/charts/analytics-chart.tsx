"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TrendingUp, TrendingDown, BarChart3, LineChartIcon, PieChartIcon } from "lucide-react"

interface AnalyticsChartProps {
  title: string
  description?: string
  data: any[]
  type: "line" | "area" | "bar" | "pie"
  dataKey: string
  xAxisKey?: string
  color?: string
  showTrend?: boolean
  height?: number
  className?: string
}

const COLORS = ["#8B5CF6", "#EC4899", "#06B6D4", "#10B981", "#F59E0B", "#EF4444"]

export function AnalyticsChart({
  title,
  description,
  data,
  type,
  dataKey,
  xAxisKey = "date",
  color = "#8B5CF6",
  showTrend = false,
  height = 300,
  className = "",
}: AnalyticsChartProps) {
  const getChartIcon = () => {
    switch (type) {
      case "line":
        return <LineChartIcon className="w-5 h-5 text-purple-400" />
      case "area":
        return <LineChartIcon className="w-5 h-5 text-purple-400" />
      case "bar":
        return <BarChart3 className="w-5 h-5 text-purple-400" />
      case "pie":
        return <PieChartIcon className="w-5 h-5 text-purple-400" />
      default:
        return <LineChartIcon className="w-5 h-5 text-purple-400" />
    }
  }

  const calculateTrend = () => {
    if (!showTrend || data.length < 2) return null

    const firstValue = data[0][dataKey]
    const lastValue = data[data.length - 1][dataKey]
    const change = ((lastValue - firstValue) / firstValue) * 100

    return {
      value: Math.abs(change).toFixed(1),
      isPositive: change > 0,
    }
  }

  const trend = calculateTrend()

  const renderChart = () => {
    switch (type) {
      case "line":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey={xAxisKey} stroke="#9CA3AF" fontSize={12} />
              <YAxis stroke="#9CA3AF" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "8px",
                  color: "white",
                }}
              />
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke={color}
                strokeWidth={2}
                dot={{ fill: color, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )

      case "area":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={color} stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey={xAxisKey} stroke="#9CA3AF" fontSize={12} />
              <YAxis stroke="#9CA3AF" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "8px",
                  color: "white",
                }}
              />
              <Area type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} fill="url(#colorGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        )

      case "bar":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey={xAxisKey} stroke="#9CA3AF" fontSize={12} />
              <YAxis stroke="#9CA3AF" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "8px",
                  color: "white",
                }}
              />
              <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )

      case "pie":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey={dataKey}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "8px",
                  color: "white",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        )

      default:
        return null
    }
  }

  return (
    <Card className={`bg-black/20 backdrop-blur-xl border-white/10 ${className}`}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-white flex items-center gap-2">
              {getChartIcon()}
              {title}
            </CardTitle>
            {description && <CardDescription className="text-gray-400">{description}</CardDescription>}
          </div>

          {trend && (
            <div className={`flex items-center gap-1 text-sm ${trend.isPositive ? "text-green-400" : "text-red-400"}`}>
              {trend.isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span>{trend.value}%</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>{renderChart()}</CardContent>
    </Card>
  )
}

// プリセットチャート用のコンポーネント
export function HeartsTrendChart({ data, className }: { data: any[]; className?: string }) {
  return (
    <AnalyticsChart
      title="ハート数推移"
      description="過去30日間のハート獲得数"
      data={data}
      type="area"
      dataKey="hearts"
      xAxisKey="date"
      color="#EF4444"
      showTrend={true}
      className={className}
    />
  )
}

export function ListenersChart({ data, className }: { data: any[]; className?: string }) {
  return (
    <AnalyticsChart
      title="リスナー数推移"
      description="配信ごとのリスナー数"
      data={data}
      type="line"
      dataKey="listeners"
      xAxisKey="date"
      color="#06B6D4"
      showTrend={true}
      className={className}
    />
  )
}

export function StreamTypesChart({ data, className }: { data: any[]; className?: string }) {
  return (
    <AnalyticsChart
      title="配信タイプ別分析"
      description="配信タイプの割合"
      data={data}
      type="pie"
      dataKey="value"
      className={className}
    />
  )
}

export function PerformanceBarChart({ data, className }: { data: any[]; className?: string }) {
  return (
    <AnalyticsChart
      title="月別パフォーマンス"
      description="月ごとの配信成果"
      data={data}
      type="bar"
      dataKey="hearts"
      xAxisKey="month"
      color="#8B5CF6"
      showTrend={true}
      className={className}
    />
  )
}
