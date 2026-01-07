import { CocktailCard } from './CocktailCard.js';
export class RecommendationsGrid {
    constructor(container, cocktails, onCardClick) {
        this.container = container;
        this.cocktails = cocktails;
        this.onCardClick = onCardClick;
    }
    render() {
        this.clearContainer();
        // Если нет коктейлей - просто очищаем контейнер, без сообщения
        if (this.cocktails.length === 0) {
            return; // Просто выходим, ничего не показываем
        }
        this.renderCards();
    }
    clearContainer() {
        this.container.innerHTML = '';
    }
    renderCards() {
        this.cocktails.forEach(cocktail => {
            const card = new CocktailCard(cocktail, this.onCardClick);
            this.container.appendChild(card.getElement());
        });
    }
    updateCocktails(cocktails) {
        this.cocktails = cocktails;
        this.render();
    }
}
