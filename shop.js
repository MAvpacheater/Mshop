// Shop.js - Логіка відображення магазину

class Shop {
    constructor() {
        this.products = [
            {
                id: 1,
                name: "Смартфон iPhone 15",
                price: 35000,
                image: "https://via.placeholder.com/200x200/007ACC/ffffff?text=iPhone+15",
                description: "Новий iPhone 15 з покращеною камерою"
            },
            {
                id: 2,
                name: "Ноутбук MacBook Air",
                price: 45000,
                image: "https://via.placeholder.com/200x200/FF6B35/ffffff?text=MacBook",
                description: "MacBook Air M2 - потужність у компактному корпусі"
            },
            {
                id: 3,
                name: "Навушники AirPods",
                price: 8500,
                image: "https://via.placeholder.com/200x200/28A745/ffffff?text=AirPods",
                description: "Бездротові навушники з активним шумозаглушенням"
            },
            {
                id: 4,
                name: "Планшет iPad",
                price: 22000,
                image: "https://via.placeholder.com/200x200/DC3545/ffffff?text=iPad",
                description: "iPad 10.9 для роботи та розваг"
            },
            {
                id: 5,
                name: "Apple Watch",
                price: 15000,
                image: "https://via.placeholder.com/200x200/6F42C1/ffffff?text=Watch",
                description: "Розумний годинник з моніторингом здоров'я"
            },
            {
                id: 6,
                name: "Зарядний пристрій",
                price: 2500,
                image: "https://via.placeholder.com/200x200/FD7E14/ffffff?text=Charger",
                description: "Швидкий зарядний пристрій USB-C 20W"
            }
        ];
        
        this.cart = [];
        this.init();
    }

    init() {
        this.renderProducts();
        this.setupEventListeners();
    }

    renderProducts() {
        const container = document.getElementById('shop-container');
        
        const productsHTML = `
            <div class="products-grid">
                ${this.products.map(product => this.createProductCard(product)).join('')}
            </div>
        `;
        
        container.innerHTML = productsHTML;
    }

    createProductCard(product) {
        return `
            <div class="product-card" data-product-id="${product.id}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-price">
                        <span class="price">${this.formatPrice(product.price)} ₴</span>
                    </div>
                    <button class="add-to-cart-btn" onclick="shop.addToCart(${product.id})">
                        🛒 Додати до корзини
                    </button>
                </div>
            </div>
        `;
    }

    formatPrice(price) {
        return price.toLocaleString('uk-UA');
    }

    addToCart(productId) {
        const product = this.products.find(p => p.id === productId);
        if (product) {
            // Перевіряємо чи товар вже в корзині
            const existingItem = this.cart.find(item => item.id === productId);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                this.cart.push({
                    ...product,
                    quantity: 1
                });
            }
            
            this.updateCartUI();
            this.showNotification(`${product.name} додано до корзини!`);
            
            // Відправляємо дані до Telegram бота (якщо доступно)
            this.sendDataToTelegram();
        }
    }

    updateCartUI() {
        // Тут буде оновлення UI корзини (буде реалізовано пізніше)
        console.log('Корзина оновлена:', this.cart);
    }

    showNotification(message) {
        // Простий toast notification
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    sendDataToTelegram() {
        // Відправка даних до Telegram бота
        if (window.Telegram && window.Telegram.WebApp) {
            const cartData = {
                cart: this.cart,
                total: this.getCartTotal()
            };
            
            window.Telegram.WebApp.sendData(JSON.stringify(cartData));
        }
    }

    getCartTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    setupEventListeners() {
        // Обробка кліків по товарах
        document.addEventListener('click', (e) => {
            if (e.target.closest('.product-card')) {
                const productCard = e.target.closest('.product-card');
                const productId = parseInt(productCard.dataset.productId);
                
                // Можна додати логіку відкриття детальної інформації про товар
                if (!e.target.classList.contains('add-to-cart-btn')) {
                    this.showProductDetails(productId);
                }
            }
        });
    }

    showProductDetails(productId) {
        const product = this.products.find(p => p.id === productId);
        if (product) {
            // Тут може бути модальне вікно з детальною інформацією
            console.log('Показати деталі товару:', product);
        }
    }
}

// Ініціалізація магазину після завантаження DOM
document.addEventListener('DOMContentLoaded', () => {
    window.shop = new Shop();
});

// Експорт для використання в інших файлах
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Shop;
}
