"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Calendar,
  Plus,
  Users,
  Trophy,
  Clock,
  Star,
  Gift,
  Target,
  Share2,
  Copy,
  CheckCircle,
  Play,
  MoreHorizontal,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"

interface Event {
  id: string
  title: string
  description: string
  type: "challenge" | "contest" | "collaboration" | "milestone"
  status: "upcoming" | "active" | "completed" | "cancelled"
  startDate: string
  endDate: string
  participants: number
  maxParticipants?: number
  rewards: string[]
  rules: string[]
  createdBy: string
  createdAt: string
  bannerUrl?: string
  tags: string[]
  requirements?: string[]
  progress?: {
    current: number
    target: number
    unit: string
  }
}

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState("active")
  const [events, setEvents] = useState<Event[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    title: "",
    description: "",
    type: "challenge",
    startDate: "",
    endDate: "",
    rewards: [],
    rules: [],
    tags: [],
  })
  const { toast } = useToast()

  // サンプルデータ
  useEffect(() => {
    const sampleEvents: Event[] = [
      {
        id: "1",
        title: "新年配信チャレンジ",
        description: "新年を記念して、みんなで配信を盛り上げよう！期間中に配信した回数に応じて特別な報酬がもらえます。",
        type: "challenge",
        status: "active",
        startDate: "2025-01-01",
        endDate: "2025-01-31",
        participants: 45,
        maxParticipants: 100,
        rewards: ["特別バッジ", "プレミアム機能1ヶ月無料", "限定アバター"],
        rules: ["期間中に最低5回配信する", "各配信は最低30分以上", "ハート数100個以上獲得"],
        createdBy: "運営チーム",
        createdAt: "2024-12-25",
        bannerUrl: "/placeholder.svg?height=200&width=400",
        tags: ["新年", "チャレンジ", "報酬"],
        progress: {
          current: 15,
          target: 31,
          unit: "日",
        },
      },
      {
        id: "2",
        title: "歌枠コンテスト",
        description: "美しい歌声を披露して、リスナーの心を掴もう！投票で決まる歌枠王決定戦。",
        type: "contest",
        status: "upcoming",
        startDate: "2025-02-01",
        endDate: "2025-02-14",
        participants: 23,
        maxParticipants: 50,
        rewards: ["歌枠王タイトル", "特別楽曲リクエスト権", "プロフィール装飾"],
        rules: ["オリジナル楽曲またはカバー楽曲", "1人3曲まで参加可能", "リスナー投票で順位決定"],
        createdBy: "配信者コミュニティ",
        createdAt: "2025-01-05",
        tags: ["歌枠", "コンテスト", "投票"],
      },
      {
        id: "3",
        title: "コラボ配信週間",
        description: "配信者同士でコラボして、新しいつながりを作ろう！",
        type: "collaboration",
        status: "completed",
        startDate: "2024-12-15",
        endDate: "2024-12-22",
        participants: 67,
        rewards: ["コラボマスターバッジ", "フォロワー増加ブースト"],
        rules: ["他の配信者と最低1回コラボ", "コラボ配信は1時間以上", "お互いの配信を宣伝"],
        createdBy: "配信者A",
        createdAt: "2024-12-01",
        tags: ["コラボ", "交流", "ネットワーキング"],
      },
    ]
    setEvents(sampleEvents)
  }, [])

  const filteredEvents = events.filter((event) => {
    switch (activeTab) {
      case "active":
        return event.status === "active"
      case "upcoming":
        return event.status === "upcoming"
      case "completed":
        return event.status === "completed"
      case "my":
        return event.createdBy === "あなた" // 実際の実装では現在のユーザーIDと比較
      default:
        return true
    }
  })

  const handleCreateEvent = async () => {
    try {
      // イベント作成処理のシミュレーション
      const eventId = Date.now().toString()
      const createdEvent: Event = {
        ...(newEvent as Event),
        id: eventId,
        participants: 0,
        createdBy: "あなた",
        createdAt: new Date().toISOString(),
        status: "upcoming",
      }

      setEvents([createdEvent, ...events])
      setIsCreateDialogOpen(false)
      setNewEvent({
        title: "",
        description: "",
        type: "challenge",
        startDate: "",
        endDate: "",
        rewards: [],
        rules: [],
        tags: [],
      })

      toast({
        title: "イベント作成完了",
        description: "新しいイベントが正常に作成されました",
      })
    } catch (error) {
      toast({
        title: "作成エラー",
        description: "イベントの作成に失敗しました",
        variant: "destructive",
      })
    }
  }

  const handleJoinEvent = async (eventId: string) => {
    try {
      setEvents(
        events.map((event) => (event.id === eventId ? { ...event, participants: event.participants + 1 } : event)),
      )

      toast({
        title: "参加完了",
        description: "イベントに参加しました！",
      })
    } catch (error) {
      toast({
        title: "参加エラー",
        description: "イベントへの参加に失敗しました",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: Event["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "upcoming":
        return "bg-blue-500"
      case "completed":
        return "bg-gray-500"
      case "cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = (status: Event["status"]) => {
    switch (status) {
      case "active":
        return "開催中"
      case "upcoming":
        return "開催予定"
      case "completed":
        return "終了"
      case "cancelled":
        return "中止"
      default:
        return "不明"
    }
  }

  const getTypeIcon = (type: Event["type"]) => {
    switch (type) {
      case "challenge":
        return <Target className="w-4 h-4" />
      case "contest":
        return <Trophy className="w-4 h-4" />
      case "collaboration":
        return <Users className="w-4 h-4" />
      case "milestone":
        return <Star className="w-4 h-4" />
      default:
        return <Calendar className="w-4 h-4" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
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
            <h1 className="text-3xl font-bold text-white mb-2">イベント</h1>
            <p className="text-gray-400">コミュニティイベントに参加して配信を盛り上げよう</p>
          </div>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                <Plus className="w-4 h-4 mr-2" />
                イベント作成
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-black/90 backdrop-blur-xl border-white/20 text-white">
              <DialogHeader>
                <DialogTitle>新しいイベントを作成</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">イベント名</Label>
                    <Input
                      placeholder="イベントのタイトル"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-white">イベントタイプ</Label>
                    <Select
                      value={newEvent.type}
                      onValueChange={(value: Event["type"]) => setNewEvent({ ...newEvent, type: value })}
                    >
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-black/80 backdrop-blur-xl border-white/20">
                        <SelectItem value="challenge">チャレンジ</SelectItem>
                        <SelectItem value="contest">コンテスト</SelectItem>
                        <SelectItem value="collaboration">コラボ</SelectItem>
                        <SelectItem value="milestone">マイルストーン</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label className="text-white">説明</Label>
                  <Textarea
                    placeholder="イベントの詳細説明"
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">開始日</Label>
                    <Input
                      type="date"
                      value={newEvent.startDate}
                      onChange={(e) => setNewEvent({ ...newEvent, startDate: e.target.value })}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-white">終了日</Label>
                    <Input
                      type="date"
                      value={newEvent.endDate}
                      onChange={(e) => setNewEvent({ ...newEvent, endDate: e.target.value })}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    キャンセル
                  </Button>
                  <Button
                    onClick={handleCreateEvent}
                    disabled={!newEvent.title || !newEvent.description || !newEvent.startDate || !newEvent.endDate}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    作成
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* タブ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid w-full grid-cols-4 bg-black/20 backdrop-blur-xl border border-white/10">
              <TabsTrigger
                value="active"
                className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-300"
              >
                <Play className="w-4 h-4" />
                開催中
              </TabsTrigger>
              <TabsTrigger
                value="upcoming"
                className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-300"
              >
                <Clock className="w-4 h-4" />
                開催予定
              </TabsTrigger>
              <TabsTrigger
                value="completed"
                className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-300"
              >
                <CheckCircle className="w-4 h-4" />
                終了
              </TabsTrigger>
              <TabsTrigger
                value="my"
                className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-300"
              >
                <Users className="w-4 h-4" />
                作成したイベント
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-6">
              <AnimatePresence>
                {filteredEvents.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-12"
                  >
                    <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-white mb-2">イベントがありません</h3>
                    <p className="text-gray-400">新しいイベントを作成してコミュニティを盛り上げましょう</p>
                  </motion.div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredEvents.map((event, index) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <Card className="bg-black/20 backdrop-blur-xl border-white/10 hover:border-purple-500/50 transition-all duration-200 group">
                          {event.bannerUrl && (
                            <div className="relative h-48 overflow-hidden rounded-t-lg">
                              <img
                                src={event.bannerUrl || "/placeholder.svg"}
                                alt={event.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                              />
                              <div className="absolute top-4 left-4 flex gap-2">
                                <Badge className={`${getStatusColor(event.status)} text-white`}>
                                  {getStatusText(event.status)}
                                </Badge>
                                <Badge variant="outline" className="bg-black/60 text-white border-white/20">
                                  {getTypeIcon(event.type)}
                                  <span className="ml-1 capitalize">{event.type}</span>
                                </Badge>
                              </div>
                              <div className="absolute top-4 right-4">
                                <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          )}

                          <CardContent className="p-6">
                            <div className="space-y-4">
                              <div>
                                <div className="flex items-start justify-between mb-2">
                                  <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                                    {event.title}
                                  </h3>
                                  {!event.bannerUrl && (
                                    <div className="flex gap-2">
                                      <Badge className={`${getStatusColor(event.status)} text-white`}>
                                        {getStatusText(event.status)}
                                      </Badge>
                                    </div>
                                  )}
                                </div>
                                <p className="text-gray-400 text-sm line-clamp-2">{event.description}</p>
                              </div>

                              <div className="flex items-center gap-4 text-sm text-gray-400">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  <span>
                                    {formatDate(event.startDate)} - {formatDate(event.endDate)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Users className="w-4 h-4" />
                                  <span>{event.participants}人参加</span>
                                  {event.maxParticipants && <span>/ {event.maxParticipants}人</span>}
                                </div>
                              </div>

                              {event.progress && (
                                <div className="space-y-2">
                                  <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">進行状況</span>
                                    <span className="text-white">
                                      {event.progress.current} / {event.progress.target} {event.progress.unit}
                                    </span>
                                  </div>
                                  <div className="w-full bg-gray-700 rounded-full h-2">
                                    <div
                                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                                      style={{
                                        width: `${Math.min((event.progress.current / event.progress.target) * 100, 100)}%`,
                                      }}
                                    />
                                  </div>
                                </div>
                              )}

                              {event.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                  {event.tags.slice(0, 3).map((tag) => (
                                    <Badge
                                      key={tag}
                                      variant="outline"
                                      className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs"
                                    >
                                      {tag}
                                    </Badge>
                                  ))}
                                  {event.tags.length > 3 && (
                                    <Badge
                                      variant="outline"
                                      className="bg-gray-500/20 text-gray-300 border-gray-500/30 text-xs"
                                    >
                                      +{event.tags.length - 3}
                                    </Badge>
                                  )}
                                </div>
                              )}

                              <div className="flex justify-between items-center pt-4 border-t border-white/10">
                                <div className="flex items-center gap-2">
                                  <Avatar className="w-6 h-6">
                                    <AvatarFallback className="bg-purple-600 text-white text-xs">
                                      {event.createdBy[0]}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm text-gray-400">by {event.createdBy}</span>
                                </div>

                                <div className="flex gap-2">
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                                        onClick={() => setSelectedEvent(event)}
                                      >
                                        詳細
                                      </Button>
                                    </DialogTrigger>
                                  </Dialog>

                                  {event.status === "active" || event.status === "upcoming" ? (
                                    <Button
                                      size="sm"
                                      onClick={() => handleJoinEvent(event.id)}
                                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                                    >
                                      参加
                                    </Button>
                                  ) : (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                                    >
                                      結果を見る
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* イベント詳細ダイアログ */}
        <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
          <DialogContent className="max-w-4xl bg-black/90 backdrop-blur-xl border-white/20 text-white">
            {selectedEvent && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-3">
                    {selectedEvent.title}
                    <Badge className={`${getStatusColor(selectedEvent.status)} text-white`}>
                      {getStatusText(selectedEvent.status)}
                    </Badge>
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                  {selectedEvent.bannerUrl && (
                    <img
                      src={selectedEvent.bannerUrl || "/placeholder.svg"}
                      alt={selectedEvent.title}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  )}

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium text-white mb-2">説明</h3>
                        <p className="text-gray-300">{selectedEvent.description}</p>
                      </div>

                      <div>
                        <h3 className="font-medium text-white mb-2">ルール</h3>
                        <ul className="space-y-1">
                          {selectedEvent.rules.map((rule, index) => (
                            <li key={index} className="text-gray-300 text-sm flex items-start gap-2">
                              <span className="text-purple-400 mt-1">•</span>
                              {rule}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h3 className="font-medium text-white mb-2">報酬</h3>
                        <div className="space-y-2">
                          {selectedEvent.rewards.map((reward, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <Gift className="w-4 h-4 text-yellow-400" />
                              <span className="text-gray-300 text-sm">{reward}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">開始日</span>
                          <p className="text-white">{formatDate(selectedEvent.startDate)}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">終了日</span>
                          <p className="text-white">{formatDate(selectedEvent.endDate)}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">参加者数</span>
                          <p className="text-white">
                            {selectedEvent.participants}人
                            {selectedEvent.maxParticipants && ` / ${selectedEvent.maxParticipants}人`}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-400">作成者</span>
                          <p className="text-white">{selectedEvent.createdBy}</p>
                        </div>
                      </div>

                      {selectedEvent.progress && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">進行状況</span>
                            <span className="text-white">
                              {selectedEvent.progress.current} / {selectedEvent.progress.target}{" "}
                              {selectedEvent.progress.unit}
                            </span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-3">
                            <div
                              className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-300"
                              style={{
                                width: `${Math.min((selectedEvent.progress.current / selectedEvent.progress.target) * 100, 100)}%`,
                              }}
                            />
                          </div>
                        </div>
                      )}

                      <div>
                        <h3 className="font-medium text-white mb-2">タグ</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedEvent.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="bg-purple-500/20 text-purple-300 border-purple-500/30"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-white/20">
                    <div className="flex gap-2">
                      <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
                        <Share2 className="w-4 h-4 mr-2" />
                        共有
                      </Button>
                      <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
                        <Copy className="w-4 h-4 mr-2" />
                        リンクをコピー
                      </Button>
                    </div>

                    {selectedEvent.status === "active" || selectedEvent.status === "upcoming" ? (
                      <Button
                        onClick={() => handleJoinEvent(selectedEvent.id)}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      >
                        イベントに参加
                      </Button>
                    ) : (
                      <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
                        結果を見る
                      </Button>
                    )}
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
