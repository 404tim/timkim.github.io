document.addEventListener('DOMContentLoaded', () => {
    // Получение сохраненного языка из localStorage или установка английского по умолчанию
    let currentLang = localStorage.getItem('lang') || 'en';
    let translations = {};
  
    // Загрузка переводов из JSON файла
    fetch('lang_calc.json')
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
            currentLang = item.getAttribute('data-lang'); // Явное получение атрибута
            localStorage.setItem('lang', currentLang);
            document.querySelector('.lang-btn').textContent = currentLang.toUpperCase();
            applyLanguage(currentLang);
            document.querySelector('.lang-menu').classList.remove('show');
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
  
    // Применение переводов ко всем элементам
    function applyLanguage(lang) {
        document.querySelectorAll('[data-lang-key]').forEach(element => {
            const key = element.getAttribute('data-lang-key');
            const translation = translations[lang][key]; // Прямой доступ по полному ключу
    
            if (translation) {
                if (element.tagName === 'INPUT' && element.type === 'number') {
                    element.placeholder = translation;
                } else if (element.tagName === 'OPTION') {
                    element.textContent = translation;
                } else {
                    element.textContent = translation;
                }
            }
        });
    
        // Обновление title страницы
        document.title = translations[lang]['page.title'];
    }
  
    // Коэффициенты теплопередачи (U) для различных конструкций (Вт/м²·°C)
    const U_VALUES = {
      // Стены
      brickWall1800: 1.8, // Кирпичная стена, плотность 1800 кг/м³
      brickWall1600: 1.4, // Кирпичная стена, плотность 1600 кг/м³
      brickWall1200: 0.8, // Кирпичная стена, плотность 1200 кг/м³
      reinforcedConcrete: 1.7, // Железобетон
      lightweightConcrete1800: 0.8, // Керамзитобетон, плотность 1800 кг/м³
      lightweightConcrete500: 0.14, // Керамзитобетон, плотность 500 кг/м³
  
      // Полы
      concreteFloor: 1.4, // Бетонный пол (среднее значение)
      woodenFloorPine: 0.13, // Деревянный пол (сосна или ель, поперек волокон)
      woodenFloorOak: 0.1, // Деревянный пол (дуб, поперек волокон)
      insulatedConcreteFloor: 0.39 // Бетонный пол с утеплением 
    };
  
    // Функция для расчета теплопотерь через конструкцию
    function calculateHeatLoss(area, deltaT, uValue) {
      return area * deltaT * uValue;
    }
  
    // Основная функция для расчета необходимой мощности отопительного оборудования
    function calculateHeatingPower({
      area,
      height,
      windowArea,
      windowLayers,
      outsideTemp,
      insideTemp,
      wallArea,
      wallType,
      floorArea,
      floorType,
      safetyFactor = 1.2
    }) {
      const volume = area * height;
      const deltaT = insideTemp - outsideTemp;
  
      // Определение коэффициента теплопередачи для окон
      let glazingU;
      switch (windowLayers) {
        case '1':
          glazingU = 2.8; // Однокамерный стеклопакет
          break;
        case '2':
          glazingU = 1.1; // Двухкамерный стеклопакет
          break;
        case '3':
          glazingU = 0.6; // Трехкамерный стеклопакет
          break;
        default:
          throw new Error('Invalid glazing type');
      }
  
      // Определение коэффициента теплопередачи для стен
      const wallU = U_VALUES[wallType];
      if (!wallU) {
        throw new Error('Invalid wall type');
      }
  
      // Определение коэффициента теплопередачи для пола
      const floorU = U_VALUES[floorType];
      if (!floorU) {
        throw new Error('Invalid floor type');
      }
  
      // Расчет теплопотерь через окна
      const windowHeatLoss = calculateHeatLoss(windowArea, deltaT, glazingU);
  
      // Расчет теплопотерь через стены
      const wallHeatLoss = calculateHeatLoss(wallArea, deltaT, wallU);
  
      // Расчет теплопотерь через пол
      const floorHeatLoss = calculateHeatLoss(floorArea, deltaT, floorU);
  
      // Суммарные теплопотери
      const totalHeatLoss = windowHeatLoss + wallHeatLoss + floorHeatLoss;
  
      // Необходимая мощность отопительного оборудования с учетом коэффициента запаса
      const requiredPower = totalHeatLoss * safetyFactor;
  
      return requiredPower; // Вт
    }
  
    // Обработчик клика для кнопки расчета
    document.getElementById('calculateButton').addEventListener('click', () => {
      const area = parseFloat(document.getElementById('area').value);
      const height = parseFloat(document.getElementById('height').value);
      const windowArea = parseFloat(document.getElementById('windowArea').value);
      const windowLayers = document.getElementById('windowLayers').value;
      const outsideTemp = parseFloat(document.getElementById('outsideTemp').value);
      const insideTemp = parseFloat(document.getElementById('insideTemp').value);
      const wallType = document.getElementById('wallType').value;
      const wallsCount = parseInt(document.getElementById('wallsCount').value, 10);
      const floorType = document.getElementById('floorType').value;
  
      if (
        isNaN(area) || isNaN(height) || isNaN(windowArea) || isNaN(outsideTemp) ||
        isNaN(insideTemp) || isNaN(wallsCount)
      ) {
        if (currentLang === 'en') {
          alert('Please fill in all fields correctly.');
        } else {
          alert('Пожалуйста, заполните все поля правильно.');
        }
        return;
      }
  
      const wallArea = wallsCount * height * (area / 4); // Расчет площади стен
      const floorArea = area;
  
      const power = calculateHeatingPower({
        area,
        height,
        windowArea,
        windowLayers,
        outsideTemp,
        insideTemp,
        wallArea,
        wallType,
        floorArea,
        floorType
      });
  
      document.getElementById('powerOutput').textContent = power.toFixed(2);
    });
});