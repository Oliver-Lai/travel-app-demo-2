// Get URL parameters
const urlParams = new URLSearchParams(window.location.search);
const dayIndex = parseInt(urlParams.get('day')) || 0;
const spotIndex = parseInt(urlParams.get('spot')) || 0;

// Spot data storage
let spotData = null;

// Spot images database (placeholder images for demo)
const spotImages = {
    '故宮博物院': 'default.jpeg',
    '象山步道': 'default.jpeg',
    '士林夜市': 'default.jpeg',
    '龍山寺': 'default.jpeg',
    '陽明山': 'default.jpeg',
    '中正紀念堂': 'default.jpeg',
    '台北101': 'demo-images/台北101/台北101.jpg',
    '台北 101': 'demo-images/台北101/台北101.jpg',
    '誠品書店': 'default.jpeg',
    '市立美術館': 'default.jpeg',
    '台北市立美術館': 'default.jpeg',
    '貓空纜車': 'default.jpeg',
    '日月潭': 'default.jpeg',
    '誠品書店信義店': 'default.jpeg',
    '微風南山美食街': 'default.jpeg',
    '台北市立圖書館總館': 'default.jpeg',
    '陽明山國家公園': 'default.jpeg',
    '國立故宮博物院': 'default.jpeg',
    '西門町': 'demo-images/西門町/西門町.jpg',
    '華山 1914 文創園區': 'default.jpeg',
    '國立臺灣博物館': 'default.jpeg',
    '剝皮寮歷史街區': 'default.jpeg',
    '永康街 (鼎泰豐)': 'default.jpeg',
    '臨江街夜市 (通化夜市)': 'default.jpeg',
    '[AI 建議] 中正紀念堂': 'default.jpeg',
    '[AI 建議] 臨江街夜市 (通化夜市)': 'default.jpeg',
    '[AI 建議] 剝皮寮歷史街區': 'default.jpeg',
    '[AI 建議] 永康街 (鼎泰豐)': 'default.jpeg',
    '[AI 建議] 國立臺灣博物館': 'default.jpeg',
    '[雨天備案] 國立臺灣博物館': 'default.jpeg',
    '[雨天備案] 華山 1914 文創園區': 'default.jpeg',
    '[雨天備案] 台北市立美術館': 'default.jpeg',
    '[雨天備案] 松山文創園區 (誠品)': 'default.jpeg',
    '[雨天備案] 國立故宮博物院': 'default.jpeg'
};

// AI Rendered images database (Demo data - different weather and time combinations)
const aiRenderedImages = {
    '西門町': {
        'sunny-morning': 'demo-images/西門町/sunny-morning.jpg',
        'sunny-afternoon': 'demo-images/西門町/sunny-afternoon.jpg',
        'sunny-night': 'demo-images/西門町/sunny-night.jpg',
        'cloudy-morning': 'demo-images/西門町/cloudy-morning.jpg',
        'cloudy-afternoon': 'demo-images/西門町/cloudy-afternoon.jpg',
        'cloudy-night': 'demo-images/西門町/cloudy-night.jpg',
        'rainy-morning': 'demo-images/西門町/rainy-morning.jpg',
        'rainy-afternoon': 'demo-images/西門町/rainy-afternoon.jpg',
        'rainy-night': 'demo-images/西門町/rainy-night.jpg'
    },
    '象山步道': {
        'sunny-morning': 'default.jpeg',
        'sunny-afternoon': 'default.jpeg',
        'sunny-night': 'default.jpeg',
        'cloudy-morning': 'default.jpeg',
        'cloudy-afternoon': 'default.jpeg',
        'cloudy-night': 'default.jpeg',
        'rainy-morning': 'default.jpeg',
        'rainy-afternoon': 'default.jpeg',
        'rainy-night': 'default.jpeg'
    },
    '士林夜市': {
        'sunny-morning': 'default.jpeg',
        'sunny-afternoon': 'default.jpeg',
        'sunny-night': 'default.jpeg',
        'cloudy-morning': 'default.jpeg',
        'cloudy-afternoon': 'default.jpeg',
        'cloudy-night': 'default.jpeg',
        'rainy-morning': 'default.jpeg',
        'rainy-afternoon': 'default.jpeg',
        'rainy-night': 'default.jpeg'
    },
    // Default fallback images
    'default': {
        'sunny-morning': 'default.jpeg',
        'sunny-afternoon': 'default.jpeg',
        'sunny-night': 'default.jpeg',
        'cloudy-morning': 'default.jpeg',
        'cloudy-afternoon': 'default.jpeg',
        'cloudy-night': 'default.jpeg',
        'rainy-morning': 'default.jpeg',
        'rainy-afternoon': 'default.jpeg',
        'rainy-night': 'default.jpeg'
    }
};

