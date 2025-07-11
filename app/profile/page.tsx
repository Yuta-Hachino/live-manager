"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  User,
  MapPin,
  Calendar,
  LinkIcon,
  Heart,
  Star,
  Users,
  Trophy,
  TrendingUp,
  Clock,
  Play,
  Eye,
  Share2,
  Edit,
  Settings,
  Award,
  Crown,
} from "lucide-react"
import { motion } from "framer-motion"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"

interface UserProfile {
  id: string
  displayName: string
  username: string
  bio: string
  avatarUrl: string
  location: string
  website: string
  joinedDate: string
  isVerified: boolean
  stats: {
    totalStreams: number
    totalHearts: number
    totalSpoons: number
    totalListeners: number
    followers: number
    following: number
    bestRank: number
    totalStreamTime: string
  }
  achievements: Array<{
    id: string
    title: string
    description: string
    icon: string
    unlockedAt: string
    rarity: "common" | "rare" | "epic" | "legendary"
  }>
  recentStreams: Array<{
    id: string
    title: string
    date: string
    duration: string
    hearts: number
    spoons: number
    listeners: number
    rank: number
  }>
  monthlyStats: Array<{
    month: string
    hearts: number
    spoons: number
    listeners: number
    streams: number
  }>
  badges: Array<{
    id: string
    name: string
    description: string
    color: string
    icon: string
  }>
  level: {
    current: number
    xp: number
    nextLevelXp: number
    title: string
  }
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  // サンプルデータ
  useEffect(() => {
    const sampleProfile: UserProfile = {
      id: "user123",
      displayName: "配信者名",
      username: "@streamer123",
      bio: "音声配信を楽しんでいます！毎日19時から雑談配信をしています。みなさんと楽しい時間を過ごせるよう頑張ります✨",
      avatarUrl: "/placeholder.svg?height=120&width=120",
      location: "東京, 日本",
      website: "https://example.com",
      joinedDate: "2023-06-15",
      isVerified: true,
      stats: {
        totalStreams: 156,
        totalHearts: 45620,
        totalSpoons: 2340,
        totalListeners: 8950,
        followers: 1250,
        following: 89,
        bestRank: 3,
        totalStreamTime: "312時間45分",
      },
      achievements: [
        {
          id: "1",
          title: "配信マスター",
          description: "100回配信を達成",
          icon: "🎯",
          unlockedAt: "2024-12-15",
          rarity: "epic",
        },
        {
          id: "2",
          title: "ハートコレクター",
          description: "10,000ハートを獲得",
          icon: "❤️",
          unlockedAt: "2024-11-20",
          rarity: "rare",
        },
        {
          id: "3",
          title: "人気配信者",
          description: "1,000人のフォロワーを獲得",
          icon: "👑",
          unlockedAt: "2024-10-05",
          rarity: "legendary",
        },
        {
          id: "4",
          title: "継続は力なり",
          description: "30日連続配信を達成",
          icon: "🔥",
          unlockedAt: "2024-09-12",
          rarity: "rare",
        },
      ],
      recentStreams: [
        {
          id: "1",
          title: "雑談配信",
          date: "2025-01-08",
          duration: "2時間15分",
          hearts: 450,
          spoons: 23,
          listeners: 89,
          rank: 15,
        },
        {
          id: "2",
          title: "歌枠",
          date: "2025-01-07",
          duration: "1時間30分",
          hearts: 680,
          spoons: 45,
          listeners: 124,
          rank: 8,
        },
        {
          id: "3",
          title: "朝活配信",
          date: "2025-01-06",
          duration: "45分",
          hearts: 230,
          spoons: 12,
          listeners: 56,
          rank: 28,
        },
      ],
      monthlyStats: [
        { month: "7月", hearts: 3200, spoons: 180, listeners: 1200, streams: 20 },
        { month: "8月", hearts: 3800, spoons: 220, listeners: 1450, streams: 22 },
        { month: "9月", hearts: 4200, spoons: 250, listeners: 1600, streams: 25 },
        { month: "10月", hearts: 4800, spoons: 290, listeners: 1800, streams: 28 },
        { month: "11月", hearts: 5200, spoons: 320, listeners: 2000, streams: 30 },
        { month: "12月", hearts: 5800, spoons: 380, listeners: 2200, streams: 31 },
      ],
      badges: [
        {
          id: "1",
          name: "早起き配信者",
          description: "朝の配信を10回以上実施",
          color: "#F59E0B",
          icon: "🌅",
        },
        {
          id: "2",
          name: "歌姫",
          description: "歌枠配信を50回以上実施",
          color: "#EC4899",
          icon: "🎵",
        },
        {
          id: "3",
          name: "コミュニケーター",
          description: "リスナーとの交流が活発",
          color: "#10B981",
          icon: "💬",
        },
      ],
      level: {
        current: 25,
        xp: 12450,
        nextLevelXp: 15000,
        title: "ベテラン配信者",
      },
    }

    setTimeout(() => {
      setProfile(sampleProfile)
      setIsLoading(false)
    }, 1000)
  }, [])

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "bg-gray-500"
      case "rare":
        return "bg-blue-500"
      case "epic":
        return "bg-purple-500"
      case "legendary":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K"
    }
    return num.toString()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (isLoading || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">プロフィールを読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* プロフィールヘッダー */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="bg-black/20 backdrop-blur-xl border-white/10">
            <CardContent className="p-8">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* アバターと基本情報 */}
                <div className="flex flex-col items-center lg:items-start">
                  <div className="relative">
                    <Avatar className="w-32 h-32 border-4 border-purple-500">
                      <AvatarImage src={profile.avatarUrl || "/placeholder.svg"} />
                      <AvatarFallback className="bg-purple-600 text-white text-4xl">
                        {profile.displayName[0]}
                      </AvatarFallback>
                    </Avatar>
                    {profile.isVerified && (
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <Crown className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="text-center lg:text-left mt-4">
                    <div className="flex items-center gap-2 mb-1">
                      <h1 className="text-2xl font-bold text-white">{profile.displayName}</h1>
                      {profile.isVerified && <Badge className="bg-blue-500 text-white">認証済み</Badge>}
                    </div>
                    <p className="text-gray-400 mb-2">{profile.username}</p>

                    {/* レベル情報 */}
                    <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-3 mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="w-4 h-4 text-yellow-400" />
                        <span className="text-white font-medium">Lv.{profile.level.current}</span>
                        <span className="text-gray-400 text-sm">{profile.level.title}</span>
                      </div>
                      <Progress value={(profile.level.xp / profile.level.nextLevelXp) * 100} className="h-2 mb-1" />
                      <p className="text-xs text-gray-400">
                        {profile.level.xp} / {profile.level.nextLevelXp} XP
                      </p>
                    </div>
                  </div>
                </div>

                {/* プロフィール詳細 */}
                <div className="flex-1 space-y-4">
                  <p className="text-gray-300 leading-relaxed">{profile.bio}</p>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                    {profile.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{profile.location}</span>
                      </div>
                    )}
                    {profile.website && (
                      <div className="flex items-center gap-1">
                        <LinkIcon className="w-4 h-4" />
                        <a href={profile.website} className="text-purple-400 hover:underline">
                          {profile.website}
                        </a>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(profile.joinedDate)}から参加</span>
                    </div>
                  </div>

                  {/* バッジ */}
                  <div className="flex flex-wrap gap-2">
                    {profile.badges.map((badge) => (
                      <Badge key={badge.id} className="text-white border-0" style={{ backgroundColor: badge.color }}>
                        <span className="mr-1">{badge.icon}</span>
                        {badge.name}
                      </Badge>
                    ))}
                  </div>

                  {/* 統計サマリー */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-white">{formatNumber(profile.stats.followers)}</p>
                      <p className="text-sm text-gray-400">フォロワー</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-white">{profile.stats.following}</p>
                      <p className="text-sm text-gray-400">フォロー中</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-white">{profile.stats.totalStreams}</p>
                      <p className="text-sm text-gray-400">配信回数</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-white">#{profile.stats.bestRank}</p>
                      <p className="text-sm text-gray-400">最高順位</p>
                    </div>
                  </div>

                  {/* アクションボタン */}
                  <div className="flex gap-3 pt-4">
                    <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                      <Edit className="w-4 h-4 mr-2" />
                      プロフィール編集
                    </Button>
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
                      <Share2 className="w-4 h-4 mr-2" />
                      共有
                    </Button>
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
                      <Settings className="w-4 h-4 mr-2" />
                      設定
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* タブコンテンツ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid w-full grid-cols-4 bg-black/20 backdrop-blur-xl border border-white/10">
              <TabsTrigger
                value="overview"
                className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-300"
              >
                <User className="w-4 h-4" />
                概要
              </TabsTrigger>
              <TabsTrigger
                value="stats"
                className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-300"
              >
                <TrendingUp className="w-4 h-4" />
                統計
              </TabsTrigger>
              <TabsTrigger
                value="achievements"
                className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-300"
              >
                <Trophy className="w-4 h-4" />
                実績
              </TabsTrigger>
              <TabsTrigger
                value="streams"
                className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-300"
              >
                <Play className="w-4 h-4" />
                配信履歴
              </TabsTrigger>
            </TabsList>

            {/* 概要タブ */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
                <Card className="bg-gradient-to-br from-red-500/20 to-pink-500/20 border-red-500/30 backdrop-blur-xl">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-red-300 mb-1">総ハート数</p>
                        <p className="text-2xl font-bold text-white">{formatNumber(profile.stats.totalHearts)}</p>
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
                        <p className="text-2xl font-bold text-white">{formatNumber(profile.stats.totalSpoons)}</p>
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
                        <p className="text-2xl font-bold text-white">{formatNumber(profile.stats.totalListeners)}</p>
                      </div>
                      <Users className="w-8 h-8 text-blue-400" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30 backdrop-blur-xl">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-green-300 mb-1">配信時間</p>
                        <p className="text-2xl font-bold text-white">{profile.stats.totalStreamTime}</p>
                      </div>
                      <Clock className="w-8 h-8 text-green-400" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* 最近の配信 */}
              <Card className="bg-black/20 backdrop-blur-xl border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">最近の配信</CardTitle>
                  <CardDescription className="text-gray-400">直近の配信パフォーマンス</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {profile.recentStreams.map((stream) => (
                      <div key={stream.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                            <Play className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h4 className="text-white font-medium">{stream.title}</h4>
                            <div className="flex items-center gap-4 text-sm text-gray-400">
                              <span>{formatDate(stream.date)}</span>
                              <span>{stream.duration}</span>
                              <span>#{stream.rank}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-6 text-sm">
                          <div className="text-center">
                            <p className="text-red-400 flex items-center gap-1">
                              <Heart className="w-3 h-3" />
                              {stream.hearts}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-yellow-400 flex items-center gap-1">
                              <Star className="w-3 h-3" />
                              {stream.spoons}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-blue-400 flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {stream.listeners}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 統計タブ */}
            <TabsContent value="stats" className="space-y-6">
              <Card className="bg-black/20 backdrop-blur-xl border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">月別パフォーマンス</CardTitle>
                  <CardDescription className="text-gray-400">過去6ヶ月の配信統計</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={profile.monthlyStats}>
                        <defs>
                          <linearGradient id="heartsGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#EF4444" stopOpacity={0.1} />
                          </linearGradient>
                          <linearGradient id="spoonsGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.1} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
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
                          dataKey="hearts"
                          stroke="#EF4444"
                          strokeWidth={2}
                          fill="url(#heartsGradient)"
                        />
                        <Area
                          type="monotone"
                          dataKey="spoons"
                          stroke="#F59E0B"
                          strokeWidth={2}
                          fill="url(#spoonsGradient)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 実績タブ */}
            <TabsContent value="achievements" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {profile.achievements.map((achievement) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="bg-black/20 backdrop-blur-xl border-white/10 hover:border-purple-500/50 transition-all duration-200">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${getRarityColor(achievement.rarity)}`}
                          >
                            {achievement.icon}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-white font-medium">{achievement.title}</h3>
                              <Badge className={`${getRarityColor(achievement.rarity)} text-white text-xs`}>
                                {achievement.rarity}
                              </Badge>
                            </div>
                            <p className="text-gray-400 text-sm mb-2">{achievement.description}</p>
                            <p className="text-xs text-gray-500">{formatDate(achievement.unlockedAt)}に獲得</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* 配信履歴タブ */}
            <TabsContent value="streams" className="space-y-6">
              <Card className="bg-black/20 backdrop-blur-xl border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">配信履歴</CardTitle>
                  <CardDescription className="text-gray-400">過去の配信記録</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {profile.recentStreams.map((stream) => (
                      <div
                        key={stream.id}
                        className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors duration-200"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                            <Play className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h4 className="text-white font-medium">{stream.title}</h4>
                            <div className="flex items-center gap-4 text-sm text-gray-400">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatDate(stream.date)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {stream.duration}
                              </span>
                              <span className="flex items-center gap-1">
                                <Trophy className="w-3 h-3" />#{stream.rank}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-6 text-sm">
                          <div className="text-center">
                            <p className="text-red-400 flex items-center gap-1">
                              <Heart className="w-3 h-3" />
                              {stream.hearts}
                            </p>
                            <p className="text-xs text-gray-400">ハート</p>
                          </div>
                          <div className="text-center">
                            <p className="text-yellow-400 flex items-center gap-1">
                              <Star className="w-3 h-3" />
                              {stream.spoons}
                            </p>
                            <p className="text-xs text-gray-400">スプーン</p>
                          </div>
                          <div className="text-center">
                            <p className="text-blue-400 flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {stream.listeners}
                            </p>
                            <p className="text-xs text-gray-400">リスナー</p>
                          </div>
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                            <Eye className="w-4 h-4" />
                          </Button>
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
