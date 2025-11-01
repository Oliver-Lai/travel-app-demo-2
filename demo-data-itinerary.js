// Demo Itinerary Data - 台北 2 日自由行
// 這個檔案包含完整的 demo 行程數據，包括 AI 建議功能

const demoItineraryData = {
    "title": "台北 2 日・自由行",
    "description": "這是一個稀疏的基礎行程，用以展示 AI 增補功能。",
    "startDate": "2025-11-15",
    "endDate": "2025-11-16",
    "days": [
        {
            "day_name": "Day 1",
            "dayNumber": 1,
            "date": "2025-11-15",
            "dateFormatted": "11月15日 週六",
            "theme": "現代與潮流",
            "isRainyMode": false,
            "spots": [
                {
                    "time": "10:00",
                    "name": "華山 1914 文創園區",
                    "note": "逛逛文創小店與展覽。",
                    "type": "manual",
                    "location": "indoor"
                },
                {
                    "time": "15:00",
                    "name": "西門町",
                    "note": "感受年輕潮流與街頭美食。",
                    "type": "manual",
                    "location": "outdoor"
                },
                {
                    "time": "19:00",
                    "name": "台北 101",
                    "note": "欣賞台北夜景。",
                    "type": "manual",
                    "location": "indoor"
                }
            ]
        },
        {
            "day_name": "Day 2",
            "dayNumber": 2,
            "date": "2025-11-16",
            "dateFormatted": "11月16日 週日",
            "theme": "歷史與文化",
            "isRainyMode": false,
            "spots": [
                {
                    "time": "10:00",
                    "name": "龍山寺",
                    "note": "參拜祈福，感受傳統信仰。",
                    "type": "manual",
                    "location": "outdoor"
                }
            ]
        }
    ],
    "ai_suggestions": {
        "fill_gap": {
            "day_1": [
                {
                    "time": "13:00",
                    "name": "[AI 建議] 國立臺灣博物館",
                    "note": "AI 建議：參觀歷史建築與展覽，並可於附近享用午餐，再前往西門町。",
                    "type": "ai",
                    "location": "indoor",
                    "insert_after": "10:00"
                }
            ]
        },
        "continue_itinerary": {
            "day_1": [
                {
                    "time": "21:00",
                    "name": "[AI 建議] 臨江街夜市 (通化夜市)",
                    "note": "AI 建議：距離 101 不遠，體驗在地人逛的夜市美食。",
                    "type": "ai",
                    "location": "outdoor"
                }
            ],
            "day_2": [
                {
                    "time": "12:00",
                    "name": "[AI 建議] 剝皮寮歷史街區",
                    "note": "AI 建議：就在龍山寺旁邊，可在此感受老台北的紅磚建築風情。",
                    "type": "ai",
                    "location": "outdoor"
                },
                {
                    "time": "18:00",
                    "name": "[AI 建議] 永康街 (鼎泰豐)",
                    "note": "AI 建議：逛完中正紀念堂，可搭捷運至此享用晚餐。",
                    "type": "ai",
                    "location": "indoor",
                    "condition": "如果使用者手動新增了 14:00 中正紀念堂"
                }
            ]
        },
        "rainy_alternatives": [
            {
                "name": "[雨天備案] 國立臺灣博物館",
                "note": "室內展覽，認識台灣自然與文化歷史。",
                "type": "ai",
                "location": "indoor"
            },
            {
                "name": "[雨天備案] 華山 1914 文創園區",
                "note": "逛逛文創小店與展覽。",
                "type": "ai",
                "location": "indoor"
            },
            {
                "name": "[雨天備案] 台北市立美術館",
                "note": "欣賞當代藝術作品與特展。",
                "type": "ai",
                "location": "indoor"
            },
            {
                "name": "[雨天備案] 松山文創園區 (誠品)",
                "note": "文創商店與書店，適合悠閒逛街。",
                "type": "ai",
                "location": "indoor"
            },
            {
                "name": "[雨天備案] 國立故宮博物院",
                "note": "世界級的中華文物收藏，值得細細品味。",
                "type": "ai",
                "location": "indoor"
            },
            {
                "name": "[雨天備案] 微風南山美食街",
                "note": "室內美食廣場，集結各國美食，雨天也能享受美食體驗。",
                "type": "ai",
                "location": "indoor",
                "replaces": "[AI 建議] 臨江街夜市 (通化夜市)"
            }
        ]
    }
};

// 將 demo 數據暴露到全域，供其他腳本使用
window.demoItineraryData = demoItineraryData;
