// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Add smooth scroll behavior
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add animation on scroll
    observeElements();
    
    // Update stats with animation
    animateStats();
    
    // Add touch feedback for cards
    addTouchFeedback();
    
    // Set active navigation item
    setActiveNavItem();
    
    // Add click handlers to navigation items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            const page = this.dataset.page;
            navigateTo(page);
        });
    });
}

// Set active navigation item based on current page
function setActiveNavItem() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navItems = document.querySelectorAll('.nav-item');
    
    // Remove active class from all items
    navItems.forEach(item => item.classList.remove('active'));
    
    // Set active based on current page
    let activePage = 'home'; // default
    
    if (currentPage === 'index.html' || currentPage === '') {
        activePage = 'home';
    } else if (currentPage === 'plan.html') {
        activePage = 'plan';
    } else if (currentPage === 'write.html') {
        activePage = 'write';
    } else if (currentPage === 'search.html') {
        activePage = 'search';
    } else if (currentPage === 'account.html') {
        activePage = 'account';
    }
    
    // Add active class to current page item
    const activeItem = document.querySelector(`.nav-item[data-page="${activePage}"]`);
    if (activeItem) {
        activeItem.classList.add('active');
    }
}

// Observe elements for animation
function observeElements() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all animated elements
    const animatedElements = document.querySelectorAll('.feature-card, .stat-card, .tip-item');
    animatedElements.forEach(el => observer.observe(el));
}

// Animate stats numbers
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach((stat, index) => {
        const text = stat.textContent;
        const isPercentage = text.includes('%');
        const targetNumber = parseInt(text.replace(/,/g, '').replace('%', ''));
        
        if (isNaN(targetNumber)) return;
        
        let currentNumber = 0;
        const increment = targetNumber / 50; // 50 steps
        const duration = 1500; // 1.5 seconds
        const stepTime = duration / 50;
        
        // Start animation after a delay based on index
        setTimeout(() => {
            const timer = setInterval(() => {
                currentNumber += increment;
                
                if (currentNumber >= targetNumber) {
                    currentNumber = targetNumber;
                    clearInterval(timer);
                }
                
                if (isPercentage) {
                    stat.textContent = Math.floor(currentNumber) + '%';
                } else {
                    stat.textContent = formatNumber(Math.floor(currentNumber));
                }
            }, stepTime);
        }, index * 200);
    });
}

// Format number with commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Add touch feedback
function addTouchFeedback() {
    const cards = document.querySelectorAll('.feature-card:not(.coming-soon)');
    
    cards.forEach(card => {
        // Mouse events
        card.addEventListener('mousedown', function() {
            this.style.transform = 'scale(0.98)';
        });
        
        card.addEventListener('mouseup', function() {
            this.style.transform = '';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
        
        // Touch events
        card.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        }, { passive: true });
        
        card.addEventListener('touchend', function() {
            this.style.transform = '';
        }, { passive: true });
    });
}

// Menu button functionality
const menuBtn = document.querySelector('.menu-btn');
if (menuBtn) {
    menuBtn.addEventListener('click', function() {
        showMenuOptions();
    });
}

function showMenuOptions() {
    // Create simple alert for demo
    const options = [
        '設定',
        '關於我們',
        '使用說明',
        '意見回饋'
    ];
    
    alert('選單選項（Demo）：\n\n' + options.join('\n'));
}

// Add page load animation
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Handle coming soon cards
const comingSoonCards = document.querySelectorAll('.feature-card.coming-soon');
comingSoonCards.forEach(card => {
    card.addEventListener('click', function(e) {
        e.preventDefault();
        showComingSoonMessage();
    });
});

function showComingSoonMessage() {
    const message = document.createElement('div');
    message.className = 'coming-soon-message';
    message.innerHTML = `
        <div class="message-content">
            <i class="fas fa-rocket"></i>
            <h3>即將推出！</h3>
            <p>這個功能正在開發中，敬請期待</p>
        </div>
    `;
    
    // Add styles
    message.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;
    
    const messageContent = message.querySelector('.message-content');
    messageContent.style.cssText = `
        background: white;
        padding: 40px 30px;
        border-radius: 16px;
        text-align: center;
        max-width: 300px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        animation: slideUp 0.3s ease;
    `;
    
    document.body.appendChild(message);
    
    // Remove message when clicked
    message.addEventListener('click', function() {
        document.body.removeChild(message);
    });
    
    // Auto remove after 2 seconds
    setTimeout(() => {
        if (document.body.contains(message)) {
            document.body.removeChild(message);
        }
    }, 2000);
}

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Press 'P' for planning
    if (e.key === 'p' || e.key === 'P') {
        if (!e.ctrlKey && !e.metaKey) {
            navigateTo('plan.html');
        }
    }
    
    // Press 'W' for writing
    if (e.key === 'w' || e.key === 'W') {
        if (!e.ctrlKey && !e.metaKey) {
            navigateTo('write.html');
        }
    }
    
    // Press 'Esc' to scroll to top
    if (e.key === 'Escape') {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
});

// Easter egg - Konami code
let konamiCode = [];
const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', function(e) {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join(',') === konamiPattern.join(',')) {
        activateEasterEgg();
        konamiCode = [];
    }
});

function activateEasterEgg() {
    // Add fun animation to all feature cards
    const cards = document.querySelectorAll('.feature-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.animation = 'none';
            setTimeout(() => {
                card.style.animation = '';
                card.style.transform = 'rotate(360deg) scale(1.1)';
                setTimeout(() => {
                    card.style.transform = '';
                }, 500);
            }, 10);
        }, index * 200);
    });
    
    // Show secret message
    alert('🎉 恭喜你發現彩蛋！你是一位真正的探險家！');
}

// Performance monitoring
function logPerformance() {
    if (window.performance) {
        const perfData = window.performance.timing;
        const loadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`✈️ Travel Companion 載入時間: ${loadTime}ms`);
    }
}

window.addEventListener('load', logPerformance);

// Error handling
window.addEventListener('error', function(e) {
    console.error('❌ 應用程式錯誤:', e.error);
});

// Check for updates (demo)
function checkForUpdates() {
    // Simulate checking for updates
    const hasUpdate = Math.random() > 0.8;
    
    if (hasUpdate) {
        console.log('🔄 有新版本可用！');
    }
}

setTimeout(checkForUpdates, 3000);

// Console welcome message
console.log('%c✈️ Travel Companion', 'color: #667eea; font-size: 24px; font-weight: bold;');
console.log('%c歡迎使用旅遊助手！', 'color: #718096; font-size: 14px;');
console.log('%c快捷鍵：P = 行程規劃 | W = 文案生成', 'color: #718096; font-size: 12px;');

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
