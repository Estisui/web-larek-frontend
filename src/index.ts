import { AppData } from './components/AppData';
import { Card } from './components/Card';
import { Page } from './components/Page';
import { WebLarekAPI } from './components/WebLarekApi';
import { EventEmitter } from './components/base/events';
import { Basket } from './components/common/Basket';
import { Modal } from './components/common/Modal';
import './scss/styles.scss';
import { IProduct } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

const api = new WebLarekAPI(CDN_URL, API_URL);

// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const modalCardTemplate =
	ensureElement<HTMLTemplateElement>('#modal-container');

const events = new EventEmitter();

// Модель данных приложения
const appData = new AppData(events);

// Глобальные контейнеры
const modal = new Modal(modalCardTemplate, events);
const page = new Page(document.body, events);
const basket = new Basket(events)

// Дальше идет бизнес-логика
events.on('modal:open', () => {
	page.locked = true;
});

events.on('modal:close', () => {
	page.locked = false;
});

events.on('card:select', (item: IProduct) => {
	appData.setPreview(item);
});

events.on('items:change', (items: IProduct[]) => {
	page.catalog = items.map((item) => {
		const card = new Card(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return card.render(item);
	});
});

events.on('preview:change', (item: IProduct) => {
	const card = new Card(cloneTemplate(cardPreviewTemplate), {
		onClick: () => {
			if (appData.isInBasket(item)) {
				appData.removeFromBasket(item);
				card.button = 'В корзину';
			} else {
				appData.addToBasket(item);
				card.button = 'Удалить из корзины';
			}
		},
	});

	card.button = appData.isInBasket(item) ? 'Удалить из корзины' : 'В корзину';
	modal.render({ content: card.render(item) });
});

events.on('basket:change', () => {
	page.counter = appData.basket.items.length;
	basket.items = appData.basket.items.map(id => {
		const item = appData.items.find((item) => item.id === id);
		console.log(item);
		const card = new Card(cloneTemplate(cardBasketTemplate), {
			onClick: () => appData.removeFromBasket(item),
		});
		return card.render(item);
	});

	basket.total = appData.basket.total;
})

events.on('basket:open', () => {
	modal.render({
		content: basket.render(),
	})
})

api
	.getProductList()
	.then(appData.setItems.bind(appData))
	.catch((err) => console.log(err));
