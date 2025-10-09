# AI 圖片渲染功能整合指南

## 概述

本文檔說明如何將 Demo 版本的 AI 圖片渲染功能整合為真實的 AI 圖片生成服務。

## 目前 Demo 實現

Demo 版本使用預設的 Unsplash 圖片模擬 AI 生成效果：

```javascript
// spot-detail.js 中的模擬生成
function generateAiImage() {
    // 顯示載入動畫
    previewLoading.classList.remove('hidden');
    
    // 模擬 AI 處理時間
    setTimeout(() => {
        const imageKey = `${currentWeather}-${currentTime}`;
        const renderedImage = aiRenderedImages[spotName][imageKey];
        
        // 更新預覽圖片
        previewImage.src = renderedImage;
    }, 1500);
}
```

## 整合真實 AI 服務

### 選項 1: Stable Diffusion API

使用 Stability AI 的 API 生成圖片。

```javascript
async function generateAiImage() {
    const previewLoading = document.getElementById('previewLoading');
    previewLoading.classList.remove('hidden');
    
    try {
        // 構建提示詞
        const prompt = buildPrompt(spotData.name, currentWeather, currentTime);
        
        // 呼叫 Stable Diffusion API
        const response = await fetch('https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${STABILITY_API_KEY}`
            },
            body: JSON.stringify({
                text_prompts: [
                    {
                        text: prompt,
                        weight: 1
                    },
                    {
                        text: 'low quality, blurry, distorted',
                        weight: -1
                    }
                ],
                cfg_scale: 7.5,
                height: 600,
                width: 800,
                steps: 50,
                samples: 1
            })
        });
        
        const data = await response.json();
        const imageBase64 = data.artifacts[0].base64;
        const imageUrl = `data:image/png;base64,${imageBase64}`;
        
        currentRenderedImage = imageUrl;
        document.getElementById('previewImage').src = imageUrl;
        previewLoading.classList.add('hidden');
        
    } catch (error) {
        console.error('AI 生成失敗:', error);
        showMessage('圖片生成失敗，請稍後再試', 'error');
        previewLoading.classList.add('hidden');
    }
}

function buildPrompt(spotName, weather, time) {
    const config = AI_RENDER_CONFIG.promptTemplates[spotName] || 
                   AI_RENDER_CONFIG.promptTemplates['default'];
    
    let prompt = config.base + ', ';
    
    // 加入天氣描述
    if (weather === 'sunny') prompt += config.sunny;
    else if (weather === 'cloudy') prompt += config.cloudy;
    else if (weather === 'rainy') prompt += config.rainy;
    else if (weather === 'night') prompt += config.night;
    
    // 加入時間描述
    if (time === 'morning') prompt += ', morning light';
    else if (time === 'afternoon') prompt += ', afternoon sunlight';
    else if (time === 'evening') prompt += ', golden hour, sunset';
    else if (time === 'night') prompt += ', night scene, city lights';
    
    // 加入品質增強
    prompt += ', ' + AI_RENDER_CONFIG.generationSettings.qualityEnhancers.join(', ');
    
    return prompt;
}
```

### 選項 2: OpenAI DALL-E API

```javascript
async function generateAiImage() {
    const previewLoading = document.getElementById('previewLoading');
    previewLoading.classList.remove('hidden');
    
    try {
        const prompt = buildPrompt(spotData.name, currentWeather, currentTime);
        
        const response = await fetch('https://api.openai.com/v1/images/generations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'dall-e-3',
                prompt: prompt,
                n: 1,
                size: '1024x1024',
                quality: 'hd',
                style: 'natural'
            })
        });
        
        const data = await response.json();
        const imageUrl = data.data[0].url;
        
        currentRenderedImage = imageUrl;
        document.getElementById('previewImage').src = imageUrl;
        previewLoading.classList.add('hidden');
        
    } catch (error) {
        console.error('AI 生成失敗:', error);
        showMessage('圖片生成失敗，請稍後再試', 'error');
        previewLoading.classList.add('hidden');
    }
}
```

### 選項 3: 自建 Stable Diffusion 服務

使用 ComfyUI 或 Automatic1111 WebUI 的 API：

```javascript
async function generateAiImage() {
    const previewLoading = document.getElementById('previewLoading');
    previewLoading.classList.remove('hidden');
    
    try {
        const prompt = buildPrompt(spotData.name, currentWeather, currentTime);
        
        // 發送生成請求到自建服務
        const response = await fetch('http://your-server:7860/sdapi/v1/txt2img', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt: prompt,
                negative_prompt: 'low quality, blurry, distorted, watermark',
                steps: 50,
                width: 800,
                height: 600,
                cfg_scale: 7.5,
                sampler_name: 'DPM++ 2M Karras',
                batch_size: 1
            })
        });
        
        const data = await response.json();
        const imageBase64 = data.images[0];
        const imageUrl = `data:image/png;base64,${imageBase64}`;
        
        currentRenderedImage = imageUrl;
        document.getElementById('previewImage').src = imageUrl;
        previewLoading.classList.add('hidden');
        
    } catch (error) {
        console.error('AI 生成失敗:', error);
        showMessage('圖片生成失敗，請稍後再試', 'error');
        previewLoading.classList.add('hidden');
    }
}
```

## 後端整合建議

為了保護 API 密鑰和優化性能，建議使用後端代理：

### Node.js Express 範例

```javascript
// server.js
const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use(express.json());