// AI Render state
let currentWeather = 'rainy';
let currentTime = 'morning';
let currentRenderedImage = null;

// Spot descriptions database
const spotDescriptions = {
    '故宮博物院': '國立故宮博物院位於台北市士林區，是世界四大博物館之一。館藏近70萬件中國歷代文物藝術品，是中華文化瑰寶的寶庫。',
    '象山步道': '象山步道是台北市最受歡迎的登山步道之一，登上山頂可以俯瞰整個台北市景，特別是台北101的壯觀景色，是攝影愛好者的天堂。',
    '士林夜市': '士林夜市是台北最大且最著名的夜市之一，擁有各式各樣的台灣小吃和遊戲攤位，是體驗台灣夜市文化的最佳選擇。',
    '龍山寺': '龍山寺創建於1738年，是台北最古老的寺廟之一，也是國定古蹟。寺內建築精美，香火鼎盛，是台北重要的信仰中心。',
    '陽明山': '陽明山國家公園是台北的後花園，擁有豐富的自然景觀和溫泉資源。春季的櫻花和海芋花季更是吸引大批遊客前來賞花。',
    '中正紀念堂': '中正紀念堂是台北市的地標性建築，園區廣闊，建築雄偉壯觀。每天整點的衛兵交接儀式是必看的表演。',
    '台北101': '台北101曾是世界第一高樓，是台北最具代表性的地標。89樓觀景台可以360度俯瞰台北市景，夜景更是美不勝收。',
    '台北 101': '台北101曾是世界第一高樓，是台北最具代表性的地標。89樓觀景台可以360度俯瞰台北市景，夜景更是美不勝收。',
    '誠品書店': '誠品書店是台灣最知名的連鎖書店，不只賣書，更是一個文化生活空間。24小時營業的信義店是愛書人的天堂。',
    '市立美術館': '台北市立美術館是台灣第一座現代美術館，展出當代藝術作品，是藝術愛好者不可錯過的文化景點。',
    '貓空纜車': '貓空纜車是台北市第一條觀光纜車，全長4.03公里。搭乘纜車可以俯瞰台北市景，終點站貓空則以茶園和茶藝聞名。',
    '台北市立美術館': '台北市立美術館是台灣第一座現代美術館，展出當代藝術作品，是藝術愛好者不可錯過的文化景點。',
    '誠品書店信義店': '誠品信義店是24小時營業的大型書店，結合書籍、音樂、展覽等多元文化元素，是台北夜生活的文化新選擇。',
    '微風南山美食街': '微風南山是台北最新的購物中心，B2美食街集結各國美食，從日本拉麵到台灣小吃應有盡有。',
    '台北市立圖書館總館': '台北市立圖書館總館是台北最大的公共圖書館，館藏豐富，閱讀空間舒適，是閱讀和學習的好地方。',
    '陽明山國家公園': '陽明山國家公園是台北的後花園，擁有豐富的自然景觀和溫泉資源。春季的櫻花和海芋花季更是吸引大批遊客前來賞花。',
    '國立故宮博物院': '國立故宮博物院位於台北市士林區，是世界四大博物館之一。館藏近70萬件中國歷代文物藝術品，是中華文化瑰寶的寶庫。',
    '西門町': '西門町是台北最具代表性的年輕潮流聚集地，有台北原宿之稱。這裡充滿各式商店、電影院、美食餐廳，是購物、娛樂和品嚐美食的熱門地點。',
    '華山 1914 文創園區': '華山1914文創園區前身為日治時期的酒廠，現已轉型為文創展演空間。園區內有眾多文創商店、展覽空間、餐廳咖啡廳，是體驗台灣文創產業的好去處。',
    '國立臺灣博物館': '國立臺灣博物館是台灣歷史最悠久的博物館，位於二二八和平公園內。館內收藏豐富的自然史與人類學標本，建築本身也是國定古蹟。',
    '剝皮寮歷史街區': '剝皮寮歷史街區保留了清代至日治時期的建築風貌，紅磚、木窗構成懷舊氛圍。這裡是電影《艋舺》的拍攝地，也是認識老台北萬華文化的窗口。',
    '永康街 (鼎泰豐)': '永康街是台北著名的美食街，以鼎泰豐小籠包聞名國際。除了鼎泰豐，這裡還有許多特色餐廳、咖啡廳和甜品店，是美食愛好者的天堂。',
    '臨江街夜市 (通化夜市)': '臨江街夜市又稱通化夜市，是在地人最愛的夜市之一。相較於觀光夜市，這裡更貼近台北人的日常生活，有許多道地的台灣小吃。',
    '松山文創園區 (誠品)': '松山文創園區前身為松山菸廠，現為結合文創、設計、藝術的展演空間。園區內的誠品生活松菸店集結書店、選物店、餐廳，是文青必訪景點。',
    '[AI 建議] 中正紀念堂': '中正紀念堂是台北市的地標性建築，園區廣闊，建築雄偉壯觀。每天整點的衛兵交接儀式是必看的表演。',
    '[AI 建議] 臨江街夜市 (通化夜市)': '臨江街夜市又稱通化夜市，是在地人最愛的夜市之一。相較於觀光夜市，這裡更貼近台北人的日常生活，有許多道地的台灣小吃。',
    '[AI 建議] 剝皮寮歷史街區': '剝皮寮歷史街區保留了清代至日治時期的建築風貌，紅磚、木窗構成懷舊氛圍。這裡是電影《艋舺》的拍攝地，也是認識老台北萬華文化的窗口。',
    '[AI 建議] 永康街 (鼎泰豐)': '永康街是台北著名的美食街，以鼎泰豐小籠包聞名國際。除了鼎泰豐，這裡還有許多特色餐廳、咖啡廳和甜品店，是美食愛好者的天堂。',
    '[AI 建議] 國立臺灣博物館': '國立臺灣博物館是台灣歷史最悠久的博物館，位於二二八和平公園內。館內收藏豐富的自然史與人類學標本，建築本身也是國定古蹟。',
    '[雨天備案] 國立臺灣博物館': '國立臺灣博物館是台灣歷史最悠久的博物館，位於二二八和平公園內。館內收藏豐富的自然史與人類學標本，建築本身也是國定古蹟。',
    '[雨天備案] 華山 1914 文創園區': '華山1914文創園區前身為日治時期的酒廠，現已轉型為文創展演空間。園區內有眾多文創商店、展覽空間、餐廳咖啡廳，是體驗台灣文創產業的好去處。',
    '[雨天備案] 台北市立美術館': '台北市立美術館是台灣第一座現代美術館，展出當代藝術作品，是藝術愛好者不可錯過的文化景點。',
    '[雨天備案] 松山文創園區 (誠品)': '松山文創園區前身為松山菸廠，現為結合文創、設計、藝術的展演空間。園區內的誠品生活松菸店集結書店、選物店、餐廳，是文青必訪景點。',
    '[雨天備案] 國立故宮博物院': '國立故宮博物院位於台北市士林區，是世界四大博物館之一。館藏近70萬件中國歷代文物藝術品，是中華文化瑰寶的寶庫。'
};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadSpotData();
    initializeEventListeners();
    setActiveNavItem();
});

