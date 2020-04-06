function filterPrice(priceStr, minPrice, maxPrice) {
  let price = priceStr.slice(3, priceStr.length - 3);
  price = Number(price.replace(".", ""));

  return price >= minPrice && price <= maxPrice;
}

module.exports = filterPrice;
