// App State
let itinerary = {
    title: '',
    startDate: '',
    endDate: '',
    days: []
};

let currentDayIndex = 0;
let currentSpotIndex = 0;

// DOM Elements
const tripTitle = document.getElementById('tripTitle');
const startDate = document.getElementById('startDate');
const endDate = document.getElementById('endDate');
const startPlanBtn = document.getElementById('startPlanBtn');
const timelineSection = document.getElementById('timelineSection');
const timelineContainer = document.getElementById('timelineContainer');
const addSpotModal = document.getElementById('addSpotModal');
const aiRecommendModal = document.getElementById('aiRecommendModal');
const clearAllBtn = document.getElementById('clearAllBtn');
const saveItineraryBtn = document.getElementById('saveItineraryBtn');
const confirmAddSpot = document.getElementById('confirmAddSpot');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Set demo data in form fields
    const demoDate = new Date('2025-10-26');
    tripTitle.value = '台北一日遊';
    startDate.valueAsDate = demoDate;
    endDate.valueAsDate = demoDate;
    
    // Initialize modal confirm button for add mode
    resetModalForAdd();
    
    // Event listeners
    startPlanBtn.addEventListener('click', startPlanning);
    clearAllBtn.addEventListener('click', clearAllSpots);
    saveItineraryBtn.addEventListener('click', saveItinerary);
    // confirmAddSpot uses onclick assignment in resetModalForAdd() to allow switching between add/edit modes
    
    // AI modal confirm button (removed - now auto-generates)
    // const confirmAiSpots = document.getElementById('confirmAiSpots');
    // if (confirmAiSpots) {
    //     confirmAiSpots.addEventListener('click', addSelectedAiSpots);
    // }
    
    // Close modal when clicking outside
    addSpotModal.addEventListener('click', function(e) {
        if (e.target === addSpotModal) {
            closeModal();
        }
    });
    
    aiRecommendModal.addEventListener('click', function(e) {
        if (e.target === aiRecommendModal) {
            closeAiModal();
        }
    });

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