// Load spot data from localStorage
function loadSpotData() {
    const savedItinerary = localStorage.getItem('savedItinerary');
    
    if (savedItinerary) {
        try {
            const itinerary = JSON.parse(savedItinerary);
            
            if (itinerary.days && itinerary.days[dayIndex] && 
                itinerary.days[dayIndex].spots && 
                itinerary.days[dayIndex].spots[spotIndex]) {
                
                spotData = itinerary.days[dayIndex].spots[spotIndex];
                
                // 只有西門町才顯示詳細資料
                if (spotData.name === '西門町') {
                    renderSpotDetails();
                } else {
                    showError('沒有景點詳細資料');
                }
            } else {
                showError('找不到景點資料');
            }
        } catch (error) {
            console.error('Error loading spot data:', error);
            showError('載入景點資料時發生錯誤');
        }
    } else {
        showError('找不到行程資料');
    }
}

// Render spot details
function renderSpotDetails() {
    if (!spotData) return;
    
    // Set spot name
    document.getElementById('spotName').textContent = spotData.name;
    
    // Set location badge
    const locationBadge = document.getElementById('locationBadge');
    const location = spotData.location || 'outdoor';
    if (location === 'indoor') {
        locationBadge.innerHTML = '<i class="fas fa-home"></i> 室內';
        locationBadge.classList.add('indoor');
        locationBadge.classList.remove('outdoor');
    } else {
        locationBadge.innerHTML = '<i class="fas fa-sun"></i> 室外';
        locationBadge.classList.add('outdoor');
        locationBadge.classList.remove('indoor');
    }
    
    // Set time badge
    document.getElementById('timeBadge').innerHTML = 
        `<i class="fas fa-clock"></i> ${spotData.time}`;
    
    // Set spot image
    const spotImage = document.getElementById('spotImage');
    const imageSrc = spotImages[spotData.name] || spotImages[spotData.originalName] || 
                     'default.jpeg';
    spotImage.src = imageSrc;
    spotImage.alt = spotData.name;
    
    // Set description
    const description = spotDescriptions[spotData.name] || 
                       spotDescriptions[spotData.originalName] ||
                       `${spotData.name}是一個值得探訪的美麗景點。這裡有豐富的特色和獨特的魅力，適合各年齡層的遊客前來遊玩。無論是拍照、休閒還是深度體驗，都能在這裡找到樂趣。`;
    document.getElementById('spotDescription').textContent = description;
    
    // Set note
    const noteElement = document.getElementById('spotNote');
    if (spotData.note && spotData.note.trim() !== '') {
        noteElement.textContent = spotData.note;
    } else {
        noteElement.textContent = '暫無備註';
    }
    
    // Set address (mock data for demo)
    document.getElementById('spotAddress').innerHTML = 
        `<i class="fas fa-location-arrow"></i> 台北市，台灣`;
}

