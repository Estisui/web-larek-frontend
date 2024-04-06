import { Form } from './common/Form';
import { OrderForm, PaymentMethod } from '../types';
import { IEvents } from './base/Events';

export class Order extends Form<OrderForm> {
	protected _paymentCard?: HTMLButtonElement;
	protected _paymentCash?: HTMLButtonElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		if (
			container.querySelector('.button_alt[name=card]') &&
			container.querySelector('.button_alt[name=cash]')
		) {
			this._paymentCard = container.querySelector('.button_alt[name=card]');
			this._paymentCash = container.querySelector('.button_alt[name=cash]');

			this._paymentCard.addEventListener('click', () => {
				this.payment = 'card';
				this.onInputChange('payment', 'card');
			});

			this._paymentCash.addEventListener('click', () => {
				this.payment = 'cash';
				this.onInputChange('payment', 'cash');
			});
		}
	}

	set payment(value: PaymentMethod) {
		this._paymentCard.classList.toggle('button_alt-active', value === 'card');
		this._paymentCash.classList.toggle('button_alt-active', value === 'cash');
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}

	set email(value: string) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value =
			value;
	}

	set phone(value: string) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value =
			value;
	}
}
