import { placeHolder, renderBestSelling } from "./bestSelling.js";
import { addToCart, getCartFromStorage, recalculateCart, renderCart, saveCartToStorage } from "./cart.js";
import { fetchCurrencies, getCurrency, saveCurrency } from "./currencies.js";
import { render } from "./product.js";
import { fetchBook, fetchNewBooks, renderBooks } from "./productsAll.js";


const toastify = ({message, type = 'success', ...rest}) => {
  Toastify({
    text: message,
    duration: 3000,
    close: true,
    gravity: "top", // `top` or `bottom`
    position: "right", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: "#382110",
    },
    onClick: ()=>document.getElementById('cart-sidebar').classList.add('show'),
    ...rest
  }).showToast();
}

AOS.init({
  duration: 1500,
});

const swiper = new Swiper(".swiper", {
  spaceBetween: 30,
  grabCursor: true,
  loop: true,

  autoplay: {
    delay: 2500,
    disableOnInteraction: false,
  },

  pagination: {
    el: ".swiper-pagination",
    clickable: true,
    renderBullet: function (index, className) {
      return '<span class="' + className + '">' + (index + 1) + "</span>";
    },
  },

  breakpoints: {
    640: {
      slidesPerView: 1,
    },
    768: {
      slidesPerView: 2,
    },
    1024: {
      slidesPerView: 3,
    },
  },
});

/****************** start bestSelling section *************************/
const container = document.querySelector(".bestSelling__container");
const newBooksContainer = document.querySelector(".newBooks__container");

const fetchAndRenderBooks = async (page = 1) => {
  const { books, ...meta } = await fetchNewBooks(page);
  newBooksContainer.innerHTML = renderBooks(books);
  renderPagination({
    currentPage: meta.page,
    paginationId: 'newBooks__pagination',
    fetchFunction: fetchAndRenderBooks,
    pages: meta.max,
  });

  const bestSelling = await fetchBook("bootstrap", page);
  container.innerHTML = renderBooks(bestSelling.books.slice(0, 3));

}

if (container && newBooksContainer) {
  newBooksContainer.innerHTML = placeHolder();
  container.innerHTML = placeHolder();
  fetchAndRenderBooks();
} else {
  document.addEventListener('DOMContentLoaded', async () => {
    render();
  });
}



/****************** end bestSelling section *************************/

/****************** start currency section *************************/
const currencyContainer = document.getElementById("currency-selector");
let currentCurrency = getCurrency();
let currencies = [];

fetchCurrencies().then((data) => {
  currencies = data;
  currentCurrency = currencies.find((currency) => currency.currency === currentCurrency) || {
    currency: "USD",
    name: "Dollar",
    rate: 1,
  };
  currencyContainer.innerHTML = currencies
    .map((currency) => {
      return `<option value="${currency.currency}" ${
        currency.currency === currentCurrency.currency ? "selected" : ""
      }>${currency.currency}</option>`;
    })
    .join("");

  saveCurrency(currentCurrency);
  recalculateCart(currentCurrency);
});

currencyContainer.addEventListener("change", (e) => {
  let currency = currencies.find((c) => c.currency === e.target.value);
  saveCurrency(currency);

  if (container && newBooksContainer) {
    newBooksContainer.innerHTML = placeHolder();
    container.innerHTML = placeHolder();
    fetchAndRenderBooks()
  } else {
    render();
  }
  recalculateCart(currency);
});

/****************** end currency section *************************/

/****************** start pagination section *************************/
const renderPagination = ({currentPage, paginationId, fetchFunction, pages}) => {
  const paginationContainer = document.getElementById(paginationId);

  let paginationHTML = '';

  for (let i = 1; i <= pages; i++) {
    paginationHTML += `
      <li class="page-item ${i === currentPage ? 'active' : ''}">
        <a class="page-link" href="#" data-page="${i}">${i}</a>
      </li>
    `;
  }

  paginationContainer.innerHTML = paginationHTML;

  paginationContainer.querySelectorAll('.page-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const page = parseInt(e.target.getAttribute('data-page'));
      fetchFunction(page);
    });
  });
}
/****************** end pagination section *************************/

let cartItems = [];
document.getElementById('cart-btn').addEventListener('click', function () {
  renderCart();
  document.getElementById('cart-sidebar').classList.add('show');
});

document.getElementById('close-cart').addEventListener('click', function () {
  document.getElementById('cart-sidebar').classList.remove('show');
});

// Add to cart
document.addEventListener('click', function (e) {
  if (e.target.classList.contains('addToCart')) {
    const book = e.target.closest('.product').dataset.isbn;
    addToCart(book).then(() => {
      toastify({message: 'Book added to cart', type: 'success'});
    }).catch((error) => {
      toastify({message: error.message, type: 'error'});
    });
  }
});

// subQty
document.addEventListener('click', function (e) {
  if (e.target.classList.contains('subQty')) {
    const book = e.target.getAttribute('data-isbn');
    cartItems = getCartFromStorage();
    const item = cartItems.find((item) => item.isbn === book);
    if (item.quantity > 1) {
      item.quantity--;
      saveCartToStorage(cartItems);
      renderCart();
    }
  }
});

// addQty
document.addEventListener('click', function (e) {
  if (e.target.classList.contains('addQty')) {
    const book = e.target.getAttribute('data-isbn');
    cartItems = getCartFromStorage();
    const item = cartItems.find((item) => item.isbn === book);
    item.quantity++;
    saveCartToStorage(cartItems);
    renderCart();
  }
});

// Remove item
document.addEventListener('click', function (e) {
  if (e.target.classList.contains('rmvBtn')) {
    const book = e.target.getAttribute('data-isbn');
    cartItems = getCartFromStorage();
    const item = cartItems.find((item) => item.isbn === book);
    const index = cartItems.indexOf(item);
    cartItems.splice(index, 1);
    saveCartToStorage(cartItems);
    renderCart();
  }
});

// clear cart
document.getElementById('clear-cart').addEventListener('click', function () {
  localStorage.removeItem('cart');
  renderCart();
});


// View book
document.addEventListener('click', function (e) {
  const modal = document.getElementById('bookModal');
  if (!e.target.classList.contains('viewBook')) {
    return;
  }
  const book = e.target.closest('.product').dataset.isbn;

});

// Book increase-quantity
document.addEventListener('click', function (e) {
  if (e.target.classList.contains('increase-quantity')) {
    const quantity = document.getElementById('book-quantity');
    quantity.textContent = parseInt(quantity.textContent) + 1;

  }
});

// Book decrease-quantity
document.addEventListener('click', function (e) {
  if (e.target.classList.contains('decrease-quantity')) {
    const quantity = document.getElementById('book-quantity');
    if (parseInt(quantity.textContent) === 1) {
      return;
    }
    quantity.textContent = parseInt(quantity.textContent) - 1;
  }
});

// Add to cart
document.addEventListener('click', function (e) {
  if (e.target.classList.contains('add-to-cart')) {
    const book = e.target.dataset.isbn;
    const quantity = document.getElementById('book-quantity').textContent;
    addToCart(book, parseInt(quantity)).then(() => {
      toastify({message: 'Book added to cart', type: 'success'});
    }).catch((error) => {
      toastify({message: error.message, type: 'error'});
    });
  
  }
});

