// App State Management
let appState = {
    currentStep: 1,
    uploadedPhotos: [],
    sortedPhotos: []
};

// DOM Elements
const fileInput = document.getElementById('fileInput');
const uploadZone = document.getElementById('uploadZone');
const photoPreview = document.getElementById('photoPreview');
const nextBtn1 = document.getElementById('nextBtn1');
const nextBtn2 = document.getElementById('nextBtn2');
const backBtn1 = document.getElementById('backBtn1');
const backBtn2 = document.getElementById('backBtn2');
const restartBtn = document.getElementById('restartBtn');
const sortablePhotos = document.getElementById('sortablePhotos');
const loadingAnimation = document.getElementById('loadingAnimation');
const generatedContent = document.getElementById('generatedContent');

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    updateStepIndicator();
    
    // Initialize sortable photos context menu
    const sortablePhotos = document.getElementById('sortablePhotos');
    if (sortablePhotos) {
        sortablePhotos.addEventListener('contextmenu', function(e) {
            if (e.target.closest('.sortable-item')) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        });
        
        // Prevent long press context menu on iOS Safari
        sortablePhotos.addEventListener('touchstart', function(e) {
            if (e.target.closest('.sortable-item')) {
                e.target.style.webkitTouchCallout = 'none';
            }
        }, { passive: true });
    }
    
    // Initialize bottom navigation
    setActiveNavItem('write');
    
    // Add click handlers to navigation items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            const page = this.dataset.page;
            navigateTo(page);
        });
    });
});

// Initialize Event Listeners
function initializeEventListeners() {
    // File input change
    if (fileInput) {
        fileInput.addEventListener('change', handleFileSelect);
    }
    
    // Drag and drop for upload zone
    if (uploadZone) {
        uploadZone.addEventListener('dragover', handleDragOver);
        uploadZone.addEventListener('dragleave', handleDragLeave);
        uploadZone.addEventListener('drop', handleDrop);
    }
    
    // Navigation buttons
    if (nextBtn1) {
        nextBtn1.addEventListener('click', () => goToStep(2));
    }
    
    if (nextBtn2) {
        nextBtn2.addEventListener('click', () => goToStep(3));
    }
    
    if (backBtn1) {
        backBtn1.addEventListener('click', () => goToStep(1));
    }
    
    if (backBtn2) {
        backBtn2.addEventListener('click', () => goToStep(2));
    }
    
    if (restartBtn) {
        restartBtn.addEventListener('click', resetApp);
    }
    
    // Back button in header
    const backBtn = document.querySelector('.back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }
}

// Handle file selection
function handleFileSelect(e) {
    const files = Array.from(e.target.files);
    addPhotos(files);
}

// Handle drag over
function handleDragOver(e) {
    e.preventDefault();
    uploadZone.classList.add('dragover');
}

// Handle drag leave
function handleDragLeave(e) {
    e.preventDefault();
    uploadZone.classList.remove('dragover');
}

// Handle drop
function handleDrop(e) {
    e.preventDefault();
    uploadZone.classList.remove('dragover');
    
    const files = Array.from(e.dataTransfer.files).filter(file => 
        file.type.startsWith('image/')
    );
    
    addPhotos(files);
}

// Add photos to state
function addPhotos(files) {
    files.forEach(file => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            appState.uploadedPhotos.push({
                id: Date.now() + Math.random(),
                src: e.target.result,
                file: file
            });
            
            renderPhotoPreview();
            updateNextButton();
        };
        
        reader.readAsDataURL(file);
    });
}

