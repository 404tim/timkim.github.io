document.addEventListener('DOMContentLoaded', () => {
    // Get saved language from localStorage or set English as default
    let currentLang = localStorage.getItem('lang') || 'en';
    let translations = {};

    // Load translations from JSON file
    fetch('lang_review.json')
        .then(response => response.json())
        .then(data => {
            translations = data;
            applyLanguage(currentLang);
            initLanguageUI();
        })
        .catch(error => {
            console.error('Error loading translations:', error);
        });

    // Initialize language-related UI elements
    function initLanguageUI() {
        // Set current language in toggle button
        document.querySelector('.lang-btn').textContent = currentLang.toUpperCase();
        
        // Event handlers for language switching
        document.querySelectorAll('.lang-menu li').forEach(item => {
            item.addEventListener('click', () => {
                currentLang = item.dataset.lang;
                localStorage.setItem('lang', currentLang);
                document.querySelector('.lang-btn').textContent = currentLang.toUpperCase();
                applyLanguage(currentLang);
            });
        });

        // Show/hide language selection menu
        document.querySelector('.lang-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            document.querySelector('.lang-menu').classList.toggle('show');
        });

        // Hide language menu when clicking outside
        document.addEventListener('click', () => {
            document.querySelector('.lang-menu').classList.remove('show');
        });
    }

    // Apply translations to all elements with data-lang-key attribute
    function applyLanguage(lang) {
        document.querySelectorAll('[data-lang-key]').forEach(element => {
            const key = element.getAttribute('data-lang-key');
            
            if (translations[lang] && translations[lang][key]) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    if (element.hasAttribute('placeholder')) {
                        element.placeholder = translations[lang][key];
                    } else {
                        element.value = translations[lang][key];
                    }
                } else if (element.hasAttribute('title')) {
                    element.title = translations[lang][key];
                } else if (element.tagName === 'META' && element.getAttribute('name') === 'description') {
                    element.setAttribute('content', translations[lang][key]);
                } else {
                    element.innerHTML = translations[lang][key];
                }
            }
        });
        
        // Update page title if translation exists
        if (translations[lang]['page.title']) {
            document.title = translations[lang]['page.title'];
        }
    }
});

// Existing calculator functionality
function calculateSavings() {
    const power = parseFloat(document.getElementById('power').value);
    const cost = parseFloat(document.getElementById('cost').value);
    const area = parseFloat(document.getElementById('area').value);

    if (!power || !cost || !area) {
        const currentLang = localStorage.getItem('lang') || 'en';
        const translations = {
            en: "Please fill in all fields",
            ru: "Пожалуйста, заполните все поля"
        };
        alert(translations[currentLang]);
        return;
    }

    const months = [
        {name: "Январь",    hours: 31 * 24, temp: 0},
        {name: "Февраль",   hours: 28 * 24, temp: 2},
        {name: "Март",      hours: 31 * 24, temp: 6},
        {name: "Апрель",    hours: 30 * 24, temp: 10},
        {name: "Май",       hours: 31 * 24, temp: 15},
        {name: "Июнь",      hours: 30 * 24, temp: 17},
        {name: "Июль",      hours: 31 * 24, temp: 18},
        {name: "Август",    hours: 31 * 24, temp: 18},
        {name: "Сентябрь",  hours: 30 * 24, temp: 14},
        {name: "Октябрь",   hours: 31 * 24, temp: 10},
        {name: "Ноябрь",    hours: 30 * 24, temp: 5},
        {name: "Декабрь",   hours: 31 * 24, temp: 1}
    ];

    const K = power * (area / 100) / 23;
    let totalSavedKwh = 0;

    months.forEach(m => {
        const diff = Math.max(23 - m.temp, 0);
        let savingPerHour;

        if (diff > 5) {
            savingPerHour = K * (80 / 24);
        } else {
            savingPerHour = K * ((16 / 24) * diff);
        }

        totalSavedKwh += savingPerHour * m.hours;
    });

    const savingEuros = totalSavedKwh * cost;
    animateResult(savingEuros);
}

function animateResult(finalValue) {
    const resultText = document.querySelector('.result-text');
    const progressRing = document.querySelector('.ring-progress');
    let current = 0;
    const duration = 3000;
    const startTime = Date.now();

    progressRing.style.strokeDashoffset = '283';
    progressRing.style.transition = 'none';
    progressRing.getBoundingClientRect(); // Trigger reflow
    progressRing.style.transition = 'stroke-dashoffset 3s ease-out';
    progressRing.style.strokeDashoffset = '0';

    function update() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        current = finalValue * progress;
        resultText.textContent = `${current.toFixed(2)}€`;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            resultText.textContent = `${finalValue.toFixed(2)}€`;
        }
    }

    requestAnimationFrame(update);
}