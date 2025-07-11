"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { User, Bell, Shield, Palette, Zap, Camera, Save, Upload, Trash2, Download, RefreshCw } from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"

interface UserSettings {
  profile: {
    displayName: string
    bio: string
    avatarUrl: string
    location: string
    website: string
  }
  notifications: {
    emailNotifications: boolean
    pushNotifications: boolean
    streamStartNotifications: boolean
    commentNotifications: boolean
    heartNotifications: boolean
    weeklyReport: boolean
  }
  privacy: {
    profileVisibility: "public" | "private" | "friends"
    showOnlineStatus: boolean
    allowDirectMessages: boolean
    showStreamHistory: boolean
    dataCollection: boolean
  }
  streaming: {
    defaultStreamTitle: string
    autoSaveResults: boolean
    ocrEnabled: boolean
    aiAdviceEnabled: boolean
    autoHighlights: boolean
    streamQuality: "low" | "medium" | "high"
  }
  appearance: {
    theme: "dark" | "light" | "auto"
    language: "ja" | "en"
    timezone: string
    dateFormat: "YYYY/MM/DD" | "MM/DD/YYYY" | "DD/MM/YYYY"
  }
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings>({
    profile: {
      displayName: "配信者名",
      bio: "音声配信を楽しんでいます！",
      avatarUrl: "/placeholder.svg?height=100&width=100",
      location: "東京, 日本",
      website: "https://example.com",
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      streamStartNotifications: true,
      commentNotifications: true,
      heartNotifications: false,
      weeklyReport: true,
    },
    privacy: {
      profileVisibility: "public",
      showOnlineStatus: true,
      allowDirectMessages: true,
      showStreamHistory: true,
      dataCollection: true,
    },
    streaming: {
      defaultStreamTitle: "雑談配信",
      autoSaveResults: true,
      ocrEnabled: true,
      aiAdviceEnabled: true,
      autoHighlights: true,
      streamQuality: "high",
    },
    appearance: {
      theme: "dark",
      language: "ja",
      timezone: "Asia/Tokyo",
      dateFormat: "YYYY/MM/DD",
    },
  })

  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { toast } = useToast()

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // 設定保存処理のシミュレーション
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "設定を保存しました",
        description: "変更が正常に保存されました",
      })
    } catch (error) {
      toast({
        title: "保存エラー",
        description: "設定の保存に失敗しました",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setSettings({
        ...settings,
        profile: { ...settings.profile, avatarUrl: url },
      })
    }
  }

  const handleExportData = async () => {
    try {
      // データエクスポート処理のシミュレーション
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "データエクスポート完了",
        description: "データのダウンロードが開始されました",
      })
    } catch (error) {
      toast({
        title: "エクスポートエラー",
        description: "データのエクスポートに失敗しました",
        variant: "destructive",
      })
    }
  }

  const handleDeleteAccount = async () => {
    if (confirm("本当にアカウントを削除しますか？この操作は取り消せません。")) {
      try {
        // アカウント削除処理のシミュレーション
        await new Promise((resolve) => setTimeout(resolve, 1000))

        toast({
          title: "アカウント削除完了",
          description: "アカウントが正常に削除されました",
        })
      } catch (error) {
        toast({
          title: "削除エラー",
          description: "アカウントの削除に失敗しました",
          variant: "destructive",
        })
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* ヘッダー */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center"
        >
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">設定</h1>
            <p className="text-gray-400">アカウントと配信の設定を管理</p>
          </div>

          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                保存中...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                設定を保存
              </>
            )}
          </Button>
        </motion.div>

        {/* タブ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Tabs defaultValue="profile" className="space-y-8">
            <TabsList className="grid w-full grid-cols-5 bg-black/20 backdrop-blur-xl border border-white/10">
              <TabsTrigger
                value="profile"
                className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-300"
              >
                <User className="w-4 h-4" />
                プロフィール
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-300"
              >
                <Bell className="w-4 h-4" />
                通知
              </TabsTrigger>
              <TabsTrigger
                value="privacy"
                className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-300"
              >
                <Shield className="w-4 h-4" />
                プライバシー
              </TabsTrigger>
              <TabsTrigger
                value="streaming"
                className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-300"
              >
                <Zap className="w-4 h-4" />
                配信
              </TabsTrigger>
              <TabsTrigger
                value="appearance"
                className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-300"
              >
                <Palette className="w-4 h-4" />
                外観
              </TabsTrigger>
            </TabsList>

            {/* プロフィール設定 */}
            <TabsContent value="profile" className="space-y-6">
              <Card className="bg-black/20 backdrop-blur-xl border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">プロフィール情報</CardTitle>
                  <CardDescription className="text-gray-400">公開プロフィールの情報を設定してください</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <Avatar className="w-20 h-20">
                        <AvatarImage src={settings.profile.avatarUrl || "/placeholder.svg"} />
                        <AvatarFallback className="bg-purple-600 text-white text-xl">
                          {settings.profile.displayName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <Button
                        size="sm"
                        className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 bg-purple-600 hover:bg-purple-700"
                        onClick={() => document.getElementById("avatar-upload")?.click()}
                      >
                        <Camera className="w-4 h-4" />
                      </Button>
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarUpload}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-medium mb-1">プロフィール画像</h3>
                      <p className="text-sm text-gray-400 mb-3">JPG、PNG、GIF形式（最大5MB）</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                        onClick={() => document.getElementById("avatar-upload")?.click()}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        画像をアップロード
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-white">表示名</Label>
                      <Input
                        value={settings.profile.displayName}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            profile: { ...settings.profile, displayName: e.target.value },
                          })
                        }
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-white">場所</Label>
                      <Input
                        value={settings.profile.location}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            profile: { ...settings.profile, location: e.target.value },
                          })
                        }
                        className="bg-white/10 border-white/20 text-white"
                        placeholder="例: 東京, 日本"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-white">ウェブサイト</Label>
                    <Input
                      value={settings.profile.website}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          profile: { ...settings.profile, website: e.target.value },
                        })
                      }
                      className="bg-white/10 border-white/20 text-white"
                      placeholder="https://example.com"
                    />
                  </div>

                  <div>
                    <Label className="text-white">自己紹介</Label>
                    <Textarea
                      value={settings.profile.bio}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          profile: { ...settings.profile, bio: e.target.value },
                        })
                      }
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      placeholder="あなたについて教えてください..."
                      rows={4}
                    />
                    <p className="text-xs text-gray-400 mt-1">{settings.profile.bio.length}/500文字</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 通知設定 */}
            <TabsContent value="notifications" className="space-y-6">
              <Card className="bg-black/20 backdrop-blur-xl border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">通知設定</CardTitle>
                  <CardDescription className="text-gray-400">受け取りたい通知を選択してください</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">メール通知</h4>
                        <p className="text-sm text-gray-400">重要な更新をメールで受け取る</p>
                      </div>
                      <Switch
                        checked={settings.notifications.emailNotifications}
                        onCheckedChange={(checked) =>
                          setSettings({
                            ...settings,
                            notifications: { ...settings.notifications, emailNotifications: checked },
                          })
                        }
                      />
                    </div>

                    <Separator className="bg-white/10" />

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">プッシュ通知</h4>
                        <p className="text-sm text-gray-400">ブラウザでリアルタイム通知を受け取る</p>
                      </div>
                      <Switch
                        checked={settings.notifications.pushNotifications}
                        onCheckedChange={(checked) =>
                          setSettings({
                            ...settings,
                            notifications: { ...settings.notifications, pushNotifications: checked },
                          })
                        }
                      />
                    </div>

                    <Separator className="bg-white/10" />

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">配信開始通知</h4>
                        <p className="text-sm text-gray-400">フォローしている配信者の配信開始を通知</p>
                      </div>
                      <Switch
                        checked={settings.notifications.streamStartNotifications}
                        onCheckedChange={(checked) =>
                          setSettings({
                            ...settings,
                            notifications: { ...settings.notifications, streamStartNotifications: checked },
                          })
                        }
                      />
                    </div>

                    <Separator className="bg-white/10" />

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">コメント通知</h4>
                        <p className="text-sm text-gray-400">配信にコメントがついた時に通知</p>
                      </div>
                      <Switch
                        checked={settings.notifications.commentNotifications}
                        onCheckedChange={(checked) =>
                          setSettings({
                            ...settings,
                            notifications: { ...settings.notifications, commentNotifications: checked },
                          })
                        }
                      />
                    </div>

                    <Separator className="bg-white/10" />

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">ハート通知</h4>
                        <p className="text-sm text-gray-400">ハートを受け取った時に通知</p>
                      </div>
                      <Switch
                        checked={settings.notifications.heartNotifications}
                        onCheckedChange={(checked) =>
                          setSettings({
                            ...settings,
                            notifications: { ...settings.notifications, heartNotifications: checked },
                          })
                        }
                      />
                    </div>

                    <Separator className="bg-white/10" />

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">週次レポート</h4>
                        <p className="text-sm text-gray-400">週間の配信統計をメールで受け取る</p>
                      </div>
                      <Switch
                        checked={settings.notifications.weeklyReport}
                        onCheckedChange={(checked) =>
                          setSettings({
                            ...settings,
                            notifications: { ...settings.notifications, weeklyReport: checked },
                          })
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* プライバシー設定 */}
            <TabsContent value="privacy" className="space-y-6">
              <Card className="bg-black/20 backdrop-blur-xl border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">プライバシー設定</CardTitle>
                  <CardDescription className="text-gray-400">プライバシーとセキュリティの設定を管理</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="text-white">プロフィールの公開設定</Label>
                    <Select
                      value={settings.privacy.profileVisibility}
                      onValueChange={(value: "public" | "private" | "friends") =>
                        setSettings({
                          ...settings,
                          privacy: { ...settings.privacy, profileVisibility: value },
                        })
                      }
                    >
                      <SelectTrigger className="bg-white/10 border-white/20 text-white mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-black/80 backdrop-blur-xl border-white/20">
                        <SelectItem value="public">公開</SelectItem>
                        <SelectItem value="friends">フレンドのみ</SelectItem>
                        <SelectItem value="private">非公開</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator className="bg-white/10" />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">オンライン状態を表示</h4>
                        <p className="text-sm text-gray-400">他のユーザーにオンライン状態を表示する</p>
                      </div>
                      <Switch
                        checked={settings.privacy.showOnlineStatus}
                        onCheckedChange={(checked) =>
                          setSettings({
                            ...settings,
                            privacy: { ...settings.privacy, showOnlineStatus: checked },
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">ダイレクトメッセージを許可</h4>
                        <p className="text-sm text-gray-400">他のユーザーからのDMを受け取る</p>
                      </div>
                      <Switch
                        checked={settings.privacy.allowDirectMessages}
                        onCheckedChange={(checked) =>
                          setSettings({
                            ...settings,
                            privacy: { ...settings.privacy, allowDirectMessages: checked },
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">配信履歴を表示</h4>
                        <p className="text-sm text-gray-400">プロフィールに過去の配信履歴を表示する</p>
                      </div>
                      <Switch
                        checked={settings.privacy.showStreamHistory}
                        onCheckedChange={(checked) =>
                          setSettings({
                            ...settings,
                            privacy: { ...settings.privacy, showStreamHistory: checked },
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">データ収集を許可</h4>
                        <p className="text-sm text-gray-400">サービス改善のためのデータ収集を許可する</p>
                      </div>
                      <Switch
                        checked={settings.privacy.dataCollection}
                        onCheckedChange={(checked) =>
                          setSettings({
                            ...settings,
                            privacy: { ...settings.privacy, dataCollection: checked },
                          })
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/20 backdrop-blur-xl border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">データ管理</CardTitle>
                  <CardDescription className="text-gray-400">あなたのデータをダウンロードまたは削除</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium">データをエクスポート</h4>
                      <p className="text-sm text-gray-400">すべてのデータをダウンロード</p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={handleExportData}
                      className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      エクスポート
                    </Button>
                  </div>

                  <Separator className="bg-white/10" />

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium text-red-400">アカウントを削除</h4>
                      <p className="text-sm text-gray-400">すべてのデータが永久に削除されます</p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={handleDeleteAccount}
                      className="border-red-500/50 text-red-400 hover:bg-red-500/10 bg-transparent"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      削除
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 配信設定 */}
            <TabsContent value="streaming" className="space-y-6">
              <Card className="bg-black/20 backdrop-blur-xl border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">配信設定</CardTitle>
                  <CardDescription className="text-gray-400">配信に関する設定を管理</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="text-white">デフォルト配信タイトル</Label>
                    <Input
                      value={settings.streaming.defaultStreamTitle}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          streaming: { ...settings.streaming, defaultStreamTitle: e.target.value },
                        })
                      }
                      className="bg-white/10 border-white/20 text-white mt-2"
                      placeholder="例: 雑談配信"
                    />
                  </div>

                  <div>
                    <Label className="text-white">配信品質</Label>
                    <Select
                      value={settings.streaming.streamQuality}
                      onValueChange={(value: "low" | "medium" | "high") =>
                        setSettings({
                          ...settings,
                          streaming: { ...settings.streaming, streamQuality: value },
                        })
                      }
                    >
                      <SelectTrigger className="bg-white/10 border-white/20 text-white mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-black/80 backdrop-blur-xl border-white/20">
                        <SelectItem value="low">低品質（データ節約）</SelectItem>
                        <SelectItem value="medium">標準品質</SelectItem>
                        <SelectItem value="high">高品質</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator className="bg-white/10" />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">リザルト自動保存</h4>
                        <p className="text-sm text-gray-400">配信終了時に結果を自動保存</p>
                      </div>
                      <Switch
                        checked={settings.streaming.autoSaveResults}
                        onCheckedChange={(checked) =>
                          setSettings({
                            ...settings,
                            streaming: { ...settings.streaming, autoSaveResults: checked },
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">OCR機能</h4>
                        <p className="text-sm text-gray-400">スクリーンショットからデータを自動抽出</p>
                      </div>
                      <Switch
                        checked={settings.streaming.ocrEnabled}
                        onCheckedChange={(checked) =>
                          setSettings({
                            ...settings,
                            streaming: { ...settings.streaming, ocrEnabled: checked },
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">AIアドバイス</h4>
                        <p className="text-sm text-gray-400">配信改善のためのAIアドバイスを受け取る</p>
                      </div>
                      <Switch
                        checked={settings.streaming.aiAdviceEnabled}
                        onCheckedChange={(checked) =>
                          setSettings({
                            ...settings,
                            streaming: { ...settings.streaming, aiAdviceEnabled: checked },
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">自動ハイライト生成</h4>
                        <p className="text-sm text-gray-400">配信の見どころを自動で抽出</p>
                      </div>
                      <Switch
                        checked={settings.streaming.autoHighlights}
                        onCheckedChange={(checked) =>
                          setSettings({
                            ...settings,
                            streaming: { ...settings.streaming, autoHighlights: checked },
                          })
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 外観設定 */}
            <TabsContent value="appearance" className="space-y-6">
              <Card className="bg-black/20 backdrop-blur-xl border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">外観設定</CardTitle>
                  <CardDescription className="text-gray-400">アプリの見た目と言語設定</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="text-white">テーマ</Label>
                    <Select
                      value={settings.appearance.theme}
                      onValueChange={(value: "dark" | "light" | "auto") =>
                        setSettings({
                          ...settings,
                          appearance: { ...settings.appearance, theme: value },
                        })
                      }
                    >
                      <SelectTrigger className="bg-white/10 border-white/20 text-white mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-black/80 backdrop-blur-xl border-white/20">
                        <SelectItem value="dark">ダークテーマ</SelectItem>
                        <SelectItem value="light">ライトテーマ</SelectItem>
                        <SelectItem value="auto">システム設定に従う</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-white">言語</Label>
                    <Select
                      value={settings.appearance.language}
                      onValueChange={(value: "ja" | "en") =>
                        setSettings({
                          ...settings,
                          appearance: { ...settings.appearance, language: value },
                        })
                      }
                    >
                      <SelectTrigger className="bg-white/10 border-white/20 text-white mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-black/80 backdrop-blur-xl border-white/20">
                        <SelectItem value="ja">日本語</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-white">タイムゾーン</Label>
                    <Select
                      value={settings.appearance.timezone}
                      onValueChange={(value) =>
                        setSettings({
                          ...settings,
                          appearance: { ...settings.appearance, timezone: value },
                        })
                      }
                    >
                      <SelectTrigger className="bg-white/10 border-white/20 text-white mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-black/80 backdrop-blur-xl border-white/20">
                        <SelectItem value="Asia/Tokyo">Asia/Tokyo (JST)</SelectItem>
                        <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                        <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                        <SelectItem value="UTC">UTC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-white">日付形式</Label>
                    <Select
                      value={settings.appearance.dateFormat}
                      onValueChange={(value: "YYYY/MM/DD" | "MM/DD/YYYY" | "DD/MM/YYYY") =>
                        setSettings({
                          ...settings,
                          appearance: { ...settings.appearance, dateFormat: value },
                        })
                      }
                    >
                      <SelectTrigger className="bg-white/10 border-white/20 text-white mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-black/80 backdrop-blur-xl border-white/20">
                        <SelectItem value="YYYY/MM/DD">YYYY/MM/DD</SelectItem>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      </SelectContent>
                    </Select>
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
