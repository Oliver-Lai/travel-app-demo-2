# 推薦行程圖片使用說明

## 圖片位置
請將圖片放在與 index.html 同一個資料夾中

## 需要的圖片檔案

### 方式 1：使用單一預設圖片
1. 準備一張圖片命名為 `default.jpeg`
2. 放在專案根目錄
3. 所有行程卡片都會使用這張圖片

### 方式 2：為每個行程使用不同圖片（推薦）
建議建立一個 `images` 資料夾，然後將以下圖片放入：

1. `taipei.jpg` - 台北一日遊（建議：台北101、故宮博物院）
2. `tainan.jpg` - 台南美食之旅（建議：安平古堡、台南小吃）
3. `hualien.jpg` - 花蓮太魯閣（建議：太魯閣峽谷、清水斷崖）
4. `alishan.jpg` - 阿里山日出（建議：阿里山日出、小火車）
5. `kenting.jpg` - 墾丁海灘（建議：墾丁海灘、夕陽）
6. `sunmoon.jpg` - 日月潭（建議：日月潭湖景、遊船）

## 圖片規格建議
- 尺寸：至少 800x600 像素
- 格式：JPG 或 PNG
- 比例：4:3 或 16:9
- 檔案大小：建議在 500KB 以下（優化網頁載入速度）

## 如何修改圖片路徑

在 `index.html` 中搜尋以下註解：
```html
<!-- 圖片路徑：可修改為 images/taipei.jpg -->
```

然後修改 `<img>` 標籤的 src 屬性：

### 修改前（使用預設圖片）：
```html
<img src="default.jpeg" alt="台北一日遊">
```

### 修改後（使用專屬圖片）：
```html
<img src="images/taipei.jpg" alt="台北一日遊">
```

## 快速替換指令

如果你所有圖片都放在 `images/` 資料夾中，可以按照以下對照表修改：

1. 第一張卡片：`default.jpeg` → `images/taipei.jpg`
2. 第二張卡片：`default.jpeg` → `images/tainan.jpg`
3. 第三張卡片：`default.jpeg` → `images/hualien.jpg`
4. 第四張卡片：`default.jpeg` → `images/alishan.jpg`
5. 第五張卡片：`default.jpeg` → `images/kenting.jpg`
6. 第六張卡片：`default.jpeg` → `images/sunmoon.jpg`

## 臨時解決方案

如果暫時沒有圖片，可以使用線上圖片服務：
- Unsplash: https://unsplash.com/ (免費高品質圖片)
- Pexels: https://www.pexels.com/ (免費圖庫)

或使用佔位符服務：
```html
<img src="https://picsum.photos/400/300" alt="台北一日遊">
```
