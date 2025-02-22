document.addEventListener('DOMContentLoaded', function() {
    loadTranslations().then(() => {
        setupLanguageSwitcher();
    });
    let translations = {};
    let currentLang = localStorage.getItem('selectedLanguage') || 'en';

    // Загрузка переводов из JSON файла
    async function loadTranslations() {
        try {
            const response = await fetch('lang_contact.json');
            translations = await response.json();
            applyTranslations();
        } catch (error) {
            console.error('Error loading translations:', error);
        }
    }

    // Применение переводов на странице
    function applyTranslations() {
        // Обновляем кнопку выбора языка
        const langBtn = document.querySelector('.lang-btn');
        if (langBtn) {
            langBtn.textContent = currentLang.toUpperCase();
    }
    
    // Применяем переводы ко всем элементам с data-lang-key
    const elements = document.querySelectorAll('[data-lang-key]');
    elements.forEach(element => {
        const key = element.getAttribute('data-lang-key');
        if (translations[currentLang] && translations[currentLang][key]) {
            // Специальная обработка для элементов с HTML
            if (key.includes('.value') && translations[currentLang][key].includes('<br>')) {
                element.innerHTML = translations[currentLang][key];
            } else {
                element.textContent = translations[currentLang][key];
            }
        }
    });
    
    // Обновляем заголовок страницы
    if (translations[currentLang]["page.title"]) {
        document.title = translations[currentLang]["page.title"];
    }
    
    // Устанавливаем атрибут lang для HTML
    document.documentElement.lang = currentLang;
    
    // Обновляем подсказки формы
    updateFormAttributes();
    }

    // Обновляем атрибуты формы в зависимости от языка
    function updateFormAttributes() {
        const emailInput = document.getElementById('email');
        const phoneInput = document.getElementById('phone');
        
        if (emailInput) {
            emailInput.title = currentLang === 'en' 
                ? 'Please enter a valid email (e.g., user@example.com)'
                : 'Пожалуйста, введите корректный email (например, user@example.com)';
        }
        
        if (phoneInput) {
            phoneInput.title = currentLang === 'en'
                ? 'Phone format: +countrycodenumber (e.g. +4915112345678)'
                : 'Формат телефона: +кодстраныномер (например, +4915112345678)';
        }
    }

    // Настройка переключателя языка
    function setupLanguageSwitcher() {
        const langItems = document.querySelectorAll('.lang-menu li');
        const langBtn = document.querySelector('.lang-btn');
        const langMenu = document.querySelector('.lang-menu');
        
        // Открытие/закрытие меню
        if (langBtn && langMenu) {
            langBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                langMenu.style.display = langMenu.style.display === 'block' ? 'none' : 'block';
            });
        }
    
    // Выбор языка
    langItems.forEach(item => {
        item.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            currentLang = lang;
            localStorage.setItem('selectedLanguage', lang);
            
            // Скрываем меню
            if (langMenu) {
                langMenu.style.display = 'none';
            }
            
            // Применяем переводы
            applyTranslations();
        });
    });
    
    // Закрытие меню при клике вне его
    document.addEventListener('click', function(event) {
        if (langBtn && langMenu && !langBtn.contains(event.target) && !langMenu.contains(event.target)) {
            langMenu.style.display = 'none';
        }
    });
    }

    // Экспорт функции получения перевода для использования в других скриптах
    function getTranslation(key) {
        if (translations[currentLang] && translations[currentLang][key]) {
            return translations[currentLang][key];
        }
        return '';
    }



    const form = document.querySelector('form');
    const phoneInput = document.getElementById('phone');
    const emailInput = document.getElementById('email');

    // Функция для получения текущего языка
    function getCurrentLang() {
        return localStorage.getItem('selectedLanguage') || 'en';
    }

    // Функция для получения перевода
    function getTranslationText(key) {
        // Используем глобальную функцию из language.js, если она доступна
        if (typeof getTranslation === 'function') {
            return getTranslation(key);
        }
        
        // Запасной вариант, если translations доступен глобально
        if (window.translations && window.translations[getCurrentLang()] && 
            window.translations[getCurrentLang()][key]) {
            return window.translations[getCurrentLang()][key];
        }
        
        // По умолчанию используем английские сообщения
        const defaultMessages = {
            'validation.required': 'This field is required',
            'validation.email': 'Please enter a valid email address',
            'validation.phone.pattern': 'Invalid phone format. Must start with + and country code',
            'validation.phone.format': 'Invalid format. Example: +1234567890'
        };
        return defaultMessages[key] || '';
    }

    // Переопределяем стандартные сообщения валидации
    document.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('invalid', function(e) {
            e.preventDefault();
            
            if (this.validity.valueMissing) {
                setError(this, getTranslationText('validation.required'));
            } else if (this.type === 'email' && this.validity.typeMismatch) {
                setError(this, getTranslationText('validation.email'));
            } else if (this.id === 'phone' && this.validity.patternMismatch) {
                setError(this, getTranslationText('validation.phone.pattern'));
            }
        });

        input.addEventListener('input', function() {
            if (this.checkValidity()) {
                clearError(this);
            }
        });
    });
    
    // Custom validation messages
    function setError(input, message) {
        const errorElement = input.nextElementSibling;
        if (errorElement && errorElement.classList.contains('error-message')) {
            errorElement.textContent = message;
        } else {
            const error = document.createElement('div');
            error.className = 'error-message';
            error.textContent = message;
            input.parentNode.insertBefore(error, input.nextSibling);
        }
        input.classList.add('invalid');
    }

    function clearError(input) {
        const errorElement = input.nextElementSibling;
        if (errorElement && errorElement.classList.contains('error-message')) {
            errorElement.remove();
        }
        input.classList.remove('invalid');
    }

    // Phone validation
    function validatePhone(phone) {
        const regex = /^\+[0-9]{1,3}[0-9]{7,14}$/;
        return regex.test(phone);
    }

    // Email validation
    function validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    // Real-time validation
    phoneInput.addEventListener('input', function() {
        if (this.value && !validatePhone(this.value)) {
            setError(this, getTranslationText('validation.phone.format'));
        } else {
            clearError(this);
        }
    });

    emailInput.addEventListener('input', function() {
        if (this.value && !validateEmail(this.value)) {
            setError(this, getTranslationText('validation.email'));
        } else {
            clearError(this);
        }
    });

    // Form submission handler
    form.addEventListener('submit', function(e) {
        let isValid = true;

        // Validate required fields
        document.querySelectorAll('[required]').forEach(input => {
            if (!input.value.trim()) {
                setError(input, getTranslationText('validation.required'));
                isValid = false;
            }
        });

        // Validate phone
        if (phoneInput.value && !validatePhone(phoneInput.value)) {
            setError(phoneInput, getTranslationText('validation.phone.pattern'));
            isValid = false;
        }

        // Validate email
        if (emailInput.value && !validateEmail(emailInput.value)) {
            setError(emailInput, getTranslationText('validation.email'));
            isValid = false;
        }

        if (!isValid) {
            e.preventDefault();
        }
    });
});