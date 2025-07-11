export async function GET() {
  // Prometheusメトリクス形式でレスポンス
  const metrics = `
# HELP spoon_app_requests_total Total number of requests
# TYPE spoon_app_requests_total counter
spoon_app_requests_total{method="GET",status="200"} 1234
spoon_app_requests_total{method="POST",status="200"} 567

# HELP spoon_app_active_users Current number of active users
# TYPE spoon_app_active_users gauge
spoon_app_active_users 42

# HELP spoon_app_upload_size_bytes Size of uploaded files in bytes
# TYPE spoon_app_upload_size_bytes histogram
spoon_app_upload_size_bytes_bucket{le="1000000"} 100
spoon_app_upload_size_bytes_bucket{le="5000000"} 150
spoon_app_upload_size_bytes_bucket{le="10000000"} 180
spoon_app_upload_size_bytes_bucket{le="+Inf"} 200
spoon_app_upload_size_bytes_sum 500000000
spoon_app_upload_size_bytes_count 200
`

  return new Response(metrics, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  })
}