// Render photo preview
function renderPhotoPreview() {
    if (!photoPreview) return;
    
    photoPreview.innerHTML = '';
    
    appState.uploadedPhotos.forEach((photo, index) => {
        const photoItem = document.createElement('div');
        photoItem.className = 'photo-item';
        photoItem.innerHTML = `
            <img src="${photo.src}" alt="Photo ${index + 1}">
            <button class="photo-remove" onclick="removePhoto(${index})">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        photoPreview.appendChild(photoItem);
    });
}

// Remove photo
function removePhoto(index) {
    appState.uploadedPhotos.splice(index, 1);
    renderPhotoPreview();
    updateNextButton();
}

// Update next button state
function updateNextButton() {
    if (nextBtn1) {
        nextBtn1.disabled = appState.uploadedPhotos.length === 0;
    }
}

// Go to specific step
function goToStep(step) {
    appState.currentStep = step;
    
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show current section
    if (step === 1) {
        document.getElementById('upload-section').classList.add('active');
    } else if (step === 2) {
        document.getElementById('sorting-section').classList.add('active');
        renderSortablePhotos();
    } else if (step === 3) {
        document.getElementById('generation-section').classList.add('active');
        generateContent();
    }
    
    updateStepIndicator();
}

// Update step indicator
function updateStepIndicator() {
    document.querySelectorAll('.step').forEach((step, index) => {
        if (index + 1 <= appState.currentStep) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
}

// Render itinerary cards
function renderSortablePhotos() {
    const itineraryCardsContainer = document.getElementById('itineraryCards');
    if (!itineraryCardsContainer) return;
    
    itineraryCardsContainer.innerHTML = '';
    appState.sortedPhotos = [...appState.uploadedPhotos];
    
    // Itinerary data mapping by location name
    const itineraryDataMap = {
        '正濱漁港': { name: '正濱漁港', time: '10:54', day: 1, sortTime: '10:54' },
        '和平島考古遺跡': { name: '和平島考古遺跡', time: '13:36', day: 1, sortTime: '13:36' },
        '基隆主普壇': { name: '基隆主普壇', time: '17:28', day: 1, sortTime: '17:28' },
        'KEELUNG地標': { name: 'KEELUNG地標', time: '10:37', day: 2, sortTime: '10:37' },
        '陳記泡泡冰': { name: '基隆廟口夜市（陳記泡泡冰）', time: '12:23', day: 2, sortTime: '12:23' },
        '肉圓': { name: '基隆廟口夜市（肉圓）', time: '12:37', day: 2, sortTime: '12:37' },
        '基隆中山陸橋': { name: '基隆中山陸橋', time: '13:44', day: 2, sortTime: '13:44' },
    };
    
    // Match photos with itinerary data
    const photoItineraryPairs = appState.sortedPhotos.map((photo, index) => {
        // Extract location name from filename (remove .jpg extension)
        const fileName = photo.file.name.replace(/\.(jpg|jpeg|png|gif)$/i, '');
        
        // Try to match filename with itinerary data
        let itinerary = null;
        for (const key in itineraryDataMap) {
            if (fileName.includes(key) || key.includes(fileName)) {
                itinerary = itineraryDataMap[key];
                break;
            }
        }
        
        // Fallback to default if no match found
        if (!itinerary) {
            itinerary = { 
                name: fileName || `景點 ${index + 1}`, 
                time: '待確認', 
                day: Math.floor(index / 3) + 1,
                sortTime: '99:99'
            };
        }
        
        return { photo, itinerary };
    });
    
    // Sort by day first, then by time
    photoItineraryPairs.sort((a, b) => {
        if (a.itinerary.day !== b.itinerary.day) {
            return a.itinerary.day - b.itinerary.day;
        }
        return a.itinerary.sortTime.localeCompare(b.itinerary.sortTime);
    });
    
    // Update sortedPhotos array to match the sorted order
    appState.sortedPhotos = photoItineraryPairs.map(pair => pair.photo);
    
    // Render sorted cards
    photoItineraryPairs.forEach((pair, index) => {
        const { photo, itinerary } = pair;
        
        const card = document.createElement('div');
        card.className = 'itinerary-card';
        card.dataset.index = index;
        
        card.innerHTML = `
            <div class="itinerary-card-image">
                <img src="${photo.src}" alt="${itinerary.name}">
                <div class="itinerary-day-badge">Day ${itinerary.day}</div>
            </div>
            <div class="itinerary-card-content">
                <div class="itinerary-card-header">
                    <div class="itinerary-order">${index + 1}</div>
                    <div class="itinerary-card-title">
                        <h3>${itinerary.name}</h3>
                    </div>
                </div>
                <div class="itinerary-card-info">
                    <div class="itinerary-info-item">
                        <i class="fas fa-clock"></i>
                        <span class="info-label">拍攝時間</span>
                        <span class="info-value">${itinerary.time}</span>
                    </div>
                    </div>
                </div>
            </div>
        `;
        
        itineraryCardsContainer.appendChild(card);
    });
}

// Drag and drop for sorting
let draggedElement = null;

function handleDragStart(e) {
    draggedElement = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
}

function handleSortDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    if (this !== draggedElement) {
        this.classList.add('drag-over');
    }
}

function handleSortDrop(e) {
    e.preventDefault();
    this.classList.remove('drag-over');
    
    if (this !== draggedElement) {
        const fromIndex = parseInt(draggedElement.dataset.index);
        const toIndex = parseInt(this.dataset.index);
        
        // Swap photos in array
        const temp = appState.sortedPhotos[fromIndex];
        appState.sortedPhotos[fromIndex] = appState.sortedPhotos[toIndex];
        appState.sortedPhotos[toIndex] = temp;
        
        renderSortablePhotos();
    }
}

function handleDragEnd(e) {
    this.classList.remove('dragging');
    document.querySelectorAll('.drag-over').forEach(el => {
        el.classList.remove('drag-over');
    });
}

// Generate content
function generateContent() {
    if (loadingAnimation && generatedContent) {
        loadingAnimation.style.display = 'block';
        generatedContent.style.display = 'none';
        
        // Simulate AI generation
        setTimeout(() => {
            loadingAnimation.style.display = 'none';
            generatedContent.style.display = 'block';
            
            // Initialize map after content is displayed
            initializeMap();
        }, 2000);
    }
}

// Initialize map with Keelung two-day itinerary
function initializeMap() {
    // Keelung itinerary locations
    const itinerary = [
        // Day 1
        { lat: 25.1502699, lng: 121.7638044, name: '正濱漁港', day: 1, order: 1, time: '早上' },
        { lat: 25.1593173, lng: 121.7608679, name: '和平島考古遺跡', day: 1, order: 2, time: '下午' },
        { lat: 25.132058, lng: 121.7478555, name: '基隆主普壇', day: 1, order: 3, time: '傍晚' },
        
        // Day 2
        { lat: 25.1352379, lng: 121.7342084, name: 'KEELUNG地標', day: 2, order: 1, time: '早上' },
        { lat: 25.1282113, lng: 121.7408143, name: '基隆廟口夜市（陳記泡泡冰）', day: 2, order: 2, time: '中午' },
        { lat: 25.1290702, lng: 121.7414626, name: '基隆廟口夜市（肉圓）', day: 2, order: 3, time: '中午' },
        { lat: 25.1310671, lng: 121.7383402, name: '基隆中山陸橋', day: 2, order: 4, time: '下午' },
    ];
    
    // Calculate center and bounds
    const lats = itinerary.map(loc => loc.lat);
    const lngs = itinerary.map(loc => loc.lng);
    const centerLat = (Math.max(...lats) + Math.min(...lats)) / 2;
    const centerLng = (Math.max(...lngs) + Math.min(...lngs)) / 2;
    
    // Initialize map centered on Keelung
    const map = L.map('map').setView([centerLat, centerLng], 13);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
    }).addTo(map);
    
    // Custom icon function
    function createNumberIcon(number, day) {
        const color = day === 1 ? '#667eea' : '#f56565';
        return L.divIcon({
            className: 'custom-marker',
            html: `<div style="
                background-color: ${color};
                width: 32px;
                height: 32px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: bold;
                font-size: 14px;
                border: 3px solid white;
                box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            ">${number}</div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 16],
            popupAnchor: [0, -16]
        });
    }
    
    // Add markers and create polylines
    const day1Coords = [];
    const day2Coords = [];
    
    itinerary.forEach((location) => {
        const marker = L.marker([location.lat, location.lng], {
            icon: createNumberIcon(location.order, location.day)
        }).addTo(map);
        
        marker.bindPopup(`
            <div style="text-align: center;">
                <strong>${location.name}</strong><br>
                <small>第${location.day}天 - 第${location.order}站</small><br>
                <small>遊玩時間：${location.time}</small>
            </div>
        `);
        
        if (location.day === 1) {
            day1Coords.push([location.lat, location.lng]);
        } else {
            day2Coords.push([location.lat, location.lng]);
        }
    });
    
    // Draw route lines
    if (day1Coords.length > 0) {
        L.polyline(day1Coords, {
            color: '#667eea',
            weight: 3,
            opacity: 0.7,
            dashArray: '10, 5'
        }).addTo(map);
    }
    
    if (day2Coords.length > 0) {
        L.polyline(day2Coords, {
            color: '#f56565',
            weight: 3,
            opacity: 0.7,
            dashArray: '10, 5'
        }).addTo(map);
    }
    
    // Fit map to show all markers with padding
    const allCoords = [...day1Coords, ...day2Coords];
    if (allCoords.length > 0) {
        const bounds = L.latLngBounds(allCoords);
        map.fitBounds(bounds, { padding: [30, 30] });
    }
}

