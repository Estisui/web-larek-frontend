# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Архитектура

![UML](web-larek.drawio.png)

Взаимодействия внутри приложения происходят через события. Модели инициализируют события, слушатели событий в основном коде выполняют передачу данных компонентам отображения, а также вычислениями между этой передачей, и еще они меняют значения в моделях.

Используется паттерн MVP. Следовательно, код приложения разделен на три слоя:

- слой данных: отвечает за хранение и изменения данных

- слой представления: отвечает за вывод данных на страницу

- презентер: отвечает за взаимодействие данных и представления, описывая логику приложения (`src/index.ts`)

## Базовые классы

### Класс `Api`

Базовый класс для отправки и получения запросов. В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

`constructor(baseUrl: string, options: RequestInit = {})` - принимает url сервера, по которому будут совершаться запросы и общие опции для этих запросов.

Поля:

- `baseUrl` - базовый адрес сервера
- `options` - объект с заголовками запросов

Методы:

- `handleResponse` - принимает ответ от сервера как параметр, и обрабатывает его,возвращая результат в формате `json` или отклоненный промис с возникшей ошибкой
- `_request` - выполняет запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер
- `get` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер
- `post` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется 'POST' запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.

### Класс EventEmitter

Классическая реализация брокера событий. Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

`constructor()` - инициализирует брокер событий

Поля:

- `_events` - `Map`, состоящий из ивентов и подписчиков

Методы:

- `on` - подписка на событие
- `off` - отписка от события
- `emit` - инициализация события
- `onAll` - подписка одновременно на все события
- `offAll` - сброс ВСЕХ обработчиков
- `trigger` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие

### Класс `Component<T>`

Абстрактный базовый класс, предназначенным для создания компонентов пользовательского интерфейса. Класс обеспечивает инструментарий для управления DOM элементами и поведением компонента. Наследуется всеми классами представления(View)

`constructor(container: HTMLElement)` - принимает элемент контейнера, в который будет помещен компонент

Методы:

- `toggleClass` - переключается класс для переданного элемента
- `setText` - устанавливает текстовое содержимое для переданного элемента
- `setImage` - устанавливает изображения и альтернативный текст для изоображения(опционально) для переданного элемента типа HTMLImageElement
- `setDisabled` - изменяет статус блокировки для переданного элемента
- `setHidden`, `setVisible` - скрывает, отображает переданный элемент
- `render` - рендерит компонент, используя переданные данные. Метод должен быть переназначен в дочерних классах

### Класс `View<T>`

Базовый класс, расширяющий класс `Component`, добавляя в него поле `events`, в которое записывается брокер событий, чтобы была возможность их генерации.

`constructor(container: HTMLElement, protected readonly events: IEvents)` - принимает элемент контейнера, в который будет помещен компонент и брокер событий

Методы: полностью наследуются от класса `Component<T>`

## Общие классы

### Класс `Modal`

Реализует модальное окно. Предоставляет методы для управления состоянием окна и генерации событий (`modal:open`, `modal:close`).

`constructor(container: HTMLElement, protected events: IEvents)` -  принимает DOM-элемент модального окна на базе шаблона и брокер событий

Поля:

- `_closeButton` - элемент кнопки закрытия модального окна
- `_content` - элемент с содержимым модального окна

Сеттеры:

- `content` - меняет содержимое модального окна

Методы:

- `open` - открывает модальное окно и эмитит ивент `modal:open`
- `close` - закрывает и стирает содержимое модального окна, также эмитит ивент `modal:close`
- `render` - рендерит модальное окно с переданным содержимым и открывает его

### Класс `Form`

Реализует общий компонент формы. Предоставляет базовые методы и сеттеры для работы с отображнем элементов формы. Эмитит событие `${field}:change` при инпуте и событие `${this.container.name}:submit` при сабмите формы.

`constructor(protected container: HTMLFormElement, protected events: IEvents)` -  принимает контейнер с формой и брокер событий

Поля:

- `_submit` - элемент кнопки для сабмита формы
- `_errors` - контейнер с сообщениями об ошибках

Сеттеры:

- `valid` - дизэйблид кнопку сабмита формы в зависимости от переданного состояния
- `errors` - меняет содержмое компонента с ошибками формы на переданное

Методы:

- `onInputChange` - эмитит событие `${field}:change` с переданными параметрами
- `render` - рендерит компонент формы, используя переданное состояние

## Компоненты

### Класс `AppData`

Отвечает за хранение данных и логику работы с ними.

`constructor(protected events: IEvents)` - принимает при создании брокер событий

Поля:

- `items` - массив товаров
- `preview` - товар, который открыт в данный момент
- `basket` - объект корзины (товары в ней и их сумму)
- `order` - данные заказа
- `formErrors` - данные валидации формы
- `events` - инстанс брокера событий (добавляется через конструктор)

Методы:

- `setItems` - меняет массив товаров на переданный и эмитит событие `items:change`
- `setPreview` - меняет превью на переданный товар и эмитит событие `preview:change`
- `isInBasket` - проверяет наличие переданного товара в корзине
- `addToBasket` - добавляет переданный товар в корзину и эмитит событие `basket:change`
- `removeFromBasket` - убирает переданный товар из корзины и эмитит событие `basket:change`
- `clearBasket` - очищает корзину и эмитит событие `basket:change`
- `setPayment` - меняет способ оплаты на переданный
- `setOrderField` - меняет содержимое переданного поля на полученное значение
- `validateOrder` - проверяет корректность заполнения формы
- `clearOrder` - очищает объект заказа

