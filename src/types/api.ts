// API型定義（OpenAPI仕様書から自動生成）

export interface User {
  id: string
  email: string
  name: string
  avatarUrl?: string
  planType: "free" | "premium"
  status: "active" | "inactive" | "suspended"
  createdAt: string
  updatedAt: string
}

export interface GalleryItem {
  id: string
  title: string
  description?: string
  fileUrl: string
  fileType: string
  fileSize: number
  viewCount: number
  createdAt: string
  updatedAt: string
}

export interface StreamResult {
  id: string
  title: string
  streamDate: string
  hearts: number
  spoons: number
  totalListeners: number
  activeListeners: number
  bestRank?: number
  endRank?: number
  screenshotUrl?: string
  listeners: ListenerData[]
  createdAt: string
}

export interface ListenerData {
  id: string
  listenerName: string
  heartsGiven: number
  spoonsGiven: number
  isGalleryRegistered: boolean
}

export interface Event {
  id: string
  name: string
  description?: string
  startDate: string
  endDate: string
  status: "active" | "completed" | "cancelled"
  participantCount: number
  templateConfig?: any
  createdAt: string
}

export interface AnalyticsStats {
  totalHearts: number
  totalSpoons: number
  totalListeners: number
  bestRank: number
  streamCount: number
  averageHearts: number
  chartData: ChartDataPoint[]
}

export interface ChartDataPoint {
  date: string
  hearts: number
  spoons: number
  listeners: number
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
