import products from "./products";

const PRODUCT_STORAGE_KEY = "ethnicart_products";

export const getProducts = () => {
  const savedProducts = localStorage.getItem(PRODUCT_STORAGE_KEY);

  if (savedProducts) {
    return JSON.parse(savedProducts);
  }

  localStorage.setItem(
    PRODUCT_STORAGE_KEY,
    JSON.stringify(products)
  );

  return products;
};

export const saveProducts = (productsList) => {
  localStorage.setItem(
    PRODUCT_STORAGE_KEY,
    JSON.stringify(productsList)
  );
};

export const resetProducts = () => {
  localStorage.setItem(
    PRODUCT_STORAGE_KEY,
    JSON.stringify(products)
  );

  return products;
};
