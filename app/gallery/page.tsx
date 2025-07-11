"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import {
  Upload,
  Search,
  Filter,
  Grid3X3,
  List,
  Heart,
  Eye,
  Share2,
  Download,
  Trash2,
  Edit,
  MoreHorizontal,
  Tag,
  Sparkles,
  Play,
  Volume2,
  FolderPlus,
  Folder,
  GripVertical,
} from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"

interface GalleryItem {
  id: string
  title: string
  description?: string
  fileUrl: string
  fileType: "image" | "video" | "audio"
  fileSize: number
  viewCount: number
  likes: number
  tags: string[]
  createdAt: string
  isAIGenerated?: boolean
  streamDate?: string
  groupId?: string
}

interface GalleryGroup {
  id: string
  name: string
  color: string
  items: GalleryItem[]
}

export default function GalleryPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [groups, setGroups] = useState<GalleryGroup[]>([])
  const [ungroupedItems, setUngroupedItems] = useState<GalleryItem[]>([])
  const [isCreatingGroup, setIsCreatingGroup] = useState(false)
  const [newGroupName, setNewGroupName] = useState("")
  const [editingGroup, setEditingGroup] = useState<string | null>(null)
  const { toast } = useToast()

  // データベースからデータを取得
  useEffect(() => {
    fetchGalleryData()
  }, [])

  const fetchGalleryData = async () => {
    try {
      const response = await fetch("/api/gallery")
      const data = await response.json()

      if (data.success) {
        // グループ化されたデータとグループ化されていないデータを分離
        const groupedData: { [key: string]: GalleryGroup } = {}
        const ungrouped: GalleryItem[] = []

        data.data.forEach((item: GalleryItem) => {
          if (item.groupId) {
            if (!groupedData[item.groupId]) {
              groupedData[item.groupId] = {
                id: item.groupId,
                name: `グループ ${item.groupId}`,
                color: getRandomColor(),
                items: [],
              }
            }
            groupedData[item.groupId].items.push(item)
          } else {
            ungrouped.push(item)
          }
        })

        setGroups(Object.values(groupedData))
        setUngroupedItems(ungrouped)
      }
    } catch (error) {
      console.error("Failed to fetch gallery data:", error)
      toast({
        title: "データ取得エラー",
        description: "ギャラリーデータの取得に失敗しました",
        variant: "destructive",
      })
    }
  }

  const getRandomColor = () => {
    const colors = ["purple", "blue", "green", "yellow", "red", "pink", "indigo", "teal"]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const { source, destination, draggableId } = result

    // アイテムをグループ間で移動
    if (source.droppableId !== destination.droppableId) {
      const sourceGroupId = source.droppableId === "ungrouped" ? null : source.droppableId
      const destGroupId = destination.droppableId === "ungrouped" ? null : destination.droppableId

      // データベースを更新
      updateItemGroup(draggableId, destGroupId)
    }
  }

  const updateItemGroup = async (itemId: string, groupId: string | null) => {
    try {
      const response = await fetch(`/api/gallery/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ groupId }),
      })

      if (response.ok) {
        // ローカル状態を更新
        fetchGalleryData()
        toast({
          title: "移動完了",
          description: "アイテムを移動しました",
        })
      }
    } catch (error) {
      toast({
        title: "移動エラー",
        description: "アイテムの移動に失敗しました",
        variant: "destructive",
      })
    }
  }

  const createGroup = async () => {
    if (!newGroupName.trim()) return

    try {
      const response = await fetch("/api/gallery/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newGroupName, color: getRandomColor() }),
      })

      if (response.ok) {
        const data = await response.json()
        setGroups([...groups, { ...data.data, items: [] }])
        setNewGroupName("")
        setIsCreatingGroup(false)
        toast({
          title: "グループ作成",
          description: "新しいグループを作成しました",
        })
      }
    } catch (error) {
      toast({
        title: "作成エラー",
        description: "グループの作成に失敗しました",
        variant: "destructive",
      })
    }
  }

  const updateGroupName = async (groupId: string, newName: string) => {
    try {
      const response = await fetch(`/api/gallery/groups/${groupId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName }),
      })

      if (response.ok) {
        setGroups(groups.map((group) => (group.id === groupId ? { ...group, name: newName } : group)))
        setEditingGroup(null)
        toast({
          title: "更新完了",
          description: "グループ名を更新しました",
        })
      }
    } catch (error) {
      toast({
        title: "更新エラー",
        description: "グループ名の更新に失敗しました",
        variant: "destructive",
      })
    }
  }

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      Array.from(files).forEach((file) => {
        formData.append("files", file)
      })

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        fetchGalleryData()
        toast({
          title: "アップロード完了",
          description: `${files.length}個のファイルがアップロードされました`,
        })
      }
    } catch (error) {
      toast({
        title: "アップロードエラー",
        description: "ファイルのアップロードに失敗しました",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    const sizes = ["B", "KB", "MB", "GB"]
    if (bytes === 0) return "0 B"
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const renderGalleryItem = (item: GalleryItem, index: number) => (
    <Draggable key={item.id} draggableId={item.id} index={index}>
      {(provided, snapshot) => (
        <motion.div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className={`${snapshot.isDragging ? "rotate-3 scale-105" : ""}`}
        >
          <Card className="bg-black/20 backdrop-blur-xl border-white/10 hover:border-purple-500/50 transition-all duration-200 group cursor-pointer">
            <div className="relative aspect-video overflow-hidden rounded-t-lg">
              <img
                src={item.fileUrl || "/placeholder.svg?height=300&width=400"}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />

              {/* ドラッグハンドル */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical className="w-4 h-4 text-white bg-black/50 rounded p-0.5" />
              </div>

              {/* オーバーレイ */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <div className="flex space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-white hover:bg-white/20"
                        onClick={() => setSelectedItem(item)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                  <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* バッジ */}
              <div className="absolute top-2 left-2 flex gap-1">
                {item.isAIGenerated && (
                  <Badge className="bg-yellow-500/80 text-black text-xs">
                    <Sparkles className="w-2 h-2 mr-1" />
                    AI
                  </Badge>
                )}
                <Badge variant="secondary" className="bg-black/60 text-white text-xs">
                  {item.fileType.toUpperCase()}
                </Badge>
              </div>

              {/* 統計 */}
              <div className="absolute bottom-2 right-2 flex items-center space-x-2 text-white text-xs">
                <div className="flex items-center space-x-1">
                  <Eye className="w-3 h-3" />
                  <span>{item.viewCount}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Heart className="w-3 h-3" />
                  <span>{item.likes}</span>
                </div>
              </div>
            </div>

            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-white truncate flex-1">{item.title}</h3>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-black/80 backdrop-blur-xl border-white/20">
                    <DropdownMenuItem>
                      <Edit className="w-4 h-4 mr-2" />
                      編集
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Share2 className="w-4 h-4 mr-2" />
                      共有
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="w-4 h-4 mr-2" />
                      ダウンロード
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-400">
                      <Trash2 className="w-4 h-4 mr-2" />
                      削除
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {item.description && <p className="text-sm text-gray-400 mb-3 line-clamp-2">{item.description}</p>}

              <div className="flex flex-wrap gap-1 mb-3">
                {item.tags.slice(0, 3).map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="text-xs bg-purple-500/20 text-purple-300 border-purple-500/30"
                  >
                    <Tag className="w-2 h-2 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex justify-between items-center text-xs text-gray-400">
                <span>{formatDate(item.createdAt)}</span>
                <span>{formatFileSize(item.fileSize)}</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </Draggable>
  )

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
            <h1 className="text-3xl font-bold text-white mb-2">ギャラリー</h1>
            <p className="text-gray-400">配信の思い出を管理・共有しましょう</p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => setIsCreatingGroup(true)}
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <FolderPlus className="w-4 h-4 mr-2" />
              グループ作成
            </Button>
            <Button
              onClick={() => document.getElementById("file-upload")?.click()}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              disabled={isUploading}
            >
              <Upload className="w-4 h-4 mr-2" />
              {isUploading ? "アップロード中..." : "アップロード"}
            </Button>
            <input
              id="file-upload"
              type="file"
              multiple
              accept="image/*,video/*,audio/*"
              className="hidden"
              onChange={(e) => handleFileUpload(e.target.files)}
            />
          </div>
        </motion.div>

        {/* 検索・フィルター */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="bg-black/20 backdrop-blur-xl border-white/10">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="タイトルやタグで検索..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="bg-white/10 border-white/20 text-white">
                        <Filter className="w-4 h-4 mr-2" />
                        フィルター
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-black/80 backdrop-blur-xl border-white/20">
                      <DropdownMenuItem onClick={() => setSelectedFilter("all")}>すべて</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSelectedFilter("image")}>画像</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSelectedFilter("video")}>動画</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSelectedFilter("audio")}>音声</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSelectedFilter("ai")}>AI生成</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <div className="flex border border-white/20 rounded-lg overflow-hidden">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className="rounded-none"
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className="rounded-none"
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ドラッグ&ドロップコンテキスト */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="space-y-8">
            {/* グループ */}
            {groups.map((group) => (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="bg-black/20 backdrop-blur-xl border-white/10">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Folder className={`w-5 h-5 text-${group.color}-400`} />
                        {editingGroup === group.id ? (
                          <Input
                            defaultValue={group.name}
                            className="bg-white/10 border-white/20 text-white"
                            onBlur={(e) => updateGroupName(group.id, e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                updateGroupName(group.id, e.currentTarget.value)
                              }
                            }}
                            autoFocus
                          />
                        ) : (
                          <CardTitle
                            className="text-white cursor-pointer hover:text-purple-300"
                            onClick={() => setEditingGroup(group.id)}
                          >
                            {group.name}
                          </CardTitle>
                        )}
                      </div>
                      <Badge variant="outline" className="bg-white/10 text-white">
                        {group.items.length}個
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Droppable droppableId={group.id} direction="horizontal">
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 min-h-[200px] p-4 rounded-lg transition-colors ${
                            snapshot.isDraggingOver
                              ? "bg-purple-500/20 border-2 border-dashed border-purple-500"
                              : "bg-white/5"
                          }`}
                        >
                          {group.items.map((item, index) => renderGalleryItem(item, index))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {/* グループ化されていないアイテム */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Card className="bg-black/20 backdrop-blur-xl border-white/10">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center gap-2">
                      <Upload className="w-5 h-5 text-gray-400" />
                      未分類
                    </CardTitle>
                    <Badge variant="outline" className="bg-white/10 text-white">
                      {ungroupedItems.length}個
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Droppable droppableId="ungrouped" direction="horizontal">
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 min-h-[200px] p-4 rounded-lg transition-colors ${
                          snapshot.isDraggingOver
                            ? "bg-blue-500/20 border-2 border-dashed border-blue-500"
                            : "bg-white/5"
                        }`}
                      >
                        {ungroupedItems.map((item, index) => renderGalleryItem(item, index))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </DragDropContext>

        {/* グループ作成ダイアログ */}
        <Dialog open={isCreatingGroup} onOpenChange={setIsCreatingGroup}>
          <DialogContent className="bg-black/90 backdrop-blur-xl border-white/20 text-white">
            <DialogHeader>
              <DialogTitle>新しいグループを作成</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="group-name" className="text-white">
                  グループ名
                </Label>
                <Input
                  id="group-name"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="グループ名を入力..."
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreatingGroup(false)}>
                  キャンセル
                </Button>
                <Button onClick={createGroup} className="bg-gradient-to-r from-purple-600 to-pink-600">
                  作成
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* 詳細表示ダイアログ */}
        <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
          <DialogContent className="max-w-4xl bg-black/90 backdrop-blur-xl border-white/20 text-white">
            {selectedItem && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    {selectedItem.title}
                    {selectedItem.isAIGenerated && (
                      <Badge className="bg-yellow-500/80 text-black">
                        <Sparkles className="w-3 h-3 mr-1" />
                        AI生成
                      </Badge>
                    )}
                  </DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="aspect-video rounded-lg overflow-hidden">
                      {selectedItem.fileType === "image" && (
                        <img
                          src={selectedItem.fileUrl || "/placeholder.svg?height=400&width=600"}
                          alt={selectedItem.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                      {selectedItem.fileType === "video" && (
                        <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                          <Play className="w-16 h-16 text-gray-400" />
                        </div>
                      )}
                      {selectedItem.fileType === "audio" && (
                        <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                          <Volume2 className="w-16 h-16 text-gray-400" />
                        </div>
                      )}
                    </div>

                    <div className="flex justify-center gap-2">
                      <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
                        <Share2 className="w-4 h-4 mr-2" />
                        共有
                      </Button>
                      <Button variant="outline" className="border-white/20 text-white bg-transparent">
                        <Download className="w-4 h-4 mr-2" />
                        ダウンロード
                      </Button>
                      <Button variant="outline" className="border-white/20 text-white bg-transparent">
                        <Heart className="w-4 h-4 mr-2" />
                        いいね
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">説明</h3>
                      <p className="text-gray-300">{selectedItem.description || "説明がありません"}</p>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">タグ</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedItem.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="bg-purple-500/20 text-purple-300 border-purple-500/30"
                          >
                            <Tag className="w-3 h-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">作成日時</span>
                        <p className="text-white">{formatDate(selectedItem.createdAt)}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">ファイルサイズ</span>
                        <p className="text-white">{formatFileSize(selectedItem.fileSize)}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">表示回数</span>
                        <p className="text-white">{selectedItem.viewCount}回</p>
                      </div>
                      <div>
                        <span className="text-gray-400">いいね数</span>
                        <p className="text-white">{selectedItem.likes}個</p>
                      </div>
                    </div>

                    {selectedItem.streamDate && (
                      <div>
                        <span className="text-gray-400">配信日</span>
                        <p className="text-white">{selectedItem.streamDate}</p>
                      </div>
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
