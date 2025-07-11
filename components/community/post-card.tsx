"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Send,
  Bookmark,
  Flag,
  Edit,
  Trash2,
  Eye,
  Clock,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"

interface Post {
  id: string
  userId: string
  username: string
  avatarUrl: string
  content: string
  imageUrl?: string
  likes: number
  comments: number
  shares: number
  createdAt: string
  tags: string[]
  isLiked?: boolean
  isBookmarked?: boolean
}

interface Comment {
  id: string
  userId: string
  username: string
  avatarUrl: string
  content: string
  likes: number
  createdAt: string
  isLiked?: boolean
}

interface PostCardProps {
  post: Post
  onLike?: (postId: string) => void
  onComment?: (postId: string, content: string) => void
  onShare?: (postId: string) => void
  onDelete?: (postId: string) => void
  currentUserId?: string
  className?: string
}

export function PostCard({ post, onLike, onComment, onShare, onDelete, currentUserId, className = "" }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked || false)
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked || false)
  const [likesCount, setLikesCount] = useState(post.likes)
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoadingComments, setIsLoadingComments] = useState(false)
  const { toast } = useToast()

  const handleLike = async () => {
    try {
      setIsLiked(!isLiked)
      setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1))

      if (onLike) {
        onLike(post.id)
      }
    } catch (error) {
      // エラー時は元に戻す
      setIsLiked(isLiked)
      setLikesCount(likesCount)
      toast({
        title: "エラー",
        description: "いいねの処理に失敗しました",
        variant: "destructive",
      })
    }
  }

  const handleBookmark = async () => {
    try {
      setIsBookmarked(!isBookmarked)
      toast({
        title: isBookmarked ? "ブックマークを解除しました" : "ブックマークに追加しました",
        description: isBookmarked ? "" : "後で見返すことができます",
      })
    } catch (error) {
      setIsBookmarked(isBookmarked)
      toast({
        title: "エラー",
        description: "ブックマークの処理に失敗しました",
        variant: "destructive",
      })
    }
  }

  const handleComment = async () => {
    if (!newComment.trim()) return

    try {
      const comment: Comment = {
        id: Date.now().toString(),
        userId: currentUserId || "current_user",
        username: "あなた",
        avatarUrl: "/placeholder.svg?height=32&width=32",
        content: newComment,
        likes: 0,
        createdAt: new Date().toISOString(),
        isLiked: false,
      }

      setComments((prev) => [comment, ...prev])
      setNewComment("")

      if (onComment) {
        onComment(post.id, newComment)
      }

      toast({
        title: "コメントを投稿しました",
        description: "コメントが正常に投稿されました",
      })
    } catch (error) {
      toast({
        title: "エラー",
        description: "コメントの投稿に失敗しました",
        variant: "destructive",
      })
    }
  }

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${post.username}の投稿`,
          text: post.content,
          url: window.location.href,
        })
      } else {
        await navigator.clipboard.writeText(window.location.href)
        toast({
          title: "リンクをコピーしました",
          description: "投稿のリンクがクリップボードにコピーされました",
        })
      }

      if (onShare) {
        onShare(post.id)
      }
    } catch (error) {
      toast({
        title: "エラー",
        description: "共有に失敗しました",
        variant: "destructive",
      })
    }
  }

  const loadComments = async () => {
    if (comments.length > 0) return

    setIsLoadingComments(true)
    try {
      // コメント取得のシミュレーション
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const sampleComments: Comment[] = [
        {
          id: "1",
          userId: "user1",
          username: "リスナーA",
          avatarUrl: "/placeholder.svg?height=32&width=32",
          content: "素晴らしい投稿ですね！",
          likes: 3,
          createdAt: new Date(Date.now() - 60000).toISOString(),
          isLiked: false,
        },
        {
          id: "2",
          userId: "user2",
          username: "リスナーB",
          avatarUrl: "/placeholder.svg?height=32&width=32",
          content: "いつも楽しい配信をありがとうございます",
          likes: 1,
          createdAt: new Date(Date.now() - 120000).toISOString(),
          isLiked: false,
        },
      ]

      setComments(sampleComments)
    } catch (error) {
      toast({
        title: "エラー",
        description: "コメントの読み込みに失敗しました",
        variant: "destructive",
      })
    } finally {
      setIsLoadingComments(false)
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return `${diffInSeconds}秒前`
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}分前`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}時間前`
    return `${Math.floor(diffInSeconds / 86400)}日前`
  }

  const isOwnPost = currentUserId === post.userId

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      <Card className="bg-black/20 backdrop-blur-xl border-white/10 hover:border-purple-500/30 transition-all duration-200">
        <CardContent className="p-6">
          {/* ヘッダー */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={post.avatarUrl || "/placeholder.svg"} />
                <AvatarFallback className="bg-purple-600 text-white">{post.username[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-white font-medium">{post.username}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Clock className="w-3 h-3" />
                  <span>{formatTimeAgo(post.createdAt)}</span>
                </div>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-black/80 backdrop-blur-xl border-white/20">
                <DropdownMenuItem onClick={handleBookmark}>
                  <Bookmark className="w-4 h-4 mr-2" />
                  {isBookmarked ? "ブックマーク解除" : "ブックマーク"}
                </DropdownMenuItem>
                {isOwnPost ? (
                  <>
                    <DropdownMenuItem>
                      <Edit className="w-4 h-4 mr-2" />
                      編集
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-400" onClick={() => onDelete && onDelete(post.id)}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      削除
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem className="text-red-400">
                    <Flag className="w-4 h-4 mr-2" />
                    報告
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* コンテンツ */}
          <div className="mb-4">
            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{post.content}</p>

            {post.imageUrl && (
              <div className="mt-3 rounded-lg overflow-hidden">
                <img
                  src={post.imageUrl || "/placeholder.svg"}
                  alt="投稿画像"
                  className="w-full max-h-96 object-cover"
                />
              </div>
            )}
          </div>

          {/* タグ */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs"
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          )}

          {/* アクションボタン */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div className="flex items-center gap-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={`text-gray-400 hover:text-white transition-colors ${
                  isLiked ? "text-red-400 hover:text-red-300" : ""
                }`}
              >
                <Heart className={`w-4 h-4 mr-2 ${isLiked ? "fill-current" : ""}`} />
                <span>{likesCount}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowComments(!showComments)
                  if (!showComments) loadComments()
                }}
                className="text-gray-400 hover:text-white"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                <span>{post.comments + comments.length}</span>
              </Button>

              <Button variant="ghost" size="sm" onClick={handleShare} className="text-gray-400 hover:text-white">
                <Share2 className="w-4 h-4 mr-2" />
                <span>{post.shares}</span>
              </Button>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Eye className="w-4 h-4" />
              <span>{post.likes + post.comments + post.shares} エンゲージメント</span>
            </div>
          </div>

          {/* コメントセクション */}
          <AnimatePresence>
            {showComments && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 pt-4 border-t border-white/10"
              >
                {/* コメント入力 */}
                <div className="flex gap-3 mb-4">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-purple-600 text-white text-sm">あ</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 flex gap-2">
                    <Textarea
                      placeholder="コメントを入力..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 resize-none"
                      rows={2}
                    />
                    <Button
                      size="sm"
                      onClick={handleComment}
                      disabled={!newComment.trim()}
                      className="bg-purple-600 hover:bg-purple-700 self-end"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* コメント一覧 */}
                <div className="space-y-3">
                  {isLoadingComments ? (
                    <div className="text-center py-4">
                      <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                      <p className="text-sm text-gray-400">コメントを読み込み中...</p>
                    </div>
                  ) : (
                    comments.map((comment) => (
                      <motion.div
                        key={comment.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex gap-3"
                      >
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={comment.avatarUrl || "/placeholder.svg"} />
                          <AvatarFallback className="bg-gray-600 text-white text-sm">
                            {comment.username[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="bg-white/5 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-white text-sm font-medium">{comment.username}</span>
                              <span className="text-xs text-gray-400">{formatTimeAgo(comment.createdAt)}</span>
                            </div>
                            <p className="text-gray-300 text-sm">{comment.content}</p>
                          </div>
                          <div className="flex items-center gap-4 mt-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-gray-400 hover:text-white h-auto p-0 text-xs"
                            >
                              <Heart className="w-3 h-3 mr-1" />
                              {comment.likes}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-gray-400 hover:text-white h-auto p-0 text-xs"
                            >
                              返信
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  )
}
