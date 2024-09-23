export interface ProductImageSource {
  thumbnail: string;
  mobile: string;
  tablet: string;
  desktop: string;
}

export interface ProductData {
  id: string;
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
      this.element.setAttribute('id', data.id);
      this.data = data;
      this.render();
      this.container.appendChild(this.element);
  }
  
  render(){
      const { imageSrc, category, name, price, quantity, enviroment } = this.data;
      this.element.innerHTML = `
      <img class="thumb selected-${quantity > 0}" src="${imageSrc[enviroment]}" />
      <div class="btn-container">
        <button class="butt cart-butt ${quantity > 0 ? 'hidden' : ''}">
          <img class="cart-butt-icon" src="/src/assets/images/icon-add-to-cart.svg" />
          <span>Add to Cart</span>
        </button>
        <div class="butt quantity-controller ${quantity <= 0 ? 'hidden' : ''}">
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
      this.dispatchQuantityChangeEvent();
      this.render();
  }

  handleDecrement(){
      if (this.data.quantity > 0) {
          this.data.quantity -= 1;
          this.dispatchQuantityChangeEvent();
          this.render();
      }
  }

  handleIncrement(){
      this.data.quantity += 1;
      this.dispatchQuantityChangeEvent();
      this.render();
  }

  dispatchQuantityChangeEvent(){
      const quantityChangeEvent = new CustomEvent('quantityChanged', {
          detail: {
              productId: this.data.id,
              productName: this.data.name,
              newQuantity: this.data.quantity
          }
      });
      this.element.dispatchEvent(quantityChangeEvent);
  }

  getId(): string {
      return this.data.id;
  }
  
  getImageSrc(): ProductImageSource {
      return this.data.imageSrc;
  }

  getCategory(): string {
      return this.data.category;
  }

  getName(): string {
      return this.data.name;
  }
  
  getPrice(): number {
      return this.data.price;
  }

  getQuantity(): number {
      return this.data.quantity;
  }

  getEnviroment(): keyof ProductImageSource {
      return this.data.enviroment;
  }

  getElement(): HTMLElement {
      return this.element;
  }

  getContainer(): HTMLElement {
      return this.container;
  }

  setImageSrc(imageSrc: ProductImageSource) {
      this.data.imageSrc = imageSrc;
      this.render();
  }

  setCategory(category: string) {
      this.data.category = category;
      this.render();
  }

  setName(name: string) {
      this.data.name = name;
      this.render();
  }

  setPrice(price: number) {
      this.data.price = price;
      this.render();
  }

  setQuantity(quantity: number) {
      this.data.quantity = quantity;
      this.dispatchQuantityChangeEvent();
      this.render();
  }

  setEnviroment(enviroment: keyof ProductImageSource) {
      this.data.enviroment = enviroment;
      this.render();
  }
}
