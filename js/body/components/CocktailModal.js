export class CocktailModal {
    constructor() {
        this.lastScrollPosition = 0;
        this.modal = document.getElementById('cocktail-modal');
        if (!this.modal) {
            throw new Error('Модальное окно не найдено в DOM');
        }
        this.closeButton = this.modal.querySelector('.cocktail-modal__close');
        this.setupEvents();
    }
    setupEvents() {
        this.closeButton.addEventListener('click', () => this.close());
        // Закрытие по клику на фон
        this.modal.addEventListener('click', (event) => {
            if (event.target === this.modal) {
                this.close();
            }
        });
        // Закрытие по Escape
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && this.modal.open) {
                this.close();
            }
        });
        // Сохраняем позицию скролла перед открытием
        this.modal.addEventListener('open', () => {
            this.lastScrollPosition = window.pageYOffset || document.documentElement.scrollTop;
        });
        // Восстанавливаем позицию скролла при закрытии
        this.modal.addEventListener('close', () => {
            this.restoreScrollPosition();
        });
    }
    show(cocktail) {
        // Сохраняем текущую позицию скролла страницы
        this.lastScrollPosition = window.pageYOffset || document.documentElement.scrollTop;
        // Сброс скролла всех элементов внутри модального окна
        this.resetModalScroll();
        this.fillModalData(cocktail);
        this.modal.showModal();
    }
    resetModalScroll() {
        // Сбрасываем скролл самого диалога
        this.modal.scrollTop = 0;
        this.modal.scrollLeft = 0;
        // Находим все прокручиваемые элементы внутри модального окна
        const scrollableElements = this.modal.querySelectorAll('*');
        scrollableElements.forEach(element => {
            const htmlElement = element;
            // Проверяем, является ли элемент прокручиваемым
            if (htmlElement.scrollHeight > htmlElement.clientHeight ||
                htmlElement.scrollWidth > htmlElement.clientWidth) {
                htmlElement.scrollTop = 0;
                htmlElement.scrollLeft = 0;
            }
        });
        // Дополнительно: сброс скролла для распространенных классов
        const commonScrollContainers = this.modal.querySelectorAll('.cocktail-detail__content, .cocktail-detail__body, [class*="scroll"], [class*="container"]');
        commonScrollContainers.forEach(container => {
            container.scrollTop = 0;
            container.scrollLeft = 0;
        });
    }
    restoreScrollPosition() {
        // Восстанавливаем позицию скролла страницы после закрытия модального окна
        // Используем requestAnimationFrame для гарантированного выполнения после всех обновлений DOM
        requestAnimationFrame(() => {
            window.scrollTo({
                top: this.lastScrollPosition,
                behavior: 'instant' // Используем 'instant' вместо 'auto' для мгновенного скролла
            });
            // Альтернативный способ (более надежный в некоторых браузерах)
            document.documentElement.scrollTop = this.lastScrollPosition;
            document.body.scrollTop = this.lastScrollPosition;
        });
    }
    fillModalData(cocktail) {
        // Находим все элементы
        const image = this.modal.querySelector('.cocktail-detail__image');
        const title = this.modal.querySelector('.cocktail-detail__title');
        const category = this.modal.querySelector('.cocktail-detail__category');
        const glass = this.modal.querySelector('.cocktail-detail__glass');
        const badge = this.modal.querySelector('.cocktail-detail__alcohol-badge');
        const description = this.modal.querySelector('.cocktail-detail__text');
        const ingredientsList = this.modal.querySelector('.cocktail-detail__list');
        const instructionsList = this.modal.querySelectorAll('.cocktail-detail__list')[1];
        const history = this.modal.querySelectorAll('.cocktail-detail__text')[1];
        const tagsContainer = this.modal.querySelector('.cocktail-detail__tags');
        // Заполняем данные
        const width = window.innerWidth;
        if (width < 1024) {
            image.src = `/images/${cocktail.imageG}`;
        }
        else {
            image.src = `/images/${cocktail.image}`;
        }
        image.alt = cocktail.name;
        title.textContent = cocktail.name;
        category.textContent = cocktail.category;
        glass.textContent = cocktail.glassType;
        // Бейдж алкоголя
        badge.textContent = cocktail.isAlcoholic ? 'ALC' : 'Non ALC';
        badge.className = 'cocktail-detail__alcohol-badge';
        badge.classList.add(cocktail.isAlcoholic ? 'alcoholic' : 'non-alcoholic');
        // Описание
        description.textContent = cocktail.description;
        // Ингредиенты
        ingredientsList.innerHTML = '';
        cocktail.ingredients.forEach(ingredient => {
            const li = document.createElement('li');
            if (ingredient.name != "Лед" && ingredient.amount != "По вкусу" && ingredient.amount != "Для шейкера" && ingredient.amount != "Для ободка") {
                li.textContent = `${ingredient.name} - ${ingredient.amount} ${ingredient.unit}`;
                ingredientsList.appendChild(li);
            }
            else {
                li.textContent = `${ingredient.name} - ${ingredient.amount}`;
                ingredientsList.appendChild(li);
            }
        });
        // Инструкции
        instructionsList.innerHTML = '';
        cocktail.instructions.forEach((instruction, index) => {
            const li = document.createElement('li');
            li.textContent = instruction;
            instructionsList.appendChild(li);
        });
        // История
        history.textContent = cocktail.history;
        // Теги
        tagsContainer.innerHTML = '';
        cocktail.tags.forEach(tag => {
            const span = document.createElement('span');
            span.className = 'cocktail-detail__tag';
            span.textContent = tag;
            tagsContainer.appendChild(span);
        });
        // Дополнительно: сброс скролла после заполнения данных
        setTimeout(() => {
            this.resetModalScroll();
        }, 10);
    }
    close() {
        // Сброс скролла содержимого модального окна
        this.resetModalScroll();
        this.modal.close();
        // Восстанавливаем позицию скролла страницы
        this.restoreScrollPosition();
    }
    isOpen() {
        return this.modal.open;
    }
}
