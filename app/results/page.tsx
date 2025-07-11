"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Upload,
  Camera,
  Sparkles,
  Zap,
  CheckCircle,
  Heart,
  Star,
  Users,
  Trophy,
  Calendar,
  Clock,
  FileImage,
  Loader2,
  Eye,
  Edit,
  Save,
} from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"
import { useDropzone } from "react-dropzone"

interface StreamResult {
  id?: string
  title: string
  streamDate: string
  hearts: number
  spoons: number
  totalListeners: number
  activeListeners: number
  bestRank?: number
  endRank?: number
  duration: string
  screenshotUrl?: string
  listeners: ListenerData[]
  notes?: string
}

interface ListenerData {
  listenerName: string
  heartsGiven: number
  spoonsGiven: number
  isGalleryRegistered: boolean
}

interface OCRResult {
  confidence: number
  extractedData: StreamResult
  rawText: string
}

export default function ResultsPage() {
  const [activeTab, setActiveTab] = useState("upload")
  const [isProcessing, setIsProcessing] = useState(false)
  const [ocrResult, setOcrResult] = useState<OCRResult | null>(null)
  const [manualData, setManualData] = useState<StreamResult>({
    title: "",
    streamDate: "",
    hearts: 0,
    spoons: 0,
    totalListeners: 0,
    activeListeners: 0,
    bestRank: undefined,
    endRank: undefined,
    duration: "",
    listeners: [],
    notes: "",
  })
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const { toast } = useToast()

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (!file) return

      setUploadedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)

      // OCR処理を開始
      setIsProcessing(true)
      setActiveTab("processing")

      try {
        // OCR処理のシミュレーション
        await new Promise((resolve) => setTimeout(resolve, 3000))

        // モックOCR結果
        const mockResult: OCRResult = {
          confidence: 0.95,
          extractedData: {
            title: "雑談配信",
            streamDate: new Date().toISOString().split("T")[0],
            hearts: 1250,
            spoons: 45,
            totalListeners: 89,
            activeListeners: 67,
            bestRank: 15,
            endRank: 23,
            duration: "2時間15分",
            listeners: [
              { listenerName: "リスナーA", heartsGiven: 150, spoonsGiven: 5, isGalleryRegistered: true },
              { listenerName: "リスナーB", heartsGiven: 89, spoonsGiven: 3, isGalleryRegistered: false },
              { listenerName: "リスナーC", heartsGiven: 234, spoonsGiven: 8, isGalleryRegistered: true },
            ],
            screenshotUrl: url,
          },
          rawText: "配信タイトル: 雑談配信\nハート: 1250\nスプーン: 45\n...",
        }

        setOcrResult(mockResult)
        setActiveTab("review")

        toast({
          title: "OCR処理完了",
          description: `${Math.round(mockResult.confidence * 100)}%の精度でデータを抽出しました`,
        })
      } catch (error) {
        toast({
          title: "OCR処理エラー",
          description: "画像の解析に失敗しました",
          variant: "destructive",
        })
        setActiveTab("upload")
      } finally {
        setIsProcessing(false)
      }
    },
    [toast],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
    },
    maxFiles: 1,
  })

  const handleManualSubmit = async () => {
    try {
      setIsProcessing(true)

      // データ保存処理のシミュレーション
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "データ保存完了",
        description: "配信リザルトが正常に保存されました",
      })

      // フォームリセット
      setManualData({
        title: "",
        streamDate: "",
        hearts: 0,
        spoons: 0,
        totalListeners: 0,
        activeListeners: 0,
        bestRank: undefined,
        endRank: undefined,
        duration: "",
        listeners: [],
        notes: "",
      })

      setActiveTab("upload")
    } catch (error) {
      toast({
        title: "保存エラー",
        description: "データの保存に失敗しました",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleOcrDataSave = async () => {
    if (!ocrResult) return

    try {
      setIsProcessing(true)

      // データ保存処理のシミュレーション
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "データ保存完了",
        description: "OCR結果が正常に保存されました",
      })

      // リセット
      setOcrResult(null)
      setUploadedFile(null)
      setPreviewUrl(null)
      setActiveTab("upload")
    } catch (error) {
      toast({
        title: "保存エラー",
        description: "データの保存に失敗しました",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

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
          <h1 className="text-3xl font-bold text-white mb-2">リザルト登録</h1>
          <p className="text-gray-400">配信結果を記録して統計を管理しましょう</p>
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
                value="upload"
                className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-300"
              >
                <Upload className="w-4 h-4" />
                アップロード
              </TabsTrigger>
              <TabsTrigger
                value="processing"
                className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-300"
                disabled={!isProcessing}
              >
                <Sparkles className="w-4 h-4" />
                AI解析中
              </TabsTrigger>
              <TabsTrigger
                value="review"
                className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-300"
                disabled={!ocrResult}
              >
                <Eye className="w-4 h-4" />
                確認・編集
              </TabsTrigger>
              <TabsTrigger
                value="manual"
                className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-300"
              >
                <Edit className="w-4 h-4" />
                手動入力
              </TabsTrigger>
            </TabsList>

            {/* アップロードタブ */}
            <TabsContent value="upload" className="space-y-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Card className="bg-black/20 backdrop-blur-xl border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Camera className="w-5 h-5 text-purple-400" />
                      スクリーンショットアップロード
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      配信結果のスクリーンショットをアップロードしてAI自動解析
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div
                      {...getRootProps()}
                      className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
                        isDragActive
                          ? "border-purple-500 bg-purple-500/10"
                          : "border-gray-600 hover:border-purple-500 bg-gradient-to-br from-purple-500/10 to-pink-500/10"
                      }`}
                    >
                      <input {...getInputProps()} />
                      <div className="space-y-4">
                        <div className="w-16 h-16 mx-auto bg-purple-500/20 rounded-full flex items-center justify-center">
                          <Upload className="w-8 h-8 text-purple-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-white mb-2">
                            {isDragActive ? "ファイルをドロップしてください" : "スクリーンショットをドロップ"}
                          </h3>
                          <p className="text-gray-400 mb-4">または、クリックしてファイルを選択</p>
                          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                            ファイルを選択
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* 機能説明 */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 bg-blue-500/20 rounded-xl border border-blue-500/30">
                        <h4 className="font-medium text-blue-300 mb-2 flex items-center gap-2">
                          <Sparkles className="w-4 h-4" />
                          AI自動解析
                        </h4>
                        <ul className="text-sm text-blue-200 space-y-1">
                          <li>• ハート数・スプーン数の自動読み取り</li>
                          <li>• リスナー数・順位の抽出</li>
                          <li>• リスナー一覧とギフト情報</li>
                          <li>• 99%の高精度解析</li>
                        </ul>
                      </div>

                      <div className="p-4 bg-green-500/20 rounded-xl border border-green-500/30">
                        <h4 className="font-medium text-green-300 mb-2 flex items-center gap-2">
                          <Zap className="w-4 h-4" />
                          瞬間登録
                        </h4>
                        <ul className="text-sm text-green-200 space-y-1">
                          <li>• 3秒以内の高速処理</li>
                          <li>• 手動入力は一切不要</li>
                          <li>• 即座に統計に反映</li>
                          <li>• 自動バックアップ保存</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* 処理中タブ */}
            <TabsContent value="processing" className="space-y-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Card className="bg-black/20 backdrop-blur-xl border-white/10">
                  <CardContent className="p-8">
                    <div className="text-center space-y-6">
                      <div className="w-20 h-20 mx-auto bg-purple-500/20 rounded-full flex items-center justify-center">
                        <Loader2 className="w-10 h-10 text-purple-400 animate-spin" />
                      </div>

                      <div>
                        <h3 className="text-xl font-medium text-white mb-2">AI解析中...</h3>
                        <p className="text-gray-400">スクリーンショットからデータを抽出しています</p>
                      </div>

                      <div className="max-w-md mx-auto space-y-3">
                        <Progress value={33} className="h-2" />
                        <div className="flex justify-between text-sm text-gray-400">
                          <span>画像解析</span>
                          <span>33%</span>
                        </div>
                      </div>

                      {previewUrl && (
                        <div className="max-w-md mx-auto">
                          <img
                            src={previewUrl || "/placeholder.svg"}
                            alt="アップロードされた画像"
                            className="w-full rounded-lg border border-white/20"
                          />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* 確認・編集タブ */}
            <TabsContent value="review" className="space-y-6">
              {ocrResult && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  {/* 解析結果サマリー */}
                  <Card className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30 backdrop-blur-xl">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-8 h-8 text-green-400" />
                          <div>
                            <h3 className="text-lg font-medium text-white">解析完了</h3>
                            <p className="text-green-300">
                              精度: {Math.round(ocrResult.confidence * 100)}% - 高精度で解析されました
                            </p>
                          </div>
                        </div>
                        <Badge className="bg-green-500 text-white">
                          <Sparkles className="w-3 h-3 mr-1" />
                          AI解析済み
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="grid lg:grid-cols-2 gap-6">
                    {/* 抽出データ */}
                    <Card className="bg-black/20 backdrop-blur-xl border-white/10">
                      <CardHeader>
                        <CardTitle className="text-white">抽出されたデータ</CardTitle>
                        <CardDescription className="text-gray-400">
                          内容を確認して必要に応じて修正してください
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-white">配信タイトル</Label>
                            <Input
                              value={ocrResult.extractedData.title}
                              onChange={(e) =>
                                setOcrResult({
                                  ...ocrResult,
                                  extractedData: { ...ocrResult.extractedData, title: e.target.value },
                                })
                              }
                              className="bg-white/10 border-white/20 text-white"
                            />
                          </div>
                          <div>
                            <Label className="text-white">配信日</Label>
                            <Input
                              type="date"
                              value={ocrResult.extractedData.streamDate}
                              onChange={(e) =>
                                setOcrResult({
                                  ...ocrResult,
                                  extractedData: { ...ocrResult.extractedData, streamDate: e.target.value },
                                })
                              }
                              className="bg-white/10 border-white/20 text-white"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-white flex items-center gap-1">
                              <Heart className="w-4 h-4 text-red-400" />
                              ハート数
                            </Label>
                            <Input
                              type="number"
                              value={ocrResult.extractedData.hearts}
                              onChange={(e) =>
                                setOcrResult({
                                  ...ocrResult,
                                  extractedData: { ...ocrResult.extractedData, hearts: Number(e.target.value) },
                                })
                              }
                              className="bg-white/10 border-white/20 text-white"
                            />
                          </div>
                          <div>
                            <Label className="text-white flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-400" />
                              スプーン数
                            </Label>
                            <Input
                              type="number"
                              value={ocrResult.extractedData.spoons}
                              onChange={(e) =>
                                setOcrResult({
                                  ...ocrResult,
                                  extractedData: { ...ocrResult.extractedData, spoons: Number(e.target.value) },
                                })
                              }
                              className="bg-white/10 border-white/20 text-white"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-white flex items-center gap-1">
                              <Users className="w-4 h-4 text-blue-400" />
                              総リスナー数
                            </Label>
                            <Input
                              type="number"
                              value={ocrResult.extractedData.totalListeners}
                              onChange={(e) =>
                                setOcrResult({
                                  ...ocrResult,
                                  extractedData: { ...ocrResult.extractedData, totalListeners: Number(e.target.value) },
                                })
                              }
                              className="bg-white/10 border-white/20 text-white"
                            />
                          </div>
                          <div>
                            <Label className="text-white flex items-center gap-1">
                              <Trophy className="w-4 h-4 text-green-400" />
                              最高順位
                            </Label>
                            <Input
                              type="number"
                              value={ocrResult.extractedData.bestRank || ""}
                              onChange={(e) =>
                                setOcrResult({
                                  ...ocrResult,
                                  extractedData: {
                                    ...ocrResult.extractedData,
                                    bestRank: Number(e.target.value) || undefined,
                                  },
                                })
                              }
                              className="bg-white/10 border-white/20 text-white"
                            />
                          </div>
                        </div>

                        <div>
                          <Label className="text-white">メモ</Label>
                          <Textarea
                            placeholder="配信の感想や特記事項..."
                            value={ocrResult.extractedData.notes || ""}
                            onChange={(e) =>
                              setOcrResult({
                                ...ocrResult,
                                extractedData: { ...ocrResult.extractedData, notes: e.target.value },
                              })
                            }
                            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                            rows={3}
                          />
                        </div>
                      </CardContent>
                    </Card>

                    {/* プレビュー */}
                    <div className="space-y-6">
                      {previewUrl && (
                        <Card className="bg-black/20 backdrop-blur-xl border-white/10">
                          <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                              <FileImage className="w-5 h-5 text-purple-400" />
                              アップロード画像
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <img
                              src={previewUrl || "/placeholder.svg"}
                              alt="アップロードされた画像"
                              className="w-full rounded-lg border border-white/20"
                            />
                          </CardContent>
                        </Card>
                      )}

                      {/* リスナー情報 */}
                      {ocrResult.extractedData.listeners.length > 0 && (
                        <Card className="bg-black/20 backdrop-blur-xl border-white/10">
                          <CardHeader>
                            <CardTitle className="text-white">リスナー情報</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              {ocrResult.extractedData.listeners.map((listener, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                                >
                                  <span className="text-white">{listener.listenerName}</span>
                                  <div className="flex items-center gap-4 text-sm">
                                    <span className="text-red-400 flex items-center gap-1">
                                      <Heart className="w-3 h-3" />
                                      {listener.heartsGiven}
                                    </span>
                                    <span className="text-yellow-400 flex items-center gap-1">
                                      <Star className="w-3 h-3" />
                                      {listener.spoonsGiven}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-center gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setActiveTab("upload")}
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      キャンセル
                    </Button>
                    <Button
                      onClick={handleOcrDataSave}
                      disabled={isProcessing}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          保存中...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          データを保存
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}
            </TabsContent>

            {/* 手動入力タブ */}
            <TabsContent value="manual" className="space-y-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Card className="bg-black/20 backdrop-blur-xl border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Edit className="w-5 h-5 text-purple-400" />
                      手動データ入力
                    </CardTitle>
                    <CardDescription className="text-gray-400">配信結果を手動で入力してください</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <Label className="text-white">配信タイトル</Label>
                          <Input
                            placeholder="例: 雑談配信"
                            value={manualData.title}
                            onChange={(e) => setManualData({ ...manualData, title: e.target.value })}
                            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                          />
                        </div>

                        <div>
                          <Label className="text-white flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            配信日
                          </Label>
                          <Input
                            type="date"
                            value={manualData.streamDate}
                            onChange={(e) => setManualData({ ...manualData, streamDate: e.target.value })}
                            className="bg-white/10 border-white/20 text-white"
                          />
                        </div>

                        <div>
                          <Label className="text-white flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            配信時間
                          </Label>
                          <Input
                            placeholder="例: 2時間30分"
                            value={manualData.duration}
                            onChange={(e) => setManualData({ ...manualData, duration: e.target.value })}
                            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-white flex items-center gap-1">
                              <Heart className="w-4 h-4 text-red-400" />
                              ハート数
                            </Label>
                            <Input
                              type="number"
                              placeholder="0"
                              value={manualData.hearts || ""}
                              onChange={(e) => setManualData({ ...manualData, hearts: Number(e.target.value) || 0 })}
                              className="bg-white/10 border-white/20 text-white"
                            />
                          </div>
                          <div>
                            <Label className="text-white flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-400" />
                              スプーン数
                            </Label>
                            <Input
                              type="number"
                              placeholder="0"
                              value={manualData.spoons || ""}
                              onChange={(e) => setManualData({ ...manualData, spoons: Number(e.target.value) || 0 })}
                              className="bg-white/10 border-white/20 text-white"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-white flex items-center gap-1">
                              <Users className="w-4 h-4 text-blue-400" />
                              総リスナー数
                            </Label>
                            <Input
                              type="number"
                              placeholder="0"
                              value={manualData.totalListeners || ""}
                              onChange={(e) =>
                                setManualData({ ...manualData, totalListeners: Number(e.target.value) || 0 })
                              }
                              className="bg-white/10 border-white/20 text-white"
                            />
                          </div>
                          <div>
                            <Label className="text-white">アクティブリスナー</Label>
                            <Input
                              type="number"
                              placeholder="0"
                              value={manualData.activeListeners || ""}
                              onChange={(e) =>
                                setManualData({ ...manualData, activeListeners: Number(e.target.value) || 0 })
                              }
                              className="bg-white/10 border-white/20 text-white"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-white flex items-center gap-1">
                              <Trophy className="w-4 h-4 text-green-400" />
                              最高順位
                            </Label>
                            <Input
                              type="number"
                              placeholder="順位"
                              value={manualData.bestRank || ""}
                              onChange={(e) =>
                                setManualData({ ...manualData, bestRank: Number(e.target.value) || undefined })
                              }
                              className="bg-white/10 border-white/20 text-white"
                            />
                          </div>
                          <div>
                            <Label className="text-white">終了時順位</Label>
                            <Input
                              type="number"
                              placeholder="順位"
                              value={manualData.endRank || ""}
                              onChange={(e) =>
                                setManualData({ ...manualData, endRank: Number(e.target.value) || undefined })
                              }
                              className="bg-white/10 border-white/20 text-white"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label className="text-white">メモ・感想</Label>
                      <Textarea
                        placeholder="配信の感想や特記事項があれば記入してください..."
                        value={manualData.notes || ""}
                        onChange={(e) => setManualData({ ...manualData, notes: e.target.value })}
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                        rows={4}
                      />
                    </div>

                    <div className="flex justify-center gap-4">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setManualData({
                            title: "",
                            streamDate: "",
                            hearts: 0,
                            spoons: 0,
                            totalListeners: 0,
                            activeListeners: 0,
                            bestRank: undefined,
                            endRank: undefined,
                            duration: "",
                            listeners: [],
                            notes: "",
                          })
                        }}
                        className="border-white/20 text-white hover:bg-white/10"
                      >
                        リセット
                      </Button>
                      <Button
                        onClick={handleManualSubmit}
                        disabled={isProcessing || !manualData.title || !manualData.streamDate}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            保存中...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            データを保存
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}
