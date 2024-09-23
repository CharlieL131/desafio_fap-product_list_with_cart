import { ProductComponent } from './product.ts';
import { CartItemComponent } from './item.ts';
import { OrderItemComponent } from './order-item.ts'

export class CartComponent {
    private container: HTMLElement;
    private element: HTMLElement;
    private modal: HTMLElement;
    private itemsContainer: HTMLElement;
    private totalQuantityElement: HTMLElement;
    private totalPriceElement: HTMLElement;
    private orderButton: HTMLElement;
    private cartItems: Map<string, CartItemComponent>;

    constructor(selector: string) {
        this.container = document.querySelector(selector) as HTMLElement;
        this.element = document.createElement("div");
        this.element.classList.add("cart");
        this.modal = document.createElement("div");
        this.modal.classList.add("modal-container");
        this.modal.classList.add("hidden");
        this.modal.addEventListener('click', this.hideModal.bind(this));
        this.cartItems = new Map<string, CartItemComponent>();

        this.render();

        this.itemsContainer = this.element.querySelector('.items-container') as HTMLElement;
        this.totalQuantityElement = this.element.querySelector('.total-quant') as HTMLElement;
        this.totalPriceElement = this.element.querySelector('.total-price') as HTMLElement;
        this.orderButton = this.element.querySelector('.order-btn') as HTMLElement;

        this.updateCartInfo();
        this.container.appendChild(this.element);
        this.container.appendChild(this.modal);
    }

    showModal() {
        this.modal.innerHTML = `
          <div class="modal-adjust">
            <div class="confirm-modal">
              <img class="confirm-ico" src="./src/assets/images/icon-order-confirmed.svg">
              <div class="confirm-title-section">
                <h1 class="confirm-header">Order Confirmed</h1>
                <span class="confirm-sub">we hope you enjoy your food</span>
              </div>
  
              <div class="order-details">
                <div class="order-item-container">
              
                </div>
                <div class="order-total">
                  <span class="total-label">Order Total</span>
                  <span class="total-price">$0.00</span>
                </div>
              </div>
  
              <button class="order-btn">
                Start New Order
              </button>
            </div>
            <div class="modal-spacer"></div>
          </div>
        `
        
        this.cartItems.forEach(item => {
            new OrderItemComponent(".order-item-container", item);
        })
        const price = this.modal.querySelector('.total-price') as HTMLElement;
        let totalQuantity = 0;
        let totalPrice = 0;

        this.cartItems.forEach(cartItem => {
            const productComponent = cartItem.getProductComponent();
            totalQuantity += productComponent.getQuantity();
            totalPrice += productComponent.getQuantity() * productComponent.getPrice();
        });
        price.textContent = `$${totalPrice.toFixed(2)}`;

        this.modal.querySelector('.order-btn')?.addEventListener('click', this.clearCart.bind(this));

        this.modal.classList.remove("hidden");

        const event = new CustomEvent('modalOpened', {
            detail: {}
        });
        this.element.dispatchEvent(event);
    }

    clearCart() {
        this.cartItems.forEach(item => {
            item.getProductComponent().setQuantity(0);
        })
        this.hideModal();
    }

    hideModal() {
        if (!this.modal.classList.contains("hidden")) {
            this.modal.classList.add("hidden");
            const event = new CustomEvent('modalClosed', {
                detail: {}
            });
            this.element.dispatchEvent(event);
        }
    }

    render() {
        this.element.innerHTML = `
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
        `;

        this.element.querySelector('.order-btn')?.addEventListener('click', this.showModal.bind(this));
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

    getElement(): HTMLElement {
        return this.element;
    }
}
