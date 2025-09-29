# BTC Sentiment Mini App


このリポジトリは Farcaster 用の練習ミニアプリです。
Webhook (`/api/ingest`) に POST されたテキストを簡易センチメント解析して表示します。


## 使い方
1. リポジトリを GitHub に push
2. Vercel と連携してデプロイ
3. `public/.well-known/farcaster.json` を Manifest Signing Tool で署名して反映
4. フロントにアクセスして動作確認


## テスト（PowerShell）
```powershell
$uri = "https://<your-vercel-domain>.vercel.app/api/ingest"
$body = @{ text = "Bitcoin is mooning 🚀 #BTC" } | ConvertTo-Json
Invoke-RestMethod -Uri $uri -Method POST -Body $body -ContentType "application/json"
