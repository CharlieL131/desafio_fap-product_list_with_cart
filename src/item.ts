import { ProductComponent } from './product.ts';

export class CartItemComponent {
    private element: HTMLElement;
    private container: HTMLElement;
    private productComponent: ProductComponent;
  
    constructor(containerSelector: string, productComponent: ProductComponent) {
        this.container = document.querySelector(containerSelector) as HTMLElement;
        this.element = document.createElement("div");
        this.element.classList.add("cart-item");
        this.productComponent = productComponent;
        this.render();
        this.container.appendChild(this.element);
        
        this.productComponent.getElement().addEventListener('quantityChanged', this.handleQuantityChange.bind(this));
    }
  
    render() {
        this.element.innerHTML = `
            <div class="item-info">
            <span class="item-name">${this.productComponent.getName()}</span>
            <div class="item-quan-price">
                <span class="quant-number">${this.productComponent.getQuantity()}x</span>
                <span class="price-base">@ \$${this.productComponent.getPrice().toFixed(2)}</span>
                <span class="price-item-total">\$${
                (this.productComponent.getPrice() * this.productComponent.getQuantity()).toFixed(2)
                }</span>
            </div>
            </div>
            <button class="cart-btn">
            <img src="./src/assets/images/icon-remove-item.svg"/>
            </button>
        `;
  
        this.addEventListeners();
    }
  
    addEventListeners() {
        const removeBtn = this.element.querySelector('.cart-btn');
        removeBtn?.addEventListener('click', this.handleRemove.bind(this));
    }

    handleQuantityChange(event: Event) {
        const customEvent = event as CustomEvent;
        const newQuantity = customEvent.detail.newQuantity;
        
        if (newQuantity > 0) {
            this.render();
        } else {        
            const itemRemovedEvent = new CustomEvent('itemRemoved', {
                detail: {
                    itemComponent: this
                }
            });
            this.container.dispatchEvent(itemRemovedEvent);
        }
    }
  
    handleRemove() {
        this.productComponent.setQuantity(0);
    }

    getElement(): HTMLElement {
        return this.element;
    }
  
    getContainer(): HTMLElement {
        return this.container;
    }

    getProductComponent(): ProductComponent {
        return this.productComponent;
    }
}
