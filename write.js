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

// Render sortable photos
function renderSortablePhotos() {
    if (!sortablePhotos) return;
    
    sortablePhotos.innerHTML = '';
    appState.sortedPhotos = [...appState.uploadedPhotos];
    
    appState.sortedPhotos.forEach((photo, index) => {
        const sortableItem = document.createElement('div');
        sortableItem.className = 'sortable-item';
        sortableItem.draggable = true;
        sortableItem.dataset.index = index;
        
        sortableItem.innerHTML = `
            <img src="${photo.src}" alt="Photo ${index + 1}">
            <div class="photo-order">${index + 1}</div>
            <div class="drag-handle">
                <i class="fas fa-grip-vertical"></i>
            </div>
        `;
        
        // Add drag event listeners
        sortableItem.addEventListener('dragstart', handleDragStart);
        sortableItem.addEventListener('dragover', handleSortDragOver);
        sortableItem.addEventListener('drop', handleSortDrop);
        sortableItem.addEventListener('dragend', handleDragEnd);
        
        sortablePhotos.appendChild(sortableItem);
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
        }, 2000);
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