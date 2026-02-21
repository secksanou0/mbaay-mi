// JavaScript for index.html (Accueil page)

document.addEventListener('DOMContentLoaded', function() {
    // Initialize subscription count from localStorage
    initializeSubscriptionCount();
    
    // Animate stats counter
    animateStatsCounter();
    
    // Initialize any interactive features
    initializeInteractiveFeatures();
});

// Initialize subscription count from localStorage
function initializeSubscriptionCount() {
    const abonnesCountElement = document.getElementById('abonnes-count');
    if (!abonnesCountElement) return;
    
    // Get subscription count from localStorage or use default
    const totalSubscriptions = localStorage.getItem('mbaaymi_total_subscriptions') || 245;
    abonnesCountElement.textContent = totalSubscriptions;
}

// Animate stats counter
function animateStatsCounter() {
    const statsElements = document.querySelectorAll('.stat-item h3');
    
    statsElements.forEach(element => {
        const finalValue = parseInt(element.textContent);
        if (isNaN(finalValue)) return;
        
        let currentValue = 0;
        const increment = finalValue / 50; // Adjust speed
        const timer = setInterval(() => {
            currentValue += increment;
            if (currentValue >= finalValue) {
                currentValue = finalValue;
                clearInterval(timer);
            }
            element.textContent = Math.floor(currentValue);
        }, 30);
    });
}

// Initialize interactive features
function initializeInteractiveFeatures() {
    // Feature cards hover effect enhancement
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Update subscription count in real-time
    window.addEventListener('storage', function(e) {
        if (e.key === 'mbaaymi_total_subscriptions') {
            const abonnesCountElement = document.getElementById('abonnes-count');
            if (abonnesCountElement) {
                const newValue = e.newValue || 245;
                animateValue(abonnesCountElement, parseInt(abonnesCountElement.textContent), newValue);
            }
        }
    });
}

// Animate value change
function animateValue(element, start, end, duration = 1000) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const currentValue = Math.floor(progress * (end - start) + start);
        element.textContent = currentValue;
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Simulate subscription update (for testing)
function simulateSubscriptionUpdate() {
    const currentCount = parseInt(localStorage.getItem('mbaaymi_total_subscriptions') || 245);
    const newCount = currentCount + Math.floor(Math.random() * 5) + 1;
    localStorage.setItem('mbaaymi_total_subscriptions', newCount);
    
    // Dispatch storage event to update all tabs
    window.dispatchEvent(new StorageEvent('storage', {
        key: 'mbaaymi_total_subscriptions',
        newValue: newCount.toString()
    }));
    
    return newCount;
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeSubscriptionCount,
        animateStatsCounter,
        simulateSubscriptionUpdate
    };
}