const allowedCurrencies = ['PHP', 'USD', 'JPY', 'KRW', 'EUR', 'GBP', 'AUD', 'CAD', 'CNY', 'SGD', 'MYR', 'IDR', 'THB', 'VND', 'HKD', 'TWD'];

let currencies = [];

export const fetchCurrencies = async () => {
    // 2024-11-02
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const today = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
    const response = await fetch('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.json');
    const responseRates = await fetch(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${today}/v1/currencies/usd.json`);
    const data = await response.json();
    const dataRates = await responseRates.json();
    for (const currency in data) {
        if (allowedCurrencies.includes(currency.toUpperCase())) {
            currencies.push({ 
                currency: currency.toUpperCase(), 
                name: data[currency],
                rate: dataRates['usd'][currency]
             });
        }
    }
    return currencies;
}

export const convertCurrency = (amount, to = "PHP", from = "USD") => {
    const currencyFrom = currencies.find(c => c.currency === from);
    const currencyTo = currencies.find(c => c.currency === to);
    if (!currencyFrom || !currencyTo) {
        return amount;
    }
    return (amount / currencyFrom.rate) * currencyTo.rate;
}

export const saveCurrency = (currency) => {
    if (!currencies.find(c => c.currency === currency.currency)) {
        currency = {
            currency: 'USD',
            name: 'Dollar',
            rate: 1
        }
    }

    localStorage.setItem('currency', JSON.stringify(currency));
}

export const getCurrency = () => {
    let currency = localStorage.getItem('currency');
    try {
        currency = JSON.parse(currency);
    } 
    catch (error) {
        currency = null;
    }
    if (!currency || !currencies.find(c => c.currency === currency.currency)) {
        currency = {
            currency: 'USD',
            name: 'Dollar',
            rate: 1
        }
    }

    return currency;
}
