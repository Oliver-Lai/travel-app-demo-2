// AI 圖片渲染 Demo 數據配置
// 在實際應用中，這些圖片應該由 AI 服務生成

const AI_RENDER_CONFIG = {
    // 天氣選項
    weatherOptions: [
        { id: 'sunny', name: '晴天', icon: 'fa-sun', color: '#f59e0b' },
        { id: 'cloudy', name: '陰天', icon: 'fa-cloud', color: '#94a3b8' },
        { id: 'rainy', name: '雨天', icon: 'fa-cloud-rain', color: '#3b82f6' },
        { id: 'night', name: '夜晚', icon: 'fa-moon', color: '#6366f1' }
    ],
    
    // 時段選項
    timeOptions: [
        { id: 'morning', name: '早晨', icon: 'fa-sunrise', range: [6, 11] },
        { id: 'afternoon', name: '下午', icon: 'fa-sun', range: [12, 17] },
        { id: 'evening', name: '傍晚', icon: 'fa-sunset', range: [18, 20] },
        { id: 'night', name: '深夜', icon: 'fa-moon', range: [21, 5] }
    ],
    
    // 景點 AI 渲染提示詞模板
    promptTemplates: {
        '台北101': {
            base: 'Taipei 101 skyscraper in Taiwan, urban landscape, modern architecture',
            sunny: 'clear blue sky, bright sunlight, vibrant colors',
            cloudy: 'overcast sky, soft diffused lighting, muted colors',
            rainy: 'rainy weather, wet streets, reflection on ground, dramatic atmosphere',
            night: 'night scene, city lights, illuminated building, blue hour'
        },
        '象山步道': {
            base: 'Elephant Mountain hiking trail in Taipei, nature trail, mountain path',
            sunny: 'bright sunny day, clear visibility, lush green trees',
            cloudy: 'cloudy weather, soft light, misty atmosphere',
            rainy: 'rainy hiking trail, wet rocks, foggy mountain',
            night: 'evening trail, sunset colors, golden hour lighting'
        },
        '士林夜市': {
            base: 'Shilin Night Market in Taipei, crowded street food market, vibrant atmosphere',
            sunny: 'daytime market, bright daylight, colorful stalls',
            cloudy: 'overcast day market, soft natural lighting',
            rainy: 'rainy night market, umbrellas, wet pavement reflections',
            night: 'bustling night market, neon lights, street food vendors, crowds'
        },
        'default': {
            base: 'Taiwan tourist attraction, beautiful scenery',
            sunny: 'sunny weather, bright and cheerful',
            cloudy: 'cloudy weather, soft lighting',
            rainy: 'rainy scene, atmospheric',
            night: 'night view, city lights'
        }
    },
    
    // Demo 圖片數據 - 使用 Unsplash 作為範例
    // 實際應用中應該使用 AI 生成的圖片
    demoImages: {
        '台北101': {
            'sunny-morning': {
                url: 'https://images.unsplash.com/photo-1508964942454-1a56651d54ac?w=800',
                description: '晴朗的早晨，台北101在藍天下顯得格外壯觀'
            },
            'sunny-afternoon': {
                url: 'https://images.unsplash.com/photo-1559590835-0f572e65c144?w=800',
                description: '午後陽光灑在台北101上，城市活力四射'
            },
            'sunny-evening': {
                url: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800',
                description: '傍晚時分，台北101在夕陽餘暉中格外迷人'
            },
            'rainy-evening': {
                url: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?w=800',
                description: '雨中的台北101，燈光映照在濕潤的街道上'
            },
            'night-night': {
                url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800',
                description: '夜幕降臨，台北101的燈光點亮夜空'
            }
        },
        '象山步道': {
            'sunny-morning': {
                url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
                description: '清晨的象山步道，陽光穿透樹林'
            },
            'sunny-afternoon': {
                url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
                description: '午後的山林景色，視野開闊'
            },
            'sunny-evening': {
                url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800',
                description: '傍晚時分，金黃色的陽光灑在山徑上'
            },
            'rainy-morning': {
                url: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800',
                description: '雨後的象山，雲霧繚繞'
            }
        },
        '士林夜市': {
            'sunny-afternoon': {
                url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
                description: '白天的士林夜市，攤販準備營業'
            },
            'sunny-evening': {
                url: 'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=800',
                description: '傍晚時分，夜市逐漸熱鬧起來'
            },
            'night-night': {
                url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
                description: '夜晚的士林夜市，燈火通明人潮湧動'
            },
            'rainy-night': {
                url: 'https://images.unsplash.com/photo-1478145046317-39f10e56b5e9?w=800',
                description: '雨夜的夜市，霓虹燈映照在雨水中'
            }
        }
    },
    
    // AI 生成建議參數
    generationSettings: {
        // Stable Diffusion / DALL-E 參數建議
        width: 800,
        height: 600,
        steps: 50,
        cfgScale: 7.5,
        sampler: 'DPM++ 2M Karras',
        
        // 品質增強提示詞
        qualityEnhancers: [
            'high quality',
            'detailed',
            'professional photography',
            '8k resolution',
            'photorealistic',
            'sharp focus'
        ],
        
        // 負面提示詞
        negativePrompts: [
            'low quality',
            'blurry',
            'distorted',
            'watermark',
            'text',
            'signature'
        ]
    }
};

// 導出配置（如果使用模組化）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AI_RENDER_CONFIG;
}
