export class CocktailCard {
    constructor(cocktail, onClick) {
        this.cocktail = cocktail;
        this.onClick = onClick;
        this.element = this.createFromTemplate();
        this.attachEvents();
    }
    createFromTemplate() {
        // 1. Берем шаблон из HTML
        const template = document.getElementById('cocktail-card-template');
        if (!template)
            throw new Error('Шаблон карточки не найден');
        // 2. Клонируем
        const clone = template.content.cloneNode(true);
        const card = clone.querySelector('.cocktail-card');
        // 3. Заполняем ТОЛЬКО данные, без создания HTML
        this.fillCardData(card);
        return card;
    }
    fillCardData(card) {
        // Все элементы уже есть в шаблоне, просто заполняем
        const img = card.querySelector('.cocktail-card__image');
        const title = card.querySelector('.cocktail-card__title');
        const desc = card.querySelector('.cocktail-card__description');
        const glass = card.querySelector('.cocktail-card__glass');
        const category = card.querySelector('.cocktail-card__category');
        const count = card.querySelector('.cocktail-card__ingredients-count');
        const badge = card.querySelector('.cocktail-card__alcohol-badge');
        const tagsContainer = card.querySelector('.cocktail-card__tags');
        // Заполняем
        card.dataset.id = this.cocktail.id;
        img.src = `/images/${this.cocktail.imageG}`;
        img.alt = this.cocktail.name;
        title.textContent = this.cocktail.name;
        desc.textContent = this.cocktail.description;
        glass.textContent = this.cocktail.glassType;
        category.textContent = this.cocktail.category;
        count.textContent = `${this.cocktail.ingredients.length} ингр.`;
        // Бейдж
        badge.textContent = this.cocktail.isAlcoholic ? 'ALC' : 'NON';
        badge.classList.add(this.cocktail.isAlcoholic ? 'alcoholic' : 'non-alcoholic');
        // Теги (это ЕДИНСТВЕННОЕ место где создаем элементы)
        this.fillTags(tagsContainer);
    }
    fillTags(container) {
        // Создаем элементы для тегов
        this.cocktail.tags.slice(0, 3).forEach(tag => {
            const span = document.createElement('span');
            span.className = 'cocktail-card__tag';
            span.textContent = tag;
            container.appendChild(span);
        });
    }
    attachEvents() {
        this.element.addEventListener('click', () => this.onClick(this.cocktail));
    }
    getElement() {
        return this.element;
    }
}
