"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calculator, DollarSign, TrendingUp, Coins, Heart, Gift, Users, Calendar } from "lucide-react"
import { motion } from "framer-motion"

export default function CalculatorPage() {
  const [spoons, setSpoons] = useState("")
  const [hearts, setHearts] = useState("")
  const [listeners, setListeners] = useState("")
  const [streamHours, setStreamHours] = useState("")
  const [monthlyStreams, setMonthlyStreams] = useState("")

  // 収益計算ロジック（仮想的な計算式）
  const calculateRevenue = () => {
    const spoonCount = Number.parseInt(spoons) || 0
    const heartCount = Number.parseInt(hearts) || 0
    const spoonValue = 0.1 // 1スプーン = 0.1円（仮想）
    const heartValue = 0.01 // 1ハート = 0.01円（仮想）

    return {
      spoonRevenue: spoonCount * spoonValue,
      heartRevenue: heartCount * heartValue,
      total: spoonCount * spoonValue + heartCount * heartValue,
    }
  }

  // エンゲージメント計算
  const calculateEngagement = () => {
    const listenerCount = Number.parseInt(listeners) || 0
    const heartCount = Number.parseInt(hearts) || 0
    const spoonCount = Number.parseInt(spoons) || 0

    if (listenerCount === 0) return { rate: 0, level: "データなし" }

    const engagementRate = ((heartCount + spoonCount * 10) / listenerCount) * 100

    let level = "低"
    if (engagementRate > 50) level = "非常に高い"
    else if (engagementRate > 30) level = "高い"
    else if (engagementRate > 15) level = "普通"
    else if (engagementRate > 5) level = "やや低い"

    return { rate: engagementRate, level }
  }

  // 成長予測
  const calculateGrowthProjection = () => {
    const currentListeners = Number.parseInt(listeners) || 0
    const hours = Number.parseInt(streamHours) || 0
    const streams = Number.parseInt(monthlyStreams) || 0

    if (currentListeners === 0 || hours === 0 || streams === 0) {
      return { nextMonth: 0, nextQuarter: 0, nextYear: 0 }
    }

    const growthRate = Math.min((hours * streams) / 100, 0.2) // 最大20%成長

    return {
      nextMonth: Math.round(currentListeners * (1 + growthRate)),
      nextQuarter: Math.round(currentListeners * (1 + growthRate * 3)),
      nextYear: Math.round(currentListeners * (1 + growthRate * 12)),
    }
  }

  const revenue = calculateRevenue()
  const engagement = calculateEngagement()
  const growth = calculateGrowthProjection()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* ヘッダー */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Calculator className="w-8 h-8 text-yellow-400" />
            収益計算機
          </h1>
          <p className="text-gray-400">スプーンやハートから推定収益を計算し、配信の成長を予測します</p>
        </motion.div>

        <Tabs defaultValue="revenue" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-black/20 backdrop-blur-xl border-white/10">
            <TabsTrigger
              value="revenue"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-600 data-[state=active]:to-orange-600"
            >
              収益計算
            </TabsTrigger>
            <TabsTrigger
              value="engagement"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600"
            >
              エンゲージメント
            </TabsTrigger>
            <TabsTrigger
              value="growth"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-600"
            >
              成長予測
            </TabsTrigger>
          </TabsList>

          {/* 収益計算タブ */}
          <TabsContent value="revenue" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 入力フォーム */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="bg-black/20 backdrop-blur-xl border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Coins className="w-5 h-5 text-yellow-400" />
                      収益データ入力
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="spoons" className="text-white">
                        スプーン数
                      </Label>
                      <Input
                        id="spoons"
                        type="number"
                        value={spoons}
                        onChange={(e) => setSpoons(e.target.value)}
                        placeholder="受け取ったスプーンの数"
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="hearts" className="text-white">
                        ハート数
                      </Label>
                      <Input
                        id="hearts"
                        type="number"
                        value={hearts}
                        onChange={(e) => setHearts(e.target.value)}
                        placeholder="受け取ったハートの数"
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                    <div className="pt-4 text-xs text-gray-400">
                      ※ 計算式は仮想的なものです。実際の収益とは異なる場合があります。
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* 結果表示 */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-4"
              >
                <Card className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-xl border-yellow-500/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-yellow-400" />
                      推定収益
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">スプーン収益:</span>
                        <span className="text-yellow-400 font-bold">¥{revenue.spoonRevenue.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">ハート収益:</span>
                        <span className="text-pink-400 font-bold">¥{revenue.heartRevenue.toFixed(2)}</span>
                      </div>
                      <div className="border-t border-white/20 pt-3">
                        <div className="flex justify-between items-center">
                          <span className="text-white font-medium">合計収益:</span>
                          <span className="text-green-400 font-bold text-xl">¥{revenue.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-black/20 backdrop-blur-xl border-white/10">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-yellow-400">{spoons || 0}</div>
                        <div className="text-xs text-gray-400">スプーン</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-pink-400">{hearts || 0}</div>
                        <div className="text-xs text-gray-400">ハート</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          {/* エンゲージメントタブ */}
          <TabsContent value="engagement" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="bg-black/20 backdrop-blur-xl border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Users className="w-5 h-5 text-purple-400" />
                      エンゲージメントデータ
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="listeners" className="text-white">
                        リスナー数
                      </Label>
                      <Input
                        id="listeners"
                        type="number"
                        value={listeners}
                        onChange={(e) => setListeners(e.target.value)}
                        placeholder="配信の平均リスナー数"
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="hearts-engagement" className="text-white">
                        ハート数
                      </Label>
                      <Input
                        id="hearts-engagement"
                        type="number"
                        value={hearts}
                        onChange={(e) => setHearts(e.target.value)}
                        placeholder="受け取ったハートの数"
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="spoons-engagement" className="text-white">
                        スプーン数
                      </Label>
                      <Input
                        id="spoons-engagement"
                        type="number"
                        value={spoons}
                        onChange={(e) => setSpoons(e.target.value)}
                        placeholder="受け取ったスプーンの数"
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl border-purple-500/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Heart className="w-5 h-5 text-pink-400" />
                      エンゲージメント分析
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-purple-400 mb-2">{engagement.rate.toFixed(1)}%</div>
                        <Badge
                          className={`${
                            engagement.level === "非常に高い"
                              ? "bg-green-500/80"
                              : engagement.level === "高い"
                                ? "bg-blue-500/80"
                                : engagement.level === "普通"
                                  ? "bg-yellow-500/80"
                                  : engagement.level === "やや低い"
                                    ? "bg-orange-500/80"
                                    : "bg-red-500/80"
                          } text-white`}
                        >
                          {engagement.level}
                        </Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-300">リスナー数:</span>
                          <span className="text-white">{listeners || 0}人</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">反応総数:</span>
                          <span className="text-white">
                            {(Number.parseInt(hearts) || 0) + (Number.parseInt(spoons) || 0)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          {/* 成長予測タブ */}
          <TabsContent value="growth" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="bg-black/20 backdrop-blur-xl border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-green-400" />
                      配信データ入力
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="current-listeners" className="text-white">
                        現在のリスナー数
                      </Label>
                      <Input
                        id="current-listeners"
                        type="number"
                        value={listeners}
                        onChange={(e) => setListeners(e.target.value)}
                        placeholder="平均リスナー数"
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="stream-hours" className="text-white">
                        週間配信時間
                      </Label>
                      <Input
                        id="stream-hours"
                        type="number"
                        value={streamHours}
                        onChange={(e) => setStreamHours(e.target.value)}
                        placeholder="1週間の配信時間（時間）"
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="monthly-streams" className="text-white">
                        月間配信回数
                      </Label>
                      <Input
                        id="monthly-streams"
                        type="number"
                        value={monthlyStreams}
                        onChange={(e) => setMonthlyStreams(e.target.value)}
                        placeholder="1ヶ月の配信回数"
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-xl border-green-500/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-400" />
                      成長予測
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-3">
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                          <span className="text-gray-300">来月予測:</span>
                          <span className="text-green-400 font-bold">{growth.nextMonth}人</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                          <span className="text-gray-300">3ヶ月後予測:</span>
                          <span className="text-blue-400 font-bold">{growth.nextQuarter}人</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                          <span className="text-gray-300">1年後予測:</span>
                          <span className="text-purple-400 font-bold">{growth.nextYear}人</span>
                        </div>
                      </div>
                      <div className="text-xs text-gray-400 text-center">※ 予測は配信頻度と時間に基づく推定値です</div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>
        </Tabs>

        {/* 統計サマリー */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="bg-black/20 backdrop-blur-xl border-white/10">
            <CardHeader>
              <CardTitle className="text-white text-center">配信統計サマリー</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg">
                  <Gift className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                  <div className="text-xl font-bold text-white">¥{revenue.total.toFixed(0)}</div>
                  <div className="text-xs text-gray-400">推定収益</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg">
                  <Heart className="w-8 h-8 text-pink-400 mx-auto mb-2" />
                  <div className="text-xl font-bold text-white">{engagement.rate.toFixed(1)}%</div>
                  <div className="text-xs text-gray-400">エンゲージメント</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg">
                  <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <div className="text-xl font-bold text-white">{listeners || 0}</div>
                  <div className="text-xs text-gray-400">現在のリスナー</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg">
                  <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <div className="text-xl font-bold text-white">{growth.nextMonth}</div>
                  <div className="text-xs text-gray-400">来月予測</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
