"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  TrendingUp,
  Heart,
  Star,
  Users,
  Trophy,
  Clock,
  ArrowUp,
  Activity,
  PieChart,
  LineChart,
  Download,
  Share2,
} from "lucide-react"
import { motion } from "framer-motion"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Cell,
  Area,
  AreaChart,
  Pie,
} from "recharts"

interface AnalyticsData {
  overview: {
    totalStreams: number
    totalHearts: number
    totalSpoons: number
    totalListeners: number
    averageRank: number
    bestRank: number
    totalStreamTime: string
    growthRate: number
  }
  trends: {
    daily: Array<{
      date: string
      hearts: number
      spoons: number
      listeners: number
      rank: number
    }>
    weekly: Array<{
      week: string
      hearts: number
      spoons: number
      listeners: number
      streams: number
    }>
    monthly: Array<{
      month: string
      hearts: number
      spoons: number
      listeners: number
      streams: number
    }>
  }
  categories: Array<{
    name: string
    value: number
    color: string
  }>
  topListeners: Array<{
    name: string
    totalHearts: number
    totalSpoons: number
    appearances: number
  }>
  performance: {
    bestPerformingTimes: Array<{
      time: string
      avgHearts: number
      avgListeners: number
    }>
    streamTypes: Array<{
      type: string
      count: number
      avgHearts: number
      avgSpoons: number
    }>
  }
}

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("7d")
  const [selectedMetric, setSelectedMetric] = useState("hearts")
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // サンプルデータの生成
  useEffect(() => {
    const generateSampleData = (): AnalyticsData => {
      const dailyData = Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        hearts: Math.floor(Math.random() * 500) + 200,
        spoons: Math.floor(Math.random() * 50) + 10,
        listeners: Math.floor(Math.random() * 100) + 30,
        rank: Math.floor(Math.random() * 50) + 1,
      }))

      const weeklyData = Array.from({ length: 12 }, (_, i) => ({
        week: `第${i + 1}週`,
        hearts: Math.floor(Math.random() * 2000) + 1000,
        spoons: Math.floor(Math.random() * 200) + 100,
        listeners: Math.floor(Math.random() * 400) + 200,
        streams: Math.floor(Math.random() * 7) + 3,
      }))

      const monthlyData = Array.from({ length: 6 }, (_, i) => ({
        month: `${i + 1}月`,
        hearts: Math.floor(Math.random() * 8000) + 4000,
        spoons: Math.floor(Math.random() * 800) + 400,
        listeners: Math.floor(Math.random() * 1500) + 800,
        streams: Math.floor(Math.random() * 25) + 15,
      }))

      return {
        overview: {
          totalStreams: 156,
          totalHearts: 45620,
          totalSpoons: 2340,
          totalListeners: 8950,
          averageRank: 18,
          bestRank: 3,
          totalStreamTime: "312時間45分",
          growthRate: 15.8,
        },
        trends: {
          daily: dailyData,
          weekly: weeklyData,
          monthly: monthlyData,
        },
        categories: [
          { name: "雑談", value: 45, color: "#8B5CF6" },
          { name: "歌枠", value: 30, color: "#EC4899" },
          { name: "ゲーム", value: 15, color: "#06B6D4" },
          { name: "その他", value: 10, color: "#10B981" },
        ],
        topListeners: [
          { name: "リスナーA", totalHearts: 2450, totalSpoons: 120, appearances: 45 },
          { name: "リスナーB", totalHearts: 1890, totalSpoons: 95, appearances: 38 },
          { name: "リスナーC", totalHearts: 1650, totalSpoons: 78, appearances: 42 },
          { name: "リスナーD", totalHearts: 1420, totalSpoons: 65, appearances: 35 },
          { name: "リスナーE", totalHearts: 1280, totalSpoons: 58, appearances: 31 },
        ],
        performance: {
          bestPerformingTimes: [
            { time: "19:00-21:00", avgHearts: 450, avgListeners: 89 },
            { time: "21:00-23:00", avgHearts: 380, avgListeners: 76 },
            { time: "15:00-17:00", avgHearts: 320, avgListeners: 65 },
          ],
          streamTypes: [
            { type: "雑談", count: 70, avgHearts: 320, avgSpoons: 18 },
            { type: "歌枠", count: 47, avgHearts: 480, avgSpoons: 35 },
            { type: "ゲーム", count: 23, avgHearts: 280, avgSpoons: 12 },
            { type: "朝活", count: 16, avgHearts: 180, avgSpoons: 8 },
          ],
        },
      }
    }

    setTimeout(() => {
      setAnalyticsData(generateSampleData())
      setIsLoading(false)
    }, 1000)
  }, [])

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K"
    }
    return num.toString()
  }

  const getMetricData = () => {
    if (!analyticsData) return []

    switch (selectedPeriod) {
      case "7d":
        return analyticsData.trends.daily.slice(-7)
      case "30d":
        return analyticsData.trends.daily
      case "3m":
        return analyticsData.trends.weekly
      case "6m":
        return analyticsData.trends.monthly
      default:
        return analyticsData.trends.daily.slice(-7)
    }
  }

  if (isLoading || !analyticsData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">分析データを読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* ヘッダー */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">統計分析</h1>
            <p className="text-gray-400">配信パフォーマンスを詳細に分析</p>
          </div>

          <div className="flex items-center gap-3">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-32 bg-white/10 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-black/80 backdrop-blur-xl border-white/20">
                <SelectItem value="7d">7日間</SelectItem>
                <SelectItem value="30d">30日間</SelectItem>
                <SelectItem value="3m">3ヶ月</SelectItem>
                <SelectItem value="6m">6ヶ月</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
              <Download className="w-4 h-4 mr-2" />
              エクスポート
            </Button>

            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
              <Share2 className="w-4 h-4 mr-2" />
              共有
            </Button>
          </div>
        </motion.div>

        {/* 概要統計 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
        >
          <Card className="bg-gradient-to-br from-red-500/20 to-pink-500/20 border-red-500/30 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-300 mb-1">総ハート数</p>
                  <p className="text-2xl font-bold text-white">{formatNumber(analyticsData.overview.totalHearts)}</p>
                  <div className="flex items-center text-xs text-green-400 mt-1">
                    <ArrowUp className="w-3 h-3 mr-1" />+{analyticsData.overview.growthRate}%
                  </div>
                </div>
                <Heart className="w-8 h-8 text-red-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/30 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-300 mb-1">総スプーン数</p>
                  <p className="text-2xl font-bold text-white">{formatNumber(analyticsData.overview.totalSpoons)}</p>
                  <div className="flex items-center text-xs text-green-400 mt-1">
                    <ArrowUp className="w-3 h-3 mr-1" />
                    +12.3%
                  </div>
                </div>
                <Star className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-500/30 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-300 mb-1">総リスナー数</p>
                  <p className="text-2xl font-bold text-white">{formatNumber(analyticsData.overview.totalListeners)}</p>
                  <div className="flex items-center text-xs text-green-400 mt-1">
                    <ArrowUp className="w-3 h-3 mr-1" />
                    +8.7%
                  </div>
                </div>
                <Users className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-300 mb-1">最高順位</p>
                  <p className="text-2xl font-bold text-white">#{analyticsData.overview.bestRank}</p>
                  <div className="flex items-center text-xs text-green-400 mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    過去最高
                  </div>
                </div>
                <Trophy className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* メインチャート */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-black/20 backdrop-blur-xl border-white/10">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-white flex items-center gap-2">
                    <LineChart className="w-5 h-5 text-purple-400" />
                    パフォーマンス推移
                  </CardTitle>
                  <CardDescription className="text-gray-400">選択した期間での配信パフォーマンスの変化</CardDescription>
                </div>
                <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                  <SelectTrigger className="w-32 bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black/80 backdrop-blur-xl border-white/20">
                    <SelectItem value="hearts">ハート数</SelectItem>
                    <SelectItem value="spoons">スプーン数</SelectItem>
                    <SelectItem value="listeners">リスナー数</SelectItem>
                    <SelectItem value="rank">順位</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={getMetricData()}>
                    <defs>
                      <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                      dataKey={selectedPeriod === "6m" ? "month" : selectedPeriod === "3m" ? "week" : "date"}
                      stroke="#9CA3AF"
                      fontSize={12}
                    />
                    <YAxis stroke="#9CA3AF" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        borderRadius: "8px",
                        color: "white",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey={selectedMetric}
                      stroke="#8B5CF6"
                      strokeWidth={2}
                      fill="url(#colorGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* 配信カテゴリ分析 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="bg-black/20 backdrop-blur-xl border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-purple-400" />
                  配信カテゴリ分析
                </CardTitle>
                <CardDescription className="text-gray-400">配信タイプ別の割合と成果</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 mb-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={analyticsData.categories}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {analyticsData.categories.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
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
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-3">
                  {analyticsData.categories.map((category, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                        <span className="text-white">{category.name}</span>
                      </div>
                      <span className="text-gray-400">{category.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* トップリスナー */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="bg-black/20 backdrop-blur-xl border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-400" />
                  トップリスナー
                </CardTitle>
                <CardDescription className="text-gray-400">最も支援してくれているリスナー</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.topListeners.map((listener, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-white font-medium">{listener.name}</p>
                          <p className="text-xs text-gray-400">{listener.appearances}回参加</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-3 text-sm">
                          <span className="text-red-400 flex items-center gap-1">
                            <Heart className="w-3 h-3" />
                            {formatNumber(listener.totalHearts)}
                          </span>
                          <span className="text-yellow-400 flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            {listener.totalSpoons}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* パフォーマンス詳細 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Tabs defaultValue="times" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 bg-black/20 backdrop-blur-xl border border-white/10">
              <TabsTrigger
                value="times"
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-300"
              >
                <Clock className="w-4 h-4 mr-2" />
                時間帯分析
              </TabsTrigger>
              <TabsTrigger
                value="types"
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-300"
              >
                <Activity className="w-4 h-4 mr-2" />
                配信タイプ分析
              </TabsTrigger>
            </TabsList>

            <TabsContent value="times">
              <Card className="bg-black/20 backdrop-blur-xl border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">最適な配信時間帯</CardTitle>
                  <CardDescription className="text-gray-400">時間帯別のパフォーマンス分析</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.performance.bestPerformingTimes.map((time, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Badge className="bg-purple-500/20 text-purple-300">#{index + 1}</Badge>
                          <div>
                            <p className="text-white font-medium">{time.time}</p>
                            <p className="text-xs text-gray-400">推奨時間帯</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6 text-sm">
                          <div className="text-center">
                            <p className="text-red-400 flex items-center gap-1">
                              <Heart className="w-3 h-3" />
                              {time.avgHearts}
                            </p>
                            <p className="text-xs text-gray-400">平均ハート</p>
                          </div>
                          <div className="text-center">
                            <p className="text-blue-400 flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {time.avgListeners}
                            </p>
                            <p className="text-xs text-gray-400">平均リスナー</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="types">
              <Card className="bg-black/20 backdrop-blur-xl border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">配信タイプ別パフォーマンス</CardTitle>
                  <CardDescription className="text-gray-400">各配信タイプの詳細分析</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.performance.streamTypes.map((type, index) => (
                      <div key={index} className="p-4 bg-white/5 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <h3 className="text-white font-medium">{type.type}</h3>
                            <Badge variant="outline" className="bg-white/10 text-gray-300 border-white/20">
                              {type.count}回
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-red-400 flex items-center gap-1">
                              <Heart className="w-3 h-3" />
                              {type.avgHearts}
                            </span>
                            <span className="text-yellow-400 flex items-center gap-1">
                              <Star className="w-3 h-3" />
                              {type.avgSpoons}
                            </span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-xs text-gray-400">
                          <div>
                            <span>平均ハート数: </span>
                            <span className="text-white">{type.avgHearts}</span>
                          </div>
                          <div>
                            <span>平均スプーン数: </span>
                            <span className="text-white">{type.avgSpoons}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}
