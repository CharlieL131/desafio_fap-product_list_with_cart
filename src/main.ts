import './style.css'
import { ProductComponent, ProductData } from './product.ts';
async function loadProducts(): Promise<ProductData[]> {
    const response = await fetch('./src/assets/data/data.json');
    const data = await response.json();
    
    // Transformar os dados brutos em objetos do tipo ProductData
    const products: ProductData[] = data.map((item: any) => {
      return {
        imageSrc: {
          thumbnail: item.image.thumbnail,
          mobile: item.image.mobile,
          tablet: item.image.tablet,
          desktop: item.image.desktop,
        },
        name: item.category,
        description: item.name || "No description available", // Prover uma descrição padrão caso não exista
        price: item.price,
        quantity: item.quantity || 0, // Assumir quantidade 0 caso não seja fornecido
      };
    });
  
    return products;
  }
const productData: ProductData = {
  imageSrc: '/src/assets/images/image-waffle-thumbnail.jpg',
  name: 'Waffle',
  description: 'Waffle with Berries',
  price: 6.50,
  quantity: 0,
};

new ProductComponent('main', productData);

