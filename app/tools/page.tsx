"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Music,
  Calculator,
  BarChart3,
  Calendar,
  FileText,
  Palette,
  Zap,
  Star,
  Users,
  TrendingUp,
  Sparkles,
} from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

interface Tool {
  id: string
  name: string
  description: string
  icon: any
  category: string
  isPremium: boolean
  isNew: boolean
  href: string
  color: string
}

export default function ToolsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")

  const tools: Tool[] = [
    {
      id: "setlist",
      name: "セットリスト管理",
      description: "歌枠用のセットリストを作成・管理できます。曲順の変更や出力機能付き",
      icon: Music,
      category: "music",
      isPremium: false,
      isNew: true,
      href: "/tools/setlist",
      color: "purple",
    },
    {
      id: "analytics",
      name: "配信分析ツール",
      description: "配信データを詳細に分析し、改善点を見つけることができます",
      icon: BarChart3,
      category: "analytics",
      isPremium: true,
      isNew: false,
      href: "/analytics",
      color: "blue",
    },
    {
      id: "scheduler",
      name: "配信スケジューラー",
      description: "配信予定を管理し、リスナーに通知を送ることができます",
      icon: Calendar,
      category: "management",
      isPremium: false,
      isNew: false,
      href: "/tools/scheduler",
      color: "green",
    },
    {
      id: "calculator",
      name: "収益計算機",
      description: "スプーンやハートから推定収益を計算できます",
      icon: Calculator,
      category: "analytics",
      isPremium: false,
      isNew: false,
      href: "/tools/calculator",
      color: "yellow",
    },
    {
      id: "template",
      name: "配信テンプレート",
      description: "配信の挨拶文やお礼文のテンプレートを管理できます",
      icon: FileText,
      category: "management",
      isPremium: false,
      isNew: false,
      href: "/tools/template",
      color: "indigo",
    },
    {
      id: "theme",
      name: "配信テーマ生成",
      description: "AIが配信テーマやトークネタを提案してくれます",
      icon: Palette,
      category: "ai",
      isPremium: true,
      isNew: true,
      href: "/tools/theme",
      color: "pink",
    },
    {
      id: "boost",
      name: "エンゲージメント向上",
      description: "リスナーとの交流を活発にするためのツール集",
      icon: Zap,
      category: "engagement",
      isPremium: true,
      isNew: false,
      href: "/tools/boost",
      color: "orange",
    },
    {
      id: "ranking",
      name: "ランキング追跡",
      description: "配信ランキングの変動を追跡・分析できます",
      icon: TrendingUp,
      category: "analytics",
      isPremium: true,
      isNew: false,
      href: "/tools/ranking",
      color: "red",
    },
  ]

  const categories = [
    { id: "all", name: "すべて", icon: Star },
    { id: "music", name: "音楽", icon: Music },
    { id: "analytics", name: "分析", icon: BarChart3 },
    { id: "management", name: "管理", icon: Calendar },
    { id: "ai", name: "AI", icon: Sparkles },
    { id: "engagement", name: "エンゲージメント", icon: Users },
  ]

  const filteredTools = selectedCategory === "all" ? tools : tools.filter((tool) => tool.category === selectedCategory)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* ヘッダー */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-white mb-4">配信ツール</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            配信活動をサポートする便利なツール集。効率的な配信運営を実現しましょう。
          </p>
        </motion.div>

        {/* カテゴリフィルター */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="bg-black/20 backdrop-blur-xl border-white/10">
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-2 justify-center">
                {categories.map((category) => {
                  const Icon = category.icon
                  return (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "outline"}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`${
                        selectedCategory === category.id
                          ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                          : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {category.name}
                    </Button>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ツール一覧 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredTools.map((tool, index) => {
            const Icon = tool.icon
            return (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href={tool.href}>
                  <Card className="bg-black/20 backdrop-blur-xl border-white/10 hover:border-purple-500/50 transition-all duration-200 cursor-pointer group h-full">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between mb-3">
                        <div
                          className={`w-12 h-12 rounded-xl bg-gradient-to-br from-${tool.color}-500/20 to-${tool.color}-600/20 flex items-center justify-center border border-${tool.color}-500/30`}
                        >
                          <Icon className={`w-6 h-6 text-${tool.color}-400`} />
                        </div>
                        <div className="flex gap-1">
                          {tool.isNew && <Badge className="bg-green-500/80 text-white text-xs">NEW</Badge>}
                          {tool.isPremium && (
                            <Badge className="bg-yellow-500/80 text-black text-xs">
                              <Star className="w-2 h-2 mr-1" />
                              PRO
                            </Badge>
                          )}
                        </div>
                      </div>
                      <CardTitle className="text-white group-hover:text-purple-300 transition-colors">
                        {tool.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <CardDescription className="text-gray-400 mb-4 line-clamp-3">{tool.description}</CardDescription>
                      <div className="flex items-center justify-between">
                        <Badge
                          variant="outline"
                          className={`bg-${tool.color}-500/20 text-${tool.color}-300 border-${tool.color}-500/30`}
                        >
                          {categories.find((c) => c.id === tool.category)?.name}
                        </Badge>
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          使用する
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>

        {/* 統計情報 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <Card className="bg-black/20 backdrop-blur-xl border-white/10">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-white mb-1">{tools.length}</div>
              <div className="text-sm text-gray-400">利用可能ツール</div>
            </CardContent>
          </Card>
          <Card className="bg-black/20 backdrop-blur-xl border-white/10">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-white mb-1">{tools.filter((t) => !t.isPremium).length}</div>
              <div className="text-sm text-gray-400">無料ツール</div>
            </CardContent>
          </Card>
          <Card className="bg-black/20 backdrop-blur-xl border-white/10">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-white mb-1">{tools.filter((t) => t.isPremium).length}</div>
              <div className="text-sm text-gray-400">プレミアムツール</div>
            </CardContent>
          </Card>
          <Card className="bg-black/20 backdrop-blur-xl border-white/10">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-white mb-1">{tools.filter((t) => t.isNew).length}</div>
              <div className="text-sm text-gray-400">新着ツール</div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