### Класс `Basket`

Реализует корзину. Предоставляет сеттеры для изменения отображения корзины.

`constructor(protected events: IEvents)` -  принимает брокер событий

Поля:

- `template` - элемент шаблона корзины
- `_list` - элемент содержимого корзины (карточек товаров)
- `_total` - элемент суммы товаров в корзине
- `_button` - элемент кнопки оформления заказа в корзине

Сеттеры:

- `items` - меняет содержимое в корзине в зависимости от переданных товаров
- `selected` - меняет состояние кнопки в зависимости от наличия переданных товаров
- `total` - меняет значение в элементе суммы товаров на переданное

### Класс `Card`

Реализует карточку товара (используется на главной, в модальном окне и в корзине).

`constructor(container: HTMLElement, actions?: ICardActions)` - DOM-элемент карточки на базе шаблона и опционально объект с колбэком для вызова при клике

Поля:

- `_title` - элемент заголовка карточки
- `_image` - элемент картинки карточки
- `_price` - элемент цены карточки
- `_category` - элемент категории карточки
- `_description` - элемент описания карточки
- `_button` - элемент кнопки карточки

Сеттеры:

- `id` - принимает и задает id карточки
- `title` - меняет содержимое заголовка на полученное
- `price` - меняет содержимое контейнера с ценой на полученное
- `category` - меняет содержимое контейнера с категорией на полученное
- `image` - меняет изображение и альтернативный текст в карточке
- `description` - меняет содержимое контейнера с описанием на полученное
- `button` - устанавливает текст на кнопке

### Класс `Order`

Реализует компонент формы отправки заказа.

`constructor(container: HTMLFormElement, events: IEvents)` -  принимает контейнер с формой и брокер событий

Поля:

- `_paymentCard` - кнопка выбора оплаты картой
- `_paymentCash` - кнопка выбора оплатой при получении

Сеттеры:

- `payment` - меняет классы кнопок в зависимости от переданного типа оплаты
- `address` - меняет содержимое поля `address` в форме
- `email` - меняет содержимое поля `email` в форме
- `phone` - меняет содержимое поля `phone` в форме

### Класс `Page`

Реализует главную страницу - каталог товаров с счетчиком. Имеет набор сеттеров, отвечающих за DOM-элементы главной страницы. Генерирует событие `basket:open` при клике на кнопку корзины.

`constructor(container: HTMLElement, events: IEvents)` - принимает DOM-элемент главной страницы и брокер событий.

Поля:

- `_counter` - элемент счетчика на странице
- `_catalog` - элемент каталога на странице
- `_wrapper` - элемент обертки на странице
- `_basket` - элемент корзины на странице

Сеттеры:

- `counter` - меняет содержимое счетчика на полученное
- `catalog` - меняет содержмое каталога на полученные элементы
- `locked` - меняет класс обертки на значение, соответствующее переданному

### Класс `Success`

Реализует окно с подтверждением заказа.

`constructor (container: HTMLElement, events: IEvents, actions: ISuccessActions)` -  принимает DOM-элемент окна на базе шаблона, брокер событий и объект с колбэком для вызова при нажатии кнопки в окне

Поля:

- `_close` - элемент кнопки закрытия окна
- `_total` - элемент с суммой заказа

Сеттеры:

- `total` - меняет содержимое элемента с суммой заказа

### Класс `WebLarekApi`

Дополняет базовый класс `Api` методами работы с конкретным сервером проекта.

`constructor(cdn: string, baseUrl: string, options?: RequestInit)` - принимает url сервера с контентом, url сервера, по которому будут совершаться запросы, и общие опции для этих запросов

Поля:

- `cdn` - url сервера с контентом

Методы:

- `getProductList` - возвращает массив продуктов с сервера
- `getProduct` - возвращает продукт с сервера по переданному `id`
- `createOrder` - отправляет переданный заказ на сервер и возвращает результат

## Презентер

Отвечает за взаимодействие компонентов, находится в файле `index.ts`. Взаимодействие происходит за счет брокера событий, который их остлеживает.

### События приложения

#### События изменения данных (генерируются из модели данных)

- `items:change` - изменение массива товаров каталога
- `preview:change` - изменение открываемого в модальном окне товара
- `basket:change` - изменение списка товаров корзины
- `formErrors:change` - изменение в списке ошибок валидации формы

#### События интерфейса (генерируются из классов представления)

- `modal:open` - открытие любого модального окна
- `modal:close` - закрытие любого модального окна
- `basket:open` - открытие модального окна корзины
- `card:select` - выбор карточки
- `order:open` - открытие окна оформления заказа
- `${form}:submit` - отправка формы с кастомным названием
- `${form}.${field}:change` - изменение поля с кастомным названием в форме с кастомным названием

## Основные типы/интерфейсы

- `IProduct` - интерфейс со всеми свойствами продукта
- `IBasket` - интерфейс корзины с ее содержимым и общей стоимостью товаров в ней
- `IOrder` - интерфейс заказа для отправки на сервер
- `OrderForm` - тип формы заказа
- `IOrderResult` - интерфейс результата отправки заказа
