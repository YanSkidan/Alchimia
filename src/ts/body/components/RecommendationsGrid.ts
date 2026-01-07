// src/ts/body/components/RecommendationsGrid.ts
import { Cocktail } from '../../types/cocktail';
import { CocktailCard } from './CocktailCard';

export class RecommendationsGrid {
  constructor(
    private container: HTMLElement,
    private cocktails: Cocktail[],
    private onCardClick: (cocktail: Cocktail) => void
  ) {}

  render(): void {
    this.clearContainer();
    
    // Если нет коктейлей - просто очищаем контейнер, без сообщения
    if (this.cocktails.length === 0) {
      return; // Просто выходим, ничего не показываем
    }

    this.renderCards();
  }

  private clearContainer(): void {
    this.container.innerHTML = '';
  }

  private renderCards(): void {
    this.cocktails.forEach(cocktail => {
      const card = new CocktailCard(cocktail, this.onCardClick);
      this.container.appendChild(card.getElement());
    });
  }

  updateCocktails(cocktails: Cocktail[]): void {
    this.cocktails = cocktails;
    this.render();
  }
}