import { getCurrency } from "./currencies.js";
import { fetchBookDetails } from "./productsAll.js";


const render = () => {
    const isbn = new URLSearchParams(window.location.search).get('isbn');
    if (!isbn) {
        window.location.href = 'index.html';
    }
    fetchBookDetails(isbn).then(data => {
        document.title = data.title;
        const container = document.getElementById('book-container');
        const currency = getCurrency();
        data.currency = currency.currency;
        data.price = parseFloat(data.price.substring(1) * currency.rate).toFixed(2);

        container.innerHTML = `
        <div class="row">
            <div class="col-lg-6">
                <div class="product-image">
                <img id="book-img" src="${data.image}" alt="product-image" class="img-fluid" />
                </div>
            </div>
            <div class="col-lg-6">
                <div class="product-details">
                    <h2 class="product-title">
                        ${data.title}
                    </h2>
                    <p class="product-author">by ${data.authors}</p>
                    <p class="product-price">
                        <span class="mr-2">${data.currency}</span>
                        <span class="mr-2">${data.price}</span>
                    </p>
                    <p class="product-subtitle ">
                        ${data.subtitle}
                    </p>
                    <p class="product-description ">
                        ${data.desc}
                    </p>
                    <div class="product-quantity">
                        <div class="input-group">
                            <button class="decrease-quantity main-link text-white">-</button>
                            <span id="book-quantity" class="m-auto">1</span>
                            <button class="increase-quantity main-link text-white rounded-0" id="increase-quantity">+</button>
                        </div>
                    </div>
                <button 
                    class="add-to-cart main-link text-white rounded-0 mt-3" data-isbn="${data.isbn13}">
                    Add to Cart
                </button>
                </div>
            </div>
        </div>
        `
    }).catch(error => {
        console.error(error);
        window.location.href = 'index.html';
    });
}


export { render };
