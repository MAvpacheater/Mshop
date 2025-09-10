// general.js - Основна логіка сайту

class TelegramWebApp {
    constructor() {
        this.tg = window.Telegram?.WebApp;
        this.user = null;
        this.isReady = false;
        
        this.init();
    }

    init() {
        if (this.tg) {
            // Ініціалізація Telegram Web App
            this.tg.ready();
            this.tg.expand();
            
            // Отримання даних користувача
            this.user = this.tg.initDataUnsafe?.user;
            
            // Налаштування теми
            this.setupTheme();
            
            // Налаштування кнопок
            this.setupButtons();
            
            // Обробники подій
            this.setupEventListeners();
            
            this.isReady = true;
            
            console.log('Telegram WebApp ініціалізовано', {
                user: this.user,
                platform: this.tg.platform,
                version: this.tg.version
            });
        } else {
            console.warn('Telegram WebApp не доступний');
            this.initFallbackMode();
        }
        
        // Ініціалізація загальних функцій
        this.initGeneralFeatures();
    }

    setupTheme() {
        if (!this.tg) return;
        
        // Застосування кольорової схеми Telegram
        const root = document.documentElement;
        
        if (this.tg.colorScheme === 'dark') {
            document.body.classList.add('tg-theme-dark');
        } else {
            document.body.classList.add('tg-theme-light');
        }
        
        // Встановлення CSS змінних з теми Telegram
        if (this.tg.themeParams) {
            const theme = this.tg.themeParams;
            
            root.style.setProperty('--tg-bg-color', theme.bg_color || '#ffffff');
            root.style.setProperty('--tg-text-color', theme.text_color || '#000000');
            root.style.setProperty('--tg-hint-color', theme.hint_color || '#999999');
            root.style.setProperty('--tg-button-color', theme.button_color || '#007ACC');
            root.style.setProperty('--tg-button-text-color', theme.button_text_color || '#ffffff');
        }
    }

    setupButtons() {
        if (!this.tg) return;
        
        // Головна кнопка (буде використовуватися для оформлення замовлення)
        this.tg.MainButton.setText('Перейти до корзини');
        this.tg.MainButton.color = '#007ACC';
        this.tg.MainButton.textColor = '#FFFFFF';
        
        // Кнопка назад (за потреби)
        this.tg.BackButton.onClick(() => {
            this.goBack();
        });
    }

    setupEventListeners() {
        if (!this.tg) return;
        
        // Обробник основної кнопки
        this.tg.MainButton.onClick(() => {
            this.handleMainButtonClick();
        });
        
        // Обробник отримання даних від бота
        this.tg.onEvent('mainButtonClicked', () => {
            console.log('Основна кнопка натиснута');
        });
        
        // Обробник закриття WebApp
        window.addEventListener('beforeunload', () => {
            this.tg.close();
        });
    }

    initFallbackMode() {
        // Режим для тестування поза Telegram
        console.log('Запуск у режимі розробки (поза Telegram)');
        document.body.classList.add('dev-mode');
        
        // Створення fake Telegram об'єкта для тестування
        window.Telegram = {
            WebApp: {
                ready: () => {},
                expand: () => {},
                close: () => {},
                sendData: (data) => console.log('Відправка даних:', data),
                MainButton: {
                    setText: (text) => console.log('MainButton text:', text),
                    show: () => console.log('MainButton показано'),
                    hide: () => console.log('MainButton сховано'),
                    onClick: (callback) => console.log('MainButton onClick встановлено')
                },
                BackButton: {
                    show: () => console.log('BackButton показано'),
                    hide: () => console.log('BackButton сховано'),
                    onClick: (callback) => console.log('BackButton onClick встановлено')
                },
                colorScheme: 'light',
                platform: 'web'
            }
        };
    }

    initGeneralFeatures() {
        // Загальні функції сайту
        this.initLoading();
        this.initScrollEffects();
        this.initTouchHandlers();
        this.initErrorHandling();
    }

