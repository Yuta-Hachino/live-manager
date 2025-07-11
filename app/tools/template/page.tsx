"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  Copy,
  Save,
  MoreHorizontal,
  Search,
  Filter,
  Star,
  MessageCircle,
  Heart,
  Users,
  Calendar,
} from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"

interface Template {
  id: string
  name: string
  category: string
  content: string
  tags: string[]
  isStarred: boolean
  createdAt: string
  updatedAt: string
}

const templateCategories = [
  { id: "greeting", name: "挨拶・開始", icon: MessageCircle },
  { id: "thanks", name: "お礼・感謝", icon: Heart },
  { id: "interaction", name: "リスナー交流", icon: Users },
  { id: "ending", name: "終了・お疲れ様", icon: Calendar },
  { id: "announcement", name: "告知・お知らせ", icon: FileText },
  { id: "custom", name: "カスタム", icon: Star },
]

export default function TemplatePage() {
  const [templates, setTemplates] = useState<Template[]>([
    {
      id: "1",
      name: "配信開始の挨拶",
      category: "greeting",
      content:
        "こんばんは〜！今日も配信に来てくれてありがとうございます✨\n今日は[内容]をやっていこうと思います！\nよろしくお願いします🎵",
      tags: ["挨拶", "開始", "定番"],
      isStarred: true,
      createdAt: "2025-01-01",
      updatedAt: "2025-01-01",
    },
    {
      id: "2",
      name: "スプーンお礼",
      category: "thanks",
      content: "[ユーザー名]さん、スプーンありがとうございます！！\nとても嬉しいです😊\n大切に使わせていただきます✨",
      tags: ["お礼", "スプーン", "感謝"],
      isStarred: false,
      createdAt: "2025-01-01",
      updatedAt: "2025-01-01",
    },
    {
      id: "3",
      name: "新規リスナー歓迎",
      category: "interaction",
      content:
        "初見の方、いらっしゃいませ〜！\n[ユーザー名]さん、配信に来てくれてありがとうございます🎉\nゆっくりしていってくださいね♪",
      tags: ["初見", "歓迎", "交流"],
      isStarred: true,
      createdAt: "2025-01-01",
      updatedAt: "2025-01-01",
    },
  ])

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isCreating, setIsCreating] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null)
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    category: "custom",
    content: "",
    tags: "",
  })
  const { toast } = useToast()

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const createTemplate = () => {
    if (!newTemplate.name.trim() || !newTemplate.content.trim()) return

    const template: Template = {
      id: Date.now().toString(),
      name: newTemplate.name,
      category: newTemplate.category,
      content: newTemplate.content,
      tags: newTemplate.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      isStarred: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setTemplates([...templates, template])
    setNewTemplate({ name: "", category: "custom", content: "", tags: "" })
    setIsCreating(false)
    toast({
      title: "テンプレート作成",
      description: "新しいテンプレートを作成しました",
    })
  }

  const updateTemplate = (template: Template) => {
    setTemplates(
      templates.map((t) => (t.id === template.id ? { ...template, updatedAt: new Date().toISOString() } : t)),
    )
    setEditingTemplate(null)
    toast({
      title: "テンプレート更新",
      description: "テンプレートを更新しました",
    })
  }

  const deleteTemplate = (id: string) => {
    setTemplates(templates.filter((t) => t.id !== id))
    toast({
      title: "テンプレート削除",
      description: "テンプレートを削除しました",
    })
  }

  const toggleStar = (id: string) => {
    setTemplates(templates.map((t) => (t.id === id ? { ...t, isStarred: !t.isStarred } : t)))
  }

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content)
    toast({
      title: "コピー完了",
      description: "テンプレートをクリップボードにコピーしました",
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
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <FileText className="w-8 h-8 text-indigo-400" />
              配信テンプレート
            </h1>
            <p className="text-gray-400">配信の挨拶文やお礼文のテンプレートを管理できます</p>
          </div>

          <Button
            onClick={() => setIsCreating(true)}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            新規作成
          </Button>
        </motion.div>

        {/* 検索・フィルター */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="bg-black/20 backdrop-blur-xl border-white/10">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4 items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="テンプレート名、内容、タグで検索..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-48 bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black/80 backdrop-blur-xl border-white/20">
                      <SelectItem value="all">すべてのカテゴリ</SelectItem>
                      {templateCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* テンプレート一覧 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredTemplates.map((template, index) => {
            const category = templateCategories.find((c) => c.id === template.category)
            const CategoryIcon = category?.icon || FileText

            return (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="bg-black/20 backdrop-blur-xl border-white/10 hover:border-purple-500/50 transition-all duration-200 h-full">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <CategoryIcon className="w-5 h-5 text-indigo-400" />
                        <CardTitle className="text-white text-lg">{template.name}</CardTitle>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleStar(template.id)}
                          className={`${template.isStarred ? "text-yellow-400" : "text-gray-400"} hover:text-yellow-300`}
                        >
                          <Star className={`w-4 h-4 ${template.isStarred ? "fill-current" : ""}`} />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="bg-black/80 backdrop-blur-xl border-white/20">
                            <DropdownMenuItem onClick={() => copyToClipboard(template.content)}>
                              <Copy className="w-4 h-4 mr-2" />
                              コピー
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setEditingTemplate(template)}>
                              <Edit className="w-4 h-4 mr-2" />
                              編集
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => deleteTemplate(template.id)} className="text-red-400">
                              <Trash2 className="w-4 h-4 mr-2" />
                              削除
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    <Badge variant="outline" className="w-fit bg-indigo-500/20 text-indigo-300 border-indigo-500/30">
                      {category?.name}
                    </Badge>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="bg-white/5 rounded-lg p-3 min-h-[100px]">
                        <p className="text-gray-300 text-sm whitespace-pre-wrap line-clamp-4">{template.content}</p>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {template.tags.map((tag, tagIndex) => (
                          <Badge key={tagIndex} variant="secondary" className="bg-white/10 text-gray-300 text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex justify-between items-center pt-2">
                        <span className="text-xs text-gray-500">
                          {new Date(template.updatedAt).toLocaleDateString("ja-JP")}
                        </span>
                        <Button
                          size="sm"
                          onClick={() => copyToClipboard(template.content)}
                          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                        >
                          <Copy className="w-3 h-3 mr-1" />
                          コピー
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>

        {filteredTemplates.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">
              {searchQuery || selectedCategory !== "all"
                ? "検索条件に一致するテンプレートが見つかりません"
                : "テンプレートがまだありません"}
            </p>
            <Button
              onClick={() => setIsCreating(true)}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              最初のテンプレートを作成
            </Button>
          </motion.div>
        )}

        {/* 作成ダイアログ */}
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogContent className="bg-black/90 backdrop-blur-xl border-white/20 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle>新しいテンプレートを作成</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="template-name" className="text-white">
                  テンプレート名
                </Label>
                <Input
                  id="template-name"
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                  placeholder="例: 配信開始の挨拶"
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <div>
                <Label htmlFor="template-category" className="text-white">
                  カテゴリ
                </Label>
                <Select
                  value={newTemplate.category}
                  onValueChange={(value) => setNewTemplate({ ...newTemplate, category: value })}
                >
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black/80 backdrop-blur-xl border-white/20">
                    {templateCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="template-content" className="text-white">
                  テンプレート内容
                </Label>
                <Textarea
                  id="template-content"
                  value={newTemplate.content}
                  onChange={(e) => setNewTemplate({ ...newTemplate, content: e.target.value })}
                  placeholder="テンプレートの内容を入力してください..."
                  className="bg-white/10 border-white/20 text-white min-h-[120px]"
                  rows={6}
                />
              </div>
              <div>
                <Label htmlFor="template-tags" className="text-white">
                  タグ（カンマ区切り）
                </Label>
                <Input
                  id="template-tags"
                  value={newTemplate.tags}
                  onChange={(e) => setNewTemplate({ ...newTemplate, tags: e.target.value })}
                  placeholder="例: 挨拶, 開始, 定番"
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreating(false)}>
                  キャンセル
                </Button>
                <Button
                  onClick={createTemplate}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600"
                  disabled={!newTemplate.name.trim() || !newTemplate.content.trim()}
                >
                  <Save className="w-4 h-4 mr-2" />
                  作成
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* 編集ダイアログ */}
        <Dialog open={!!editingTemplate} onOpenChange={() => setEditingTemplate(null)}>
          <DialogContent className="bg-black/90 backdrop-blur-xl border-white/20 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle>テンプレートを編集</DialogTitle>
            </DialogHeader>
            {editingTemplate && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-template-name" className="text-white">
                    テンプレート名
                  </Label>
                  <Input
                    id="edit-template-name"
                    value={editingTemplate.name}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, name: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-template-category" className="text-white">
                    カテゴリ
                  </Label>
                  <Select
                    value={editingTemplate.category}
                    onValueChange={(value) => setEditingTemplate({ ...editingTemplate, category: value })}
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black/80 backdrop-blur-xl border-white/20">
                      {templateCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-template-content" className="text-white">
                    テンプレート内容
                  </Label>
                  <Textarea
                    id="edit-template-content"
                    value={editingTemplate.content}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, content: e.target.value })}
                    className="bg-white/10 border-white/20 text-white min-h-[120px]"
                    rows={6}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-template-tags" className="text-white">
                    タグ（カンマ区切り）
                  </Label>
                  <Input
                    id="edit-template-tags"
                    value={editingTemplate.tags.join(", ")}
                    onChange={(e) =>
                      setEditingTemplate({
                        ...editingTemplate,
                        tags: e.target.value
                          .split(",")
                          .map((tag) => tag.trim())
                          .filter(Boolean),
                      })
                    }
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setEditingTemplate(null)}>
                    キャンセル
                  </Button>
                  <Button
                    onClick={() => updateTemplate(editingTemplate)}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    更新
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
