import { getCurrency } from "./currencies.js";

export const bestSelling = []

export const placeHolder = (count = 3) => {
  return Array.from({ length: count }).map(() => {
    return `
  <div class="col p-3 placeholder-glow">
  <div class="product bg-light text-center rounded overflow-hidden border"
    style="max-width: 300px; margin: auto;">
    <div class="image placeholder" style="height: 200px; overflow: hidden;">
      <img src="" class="img-fluid" style="height: 100%; width: auto;" />
    </div>
    <div class="content p-4">
      <h3 class="m-0 placeholder">

      </h3>
      <p class="py-4 text-muted border-bottom placeholder">
      </p>
      <div class="list mb-3">
        <div class="item border-bottom d-flex placeholder">
          <span class="fw-bold p-2">
            Genre
          </span>
          <span class="p-2 placeholder">
          </span>
        </div>
        <div class="item border-bottom d-flex placeholder ">
          <span class="fw-bold p-2 ">
            Author
          </span>
          <span class="p-2">
          </span>
        </div>
        <div class="item border-bottom d-flex placeholder">
          <span class="fw-bold p-2">
            Book Price
          </span>
          <span class="p-2">
          </span>
        </div>
      </div>
      <a href="#"
        class="placeholder main-link mb-2 mb-lg-0 d-inline-block text-decoration-none text-white p-2 px-4 rounded-pill">
        Buy Now
      </a>
    </div>
  </div>
</div>
  `
  }).join('');
}

export const renderBestSelling = () => {
    let books = bestSelling;
    return books.map(book => {
        const truncatedDesc = book.desc.length > 20 ? book.desc.substring(0, 20) + '...' : book.desc;
        const currency = getCurrency();
        const priceOriginal = bestSelling.find((book) => book.id === 1).price;

        book.currency = currency.currency;
        const price = parseFloat(priceOriginal * currency.rate).toFixed(2);


        return `
          <div class="col p-3">
            <div class="product bg-light text-center rounded overflow-hidden border" style="max-width: 300px; margin: auto;">
              <div class="image" style="height: 200px; overflow: hidden;">
                <img src="${book.image}" class="img-fluid" alt="${book.name}" style="height: 100%; width: auto;" />
              </div>
              <div class="content p-4">
                <h3 class="m-0">
                  ${book.name}
                </h3>
                <p class="py-4 text-muted border-bottom">
                  ${truncatedDesc}
                </p>
                <div class="list mb-3">
                  <div class="item border-bottom d-flex">
                    <span class="fw-bold p-2">
                      Genre
                    </span>
                    <span class="p-2">
                      ${book.genre}
                    </span>
                  </div>
                  <div class="item border-bottom d-flex">
                    <span class="fw-bold p-2">
                      Author
                    </span>
                    <span class="p-2">
                        ${book.author}
                    </span>
                  </div>
                  <div class="item border-bottom d-flex">
                    <span class="fw-bold p-2">
                      Book Price
                    </span>
                    <span class="p-2">
                    ${book.currency} ${price}
                    </span>
                  </div>
                </div>
                <a href="#"
                  class="main-link mb-2 mb-lg-0 d-inline-block text-decoration-none text-white p-2 px-4 rounded-pill">
                  Buy Now
                </a>
              </div>
            </div>
          </div>
        `;
    }).join('');
}