// Start Planning
function startPlanning() {
    const title = tripTitle.value.trim();
    const start = startDate.value;
    const end = endDate.value;
    
    if (!title) {
        showMessage('請輸入旅遊標題', 'error');
        tripTitle.focus();
        return;
    }
    
    if (!start || !end) {
        showMessage('請選擇開始和結束日期', 'error');
        return;
    }
    
    if (new Date(start) > new Date(end)) {
        showMessage('結束日期必須在開始日期之後', 'error');
        return;
    }
    
    // Initialize itinerary
    itinerary.title = title;
    itinerary.startDate = start;
    itinerary.endDate = end;
    itinerary.days = [];
    
    // Calculate days
    const dayCount = calculateDaysBetween(start, end) + 1;
    
    // Create day structure
    for (let i = 0; i < dayCount; i++) {
        const date = new Date(start);
        date.setDate(date.getDate() + i);
        
        itinerary.days.push({
            dayNumber: i + 1,
            date: date.toISOString().split('T')[0],
            dateFormatted: formatDate(date),
            spots: [],
            isRainyMode: false
        });
    }
    
    // Show timeline section
    timelineSection.style.display = 'block';
    renderTimeline();
    
    // Smooth scroll to timeline
    setTimeout(() => {
        timelineSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

// Calculate days between dates
function calculateDaysBetween(start, end) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

// Format date
function formatDate(date) {
    const options = { month: 'long', day: 'numeric', weekday: 'short' };
    return date.toLocaleDateString('zh-TW', options);
}

// Render Timeline
function renderTimeline() {
    timelineContainer.innerHTML = '';
    
    if (itinerary.days.length === 0) {
        timelineContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-calendar-times"></i>
                <p>請先填寫旅遊資訊並開始規劃</p>
            </div>
        `;
        return;
    }
    
    itinerary.days.forEach((day, dayIndex) => {
        const dayGroup = createDayGroup(day, dayIndex);
        timelineContainer.appendChild(dayGroup);
    });
}

// Create Day Group
function createDayGroup(day, dayIndex) {
    const dayDiv = document.createElement('div');
    dayDiv.className = 'day-group';
    
    // Day header with rainy mode button
    const rainyModeClass = day.isRainyMode ? 'active' : '';
    const headerHTML = `
        <div class="day-header">
            <div class="day-header-left">
                <span class="day-badge">Day ${day.dayNumber}</span>
                <span class="day-date">${day.dateFormatted}</span>
            </div>
            <button class="day-weather-btn ${rainyModeClass}" onclick="toggleDayRainyMode(${dayIndex})" title="${day.isRainyMode ? '切換為晴天模式' : '切換為下雨模式'}">
                <i class="fas ${day.isRainyMode ? 'fa-cloud-rain' : 'fa-sun'}"></i>
            </button>
        </div>
    `;
    
    dayDiv.innerHTML = headerHTML;
    
    // Spots with insert buttons between them
    if (day.spots.length > 0) {
        day.spots.forEach((spot, spotIndex) => {
            // Add the spot element
            const spotElement = createSpotElement(spot, dayIndex, spotIndex);
            dayDiv.appendChild(spotElement);
            
            // Add insert buttons after each spot (except the last one)
            if (spotIndex < day.spots.length - 1) {
                const insertButtons = createInsertButtons(dayIndex, spotIndex + 1);
                dayDiv.appendChild(insertButtons);
            }
        });
    }
    
    // Add spot buttons at the end
    const addButtonsHTML = `
        <div class="add-spot-container">
            <button class="add-spot-btn manual" onclick="openAddSpotModal(${dayIndex}, ${day.spots.length})">
                <i class="fas fa-plus"></i>
                手動新增景點
            </button>
            <button class="add-spot-btn ai" onclick="openAiRecommendModal(${dayIndex}, ${day.spots.length})">
                <i class="fas fa-star"></i>
                AI 推薦景點
            </button>
        </div>
    `;
    
    dayDiv.innerHTML += addButtonsHTML;
    
    return dayDiv;
}

// Create Spot Element
function createSpotElement(spot, dayIndex, spotIndex) {
    const spotDiv = document.createElement('div');
    spotDiv.className = 'spot-item';
    
    // Add location badge (indoor/outdoor)
    const location = spot.location || 'outdoor';
    const locationBadge = location === 'indoor' 
        ? '<span class="location-badge indoor"><i class="fas fa-home"></i> 室內</span>'
        : '<span class="location-badge outdoor"><i class="fas fa-sun"></i> 室外</span>';
    
    // Add AI badge if this spot was AI recommended
    const aiBadge = spot.type === 'ai' ? '<span class="ai-badge"><i class="fas fa-star"></i> AI推薦</span>' : '';
    
    const noteHTML = spot.note ? `<div class="spot-note"><i class="fas fa-sticky-note"></i> ${spot.note}</div>` : '';
    
    spotDiv.innerHTML = `
        <div class="spot-content" onclick="viewSpotDetail(${dayIndex}, ${spotIndex})">
            <div class="spot-header">
                <div class="spot-name">
                    <i class="fas fa-map-marker-alt"></i>
                    ${spot.name}
                    ${locationBadge}
                    ${aiBadge}
                </div>
                <div class="spot-time">
                    <i class="fas fa-clock"></i>
                    ${spot.time}
                </div>
            </div>
            ${noteHTML}
        </div>
        <div class="spot-actions">
            <button class="spot-action-btn view" onclick="event.stopPropagation(); viewSpotDetail(${dayIndex}, ${spotIndex})">
                <i class="fas fa-eye"></i>
                查看
            </button>
            <button class="spot-action-btn edit" onclick="event.stopPropagation(); editSpot(${dayIndex}, ${spotIndex})">
                <i class="fas fa-edit"></i>
                編輯
            </button>
            <button class="spot-action-btn delete" onclick="event.stopPropagation(); deleteSpot(${dayIndex}, ${spotIndex})">
                <i class="fas fa-trash-alt"></i>
                刪除
            </button>
        </div>
    `;
    
    return spotDiv;
}

// Create Insert Buttons (between spots)
function createInsertButtons(dayIndex, insertAtIndex) {
    const buttonsDiv = document.createElement('div');
    buttonsDiv.className = 'insert-spot-container';
    buttonsDiv.innerHTML = `
        <div class="insert-divider">
            <div class="divider-line"></div>
            <div class="insert-buttons">
                <button class="insert-spot-btn manual" onclick="openAddSpotModal(${dayIndex}, ${insertAtIndex})" title="在此處插入景點">
                    <i class="fas fa-plus"></i>
                </button>
                <button class="insert-spot-btn ai" onclick="openAiRecommendModal(${dayIndex}, ${insertAtIndex})" title="AI推薦插入">
                    <i class="fas fa-star"></i>
                </button>
            </div>
            <div class="divider-line"></div>
        </div>
    `;
    return buttonsDiv;
}

// Open Add Spot Modal
function openAddSpotModal(dayIndex, insertAtIndex = -1) {
    currentDayIndex = dayIndex;
    currentSpotIndex = insertAtIndex; // Position to insert, -1 means append
    
    // Clear form
    document.getElementById('spotName').value = '';
    document.getElementById('spotTime').value = '09:00';
    document.getElementById('spotNote').value = '';
    
    // Set default time based on last spot
    const day = itinerary.days[dayIndex];
    if (day.spots.length > 0) {
        const lastSpot = day.spots[day.spots.length - 1];
        const lastTime = lastSpot.time;
        const [hours, minutes] = lastTime.split(':');
        const nextHour = (parseInt(hours) + 2) % 24;
        document.getElementById('spotTime').value = `${String(nextHour).padStart(2, '0')}:${minutes}`;
    }
    
    addSpotModal.classList.add('active');
}

// Close Modal
function closeModal() {
    addSpotModal.classList.remove('active');
    resetModalForAdd();
}

// Reset Modal for Add Mode
function resetModalForAdd() {
    document.querySelector('#addSpotModal .modal-header h3').textContent = '手動新增景點';
    const confirmBtn = document.getElementById('confirmAddSpot');
    confirmBtn.onclick = addManualSpot;
}

// Add Manual Spot
function addManualSpot() {
    const name = document.getElementById('spotName').value.trim();
    const time = document.getElementById('spotTime').value;
    const note = document.getElementById('spotNote').value.trim();
    const location = document.getElementById('spotLocation').value;
    
    if (!name) {
        showMessage('請輸入景點名稱', 'error');
        return;
    }
    
    const spot = {
        name: name,
        time: time,
        note: note,
        type: 'manual',
        location: location
    };
    
    // Insert at specific position or append if position is at the end
    if (currentSpotIndex === -1 || currentSpotIndex >= itinerary.days[currentDayIndex].spots.length) {
        itinerary.days[currentDayIndex].spots.push(spot);
    } else {
        itinerary.days[currentDayIndex].spots.splice(currentSpotIndex, 0, spot);
    }
    
    showMessage('景點已新增！', 'success');
    
    renderTimeline();
    closeModal();
}

// Open AI Recommend Modal
function openAiRecommendModal(dayIndex, insertAtIndex = -1) {
    currentDayIndex = dayIndex;
    currentSpotIndex = insertAtIndex; // Store insert position
    aiRecommendModal.classList.add('active');

    // Show loading (only aiLoading exists in HTML)
    document.getElementById('aiLoading').style.display = 'block';

    // Simulate AI processing and directly generate itinerary
    setTimeout(() => {
        generateAiItinerary(dayIndex, insertAtIndex);
    }, 2000);
}

// Generate AI Itinerary Directly
function generateAiItinerary(dayIndex, insertAtIndex) {
    try {
        console.log('Starting AI itinerary generation for day:', dayIndex, 'position:', insertAtIndex);

        // 檢查是否為 demo 模式（台北一日精華遊）
        const isDemoMode = itinerary.title === '台北一日精華遊' && 
                          itinerary.startDate === '2025-10-26';
        
        const day = itinerary.days[dayIndex];
        
        let selected = [];
        
        if (isDemoMode && typeof window.demoTripData !== 'undefined') {
            // Demo 模式：使用 demo-data.js 中的 AI 景點
            const demoAiSpots = window.demoTripData.days[0].spots.filter(spot => spot.type === 'ai');
            
            // 過濾掉已經存在的景點
            const existingNames = day.spots.map(s => s.name);
            const availableSpots = demoAiSpots.filter(s => !existingNames.includes(s.name));
            
            if (availableSpots.length === 0) {
                showMessage('所有 AI 推薦景點都已加入！', 'info');
                closeAiModal();
                return;
            }
            
            // 使用 demo 中的所有 AI 景點
            selected = JSON.parse(JSON.stringify(availableSpots)).map(spot => ({
                name: spot.name,
                type: 'AI推薦',
                description: spot.note || '精選景點',
                time: spot.time,
                duration: '2小時',
                location: spot.location,
                rainyAlternative: spot.rainyAlternative || null
            }));
            
        } else {
            // 一般模式：使用原有的隨機生成邏輯
            const recommendations = [
                {
                    name: '國立故宮博物院',
                    type: '文化景點',
                    description: '世界四大博物館之一，收藏豐富的中華文物',
                    time: '09:00',
                    duration: '2-3小時',
                    location: 'indoor'
                },
                {
                    name: '象山步道',
                    type: '自然景觀',
                    description: '欣賞台北101的最佳觀景點，適合登山健行',
                    time: '14:00',
                    duration: '2小時',
                    location: 'outdoor'
                },
                {
                    name: '士林夜市',
                    type: '美食',
                    description: '台北最大夜市，品嚐各式台灣小吃',
                    time: '18:00',
                    duration: '2小時',
                    location: 'outdoor'
                },
                {
                    name: '龍山寺',
                    type: '文化景點',
                    description: '台北香火最盛的寺廟，建築精美值得參觀',
                    time: '10:00',
                    duration: '1小時',
                    location: 'indoor'
                },
                {
                    name: '陽明山國家公園',
                    type: '自然景觀',
                    description: '台北近郊的天然花園，四季皆有不同美景',
                    time: '08:00',
                    duration: '半天',
                    location: 'outdoor'
                },
                {
                    name: '中正紀念堂',
                    type: '文化景點',
                    description: '台灣民主象徵，建築宏偉，衛兵交接表演精彩',
                    time: '11:00',
                    duration: '1.5小時',
                    location: 'outdoor'
                },
                {
                    name: '台北101',
                    type: '地標建築',
                    description: '曾經的世界最高大樓，觀景台視野絕佳',
                    time: '15:00',
                    duration: '2小時',
                    location: 'indoor'
                },
                {
                    name: '誠品書店信義店',
                    type: '文化景點',
                    description: '24小時營業的文化地標，書香與咖啡香交織',
                    time: '13:00',
                    duration: '2小時',
                    location: 'indoor'
                },
                {
                    name: '台北市立美術館',
                    type: '藝術景點',
                    description: '台灣現代藝術的重要展館',
                    time: '10:00',
                    duration: '2小時',
                    location: 'indoor'
                },
                {
                    name: '貓空纜車',
                    type: '交通景觀',
                    description: '搭乘纜車欣賞台北美景，品嚐茶香',
                    time: '14:00',
                    duration: '3小時',
                    location: 'outdoor'
                }
            ];

            // Shuffle and pick 3-4 recommendations
            const shuffled = recommendations.sort(() => 0.5 - Math.random());
            selected = shuffled.slice(0, Math.floor(Math.random() * 2) + 3); // 3-4個
        }

        console.log('Selected recommendations:', selected);

        // Sort by time to avoid conflicts (unless in demo mode with pre-defined times)
        if (!isDemoMode) {
            selected.sort((a, b) => a.time.localeCompare(b.time));
        }

        // Calculate proper times to avoid conflicts
        let insertPosition = insertAtIndex;

        console.log('Current day spots:', day.spots.length, 'Insert position:', insertPosition);

        // Adjust times based on insertion position
        if (insertPosition !== -1 && insertPosition < day.spots.length) {
            // Inserting between existing spots
            const prevSpot = insertPosition > 0 ? day.spots[insertPosition - 1] : null;
            const nextSpot = day.spots[insertPosition];

            if (prevSpot && nextSpot) {
                const prevTime = timeToMinutes(prevSpot.time);
                const nextTime = timeToMinutes(nextSpot.time);
                const availableMinutes = nextTime - prevTime;

                console.log('Available time between spots:', availableMinutes, 'minutes');

                // Calculate minimum time needed (each spot needs at least 90 minutes + buffer)
                const minTimePerSpot = 90; // 1.5 hours minimum per spot
                const bufferTime = 30; // 30 minutes buffer between spots
                const totalMinTime = selected.length * minTimePerSpot + (selected.length - 1) * bufferTime;

                if (availableMinutes >= totalMinTime) {
                    // Enough space: distribute spots with proper spacing
                    // Ensure we leave enough buffer for all spots before the next spot
                    const usableMinutes = availableMinutes - bufferTime;
                    const timeInterval = usableMinutes / selected.length;

                    selected.forEach((rec, index) => {
                        const newTime = prevTime + bufferTime + timeInterval * index;
                        // Double-check we don't exceed the next spot time
                        const maxAllowedTime = nextTime - bufferTime;
                        const finalTime = Math.min(newTime, maxAllowedTime);
                        rec.time = minutesToTime(Math.floor(finalTime));
                    });
                } else {
                    // Not enough space: try to fit as many as possible with minimal spacing
                    const minInterval = 60; // Minimum 1 hour between spots
                    const maxSpots = Math.floor((availableMinutes - bufferTime) / minInterval) + 1;

                    if (maxSpots >= 1) {
                        // Fit what we can, ensuring we don't exceed the time boundary
                        const spotsToAdd = Math.min(selected.length, maxSpots);
                        const remainingTime = availableMinutes - bufferTime;
                        const actualInterval = Math.max(minInterval, remainingTime / spotsToAdd);

                        selected.slice(0, spotsToAdd).forEach((rec, index) => {
                            const newTime = prevTime + bufferTime + actualInterval * index;
                            // Ensure we don't exceed the next spot time
                            const maxAllowedTime = nextTime - bufferTime;
                            const finalTime = Math.min(newTime, maxAllowedTime);
                            rec.time = minutesToTime(Math.floor(finalTime));
                        });

                        // Remove spots that couldn't fit
                        selected.splice(0, spotsToAdd);
                        console.log(`Only ${spotsToAdd} spots could fit in available time`);
                    } else {
                        // No space available, append to end instead
                        console.log('No space between spots, appending to end');
                        insertPosition = day.spots.length;
                        selected.forEach((rec, index) => {
                            if (day.spots.length > 0) {
                                const lastSpotTime = timeToMinutes(day.spots[day.spots.length - 1].time);
                                rec.time = minutesToTime(lastSpotTime + 120 * (index + 1));
                            }
                        });
                    }
                }
            } else if (prevSpot && !nextSpot) {
                // Inserting at the end - ensure proper spacing from last spot
                const lastTime = timeToMinutes(prevSpot.time);
                selected.forEach((rec, index) => {
                    // Start 2 hours after the last spot, with 1.5 hour intervals between new spots
                    rec.time = minutesToTime(lastTime + 120 + index * 90);
                });
            }
        } else {
            // Appending to end or inserting at beginning
            selected.forEach((rec, index) => {
                if (day.spots.length > 0) {
                    // Find the last spot's time and add proper spacing
                    const lastSpotTime = timeToMinutes(day.spots[day.spots.length - 1].time);
                    rec.time = minutesToTime(lastSpotTime + 120 + index * 90); // 2 hours after last + 1.5 hours between each
                }
                // If no spots exist, keep original times
            });
        }

        console.log('Adjusted times:', selected.map(s => ({ name: s.name, time: s.time })));

        // Final validation: ensure no spot exceeds the next existing spot when inserting between spots
        if (insertPosition !== -1 && insertPosition < day.spots.length && selected.length > 0) {
            const nextSpotTime = timeToMinutes(day.spots[insertPosition].time);
            selected.forEach((rec, index) => {
                const spotTime = timeToMinutes(rec.time);
                if (spotTime >= nextSpotTime) {
                    // Adjust this spot and all subsequent spots to fit
                    const adjustedTime = nextSpotTime - 90 - (selected.length - 1 - index) * 60; // Leave space for remaining spots
                    const prevSpotTime = index > 0 ? timeToMinutes(selected[index - 1].time) : (insertPosition > 0 ? timeToMinutes(day.spots[insertPosition - 1].time) : 9 * 60);
                    rec.time = minutesToTime(Math.max(adjustedTime, prevSpotTime + 60));
                }
            });
        }

        // Add spots to itinerary
        let addedCount = 0;
        if (insertPosition === -1 || insertPosition >= day.spots.length) {
            // Append to end
            selected.forEach((rec) => {
                // Adjust time if it conflicts with existing spots
                rec.time = findAvailableTime(day.spots, rec.time);

                const spot = {
                    name: rec.name,
                    time: rec.time,
                    note: rec.description ? `${rec.description} (停留時間：${rec.duration})` : rec.note || '',
                    type: 'ai',
                    location: rec.location || 'outdoor',
                    rainyAlternative: rec.rainyAlternative || null
                };

                day.spots.push(spot);
                addedCount++;
            });
        } else {
            // Insert at specific position - check for conflicts with adjacent spots
            selected.forEach((rec) => {
                let finalTime = rec.time;

                // Check conflict with previous spot
                if (insertPosition > 0) {
                    const prevSpotTime = timeToMinutes(day.spots[insertPosition - 1].time);
                    const currentTime = timeToMinutes(finalTime);
                    if (currentTime - prevSpotTime < 60) { // Less than 1 hour gap
                        finalTime = minutesToTime(prevSpotTime + 90); // Add 1.5 hours buffer
                    }
                }

                // Check conflict with next spot - ensure we don't exceed it
                if (insertPosition < day.spots.length) {
                    const nextSpotTime = timeToMinutes(day.spots[insertPosition].time);
                    const currentTime = timeToMinutes(finalTime);
                    if (currentTime >= nextSpotTime) { // If time exceeds next spot
                        finalTime = minutesToTime(nextSpotTime - 90); // Place 1.5 hours before next spot
                    } else if (nextSpotTime - currentTime < 60) { // Less than 1 hour gap
                        finalTime = minutesToTime(nextSpotTime - 90); // Place 1.5 hours before next spot
                    }
                }

                // Ensure final time is not negative or too early
                const finalTimeMinutes = timeToMinutes(finalTime);
                if (finalTimeMinutes < 0) {
                    finalTime = '09:00'; // Default to 9 AM if calculation went wrong
                }

                // Final check for any remaining conflicts
                finalTime = findAvailableTime(day.spots, finalTime);

                const spot = {
                    name: rec.name,
                    time: finalTime,
                    note: `${rec.description} (停留時間：${rec.duration})`,
                    type: 'ai',
                    location: rec.location || 'outdoor'
                };

                day.spots.splice(insertPosition, 0, spot);
                insertPosition++;
                addedCount++;
            });
        }

        console.log('Added', addedCount, 'spots to itinerary');

        // Close modal and show success
        closeAiModal();
        showMessage(`AI 已生成 ${addedCount} 個行程建議！`, 'success');
        renderTimeline();

        console.log('AI itinerary generation completed successfully');

    } catch (error) {
        console.error('Error in generateAiItinerary:', error);
        showMessage('AI 生成行程時發生錯誤，請重試', 'error');
        closeAiModal();
    }
}

// Helper function to convert time string to minutes
function timeToMinutes(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
}

// Helper function to convert minutes to time string
function minutesToTime(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

// Helper function to find available time slot
function findAvailableTime(existingSpots, preferredTime) {
    let time = timeToMinutes(preferredTime);
    const usedTimes = existingSpots.map(spot => timeToMinutes(spot.time));

    // Check if preferred time conflicts with existing spots (within 1 hour)
    let attempts = 0;
    while (attempts < 24) { // Try up to 24 hours
        let hasConflict = false;

        for (const usedTime of usedTimes) {
            if (Math.abs(time - usedTime) < 60) { // Within 1 hour of any existing spot
                hasConflict = true;
                break;
            }
        }

        if (!hasConflict) {
            break; // Found available time
        }

        time += 90; // Try 1.5 hours later
        attempts++;

        if (time >= 24 * 60) { // Past midnight, wrap to morning
            time = 9 * 60; // Start from 9 AM
        }
    }

    return minutesToTime(time);
}

// Close AI Modal
function closeAiModal() {
    aiRecommendModal.classList.remove('active');
}

// Edit Spot
function editSpot(dayIndex, spotIndex) {
    currentDayIndex = dayIndex;
    
    const spot = itinerary.days[dayIndex].spots[spotIndex];
    
    document.getElementById('spotName').value = spot.name;
    document.getElementById('spotTime').value = spot.time;
    document.getElementById('spotNote').value = spot.note || '';
    document.getElementById('spotLocation').value = spot.location || 'outdoor';
    
    // Store original spot for editing
    window.editingSpotIndex = spotIndex;
    
    // Change confirm button behavior
    const confirmBtn = document.getElementById('confirmAddSpot');
    confirmBtn.onclick = function() {
        updateExistingSpot(dayIndex, window.editingSpotIndex);
    };
    
    // Change modal title
    document.querySelector('#addSpotModal .modal-header h3').textContent = '編輯景點';
    
    addSpotModal.classList.add('active');
}

// Update Existing Spot
function updateExistingSpot(dayIndex, spotIndex) {
    const name = document.getElementById('spotName').value.trim();
    const time = document.getElementById('spotTime').value;
    const note = document.getElementById('spotNote').value.trim();
    const location = document.getElementById('spotLocation').value;
    
    if (!name) {
        showMessage('請輸入景點名稱', 'error');
        return;
    }
    
    const spot = {
        name: name,
        time: time,
        note: note,
        type: itinerary.days[dayIndex].spots[spotIndex].type,
        location: location
    };
    
    itinerary.days[dayIndex].spots[spotIndex] = spot;
    showMessage('景點已更新！', 'success');
    
    renderTimeline();
    closeModal();
    
    // Reset confirm button
    resetModalForAdd();
}

// View Spot Detail
function viewSpotDetail(dayIndex, spotIndex) {
    // Save current itinerary to localStorage
    localStorage.setItem('savedItinerary', JSON.stringify(itinerary));
    
    // Navigate to spot detail page with parameters
    window.location.href = `spot-detail.html?day=${dayIndex}&spot=${spotIndex}`;
}

// Delete Spot
function deleteSpot(dayIndex, spotIndex) {
    if (confirm('確定要刪除這個景點嗎？')) {
        const spotName = itinerary.days[dayIndex].spots[spotIndex].name;
        itinerary.days[dayIndex].spots.splice(spotIndex, 1);
        showMessage(`已刪除 ${spotName}`, 'success');
        renderTimeline();
    }
}

// Clear All Spots
function clearAllSpots() {
    if (confirm('確定要清除所有景點嗎？此操作無法復原。')) {
        itinerary.days.forEach(day => {
            day.spots = [];
        });
        renderTimeline();
        showMessage('已清除所有景點', 'success');
    }
}

// Save Itinerary
function saveItinerary() {
    // Check if there are any spots
    const totalSpots = itinerary.days.reduce((sum, day) => sum + day.spots.length, 0);
    
    if (totalSpots === 0) {
        showMessage('請先新增景點再儲存行程', 'error');
        return;
    }
    
    // Simulate saving
    showMessage('行程已儲存！', 'success');
    
    // Log itinerary to console (for demo)
    console.log('Saved Itinerary:', JSON.stringify(itinerary, null, 2));
    
    // Could implement actual save to localStorage or backend here
    localStorage.setItem('savedItinerary', JSON.stringify(itinerary));
}

// Show Message
function showMessage(message, type = 'success') {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'success-message';
    messageDiv.textContent = message;
    
    if (type === 'error') {
        messageDiv.style.background = '#fc8181';
    }
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        document.body.removeChild(messageDiv);
    }, 2000);
}

// Load saved itinerary on page load (optional)
function loadSavedItinerary() {
    const saved = localStorage.getItem('savedItinerary');
    if (saved) {
        try {
            const loaded = JSON.parse(saved);
            
            // Populate form
            tripTitle.value = loaded.title;
            startDate.value = loaded.startDate;
            endDate.value = loaded.endDate;
            
            // Ask user if they want to load
            if (confirm('發現已儲存的行程，要載入嗎？')) {
                itinerary = loaded;
                timelineSection.style.display = 'block';
                renderTimeline();
                showMessage('已載入儲存的行程', 'success');
            }
        } catch (e) {
            console.error('Failed to load saved itinerary:', e);
        }
    }
}

// Try to load saved itinerary on page load
setTimeout(loadSavedItinerary, 500);

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

// Indoor alternatives database (for spots without rainyAlternative data)
const indoorAlternatives = {
    '象山步道': '台北市立美術館',
    '陽明山國家公園': '誠品書店信義店',
    '中正紀念堂': '國立故宮博物院',
    '貓空纜車': '台北101觀景台',
    '士林夜市': '微風南山美食街',
    '大安森林公園': '誠品書店信義店',
    '臨江街觀光夜市': '台北101美食街',
    '戶外景點': '台北市立圖書館總館'
};

// Toggle Rainy Mode for a specific day
function toggleDayRainyMode(dayIndex) {
    const day = itinerary.days[dayIndex];
    day.isRainyMode = !day.isRainyMode;
    
    if (day.isRainyMode) {
        convertDayOutdoorToIndoor(dayIndex);
        showMessage(`Day ${day.dayNumber} 已切換為下雨模式，戶外景點已轉換為室內景點`, 'success');
    } else {
        restoreDayOriginalSpots(dayIndex);
        showMessage(`Day ${day.dayNumber} 已切換為晴天模式`, 'success');
    }
    
    renderTimeline();
}

// Convert outdoor spots to indoor alternatives for a specific day
function convertDayOutdoorToIndoor(dayIndex) {
    const day = itinerary.days[dayIndex];
    let changedCount = 0;
    
    day.spots.forEach((spot) => {
        if (spot.location === 'outdoor') {
            // Save original name if not already saved
            if (!spot.originalName) {
                spot.originalName = spot.name;
                spot.originalNote = spot.note || '';
            }
            
            // Convert to indoor alternative
            const indoorAlternative = indoorAlternatives[spot.originalName] || indoorAlternatives['戶外景點'];
            spot.name = indoorAlternative;
            spot.location = 'indoor';
            spot.note = spot.originalNote ? `${spot.originalNote} (原為: ${spot.originalName})` : `原為: ${spot.originalName}`;
            changedCount++;
        }
    });
    
    console.log(`Converted ${changedCount} outdoor spots to indoor alternatives for day ${dayIndex + 1}`);
}

// Restore original outdoor spots for a specific day
function restoreDayOriginalSpots(dayIndex) {
    const day = itinerary.days[dayIndex];
    let restoredCount = 0;
    
    day.spots.forEach((spot) => {
        if (spot.originalName) {
            // Restore original name and location
            spot.name = spot.originalName;
            spot.location = 'outdoor';
            spot.note = spot.originalNote || '';
            delete spot.originalName;
            delete spot.originalNote;
            restoredCount++;
        }
    });
    
    console.log(`Restored ${restoredCount} spots to original outdoor locations for day ${dayIndex + 1}`);
}
