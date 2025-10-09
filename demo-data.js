/**
 * Demo Trip Data - 台北一日精華遊
 * 
 * 這個資料結構用於展示系統的核心功能：
 * 1. 手動新增景點 (manual)
 * 2. AI 智能推薦景點 (ai)
 * 3. 天氣應變模式（室外景點的雨天替代方案）
 * 4. 室內/室外景點分類
 */

const demoTripData = {
    // 旅程基本資訊
    title: '台北一日遊',
    startDate: '2025-10-26',
    endDate: '2025-10-26',
    
    // 行程安排
    days: [
        {
            dayNumber: 1,
            date: '2025-10-26',
            dateFormatted: '10月26日 週日',
            isRainyMode: false, // 預設為晴天模式
            spots: [
                {
                    id: 'spot1',
                    name: '阜杭豆漿',
                    time: '08:00',
                    location: 'indoor', // 室內景點
                    note: '聽說要排隊一小時',
                    type: 'manual', // 手動新增
                    rainyAlternative: null // 室內景點不需要雨天備案
                },
                {
                    id: 'spot2',
                    name: '中正紀念堂',
                    time: '10:00',
                    location: 'indoor', // 室內景點
                    note: '整點可以看衛兵交接',
                    type: 'manual', // 手動新增
                    rainyAlternative: null // 室內景點不需要雨天備案
                },
                {
                    id: 'spot3',
                    name: '隱家拉麵 (中山店)',
                    time: '12:30',
                    location: 'indoor', // 室內景點
                    note: '',
                    type: 'manual', // 手動新增
                    rainyAlternative: null // 室內景點不需要雨天備案
                },
                {
                    id: 'spot4',
                    name: '大安森林公園',
                    time: '14:30',
                    location: 'outdoor', // 室外景點
                    note: '',
                    type: 'ai', // AI 生成
                    rainyAlternative: {
                        name: '誠品書店信義店',
                        location: 'indoor',
                        note: '雨天備案：適合閱讀和休息的室內空間'
                    }
                },
                {
                    id: 'spot5',
                    name: '台北101觀景台',
                    time: '17:00',
                    location: 'indoor', // 室內景點
                    note: '傍晚可同時看到日夜景',
                    type: 'ai', // AI 生成
                    rainyAlternative: null // 室內景點不需要雨天備案
                },
                {
                    id: 'spot6',
                    name: '臨江街觀光夜市',
                    time: '19:30',
                    location: 'outdoor', // 室外景點
                    note: '',
                    type: 'ai', // AI 生成
                    rainyAlternative: {
                        name: '台北101美食街',
                        location: 'indoor',
                        note: '雨天備案：室內美食廣場，各式料理任選'
                    }
                }
            ]
        }
    ]
};

/**
 * 使用說明：
 * 
 * 1. 載入 Demo 資料：
 *    itinerary = JSON.parse(JSON.stringify(demoTripData));
 * 
 * 2. 天氣切換邏輯：
 *    - 當切換為下雨模式時，遍歷 spots 陣列
 *    - 對於 location === 'outdoor' 的景點：
 *      a. 保存原始名稱到 originalName
 *      b. 將 name 替換為 rainyAlternative.name
 *      c. 將 location 改為 'indoor'
 *      d. 更新或添加 note
 * 
 *    - 當切換回晴天模式時：
 *      a. 檢查是否有 originalName
 *      b. 將 name 還原為 originalName
 *      c. 將 location 改回 'outdoor'
 *      d. 清除 originalName 屬性
 * 
 * 3. Demo 展示流程：
 *    第一階段 - 手動新增 (3個景點)
 *    ├─ 阜杭豆漿 (08:00)
 *    ├─ 中正紀念堂 (10:00)
 *    └─ 隱家拉麵 (12:30)
 * 
 *    第二階段 - AI 推薦 (3個景點)
 *    ├─ 大安森林公園 (14:30) ← 室外，有雨天備案
 *    ├─ 台北101觀景台 (17:00) ← 室內
 *    └─ 臨江街觀光夜市 (19:30) ← 室外，有雨天備案
 * 
 *    第三階段 - 天氣應變
 *    點擊「下雨模式」按鈕
 *    ├─ 大安森林公園 → 誠品書店信義店
 *    └─ 臨江街觀光夜市 → 台北101美食街
 * 
 * 4. 統計資訊：
 *    - 總景點數：6 個
 *    - 手動新增：3 個 (阜杭豆漿、中正紀念堂、隱家拉麵)
 *    - AI 推薦：3 個 (大安森林公園、台北101觀景台、臨江街觀光夜市)
 *    - 室內景點：4 個 (晴天模式下)
 *    - 室外景點：2 個 (晴天模式下)
 *    - 有雨天備案的景點：2 個
 */

// 匯出資料（如果使用模組化）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = demoTripData;
}

// 全域變數（如果直接在 HTML 中引用）
if (typeof window !== 'undefined') {
    window.demoTripData = demoTripData;
}
