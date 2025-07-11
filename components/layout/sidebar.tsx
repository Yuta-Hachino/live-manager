"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import {
  Home,
  Camera,
  Upload,
  BarChart3,
  Calendar,
  Settings,
  User,
  LogOut,
  Wrench,
  Menu,
  Music,
  Calculator,
  FileText,
  Palette,
  Zap,
  TrendingUp,
  CreditCard,
  Bell,
  Star,
  ChevronDown,
  ChevronRight,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

const navigationItems = [
  { name: "ダッシュボード", href: "/", icon: Home },
  { name: "ギャラリー", href: "/gallery", icon: Camera },
  { name: "リザルト登録", href: "/results", icon: Upload },
  { name: "統計", href: "/analytics", icon: BarChart3 },
  { name: "イベント", href: "/events", icon: Calendar },
]

const toolItems = [
  { name: "セットリスト管理", href: "/tools/setlist", icon: Music, isNew: true },
  { name: "配信分析ツール", href: "/tools/analytics", icon: BarChart3, isPremium: true },
  { name: "配信スケジューラー", href: "/tools/scheduler", icon: Calendar },
  { name: "収益計算機", href: "/tools/calculator", icon: Calculator },
  { name: "配信テンプレート", href: "/tools/template", icon: FileText },
  { name: "配信テーマ生成", href: "/tools/theme", icon: Palette, isPremium: true, isNew: true },
  { name: "エンゲージメント向上", href: "/tools/boost", icon: Zap, isPremium: true },
  { name: "ランキング追跡", href: "/tools/ranking", icon: TrendingUp, isPremium: true },
]

const accountItems = [
  { name: "プロフィール", href: "/profile", icon: User },
  { name: "設定", href: "/settings", icon: Settings },
  { name: "課金・プラン", href: "/billing", icon: CreditCard },
]

interface SidebarContentProps {
  onItemClick?: () => void
}

function SidebarContent({ onItemClick }: SidebarContentProps) {
  const pathname = usePathname()
  const [isToolsOpen, setIsToolsOpen] = useState(true)
  const [isAccountOpen, setIsAccountOpen] = useState(false)

  const handleItemClick = () => {
    onItemClick?.()
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      {/* ロゴ */}
      <div className="p-6 border-b border-white/10">
        <Link href="/" className="flex items-center space-x-3" onClick={handleItemClick}>
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <div>
            <h1 className="text-lg font-bold">Spoon配信サポート</h1>
            <p className="text-xs text-gray-400">配信者向けツール</p>
          </div>
        </Link>
      </div>

      {/* メインナビゲーション */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-2 px-4">
          {/* メインメニュー */}
          <div className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={handleItemClick}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                      : "text-gray-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </div>

          {/* ツールセクション */}
          <div className="pt-4">
            <Collapsible open={isToolsOpen} onOpenChange={setIsToolsOpen}>
              <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors">
                <div className="flex items-center space-x-2">
                  <Wrench className="w-4 h-4" />
                  <span>ツール</span>
                </div>
                {isToolsOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-1 mt-2">
                {toolItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={handleItemClick}
                      className={`flex items-center justify-between px-6 py-2 rounded-lg text-sm transition-all duration-200 ${
                        isActive
                          ? "bg-gradient-to-r from-purple-600/50 to-pink-600/50 text-white"
                          : "text-gray-300 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="w-4 h-4" />
                        <span>{item.name}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {item.isNew && <Badge className="bg-green-500/80 text-white text-xs px-1.5 py-0.5">NEW</Badge>}
                        {item.isPremium && (
                          <Badge className="bg-yellow-500/80 text-black text-xs px-1.5 py-0.5">
                            <Star className="w-2 h-2 mr-0.5" />
                            PRO
                          </Badge>
                        )}
                      </div>
                    </Link>
                  )
                })}
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* アカウントセクション */}
          <div className="pt-4">
            <Collapsible open={isAccountOpen} onOpenChange={setIsAccountOpen}>
              <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>アカウント</span>
                </div>
                {isAccountOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-1 mt-2">
                {accountItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={handleItemClick}
                      className={`flex items-center space-x-3 px-6 py-2 rounded-lg text-sm transition-all duration-200 ${
                        isActive
                          ? "bg-gradient-to-r from-purple-600/50 to-pink-600/50 text-white"
                          : "text-gray-300 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </Link>
                  )
                })}
              </CollapsibleContent>
            </Collapsible>
          </div>
        </nav>
      </div>

      {/* ユーザー情報 */}
      <div className="p-4 border-t border-white/10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start p-3 h-auto hover:bg-white/10">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-white">ユーザー名</p>
                  <p className="text-xs text-gray-400">user@example.com</p>
                </div>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-black/90 backdrop-blur-xl border-white/20">
            <DropdownMenuItem onClick={handleItemClick}>
              <User className="w-4 h-4 mr-2" />
              プロフィール
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleItemClick}>
              <Settings className="w-4 h-4 mr-2" />
              設定
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleItemClick}>
              <Bell className="w-4 h-4 mr-2" />
              通知設定
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleItemClick}>
              <LogOut className="w-4 h-4 mr-2" />
              ログアウト
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export function Sidebar() {
  return (
    <>
      {/* デスクトップサイドバー */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:z-50">
        <SidebarContent />
      </div>

      {/* モバイルサイドバー */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className="lg:hidden fixed top-4 left-4 z-50 bg-black/20 backdrop-blur-sm">
            <Menu className="w-5 h-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent onItemClick={() => {}} />
        </SheetContent>
      </Sheet>
    </>
  )
}
