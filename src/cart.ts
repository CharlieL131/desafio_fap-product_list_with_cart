import { ProductComponent } from './product.ts';
import { CartItemComponent } from './item.ts';

export class CartComponent {
    private element: HTMLElement;
    private itemsContainer: HTMLElement;
    private totalQuantityElement: HTMLElement;
    private totalPriceElement: HTMLElement;
    private orderButton: HTMLElement;
    private cartItems: Map<string, CartItemComponent>;

    constructor(selector: string) {
        this.element = document.querySelector(selector) as HTMLElement;
        this.cartItems = new Map<string, CartItemComponent>();

        this.render();

        this.itemsContainer = this.element.querySelector('.items-container') as HTMLElement;
        this.totalQuantityElement = this.element.querySelector('.total-quant') as HTMLElement;
        this.totalPriceElement = this.element.querySelector('.total-price') as HTMLElement;
        this.orderButton = this.element.querySelector('.order-btn') as HTMLElement;

        this.updateCartInfo();
    }

    render() {
        this.element.innerHTML = `
            <div class="cart">
                <h2>Your Cart(<span class="total-quant">0</span>)</h2>
                <div class="items-container"></div>
                <div class="order-total">
                    <span class="total-label">Order Total</span>
                    <span class="total-price">$0.00</span>
                </div>
                <div class="stupid-box">
                    <img class="tree" src="./src/assets/images/icon-carbon-neutral.svg" />
                    <span class="no-carbon">This is a <b>carbon-neutral</b> delivery</span>
                </div>
                <button class="order-btn" disabled>
                    Confirm Order
                </button>
            </div>
        `;
    }

    listenForProductQuantityChange(productComponent: ProductComponent) {
        productComponent.getElement().addEventListener('quantityChanged', (event: Event) => {
            const custom = event as CustomEvent;
            const newQuantity = custom.detail.newQuantity;

            if (newQuantity > 0 && !this.cartItems.has(productComponent.getId())) {
                const cartItemComponent = new CartItemComponent('.items-container', productComponent);
                this.cartItems.set(productComponent.getId(), cartItemComponent);

                this.itemsContainer.addEventListener('itemRemoved', (removeEvent: Event) => {
                    const custom = removeEvent as CustomEvent
                    this.removeCartItem(custom.detail.itemComponent);
                });
            }

            this.updateCartInfo();
        });
    }


    removeCartItem(cartItem: CartItemComponent) {
        const productId = cartItem.getProductComponent().getId();
        
        
        if (this.cartItems.has(productId)) {
            console.log(`Item Deleted: ${productId}`);
            this.cartItems.get(productId)?.getElement().remove();

            this.cartItems.delete(productId);

            this.updateCartInfo();
        }
    }

    updateCartInfo() {
        let totalQuantity = 0;
        let totalPrice = 0;

        this.cartItems.forEach(cartItem => {
            const productComponent = cartItem.getProductComponent();
            totalQuantity += productComponent.getQuantity();
            totalPrice += productComponent.getQuantity() * productComponent.getPrice();
        });

        this.totalQuantityElement.textContent = `${totalQuantity}`;
        this.totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;

        if (totalQuantity === 0) {
            this.orderButton.setAttribute('disabled', 'true');
        } else {
            this.orderButton.removeAttribute('disabled');
        }
    }
}
