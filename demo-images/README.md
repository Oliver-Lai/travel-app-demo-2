# Demo Images 資料夾說明

此資料夾用於存放景點的 AI 渲染圖片示例。

## 資料夾結構

```
demo-images/
├── taipei101/
│   ├── sunny-morning.jpg      # 晴天-早晨
│   ├── sunny-afternoon.jpg    # 晴天-下午
│   ├── sunny-evening.jpg      # 晴天-傍晚
│   ├── cloudy-morning.jpg     # 陰天-早晨
│   ├── cloudy-afternoon.jpg   # 陰天-下午
│   ├── cloudy-evening.jpg     # 陰天-傍晚
│   ├── rainy-morning.jpg      # 雨天-早晨
│   ├── rainy-afternoon.jpg    # 雨天-下午
│   └── rainy-evening.jpg      # 雨天-傍晚
├── xiangshan/
│   └── ... (同上結構)
└── nightmarket/
    └── ... (同上結構)
```

## 圖片命名規則

格式：`{weather}-{timeOfDay}.jpg`

### Weather (天氣)
- `sunny` - 晴天
- `cloudy` - 陰天
- `rainy` - 雨天
- `night` - 夜晚

### Time of Day (時段)
- `morning` - 早晨 (06:00-11:59)
- `afternoon` - 下午 (12:00-17:59)
- `evening` - 傍晚 (18:00-20:59)
- `night` - 夜晚 (21:00-05:59)

## 使用說明

在實際應用中，這些圖片應該由 AI 圖片生成服務（如 Stable Diffusion, DALL-E 等）根據使用者選擇的天氣和時間動態生成。

Demo 版本使用預設的圖片 URL 作為示例。

## Demo 數據

目前使用 Unsplash 的圖片作為示例：
- 台北 101 的不同天氣和時段圖片
- 象山步道的風景圖片
- 夜市的熱鬧場景

在生產環境中，這些應該替換為實際的 AI 生成圖片。