// Reset app
function resetApp() {
    appState = {
        currentStep: 1,
        uploadedPhotos: [],
        sortedPhotos: []
    };
    
    if (photoPreview) photoPreview.innerHTML = '';
    if (sortablePhotos) sortablePhotos.innerHTML = '';
    
    goToStep(1);
    updateNextButton();
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
            url = 'search.html';
            break;
        case 'account':
            url = 'account.html';
            break;
        default:
            url = page; // If it's already a URL
    }
    window.location.href = url;
}

// Set active navigation item based on current page
function setActiveNavItem(activePage = null) {
    const currentPage = activePage || window.location.pathname.split('/').pop() || 'index.html';
    const navItems = document.querySelectorAll('.nav-item');
    
    // Remove active class from all items
    navItems.forEach(item => item.classList.remove('active'));
    
    // Set active based on current page or provided parameter
    let targetPage = 'home'; // default
    
    if (activePage) {
        targetPage = activePage;
    } else {
        if (currentPage === 'index.html' || currentPage === '') {
            targetPage = 'home';
        } else if (currentPage === 'plan.html') {
            targetPage = 'plan';
        } else if (currentPage === 'write.html') {
            targetPage = 'write';
        } else if (currentPage === 'search.html') {
            targetPage = 'search';
        } else if (currentPage === 'account.html') {
            targetPage = 'account';
        }
    }
    
    // Add active class to current page item
    const activeItem = document.querySelector(`.nav-item[data-page="${targetPage}"]`);
    if (activeItem) {
        activeItem.classList.add('active');
    }
}