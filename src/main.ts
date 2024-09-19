import './style.css'
import { ProductComponent, ProductData } from './product.ts';

async function loadProducts(): Promise<ProductData[]> {
  const response = await fetch('../data.json');
  const data = await response.json();

  let count = 0
  const products: ProductData[] = data.map((item: any) => {
    count += 1;
    return {
      id: `product-${count}`,
      imageSrc: {
        thumbnail: item.image.thumbnail,
        mobile: item.image.mobile,
        tablet: item.image.tablet,
        desktop: item.image.desktop,
      },
      category: item.category,
      name: item.name,
      price: item.price,
      quantity: item.quantity || 0,
      enviroment: "desktop"
    };
  });

  return products;
}

async function renderProducts(): Promise<ProductComponent[]> {
  const products = await loadProducts();
  let productElements: ProductComponent[] = [];

  products.forEach(product => {
    productElements.push(new ProductComponent("#product-container", product));
  });

  return productElements;
}

let productElements = renderProducts();

