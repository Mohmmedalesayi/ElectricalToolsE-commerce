/* ==============================================================================
 * File: static/js/script.js
 * Description: JavaScript for shopping cart functionality and UI interactions.
 * ============================================================================== */

// Products will be fetched from Django, so this array is no longer needed here.
// However, we'll use it to store products fetched from the server for JS purposes.
let allProducts = [];

let cart = []; // Array to store shopping cart items

// Get DOM elements
const productGrid = document.getElementById('product-grid');
const cartButton = document.getElementById('cart-button');
const cartCount = document.getElementById('cart-count');
const cartModal = document.getElementById('cart-modal');
const closeCartModalButton = document.getElementById('close-cart-modal');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalSpan = document.getElementById('cart-total');
const checkoutButton = document.getElementById('checkout-button');
const checkoutMessage = document.getElementById('checkout-message');
const customMessageBox = document.getElementById('custom-message-box');
const messageTitle = document.getElementById('message-title');
const messageText = document.getElementById('message-text');
const messageCloseButton = document.getElementById('message-close-button');

// Function to display a custom message (instead of alert())
function showCustomMessage(title, message, type = 'info') {
    messageTitle.textContent = title;
    messageText.textContent = message;
    customMessageBox.classList.remove('hidden', 'border-t-red-500', 'border-t-green-500', 'border-t-blue-500');
    if (type === 'error') {
        customMessageBox.classList.add('border-t-red-500');
    } else if (type === 'success') {
        customMessageBox.classList.add('border-t-green-500');
    } else {
        customMessageBox.classList.add('border-t-blue-500');
    }
    customMessageBox.classList.add('block');
}

// Hide the custom message
messageCloseButton.addEventListener('click', () => {
    customMessageBox.classList.remove('block');
    customMessageBox.classList.add('hidden');
});

// Function to add a product to the cart
function addToCart(event) {
    // Get product data from "Add to Cart" button attributes
    const productId = parseInt(event.target.dataset.id);
    const productName = event.target.dataset.name;
    const productPrice = parseFloat(event.target.dataset.price);

    const product = { id: productId, name: productName, price: productPrice };

    if (product) {
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity++;
            showCustomMessage('تم التحديث', `تمت زيادة كمية ${product.name} في السلة.`, 'info');
        } else {
            cart.push({ ...product, quantity: 1 });
            showCustomMessage('تمت الإضافة', `تمت إضافة ${product.name} إلى السلة.`, 'success');
        }
        updateCartDisplay();
    }
}

// Function to update the cart display
function updateCartDisplay() {
    cartItemsContainer.innerHTML = ''; // Clear old content
    let total = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="text-gray-600 text-center">سلة التسوق فارغة.</p>';
    } else {
        cart.forEach(item => {
            const cartItemDiv = document.createElement('div');
            cartItemDiv.className = 'flex items-center justify-between border-b border-gray-200 pb-2';
            cartItemDiv.innerHTML = `
                <div>
                    <p class="font-semibold">${item.name}</p>
                    <p class="text-sm text-gray-600">${item.price.toFixed(2)} ريال × ${item.quantity}</p>
                </div>
                <div class="flex items-center space-x-2 space-x-reverse">
                    <button class="remove-from-cart-btn bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600 transition duration-300" data-id="${item.id}">
                        إزالة
                    </button>
                    <button class="increase-quantity-btn bg-gray-300 text-gray-800 px-2 py-1 rounded-md text-sm hover:bg-gray-400 transition duration-300" data-id="${item.id}">+</button>
                    <button class="decrease-quantity-btn bg-gray-300 text-gray-800 px-2 py-1 rounded-md text-sm hover:bg-gray-400 transition duration-300" data-id="${item.id}">-</button>
                </div>
            `;
            cartItemsContainer.appendChild(cartItemDiv);
            total += item.price * item.quantity;
        });
    }

    cartTotalSpan.textContent = total.toFixed(2);
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);

    // Add event listeners for remove, increase, and decrease buttons
    document.querySelectorAll('.remove-from-cart-btn').forEach(button => {
        button.addEventListener('click', removeFromCart);
    });
    document.querySelectorAll('.increase-quantity-btn').forEach(button => {
        button.addEventListener('click', changeQuantity);
    });
    document.querySelectorAll('.decrease-quantity-btn').forEach(button => {
        button.addEventListener('click', changeQuantity);
    });
}

// Function to change product quantity in the cart
function changeQuantity(event) {
    const productId = parseInt(event.target.dataset.id);
    const action = event.target.textContent; // "+" or "-"

    const itemIndex = cart.findIndex(item => item.id === productId);

    if (itemIndex !== -1) {
        if (action === '+') {
            cart[itemIndex].quantity++;
        } else if (action === '-') {
            cart[itemIndex].quantity--;
            if (cart[itemIndex].quantity <= 0) {
                cart.splice(itemIndex, 1); // Remove product if quantity is zero or less
            }
        }
        updateCartDisplay();
    }
}

// Function to completely remove a product from the cart
function removeFromCart(event) {
    const productId = parseInt(event.target.dataset.id);
    cart = cart.filter(item => item.id !== productId);
    showCustomMessage('تمت الإزالة', 'تمت إزالة المنتج من السلة.', 'info');
    updateCartDisplay();
}

// Open shopping cart modal
cartButton.addEventListener('click', () => {
    cartModal.classList.remove('hidden');
    updateCartDisplay(); // Update display on open
});

// Close shopping cart modal
closeCartModalButton.addEventListener('click', () => {
    cartModal.classList.add('hidden');
    checkoutMessage.classList.add('hidden'); // Hide checkout message on close
});

// Simulate checkout process
checkoutButton.addEventListener('click', () => {
    if (cart.length > 0) {
        // Here you can add actual payment processing logic
        cart = []; // Empty the cart
        updateCartDisplay();
        checkoutMessage.classList.remove('hidden'); // Show confirmation message
        showCustomMessage('نجاح!', 'تمت عملية الشراء بنجاح! شكراً لك.', 'success');
    } else {
        showCustomMessage('السلة فارغة', 'لا توجد منتجات في سلة التسوق لإتمام الشراء.', 'error');
    }
});

// Run product display on page load
// In Django, products are passed directly to the template,
// so we don't need renderProducts() in JS to fetch them from a static array.
// Instead, we use JS only to manage the cart and interactions.
document.addEventListener('DOMContentLoaded', () => {
    // Add event listeners for "Add to Cart" buttons after DOM is loaded
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', addToCart);
    });
    updateCartDisplay(); // Update cart display on page load (in case of locally stored items)
});
