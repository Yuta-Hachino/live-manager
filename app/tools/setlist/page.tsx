"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Music,
  Plus,
  GripVertical,
  Edit,
  Trash2,
  Play,
  Download,
  MoreHorizontal,
  Youtube,
  Save,
  FileText,
  SortAsc,
  SortDesc,
  Search,
  CheckSquare,
  Square,
} from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"

interface SetlistItem {
  id: string
  songName: string
  artist: string
  releaseMedia: string
  youtubeUrl?: string
  notes?: string
  isCompleted: boolean
  order: number
}

interface Setlist {
  id: string
  name: string
  description?: string
  items: SetlistItem[]
  createdAt: string
  updatedAt: string
}

export default function SetlistPage() {
  const [setlists, setSetlists] = useState<Setlist[]>([])
  const [currentSetlist, setCurrentSetlist] = useState<Setlist | null>(null)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"order" | "songName" | "artist">("order")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [isCreatingSetlist, setIsCreatingSetlist] = useState(false)
  const [isEditingItem, setIsEditingItem] = useState<string | null>(null)
  const [newSetlistName, setNewSetlistName] = useState("")
  const [newSetlistDescription, setNewSetlistDescription] = useState("")
  const [editingItem, setEditingItem] = useState<Partial<SetlistItem>>({})
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // 初期データ
  useEffect(() => {
    // ダミーデータで初期化
    const dummySetlists: Setlist[] = [
      {
        id: "1",
        name: "2025年1月の歌枠",
        description: "新年最初の歌枠用セットリスト",
        items: [
          {
            id: "1",
            songName: "紅蓮華",
            artist: "LiSA",
            releaseMedia: "アニメ「鬼滅の刃」",
            youtubeUrl: "https://www.youtube.com/watch?v=CwkzK-F0Y00",
            notes: "盛り上がる曲",
            isCompleted: false,
            order: 0,
          },
          {
            id: "2",
            songName: "炎",
            artist: "LiSA",
            releaseMedia: "映画「鬼滅の刃 無限列車編」",
            youtubeUrl: "https://www.youtube.com/watch?v=4Q9DWJtV_Xw",
            notes: "",
            isCompleted: false,
            order: 1,
          },
          {
            id: "3",
            songName: "残酷な天使のテーゼ",
            artist: "高橋洋子",
            releaseMedia: "アニメ「新世紀エヴァンゲリオン」",
            youtubeUrl: "",
            notes: "定番曲",
            isCompleted: true,
            order: 2,
          },
        ],
        createdAt: "2025-01-01",
        updatedAt: "2025-01-01",
      },
    ]

    setSetlists(dummySetlists)
    setCurrentSetlist(dummySetlists[0])
    setIsLoading(false)
  }, [])

  const createSetlist = async () => {
    if (!newSetlistName.trim()) return

    const newSetlist: Setlist = {
      id: Date.now().toString(),
      name: newSetlistName,
      description: newSetlistDescription,
      items: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setSetlists([...setlists, newSetlist])
    setCurrentSetlist(newSetlist)
    setNewSetlistName("")
    setNewSetlistDescription("")
    setIsCreatingSetlist(false)
    toast({
      title: "セットリスト作成",
      description: "新しいセットリストを作成しました",
    })
  }

  const addItem = async () => {
    if (!currentSetlist || !editingItem.songName || !editingItem.artist) return

    const newItem: SetlistItem = {
      id: Date.now().toString(),
      songName: editingItem.songName,
      artist: editingItem.artist,
      releaseMedia: editingItem.releaseMedia || "",
      youtubeUrl: editingItem.youtubeUrl || "",
      notes: editingItem.notes || "",
      isCompleted: false,
      order: currentSetlist.items.length,
    }

    const updatedSetlist = {
      ...currentSetlist,
      items: [...currentSetlist.items, newItem],
    }

    setCurrentSetlist(updatedSetlist)
    setSetlists(setlists.map((s) => (s.id === currentSetlist.id ? updatedSetlist : s)))
    setEditingItem({})
    setIsEditingItem(null)
    toast({
      title: "楽曲追加",
      description: "セットリストに楽曲を追加しました",
    })
  }

  const updateItem = async (itemId: string, updates: Partial<SetlistItem>) => {
    if (currentSetlist) {
      const updatedSetlist = {
        ...currentSetlist,
        items: currentSetlist.items.map((item) => (item.id === itemId ? { ...item, ...updates } : item)),
      }
      setCurrentSetlist(updatedSetlist)
      setSetlists(setlists.map((s) => (s.id === currentSetlist.id ? updatedSetlist : s)))
    }
  }

  const deleteItem = async (itemId: string) => {
    if (currentSetlist) {
      const updatedSetlist = {
        ...currentSetlist,
        items: currentSetlist.items.filter((item) => item.id !== itemId),
      }
      setCurrentSetlist(updatedSetlist)
      setSetlists(setlists.map((s) => (s.id === currentSetlist.id ? updatedSetlist : s)))
      toast({
        title: "楽曲削除",
        description: "楽曲を削除しました",
      })
    }
  }

  const handleDragEnd = (result: any) => {
    if (!result.destination || !currentSetlist) return

    const items = Array.from(currentSetlist.items)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index,
    }))

    const updatedSetlist = {
      ...currentSetlist,
      items: updatedItems,
    }

    setCurrentSetlist(updatedSetlist)
    setSetlists(setlists.map((s) => (s.id === currentSetlist.id ? updatedSetlist : s)))
  }

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]))
  }

  const selectAllItems = () => {
    if (!currentSetlist) return
    setSelectedItems(currentSetlist.items.map((item) => item.id))
  }

  const deselectAllItems = () => {
    setSelectedItems([])
  }

  const deleteSelectedItems = async () => {
    if (selectedItems.length === 0 || !currentSetlist) return

    const updatedSetlist = {
      ...currentSetlist,
      items: currentSetlist.items.filter((item) => !selectedItems.includes(item.id)),
    }
    setCurrentSetlist(updatedSetlist)
    setSetlists(setlists.map((s) => (s.id === currentSetlist.id ? updatedSetlist : s)))
    setSelectedItems([])
    toast({
      title: "一括削除完了",
      description: `${selectedItems.length}曲を削除しました`,
    })
  }

  const exportSetlist = (format: "original" | "songName" | "artist") => {
    if (!currentSetlist) return

    const sortedItems = [...currentSetlist.items]

    switch (format) {
      case "songName":
        sortedItems.sort((a, b) => a.songName.localeCompare(b.songName, "ja"))
        break
      case "artist":
        sortedItems.sort((a, b) => a.artist.localeCompare(b.artist, "ja"))
        break
      case "original":
      default:
        sortedItems.sort((a, b) => a.order - b.order)
        break
    }

    const text = sortedItems
      .map(
        (item, index) =>
          `${index + 1}. ${item.songName} / ${item.artist}${item.releaseMedia ? ` (${item.releaseMedia})` : ""}`,
      )
      .join("\n")

    navigator.clipboard.writeText(text)
    toast({
      title: "エクスポート完了",
      description: "セットリストをクリップボードにコピーしました",
    })
  }

  const filteredItems = (currentSetlist?.items ?? []).filter(
    (item) =>
      item.songName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.releaseMedia.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const sortedItems = [...filteredItems].sort((a, b) => {
    let aValue: string | number
    let bValue: string | number

    switch (sortBy) {
      case "songName":
        aValue = a.songName
        bValue = b.songName
        break
      case "artist":
        aValue = a.artist
        bValue = b.artist
        break
      case "order":
      default:
        aValue = a.order
        bValue = b.order
        break
    }

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortOrder === "asc" ? aValue.localeCompare(bValue, "ja") : bValue.localeCompare(aValue, "ja")
    } else {
      return sortOrder === "asc" ? (aValue as number) - (bValue as number) : (bValue as number) - (aValue as number)
    }
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
          <Music className="w-16 h-16 mx-auto mb-4 animate-pulse" />
          <p>セットリストを読み込み中...</p>
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
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <Music className="w-8 h-8 text-purple-400" />
              セットリスト管理
            </h1>
            <p className="text-gray-400">歌枠用のセットリストを作成・管理しましょう</p>
          </div>

          <div className="flex items-center gap-3">
            <Select
              value={currentSetlist?.id || ""}
              onValueChange={(value) => {
                const setlist = setlists.find((s) => s.id === value)
                if (setlist) setCurrentSetlist(setlist)
              }}
            >
              <SelectTrigger className="w-48 bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="セットリストを選択" />
              </SelectTrigger>
              <SelectContent className="bg-black/80 backdrop-blur-xl border-white/20">
                {setlists.map((setlist) => (
                  <SelectItem key={setlist.id} value={setlist.id} className="text-white">
                    {setlist.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              onClick={() => setIsCreatingSetlist(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              新規作成
            </Button>
          </div>
        </motion.div>

        {currentSetlist && (
          <>
            {/* セットリスト情報 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="bg-black/20 backdrop-blur-xl border-white/10">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-white text-xl">{currentSetlist.name}</CardTitle>
                      {currentSetlist.description && <p className="text-gray-400 mt-2">{currentSetlist.description}</p>}
                    </div>
                    <Badge variant="outline" className="bg-white/10 text-white">
                      {(currentSetlist.items || []).length}曲
                    </Badge>
                  </div>
                </CardHeader>
              </Card>
            </motion.div>

            {/* 検索・フィルター・アクション */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="bg-black/20 backdrop-blur-xl border-white/10">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-4 items-center">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="楽曲名、アーティスト、リリース媒体で検索..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                        <SelectTrigger className="w-32 bg-white/10 border-white/20 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-black/80 backdrop-blur-xl border-white/20">
                          <SelectItem value="order">順序</SelectItem>
                          <SelectItem value="songName">楽曲名</SelectItem>
                          <SelectItem value="artist">アーティスト</SelectItem>
                        </SelectContent>
                      </Select>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                        className="bg-white/10 border-white/20 text-white"
                      >
                        {sortOrder === "asc" ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                      </Button>

                      <Button
                        onClick={() => setIsEditingItem("new")}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        楽曲追加
                      </Button>
                    </div>
                  </div>

                  {/* 選択アクション */}
                  {selectedItems.length > 0 && (
                    <div className="mt-4 p-3 bg-purple-500/20 rounded-lg border border-purple-500/30">
                      <div className="flex items-center justify-between">
                        <span className="text-purple-300">{selectedItems.length}曲を選択中</span>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={deselectAllItems}
                            className="bg-white/10 border-white/20 text-white"
                          >
                            選択解除
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={deleteSelectedItems}
                            className="bg-red-500/20 border-red-500/30 text-red-300 hover:bg-red-500/30"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            削除
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* セットリスト */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="bg-black/20 backdrop-blur-xl border-white/10">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-white flex items-center gap-2">
                      <Music className="w-5 h-5 text-purple-400" />
                      楽曲リスト
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={
                          selectedItems.length === (currentSetlist.items || []).length
                            ? deselectAllItems
                            : selectAllItems
                        }
                        className="bg-white/10 border-white/20 text-white"
                      >
                        {selectedItems.length === (currentSetlist.items || []).length ? (
                          <CheckSquare className="w-4 h-4 mr-1" />
                        ) : (
                          <Square className="w-4 h-4 mr-1" />
                        )}
                        全選択
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            エクスポート
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-black/80 backdrop-blur-xl border-white/20">
                          <DropdownMenuItem onClick={() => exportSetlist("original")}>
                            <FileText className="w-4 h-4 mr-2" />
                            そのまま
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => exportSetlist("songName")}>
                            <SortAsc className="w-4 h-4 mr-2" />
                            楽曲名順
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => exportSetlist("artist")}>
                            <SortAsc className="w-4 h-4 mr-2" />
                            アーティスト順
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="setlist">
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`space-y-2 min-h-[200px] ${
                            snapshot.isDraggingOver ? "bg-purple-500/10 rounded-lg" : ""
                          }`}
                        >
                          {sortedItems.map((item, index) => (
                            <Draggable key={item.id} draggableId={item.id} index={index}>
                              {(provided, snapshot) => (
                                <motion.div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.3, delay: index * 0.05 }}
                                  className={`p-4 rounded-lg border transition-all duration-200 ${
                                    snapshot.isDragging
                                      ? "bg-purple-500/20 border-purple-500/50 rotate-2 scale-105"
                                      : selectedItems.includes(item.id)
                                        ? "bg-purple-500/20 border-purple-500/30"
                                        : "bg-white/5 border-white/10 hover:bg-white/10"
                                  }`}
                                >
                                  <div className="flex items-center gap-4">
                                    <Checkbox
                                      checked={selectedItems.includes(item.id)}
                                      onCheckedChange={() => toggleItemSelection(item.id)}
                                      className="border-white/30"
                                    />

                                    <div
                                      {...provided.dragHandleProps}
                                      className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-white"
                                    >
                                      <GripVertical className="w-4 h-4" />
                                    </div>

                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                                      <div>
                                        <h3 className="font-medium text-white">{item.songName}</h3>
                                        <p className="text-sm text-gray-400">{item.artist}</p>
                                      </div>
                                      <div>
                                        <p className="text-sm text-gray-300">{item.releaseMedia}</p>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        {item.youtubeUrl && (
                                          <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => window.open(item.youtubeUrl, "_blank")}
                                            className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                                          >
                                            <Youtube className="w-4 h-4" />
                                          </Button>
                                        )}
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={() => updateItem(item.id, { isCompleted: !item.isCompleted })}
                                          className={`${
                                            item.isCompleted
                                              ? "text-green-400 hover:text-green-300"
                                              : "text-gray-400 hover:text-white"
                                          }`}
                                        >
                                          <Play className="w-4 h-4" />
                                        </Button>
                                      </div>
                                    </div>

                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                                          <MoreHorizontal className="w-4 h-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent className="bg-black/80 backdrop-blur-xl border-white/20">
                                        <DropdownMenuItem
                                          onClick={() => {
                                            setEditingItem(item)
                                            setIsEditingItem(item.id)
                                          }}
                                        >
                                          <Edit className="w-4 h-4 mr-2" />
                                          編集
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => deleteItem(item.id)} className="text-red-400">
                                          <Trash2 className="w-4 h-4 mr-2" />
                                          削除
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>

                                  {item.notes && (
                                    <div className="mt-3 p-2 bg-white/5 rounded text-sm text-gray-300">
                                      {item.notes}
                                    </div>
                                  )}
                                </motion.div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>

                  {sortedItems.length === 0 && (
                    <div className="text-center py-12">
                      <Music className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400 mb-4">
                        {searchQuery ? "検索結果が見つかりません" : "楽曲が登録されていません"}
                      </p>
                      <Button
                        onClick={() => setIsEditingItem("new")}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        最初の楽曲を追加
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}

        {/* セットリスト作成ダイアログ */}
        <Dialog open={isCreatingSetlist} onOpenChange={setIsCreatingSetlist}>
          <DialogContent className="bg-black/90 backdrop-blur-xl border-white/20 text-white">
            <DialogHeader>
              <DialogTitle>新しいセットリストを作成</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="setlist-name" className="text-white">
                  セットリスト名
                </Label>
                <Input
                  id="setlist-name"
                  value={newSetlistName}
                  onChange={(e) => setNewSetlistName(e.target.value)}
                  placeholder="例: 2025年1月の歌枠"
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <div>
                <Label htmlFor="setlist-description" className="text-white">
                  説明（任意）
                </Label>
                <Textarea
                  id="setlist-description"
                  value={newSetlistDescription}
                  onChange={(e) => setNewSetlistDescription(e.target.value)}
                  placeholder="セットリストの説明を入力..."
                  className="bg-white/10 border-white/20 text-white"
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreatingSetlist(false)}>
                  キャンセル
                </Button>
                <Button onClick={createSetlist} className="bg-gradient-to-r from-purple-600 to-pink-600">
                  作成
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* 楽曲編集ダイアログ */}
        <Dialog
          open={!!isEditingItem}
          onOpenChange={() => {
            setIsEditingItem(null)
            setEditingItem({})
          }}
        >
          <DialogContent className="bg-black/90 backdrop-blur-xl border-white/20 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle>{isEditingItem === "new" ? "楽曲を追加" : "楽曲を編集"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="song-name" className="text-white">
                    楽曲名 *
                  </Label>
                  <Input
                    id="song-name"
                    value={editingItem.songName || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, songName: e.target.value })}
                    placeholder="楽曲名を入力..."
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="artist" className="text-white">
                    アーティスト *
                  </Label>
                  <Input
                    id="artist"
                    value={editingItem.artist || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, artist: e.target.value })}
                    placeholder="アーティスト名を入力..."
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="release-media" className="text-white">
                  リリース媒体
                </Label>
                <Input
                  id="release-media"
                  value={editingItem.releaseMedia || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, releaseMedia: e.target.value })}
                  placeholder="例: アニメ「進撃の巨人」、テレビ番組「Mステ」など"
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <div>
                <Label htmlFor="youtube-url" className="text-white">
                  YouTube URL
                </Label>
                <Input
                  id="youtube-url"
                  value={editingItem.youtubeUrl || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, youtubeUrl: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <div>
                <Label htmlFor="notes" className="text-white">
                  メモ
                </Label>
                <Textarea
                  id="notes"
                  value={editingItem.notes || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, notes: e.target.value })}
                  placeholder="楽曲に関するメモ..."
                  className="bg-white/10 border-white/20 text-white"
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditingItem(null)
                    setEditingItem({})
                  }}
                >
                  キャンセル
                </Button>
                <Button
                  onClick={
                    isEditingItem === "new"
                      ? addItem
                      : () => {
                          if (isEditingItem && isEditingItem !== "new") {
                            updateItem(isEditingItem, editingItem)
                            setIsEditingItem(null)
                            setEditingItem({})
                          }
                        }
                  }
                  className="bg-gradient-to-r from-green-600 to-emerald-600"
                  disabled={!editingItem.songName || !editingItem.artist}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isEditingItem === "new" ? "追加" : "更新"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
