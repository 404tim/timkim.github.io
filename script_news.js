document.addEventListener('DOMContentLoaded', () => {
    // Получение сохраненного языка из localStorage или установка английского по умолчанию
    let currentLang = localStorage.getItem('lang') || 'en';
    let translations = {};
  
    // Загрузка переводов из JSON файла
    fetch('lang_news.json')
      .then(response => response.json())
      .then(data => {
        translations = data;
        applyLanguage(currentLang);
        initLanguageUI();
      })
      .catch(error => {
        console.error('Error loading translations:', error);
      });
  
    // Инициализация элементов интерфейса, связанных с языком
    function initLanguageUI() {
      // Установка текущего языка в кнопку переключения
      document.querySelector('.lang-btn').textContent = currentLang.toUpperCase();
      
      // Обработчики событий для переключения языка
      document.querySelectorAll('.lang-menu li').forEach(item => {
        item.addEventListener('click', () => {
          currentLang = item.dataset.lang;
          localStorage.setItem('lang', currentLang);
          document.querySelector('.lang-btn').textContent = currentLang.toUpperCase();
          applyLanguage(currentLang);
        });
      });
  
      // Показать/скрыть меню выбора языка
      document.querySelector('.lang-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        document.querySelector('.lang-menu').classList.toggle('show');
      });
  
      // Скрыть меню языка при клике вне его
      document.addEventListener('click', () => {
        document.querySelector('.lang-menu').classList.remove('show');
      });
    }
  
    // Применение переводов ко всем элементам с атрибутом data-lang-key
    function applyLanguage(lang) {
      document.querySelectorAll('[data-lang-key]').forEach(element => {
        const key = element.getAttribute('data-lang-key');
        
        if (translations[lang] && translations[lang][key]) {
          // Применяем перевод в зависимости от типа элемента
          if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
            if (element.type === 'placeholder') {
              element.placeholder = translations[lang][key];
            } else {
              element.value = translations[lang][key];
            }
          } else if (element.hasAttribute('title')) {
            element.title = translations[lang][key];
          } else if (element.tagName === 'META' && element.getAttribute('name') === 'description') {
            element.setAttribute('content', translations[lang][key]);
          } else {
            element.textContent = translations[lang][key];
          }
        }
      });
      
      // Если есть заголовок страницы для перевода, обновляем его
      if (translations[lang]['page.title']) {
        document.title = translations[lang]['page.title'];
      }
    }
    
    // ------------------- Existing Accordion Functionality -------------------
    
    // Работа аккордеона
    document.querySelectorAll('.accordion-item').forEach(item => {
        item.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('active'));
            if (!isActive) item.classList.add('active');
        });
    });

    // Additional function reference from original script
    if (typeof initSpeedometers === 'function') {
        initSpeedometers(); // Запуск анимации при загрузке
    }
});