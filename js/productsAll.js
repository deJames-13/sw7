import { getCurrency } from "./currencies.js";

export const fetchNewBooks = async (page = 1, limit = 6) => {
    const response = await fetch(`https://api.itbook.store/1.0/new?page=${page}`);
    const data = await response.json();
    if (page > Math.ceil(data.books.length / limit)) {
        page = Math.ceil(data.books.length / limit);
    }
    else if (page < 1) {
        page = 1;
    }
    return {
        books: data.books.slice((page - 1) * limit, page * limit),
        total: data.books.length,
        page: page,
        limit: limit,
        max: Math.ceil(data.books.length /limit),
        last: data.books.length %limit === 0 ? data.books.length -limit : data.books.length - (data.books.length %limit),
    };
}

export const fetchBookDetails = async (isbn) => {
    const response = await fetch(`https://api.itbook.store/1.0/books/${isbn}`);
    const data = await response.json();
    return data;
}

export const fetchBook = async (query, page = 1, limit = 6) => {
    const response = await fetch(`https://api.itbook.store/1.0/search/${query}?page=${page}`);
    const data = await response.json();
    return {
        books: data.books,
        total: data.books.length,
        page: data.page,
        limit:limit,
        max: Math.ceil(data.books.length /limit),
        last: data.books.length %limit === 0 ? data.books.length -limit : data.books.length - (data.books.length %limit),
    };
}

export const viewBook = (isbn) => {
  alert('Viewing book with ISBN: ' + isbn);
}    


export const bookCard = (book) => {
    if (!book) {
        return '';
    }
    const truncatedDesc = book.subtitle.length > 20 ? book.subtitle.substring(0, 20) + '...' : book.subtitle;
    const currency = getCurrency() || { currency: 'USD', name: 'Dollar', rate: 1 };
    book.currency = currency.currency
    const price = parseFloat(book.price.substring(1) * currency.rate).toFixed(2);

    return `
      <div class="col p-3 d-flex justify-content-center">
        <div class="product bg-light text-center rounded overflow-hidden border d-flex flex-column" style="max-width: 300px;" data-isbn="${book.isbn13}">
          <div class="image d-flex justify-content-center align-items-center" style="height: 200px; overflow: hidden;">
            <img src="${book.image}" class="img-fluid" alt="${book.title}" style="height: 60%; width: auto;" />
          </div>
          <div class="content p-4 flex-grow-1 d-flex flex-column">
            <h6 class="m-0">
              ${book.title.substring(0, 20) + '...'}
            </h6>
            <div class="list mb-3 flex-grow-1">
              <div class="item border-bottom d-flex">
                <span class="fw-bold p-2">
                  Book Price
                </span>
                <span class="p-2">
                  ${book.currency} ${price}
                </span>
              </div>
            </div>
            <div class="mt-auto d-flex justify-content-between">

              <a
                href="/book.html?isbn=${book.isbn13}"
                class="viewBook main-link mb-2 mb-lg-0 d-inline-block text-decoration-none text-white p-2 px-4">
                View
              </a>
              <button 
                class="addToCart main-link mb-2 mb-lg-0 d-inline-block text-decoration-none text-white p-2 px-4">
                <i class="fa-solid fa-shopping-cart"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
}

export const renderBooks = (books) => {
    if (!books) {
        return '';
    }
    return books.map(bookCard).join('');
}



