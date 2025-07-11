"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Heart,
  Star,
  Users,
  TrendingUp,
  Camera,
  Upload,
  Calendar,
  Sparkles,
  Trophy,
  Zap,
  BarChart3,
  ArrowUp,
  Play,
  Bell,
  MessageCircle,
  Share2,
  ThumbsUp,
  Eye,
  Lightbulb,
  Wand2,
  CreditCard,
  Shield,
  Wifi,
  WifiOff,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isConnected, setIsConnected] = useState(true)
  const [notifications, setNotifications] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalHearts: 0,
    totalSpoons: 0,
    totalListeners: 0,
    bestRank: 0,
  })
  const { toast } = useToast()

  // WebSocket接続とリアルタイム通知
  useEffect(() => {
    const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3001")

    ws.onopen = () => {
      setIsConnected(true)
      toast({
        title: "接続完了",
        description: "リアルタイム通知が有効になりました",
      })
    }

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === "notification") {
        setNotifications((prev) => [data.payload, ...prev.slice(0, 4)])
        toast({
          title: data.payload.title,
          description: data.payload.message,
        })
      }
    }

    ws.onclose = () => {
      setIsConnected(false)
    }

    return () => ws.close()
  }, [toast])

  // アニメーション用の数値カウントアップ
  useEffect(() => {
    const targetStats = {
      totalHearts: 15420,
      totalSpoons: 892,
      totalListeners: 1250,
      bestRank: 3,
    }

    const duration = 2000
    const steps = 60
    const stepDuration = duration / steps

    let currentStep = 0
    const interval = setInterval(() => {
      currentStep++
      const progress = currentStep / steps

      setStats({
        totalHearts: Math.floor(targetStats.totalHearts * progress),
        totalSpoons: Math.floor(targetStats.totalSpoons * progress),
        totalListeners: Math.floor(targetStats.totalListeners * progress),
        bestRank: Math.floor(targetStats.bestRank * progress) || 1,
      })

      if (currentStep >= steps) {
        clearInterval(interval)
        setStats(targetStats)
      }
    }, stepDuration)

    return () => clearInterval(interval)
  }, [])

  const recentStreams = [
    {
      id: 1,
      title: "雑談配信",
      date: "2025-01-08",
      hearts: 450,
      spoons: 23,
      listeners: 89,
      duration: "2時間15分",
      thumbnail: "/placeholder.svg?height=60&width=60",
      aiAdvice: "リスナーとの会話をもっと増やすと、ハート数が20%向上する可能性があります",
      highlights: ["面白い話", "歌のリクエスト", "質問コーナー"],
    },
    {
      id: 2,
      title: "歌枠",
      date: "2025-01-07",
      hearts: 680,
      spoons: 45,
      listeners: 156,
      duration: "1時間45分",
      thumbnail: "/placeholder.svg?height=60&width=60",
      aiAdvice: "バラード系の楽曲でより多くのスプーンを獲得できそうです",
      highlights: ["感動的な歌声", "リクエスト対応", "アンコール"],
    },
    {
      id: 3,
      title: "朝活配信",
      date: "2025-01-06",
      hearts: 320,
      spoons: 18,
      listeners: 67,
      duration: "1時間30分",
      thumbnail: "/placeholder.svg?height=60&width=60",
      aiAdvice: "朝の時間帯は定期配信にすると固定リスナーが増える傾向があります",
      highlights: ["モーニングルーティン", "今日の予定", "励ましメッセージ"],
    },
  ]

  const badgeGoals = [
    { name: "月間ハート1000個", current: 1450, target: 1000, achieved: true },
    { name: "週間配信7回", current: 5, target: 7, achieved: false },
    { name: "月間スプーン100個", current: 156, target: 100, achieved: true },
  ]

  const communityPosts = [
    {
      id: 1,
      user: "配信者A",
      avatar: "/placeholder.svg?height=40&width=40",
      content: "今日の配信で新記録達成！みんなありがとう🎉",
      likes: 24,
      comments: 8,
      timestamp: "2時間前",
    },
    {
      id: 2,
      user: "配信者B",
      avatar: "/placeholder.svg?height=40&width=40",
      content: "歌枠のコツを教えてください！",
      likes: 12,
      comments: 15,
      timestamp: "4時間前",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* ヘッダー */}
      <header className="bg-black/20 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Spoon配信サポート</h1>
                <p className="text-xs text-purple-300">AI配信アドバイザー</p>
              </div>
            </motion.div>
            <div className="flex items-center space-x-4">
              {/* リアルタイム接続状態 */}
              <div className="flex items-center space-x-2">
                {isConnected ? (
                  <Wifi className="w-4 h-4 text-green-400" />
                ) : (
                  <WifiOff className="w-4 h-4 text-red-400" />
                )}
                <span className="text-xs text-gray-300">{isConnected ? "接続中" : "切断"}</span>
              </div>

              {/* 通知 */}
              <div className="relative">
                <Bell className="w-5 h-5 text-gray-300" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
                )}
              </div>

              <Badge variant="outline" className="bg-green-500/20 text-green-300 border-green-500/30">
                <Zap className="w-3 h-3 mr-1" />
                プレミアム
              </Badge>
              <Avatar className="w-8 h-8 ring-2 ring-purple-500/50">
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback className="bg-purple-600 text-white text-sm">配</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 bg-black/20 backdrop-blur-xl border border-white/10 p-1">
            <TabsTrigger
              value="dashboard"
              className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-300"
            >
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">ダッシュボード</span>
            </TabsTrigger>
            <TabsTrigger
              value="gallery"
              className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-300"
            >
              <Camera className="w-4 h-4" />
              <span className="hidden sm:inline">ギャラリー</span>
            </TabsTrigger>
            <TabsTrigger
              value="results"
              className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-300"
            >
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">リザルト</span>
            </TabsTrigger>
            <TabsTrigger
              value="events"
              className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-300"
            >
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">イベント</span>
            </TabsTrigger>
            <TabsTrigger
              value="community"
              className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-300"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">コミュニティ</span>
            </TabsTrigger>
            <TabsTrigger
              value="billing"
              className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-300"
            >
              <CreditCard className="w-4 h-4" />
              <span className="hidden sm:inline">課金</span>
            </TabsTrigger>
          </TabsList>

          {/* ダッシュボード */}
          <TabsContent value="dashboard" className="space-y-8">
            {/* 統計カード */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="bg-gradient-to-br from-red-500/20 to-pink-500/20 border-red-500/30 backdrop-blur-xl">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-white">総ハート数</CardTitle>
                    <Heart className="h-5 w-5 text-red-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl lg:text-3xl font-bold text-white">
                      {stats.totalHearts.toLocaleString()}
                    </div>
                    <div className="flex items-center text-xs text-green-400 mt-1">
                      <ArrowUp className="w-3 h-3 mr-1" />
                      前月比 +12%
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/30 backdrop-blur-xl">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-white">総スプーン数</CardTitle>
                    <Star className="h-5 w-5 text-yellow-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl lg:text-3xl font-bold text-white">{stats.totalSpoons}</div>
                    <div className="flex items-center text-xs text-green-400 mt-1">
                      <ArrowUp className="w-3 h-3 mr-1" />
                      前月比 +8%
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-500/30 backdrop-blur-xl">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-white">総リスナー数</CardTitle>
                    <Users className="h-5 w-5 text-blue-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl lg:text-3xl font-bold text-white">{stats.totalListeners}</div>
                    <div className="flex items-center text-xs text-green-400 mt-1">
                      <ArrowUp className="w-3 h-3 mr-1" />
                      前月比 +15%
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30 backdrop-blur-xl">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-white">最高順位</CardTitle>
                    <Trophy className="h-5 w-5 text-green-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl lg:text-3xl font-bold text-white">#{stats.bestRank}</div>
                    <div className="flex items-center text-xs text-green-400 mt-1">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      今月の記録
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* AI配信アドバイス */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/30 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-yellow-400" />
                    AI配信アドバイス
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    AIがあなたの配信データを分析して最適なアドバイスを提供
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-yellow-500/20 rounded-xl border border-yellow-500/30">
                    <h4 className="font-medium text-yellow-300 mb-2 flex items-center gap-2">
                      <Wand2 className="w-4 h-4" />
                      今週のおすすめ改善点
                    </h4>
                    <ul className="text-sm text-yellow-200 space-y-1">
                      <li>• 配信時間を19:00-21:00に固定すると、リスナー数が平均25%向上します</li>
                      <li>• 歌枠の頻度を週2回に増やすと、スプーン獲得数が40%増加する可能性があります</li>
                      <li>• リスナーとの質問コーナーを設けると、エンゲージメントが向上します</li>
                    </ul>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    詳細なAI分析レポートを見る
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* 最近の配信（ハイライト付き） */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Card className="bg-black/20 backdrop-blur-xl border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Play className="w-5 h-5 text-purple-400" />
                    最近の配信（自動ハイライト付き）
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    AIが自動生成したハイライトと改善アドバイス
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {recentStreams.map((stream, index) => (
                      <motion.div
                        key={stream.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <Avatar className="w-12 h-12">
                              <AvatarImage src={stream.thumbnail || "/placeholder.svg"} />
                              <AvatarFallback className="bg-purple-600 text-white">{stream.title[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-medium text-white">{stream.title}</h3>
                              <div className="flex items-center space-x-2 text-sm text-gray-400">
                                <span>{stream.date}</span>
                                <span>•</span>
                                <span>{stream.duration}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4 text-sm">
                            <div className="flex items-center space-x-1 text-red-400">
                              <Heart className="w-4 h-4" />
                              <span>{stream.hearts}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-yellow-400">
                              <Star className="w-4 h-4" />
                              <span>{stream.spoons}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-blue-400">
                              <Users className="w-4 h-4" />
                              <span>{stream.listeners}</span>
                            </div>
                          </div>
                        </div>

                        {/* AIハイライト */}
                        <div className="mb-3">
                          <h4 className="text-sm font-medium text-purple-300 mb-2 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            自動生成ハイライト
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {stream.highlights.map((highlight, i) => (
                              <Badge key={i} variant="secondary" className="bg-purple-500/20 text-purple-300">
                                {highlight}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* AIアドバイス */}
                        <div className="p-3 bg-blue-500/20 rounded-lg border border-blue-500/30">
                          <p className="text-sm text-blue-200 flex items-start gap-2">
                            <Lightbulb className="w-4 h-4 mt-0.5 text-blue-400" />
                            {stream.aiAdvice}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* ギャラリー */}
          <TabsContent value="gallery" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Card className="bg-black/20 backdrop-blur-xl border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Camera className="w-5 h-5 text-purple-400" />
                    ギャラリー
                  </CardTitle>
                  <CardDescription className="text-gray-400">配信の思い出を管理しましょう</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <motion.div
                        key={i}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="aspect-square bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center border border-white/10 cursor-pointer hover:border-purple-500/50 transition-all duration-200 relative group"
                      >
                        <Camera className="w-8 h-8 text-gray-400" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                          <div className="flex space-x-2">
                            <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                              <Share2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="aspect-square border-2 border-dashed border-gray-600 rounded-xl flex items-center justify-center cursor-pointer hover:border-purple-500 transition-all duration-200 bg-white/5"
                    >
                      <div className="text-center">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-xs text-gray-400">アップロード</p>
                      </div>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* リザルト登録（OCR機能付き） */}
          <TabsContent value="results" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Card className="bg-black/20 backdrop-blur-xl border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Upload className="w-5 h-5 text-purple-400" />
                    リザルト登録（OCR自動読み込み）
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    スクリーンショットをアップロードして自動でデータを抽出
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center cursor-pointer hover:border-purple-500 transition-all duration-200 bg-gradient-to-br from-purple-500/10 to-pink-500/10"
                  >
                    <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2 text-white">スクリーンショットをドロップ</h3>
                    <p className="text-gray-400 mb-4">または、クリックしてファイルを選択</p>
                    <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                      ファイルを選択
                    </Button>
                  </motion.div>

                  {/* OCR処理状況 */}
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-500/20 rounded-xl border border-blue-500/30">
                      <h4 className="font-medium text-blue-300 mb-2 flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        AI OCR機能
                      </h4>
                      <p className="text-sm text-blue-200 mb-3">
                        最新のAI技術により、スクリーンショットから以下の情報を自動抽出：
                      </p>
                      <ul className="text-sm text-blue-200 space-y-1">
                        <li>• ハート数・スプーン数</li>
                        <li>• リスナー数・順位</li>
                        <li>• リスナー一覧とギフト情報</li>
                        <li>• 配信時間・タイトル</li>
                      </ul>
                    </div>

                    {/* 手動入力フォーム */}
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <h4 className="font-medium text-white mb-4">手動入力（OCR補正用）</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="hearts" className="text-white">
                            ハート数
                          </Label>
                          <Input id="hearts" type="number" className="bg-white/10 border-white/20 text-white" />
                        </div>
                        <div>
                          <Label htmlFor="spoons" className="text-white">
                            スプーン数
                          </Label>
                          <Input id="spoons" type="number" className="bg-white/10 border-white/20 text-white" />
                        </div>
                        <div>
                          <Label htmlFor="listeners" className="text-white">
                            リスナー数
                          </Label>
                          <Input id="listeners" type="number" className="bg-white/10 border-white/20 text-white" />
                        </div>
                        <div>
                          <Label htmlFor="rank" className="text-white">
                            最高順位
                          </Label>
                          <Input id="rank" type="number" className="bg-white/10 border-white/20 text-white" />
                        </div>
                      </div>
                      <Button className="w-full mt-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                        データを保存
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* イベント */}
          <TabsContent value="events" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Card className="bg-black/20 backdrop-blur-xl border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-purple-400" />
                    配信イベント
                  </CardTitle>
                  <CardDescription className="text-gray-400">イベントの管理と統計を確認</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 cursor-pointer"
                    >
                      <div>
                        <h3 className="font-medium text-white">新年配信イベント</h3>
                        <p className="text-sm text-gray-400">2025/01/01 - 2025/01/07</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm">
                          <span className="text-green-300">参加者: 45名</span>
                          <span className="text-green-300">総ハート: 12,450</span>
                        </div>
                      </div>
                      <Badge className="bg-green-500 text-white">進行中</Badge>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 cursor-pointer"
                    >
                      <div>
                        <h3 className="font-medium text-white">歌枠チャレンジ</h3>
                        <p className="text-sm text-gray-400">2024/12/20 - 2024/12/31</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm">
                          <span className="text-gray-300">参加者: 23名</span>
                          <span className="text-gray-300">総スプーン: 890</span>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-gray-600 text-gray-300">
                        終了
                      </Badge>
                    </motion.div>
                  </div>
                  <Button className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    新しいイベントを作成
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* コミュニティ */}
          <TabsContent value="community" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Card className="bg-black/20 backdrop-blur-xl border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-purple-400" />
                    コミュニティ
                  </CardTitle>
                  <CardDescription className="text-gray-400">配信者同士で情報交換しましょう</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* 投稿作成 */}
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <Textarea
                      placeholder="配信の感想や質問を投稿しましょう..."
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 resize-none"
                      rows={3}
                    />
                    <div className="flex justify-between items-center mt-3">
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                          <Camera className="w-4 h-4 mr-1" />
                          画像
                        </Button>
                      </div>
                      <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600">
                        投稿
                      </Button>
                    </div>
                  </div>

                  {/* 投稿一覧 */}
                  <div className="space-y-4">
                    {communityPosts.map((post) => (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-white/5 rounded-xl border border-white/10"
                      >
                        <div className="flex items-start space-x-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={post.avatar || "/placeholder.svg"} />
                            <AvatarFallback className="bg-purple-600 text-white">{post.user[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="font-medium text-white">{post.user}</span>
                              <span className="text-xs text-gray-400">{post.timestamp}</span>
                            </div>
                            <p className="text-gray-300 mb-3">{post.content}</p>
                            <div className="flex items-center space-x-4">
                              <Button size="sm" variant="ghost" className="text-gray-400 hover:text-red-400">
                                <ThumbsUp className="w-4 h-4 mr-1" />
                                {post.likes}
                              </Button>
                              <Button size="sm" variant="ghost" className="text-gray-400 hover:text-blue-400">
                                <MessageCircle className="w-4 h-4 mr-1" />
                                {post.comments}
                              </Button>
                              <Button size="sm" variant="ghost" className="text-gray-400 hover:text-green-400">
                                <Share2 className="w-4 h-4 mr-1" />
                                シェア
                              </Button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* 課金・決済 */}
          <TabsContent value="billing" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Card className="bg-black/20 backdrop-blur-xl border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-purple-400" />
                    プレミアムプラン
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    より多くの機能を利用して配信活動を充実させましょう
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* 現在のプラン */}
                  <div className="p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl border border-green-500/30">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-white">プレミアムプラン</h3>
                        <p className="text-sm text-green-300">月額 ¥500 - 次回更新: 2025/02/08</p>
                      </div>
                      <Badge className="bg-green-500 text-white">アクティブ</Badge>
                    </div>
                  </div>

                  {/* プラン比較 */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <h3 className="font-medium text-white mb-3">無料プラン</h3>
                      <ul className="space-y-2 text-sm text-gray-300">
                        <li>• 基本統計表示</li>
                        <li>• 月10回のOCR処理</li>
                        <li>• 1GBストレージ</li>
                        <li>• コミュニティ参加</li>
                      </ul>
                      <div className="mt-4">
                        <span className="text-2xl font-bold text-white">¥0</span>
                        <span className="text-gray-400">/月</span>
                      </div>
                    </div>

                    <div className="p-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/30">
                      <h3 className="font-medium text-white mb-3 flex items-center gap-2">
                        プレミアムプラン
                        <Sparkles className="w-4 h-4 text-yellow-400" />
                      </h3>
                      <ul className="space-y-2 text-sm text-purple-200">
                        <li>• 高度な統計分析</li>
                        <li>• 無制限OCR処理</li>
                        <li>• 無制限ストレージ</li>
                        <li>• AI配信アドバイス</li>
                        <li>• 自動ハイライト生成</li>
                        <li>• 優先サポート</li>
                      </ul>
                      <div className="mt-4">
                        <span className="text-2xl font-bold text-white">¥500</span>
                        <span className="text-gray-400">/月</span>
                      </div>
                    </div>
                  </div>

                  {/* 支払い方法 */}
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <h3 className="font-medium text-white mb-3 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-green-400" />
                      支払い方法
                    </h3>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                          <CreditCard className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-white">**** **** **** 1234</p>
                          <p className="text-xs text-gray-400">Visa • 有効期限 12/26</p>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost" className="text-purple-400">
                        変更
                      </Button>
                    </div>
                  </div>

                  {/* 請求履歴 */}
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <h3 className="font-medium text-white mb-3">請求履歴</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-300">2025/01/08</span>
                        <span className="text-white">¥500</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-300">2024/12/08</span>
                        <span className="text-white">¥500</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-300">2024/11/08</span>
                        <span className="text-white">¥500</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <Button
                      variant="outline"
                      className="flex-1 border-white/20 text-white hover:bg-white/10 bg-transparent"
                    >
                      プランを変更
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 border-red-500/30 text-red-400 hover:bg-red-500/10 bg-transparent"
                    >
                      解約する
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>

      {/* リアルタイム通知トースト */}
      <AnimatePresence>
        {notifications.slice(0, 1).map((notification, index) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed top-20 right-4 z-50 p-4 bg-black/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl max-w-sm"
          >
            <div className="flex items-start space-x-3">
              <Bell className="w-5 h-5 text-purple-400 mt-0.5" />
              <div>
                <h4 className="font-medium text-white">{notification.title}</h4>
                <p className="text-sm text-gray-300">{notification.message}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
