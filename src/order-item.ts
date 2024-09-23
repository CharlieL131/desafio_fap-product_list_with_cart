import { CartItemComponent } from './item.ts';

export class OrderItemComponent {
    private element: HTMLElement;
    private container: HTMLElement;
    private cartItem: CartItemComponent;

    constructor(containerSelector: string, cartItem: CartItemComponent) {
        this.container = document.querySelector(containerSelector) as HTMLElement;
        this.element = document.createElement('div');
        this.element.classList.add('order-item');
        this.cartItem = cartItem;

        this.render();
        this.container.appendChild(this.element);
    }

    render() {
        const product = this.cartItem.getProductComponent();
        const imageSrc = product.getImageSrc()[product.getEnviroment()];
        const name = product.getName();
        const quantity = product.getQuantity();
        const price = product.getPrice();
        const totalPrice = (price * quantity).toFixed(2);

        this.element.innerHTML = `
            <img class="confirm-thumb" src="${imageSrc}" />
            <div class="item-info">
              <span class="item-name">${name}</span>
              <div class="item-quan-price">
                  <span class="quant-number">${quantity}x</span>
                  <span class="price-base">@ \$${price.toFixed(2)}</span>
              </div>
            </div>
            <span class="price-item-total">\$${totalPrice}</span>
        `;
    }

    getElement(): HTMLElement {
        return this.element;
    }
}
