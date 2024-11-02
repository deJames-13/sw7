import { convertCurrency, getCurrency } from "./currencies.js";
import { fetchBookDetails } from "./productsAll.js";


export const recalculateCart = async (currency) => {
    const cart = getCartFromStorage();
    cart.map(item => {
        item.price = item.currency !== currency.currency ? item.price = convertCurrency(parseFloat(item.price), currency.currency, item.currency).toFixed(2) : item.price
        item.currency = currency.currency;
    });
    console.log(cart);
    saveCartToStorage(cart);
}

export const addToCart = async (isbn, quantity = 1) => {
    const currentCurrency = getCurrency();
    fetchBookDetails(isbn).then(data => {
        const book = data;
        const cart = getCartFromStorage();
        const index = cart.findIndex(item => item.isbn === book.isbn13);
        if (index > -1) {
            cart[index].quantity += quantity;
            saveCartToStorage(cart);
            return
        }
        cart.push({
            isbn: book.isbn13,
            title: book.title,
            price: convertCurrency(parseFloat(book.price.substring(1)), currentCurrency.currency).toFixed(2),
            currency: currentCurrency.currency,
            quantity
        });
        saveCartToStorage(cart);
        renderCart();
    }).catch(error => {
        console.error(error);
    });
}


export const getCartFromStorage = () => {
    try {
        const cart = localStorage.getItem('cart');
        return cart ? JSON.parse(cart) : [];
    } catch {
        return [];
    }
}

export const saveCartToStorage = (cart) => {
    try {
        const cartString = JSON.stringify(cart);
        localStorage.setItem('cart', cartString);
    } catch (error) {
        console.error(error);
    }
}

const cartCard = (item) => {
    if (!item) {
        return '';
    }
    item.total = item.price * item.quantity;
    return `
        <div class="row border-bottom py-2">
            <div class="col-3">
                <img src="https://itbook.store/img/books/${item.isbn}.png" class="img-fluid" alt="${item.title}" />
            </div>
            <div class="card-content col-9">
                <h5>${item.title}</h5>
                <p>${item.currency} ${item.price} x${item.quantity}</p>
                <p>Item Total: <strong>${item.currency} ${item.total.toFixed(2)}</strong></p>
            </div>
            <div class="col-9 cart-actions">
                <button class="subQty btn btn-primary rounded-0" data-isbn="${item.isbn}">-</button>
                <p id="cart-quantity__${item.isbn}" data-quantity="${item.quantity}">${item.quantity}</p>
                <button class="addQty btn btn-primary rounded-0" data-isbn="${item.isbn}">+</button>
            </div>
            <div class="col-3 remove-btn">
                <button class="rmvBtn btn btn-danger rounded-0" data-isbn="${item.isbn}">Remove</button>
            </div>
        </div>
    `;
}

export const renderCart = () => {
    const cart = getCartFromStorage();
    const cartContainer = document.getElementById('cart-items');
    const cartTotalContainer = document.querySelector('.cart-total');
    const cartTotal = document.getElementById('cart-total');
    cartTotalContainer.style.display = 'block';
    if (cart.length === 0) {
        cartContainer.innerHTML = '<p>Your cart is empty</p>';
        cartTotal.innerHTML = '';
        cartTotalContainer.style.display = 'none';
        return; 
    }

    cartTotal.innerHTML = `
        <h5>${getCurrency().currency} ${cart.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)}</h5>
    `;



    let cartHTML = '';
    cart.map(item => {
        cartHTML += cartCard(item);
    });
    cartContainer.innerHTML = cartHTML;
}