// Initialize event listeners
function initializeEventListeners() {
    // Back button
    document.getElementById('backBtn').addEventListener('click', function() {
        window.location.href = 'plan.html';
    });
    
    // Edit button
    document.getElementById('editSpotBtn').addEventListener('click', function() {
        // Store edit context and go back to plan page
        localStorage.setItem('editSpotContext', JSON.stringify({
            dayIndex: dayIndex,
            spotIndex: spotIndex
        }));
        window.location.href = 'plan.html';
    });
    
    // Delete button
    document.getElementById('deleteSpotBtn').addEventListener('click', function() {
        if (confirm('確定要刪除這個景點嗎？')) {
            deleteSpot();
        }
    });
    
    // AI Render button
    document.getElementById('aiRenderBtn').addEventListener('click', function() {
        openRenderModal();
    });
    
    // Weather buttons
    document.querySelectorAll('.weather-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.weather-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentWeather = this.getAttribute('data-weather');
            generateAiImage();
        });
    });
    
    // Time buttons
    document.querySelectorAll('.time-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentTime = this.getAttribute('data-time');
            generateAiImage();
        });
    });
    
    // Apply render button
    document.getElementById('applyRenderBtn').addEventListener('click', function() {
        applyRenderedImage();
    });
    
    // Navigation items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            const page = this.getAttribute('data-page');
            navigateTo(page);
        });
    });
}

// Open map
function openMap() {
    // In a real app, this would open Google Maps or similar
    showMessage('地圖功能開發中...', 'info');
}

// Delete spot
function deleteSpot() {
    const savedItinerary = localStorage.getItem('savedItinerary');
    
    if (savedItinerary) {
        try {
            const itinerary = JSON.parse(savedItinerary);
            
            // Remove the spot
            itinerary.days[dayIndex].spots.splice(spotIndex, 1);
            
            // Save updated itinerary
            localStorage.setItem('savedItinerary', JSON.stringify(itinerary));
            
            showMessage('景點已刪除', 'success');
            
            // Redirect back to plan page
            setTimeout(() => {
                window.location.href = 'plan.html';
            }, 1000);
            
        } catch (error) {
            console.error('Error deleting spot:', error);
            showMessage('刪除失敗', 'error');
        }
    }
}

// Show error
function showError(message) {
    const mainContent = document.querySelector('.main-content');
    mainContent.innerHTML = `
        <div style="text-align: center; padding: 60px 20px; color: #a0aec0;">
            <i class="fas fa-exclamation-triangle" style="font-size: 64px; margin-bottom: 16px; opacity: 0.5;"></i>
            <p style="font-size: 16px; line-height: 1.6;">${message}</p>
            <button onclick="window.location.href='plan.html'" 
                    style="margin-top: 20px; padding: 12px 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                           color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">
                返回行程規劃
            </button>
        </div>
    `;
}

