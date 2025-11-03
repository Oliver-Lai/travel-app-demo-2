const itineraryData = {
  "title": "台北 2 日遊",
  "description": "台北景點推薦與行程規劃。",
  "startDate": "2025-11-15",
  "endDate": "2025-11-16",
  "days": [
    {
      "day_name": "Day 1",
      "dayNumber": 1,
      "date": "2025-11-15",
      "dateFormatted": "11月15日 週六",
      "theme": "經典城市一日遊",
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
          "time": "15:15",
          "name": "西門町",
          "note": "感受年輕潮流文化。",
          "type": "manual",
          "location": "outdoor"
        },
        {
          "time": "18:00",
          "name": "象山步道",
          "note": "【天氣分歧點】晴天首選，欣賞 101 夜景。若下雨則極難行走。",
          "type": "manual",
          "location": "outdoor"
        }
      ]
    },
    {
      "day_name": "Day 2",
      "dayNumber": 2,
      "date": "2025-11-16",
      "dateFormatted": "11月16日 週日",
      "theme": "待規劃",
      "isRainyMode": false,
      "spots": []
    }
  ],
  "ai_suggestions": {
    "fill_gap": {
      "day_1": [
        {
          "time": "11:45",
          "name": "[AI 建議] 午餐 (永康街商圈)",
          "note": "AI 建議：從華山搭捷運 1 站至「東門站」，在永康街用餐 (鼎泰豐、牛肉麵)。",
          "type": "ai",
          "location": "indoor",
          "insert_after": "10:00"
        },
        {
          "time": "13:15",
          "name": "[AI 建議] 國立臺灣博物館",
          "note": "AI 建議：吃完午餐後，搭捷運 2 站至「台大醫院站」參觀博物館。",
          "type": "ai",
          "location": "indoor",
          "insert_after": "11:45"
        }
      ]
    },
    "continue_itinerary": {
      "day_1": [
        {
          "time": "20:45",
          "name": "[AI 建議] 臨江街夜市 (通化夜市)",
          "note": "AI 建議：距離象山/101 不遠，可在此品嚐在地夜市小吃。",
          "type": "ai",
          "location": "outdoor"
        }
      ],
      "day_2": [
        {
          "time": "10:00",
          "name": "[AI 建議] 國立故宮博物院",
          "note": "AI 建議：第二天可安排時間參觀故宮，欣賞豐富文物收藏。",
          "type": "ai",
          "location": "indoor"
        },
        {
          "time": "14:00",
          "name": "[AI 建議] 淡水老街",
          "note": "AI 建議：下午可搭捷運至淡水，欣賞河岸風光與日落。",
          "type": "ai",
          "location": "outdoor"
        }
      ]
    },
    "rainy_alternatives": [
      {
        "time": "18:00",
        "name": "[雨天備案] 台北 101 觀景台",
        "note": "取代象山。室內觀景首選，同樣能從高處看夜景。",
        "type": "ai",
        "location": "indoor",
        "replaces": "象山親山步道"
      },
      {
        "time": "15:15",
        "name": "[雨天備案] 誠品生活西門店",
        "note": "取代西門町戶外。室內逛街、看書的舒適備案。",
        "type": "ai",
        "location": "indoor",
        "replaces": "西門町"
      },
      {
        "time": "20:45",
        "name": "[雨天備案] 一蘭拉麵 (信義店A11)",
        "note": "取代戶外夜市。24小時營業，在室內舒適享用熱騰騰的拉麵。",
        "type": "ai",
        "location": "indoor",
        "replaces": "[AI 建議] 臨江街夜市 (通化夜市)"
      }
    ]
  }
};

// 將 demo 數據暴露到全域，供其他腳本使用
window.demoItineraryData = itineraryData;