app.post('/api/generate-image', async (req, res) => {
    const { spotName, weather, timeOfDay } = req.body;
    
    try {
        // 構建提示詞
        const prompt = buildPromptOnServer(spotName, weather, timeOfDay);
        
        // 呼叫 AI 服務
        const response = await fetch('https://api.stability.ai/v1/generation/...', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.STABILITY_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text_prompts: [{ text: prompt, weight: 1 }],
                cfg_scale: 7.5,
                height: 600,
                width: 800,
                steps: 50
            })
        });
        
        const data = await response.json();
        
        // 可選：將圖片儲存到雲端儲存（S3, Cloudinary 等）
        const imageUrl = await uploadToCloudStorage(data.artifacts[0].base64);
        
        res.json({ success: true, imageUrl });
        
    } catch (error) {
        console.error('生成失敗:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
```

### 前端呼叫

```javascript
async function generateAiImage() {
    const previewLoading = document.getElementById('previewLoading');
    previewLoading.classList.remove('hidden');
    
    try {
        const response = await fetch('/api/generate-image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                spotName: spotData.name,
                weather: currentWeather,
                timeOfDay: currentTime
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            currentRenderedImage = data.imageUrl;
            document.getElementById('previewImage').src = data.imageUrl;
        } else {
            throw new Error(data.error);
        }
        
        previewLoading.classList.add('hidden');
        
    } catch (error) {
        console.error('AI 生成失敗:', error);
        showMessage('圖片生成失敗，請稍後再試', 'error');
        previewLoading.classList.add('hidden');
    }
}
```

## 成本優化建議

1. **快取機制**：相同參數的圖片只生成一次，儲存到資料庫或雲端儲存
2. **預生成**：熱門景點和常見組合可以預先生成
3. **批次處理**：使用佇列系統處理大量請求
4. **壓縮優化**：生成後壓縮圖片以減少儲存和傳輸成本

## 使用者體驗優化

1. **進度顯示**：顯示生成進度百分比
2. **預覽歷史**：允許使用者查看之前生成的圖片
3. **下載選項**：允許使用者下載生成的圖片
4. **分享功能**：生成後可以分享到社交媒體

## 環境變數設定

```bash
# .env
STABILITY_API_KEY=your_stability_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
CLOUD_STORAGE_BUCKET=your_storage_bucket
```

## 測試建議

1. 測試不同天氣和時段組合
2. 測試失敗情況的處理
3. 測試載入速度和使用者體驗
4. 進行成本分析和優化

## 相關資源

- [Stability AI API 文檔](https://platform.stability.ai/docs/api-reference)
- [OpenAI DALL-E API](https://platform.openai.com/docs/guides/images)
- [ComfyUI API](https://github.com/comfyanonymous/ComfyUI)
- [Automatic1111 WebUI API](https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/API)