// Show message
function showMessage(message, type = 'success') {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'success-message';
    messageDiv.textContent = message;
    
    if (type === 'error') {
        messageDiv.style.background = '#e53e3e';
    } else if (type === 'info') {
        messageDiv.style.background = '#4299e1';
    }
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 2000);
}

// Set active navigation item
function setActiveNavItem() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));
    
    const activeItem = document.querySelector('.nav-item[data-page="plan"]');
    if (activeItem) {
        activeItem.classList.add('active');
    }
}

// Navigation function
function navigateTo(page) {
    let url;
    switch(page) {
        case 'home':
            url = 'index.html';
            break;
        case 'plan':
            url = 'plan.html';
            break;
        case 'write':
            url = 'write.html';
            break;
        case 'search':
            showMessage('搜尋功能開發中...', 'info');
            return;
        case 'account':
            showMessage('帳號功能開發中...', 'info');
            return;
        default:
            url = 'index.html';
    }
    window.location.href = url;
}

// Open render modal
function openRenderModal() {
    const modal = document.getElementById('aiRenderModal');
    modal.classList.add('active');
    
    // Set initial weather and time based on spot time
    initializeRenderOptions();
    
    // Generate initial preview
    generateAiImage();
}

// Close render modal
function closeRenderModal() {
    const modal = document.getElementById('aiRenderModal');
    modal.classList.remove('active');
}

// Initialize render options based on spot time
function initializeRenderOptions() {
    if (!spotData) return;
    
    const time = spotData.time;
    const hour = parseInt(time.split(':')[0]);
    
    // Determine time of day
    let timeOfDay = 'morning';
    if (hour >= 6 && hour < 12) {
        timeOfDay = 'morning';
    } else if (hour >= 12 && hour < 18) {
        timeOfDay = 'afternoon';
    } else if (hour >= 18 && hour < 21) {
        timeOfDay = 'evening';
    } else {
        timeOfDay = 'night';
    }
    
    currentTime = timeOfDay;
    
    // Update active buttons
    document.querySelectorAll('.time-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-time') === timeOfDay) {
            btn.classList.add('active');
        }
    });
}

// Generate AI image based on weather and time
function generateAiImage() {
    const previewImage = document.getElementById('previewImage');
    const previewLoading = document.getElementById('previewLoading');
    
    // Show loading
    previewLoading.classList.remove('hidden');
    previewImage.style.opacity = '0';
    
    // Simulate AI processing (in real app, this would call an AI API)
    setTimeout(() => {
        const imageKey = `${currentWeather}-${currentTime}`;
        const spotName = spotData.name;
        
        // Get rendered image from database
        let renderedImage;
        if (aiRenderedImages[spotName] && aiRenderedImages[spotName][imageKey]) {
            renderedImage = aiRenderedImages[spotName][imageKey];
        } else if (aiRenderedImages['default'][imageKey]) {
            renderedImage = aiRenderedImages['default'][imageKey];
        } else {
            renderedImage = spotImages[spotName] || 'default.jpeg';
        }
        
        currentRenderedImage = renderedImage;
        
        // Update preview
        previewImage.src = renderedImage;
        previewImage.onload = function() {
            previewLoading.classList.add('hidden');
            previewImage.style.opacity = '1';
        };
    }, 1500); // Simulate AI processing time
}

// Apply rendered image
function applyRenderedImage() {
    if (currentRenderedImage) {
        const mainImage = document.getElementById('spotImage');
        mainImage.src = currentRenderedImage;
        
        showMessage('圖片已套用！', 'success');
        closeRenderModal();
    }
}

// Add CSS for success message (if not already in CSS file)
const style = document.createElement('style');
style.textContent = `
    .success-message {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #48bb78;
        color: white;
        padding: 16px 32px;
        border-radius: 12px;
        font-weight: 600;
        z-index: 20000;
        box-shadow: 0 8px 24px rgba(72, 187, 120, 0.4);
        animation: successPop 0.5s ease-out;
    }
    
    @keyframes successPop {
        0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
        }
        50% {
            transform: translate(-50%, -50%) scale(1.1);
        }
        100% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
    }
`;
document.head.appendChild(style);
