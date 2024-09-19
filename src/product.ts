export interface ProductImageSource {
    thumbnail: string;
    mobile: string;
    tablet: string;
    desktop: string;
}
export interface ProductData {
    imageSrc: ProductImageSource;
    category: string;
    name: string;
    price: number;
    quantity: number;
    enviroment: keyof ProductImageSource;
}
export class ProductComponent {
    private element: HTMLElement;
    private container: HTMLElement;
    private data: ProductData;

    constructor(selector: string, data: ProductData){
        this.container = document.querySelector(selector) as HTMLElement;
        this.element = document.createElement("div");
        this.element.classList.add("product");
        this.data = data;
        this.render();
        this.container.appendChild(this.element);
    }
    
    render(){
        const { imageSrc, category, name, price, quantity, enviroment } = this.data;
        this.element.innerHTML = `
        <img class="thumb selected-${quantity>0}" src="${imageSrc[enviroment]}" />
        <div class="btn-container">
          <button class="butt cart-butt ${quantity>0 ? 'hidden' : ''}">
            <img class="cart-butt-icon" src="/src/assets/images/icon-add-to-cart.svg" />
            <span>Add to Cart</span>
          </button>
          <div class="butt quantity-controller ${quantity<=0 ? 'hidden' : ''}">
            <button class="butt ico-butt decrement">
              <img class="ico-butt-ico" src="/src/assets/images/icon-decrement-quantity.svg" />
            </button>
            ${quantity}
            <button class="butt ico-butt increment">
              <img class="ico-butt-ico" src="/src/assets/images/icon-increment-quantity.svg" />
            </button>
          </div>
        </div> 
        <div class="data">
          <span class="category">${category}</span>
          <span class="name">${name}</span>
          <span class="price">\$${price.toFixed(2)}</span>
        </div>
        `;
        
        this.addEventListeners();
    }

    addEventListeners(){
        const button = this.element.querySelector('.cart-butt');
        const dec = this.element.querySelector('.decrement');
        const inc = this.element.querySelector('.increment');
        button?.addEventListener('click', this.handleAddToCart.bind(this));
        dec?.addEventListener('click', this.handleDecrement.bind(this));
        inc?.addEventListener('click', this.handleIncrement.bind(this));
    }

    handleAddToCart() {
        this.data.quantity = 1;
        this.render();
    }

    handleDecrement(){
      this.data.quantity -= 1;
      this.render();
    }

    handleIncrement(){
      this.data.quantity += 1;
      this.render();
    }
    
}