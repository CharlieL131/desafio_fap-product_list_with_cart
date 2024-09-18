export interface ProductImageSource {
    thumbnail: string;
    mobile: string;
    tablet: string;
    desktop: string;
}
export interface ProductData {
    imageSrc: ProductImageSource;
    name: string;
    description: string;
    price: number;
    quantity: number;
    enviroment: keyof ProductImageSource;

}
export class ProductComponent {
    private element: HTMLElement;
    private data: ProductData;

    constructor(selector: string, data: ProductData){
        this.element = document.querySelector(selector) as HTMLElement;
        this.data = data;
        this.render();
    }
    
    render(){
        const { imageSrc, name, description, price, quantity, enviroment } = this.data;
        this.element.innerHTML = `
      <div class="product">
        <img class="thumb selected-${quantity!=0}" src="${imageSrc[enviroment]}" />
        <div class="btn-container">
          <button class="butt cart-butt">
            <img class="cart-butt-icon" src="/src/assets/images/icon-add-to-cart.svg" />
            <span>Add to Cart</span>
          </button>
        </div> 
        <div class="data">
          <span class="name">${name}</span>
          <span class="desc">${description}</span>
          <span class="price">${price}</span>
        </div>
      </div>
        `;
        
        this.addEventListeners();
    }

    addEventListeners(){
        const button = this.element.querySelector('.cart-butt');
        button?.addEventListener('click', this.handleAddToCart.bind(this));
    }

    handleAddToCart() {
        alert(`${this.data.name} added to cart!`);
    }


    
}