    initLoading() {
        // Показ/приховання індикатора завантаження
        window.showLoading = () => {
            const loader = document.createElement('div');
            loader.id = 'loading-overlay';
            loader.innerHTML = `
                <div class="loading-spinner">
                    <div class="spinner"></div>
                    <p>Завантаження...</p>
                </div>
            `;
            document.body.appendChild(loader);
        };
        
        window.hideLoading = () => {
            const loader = document.getElementById('loading-overlay');
            if (loader) {
                loader.remove();
            }
        };
    }

    initScrollEffects() {
        // Ефекти прокрутки
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            const header = document.querySelector('.header');
            
            if (header) {
                if (currentScrollY > lastScrollY && currentScrollY > 100) {
                    // Прокрутка вниз - ховаємо заголовок
                    header.style.transform = 'translateY(-100%)';
                } else {
                    // Прокрутка вгору - показуємо заголовок
                    header.style.transform = 'translateY(0)';
                }
            }
            
            lastScrollY = currentScrollY;
        });
    }

    initTouchHandlers() {
        // Обробники дотиків для мобільних пристроїв
        let touchStartY = 0;
        let touchEndY = 0;
        
        document.addEventListener('touchstart', (e) => {
            touchStartY = e.changedTouches[0].screenY;
        });
        
        document.addEventListener('touchend', (e) => {
            touchEndY = e.changedTouches[0].screenY;
            this.handleSwipe();
        });
        
        this.handleSwipe = () => {
            const swipeDistance = touchStartY - touchEndY;
            const minSwipeDistance = 50;
            
            if (Math.abs(swipeDistance) > minSwipeDistance) {
                if (swipeDistance > 0) {
                    // Swipe вгору
                    console.log('Swipe вгору');
                } else {
                    // Swipe вниз
                    console.log('Swipe вниз');
                }
            }
        };
    }

    initErrorHandling() {
        // Глобальний обробник помилок
        window.addEventListener('error', (e) => {
            console.error('Глобальна помилка:', e.error);
            this.showError('Виникла помилка. Спробуйте ще раз.');
        });
        
        window.addEventListener('unhandledrejection', (e) => {
            console.error('Необроблена Promise помилка:', e.reason);
            this.showError('Помилка завантаження даних.');
        });
    }

    // Методи для роботи з інтерфейсом
    showMainButton(text = 'Продовжити') {
        if (this.tg && this.tg.MainButton) {
            this.tg.MainButton.setText(text);
            this.tg.MainButton.show();
        }
    }

    hideMainButton() {
        if (this.tg && this.tg.MainButton) {
            this.tg.MainButton.hide();
        }
    }

    showBackButton() {
        if (this.tg && this.tg.BackButton) {
            this.tg.BackButton.show();
        }
    }

    hideBackButton() {
        if (this.tg && this.tg.BackButton) {
            this.tg.BackButton.hide();
        }
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    sendDataToBot(data) {
        if (this.tg) {
            try {
                this.tg.sendData(JSON.stringify(data));
            } catch (error) {
                console.error('Помилка відправки даних до бота:', error);
                this.showError('Помилка відправки даних');
            }
        } else {
            console.log('Дані для відправки боту:', data);
        }
    }

    handleMainButtonClick() {
        // Логіка обробки натискання головної кнопки
        if (window.shop && window.shop.cart.length > 0) {
            // Відправляємо дані корзини до бота
            this.sendDataToBot({
                action: 'checkout',
                cart: window.shop.cart,
                total: window.shop.getCartTotal(),
                user: this.user
            });
        } else {
            this.showError('Корзина пуста');
        }
    }

    goBack() {
        // Логіка повернення назад
        if (this.tg) {
            this.tg.close();
        } else {
            window.history.back();
        }
    }
}

// Утиліти
const Utils = {
    formatCurrency: (amount, currency = '₴') => {
        return `${amount.toLocaleString('uk-UA')} ${currency}`;
    },
    
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    throttle: (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    },
    
    isMobile: () => {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
};

// Ініціалізація після завантаження DOM
document.addEventListener('DOMContentLoaded', () => {
    window.telegramApp = new TelegramWebApp();
    window.utils = Utils;
    
    console.log('Додаток ініціалізовано');
});

// Експорт для використання в Node.js (якщо потрібно)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TelegramWebApp, Utils };
}
