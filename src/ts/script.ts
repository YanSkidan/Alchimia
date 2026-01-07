// src/ts/script.ts
import { mockCocktails } from './data/cocktails.js';
import { initCheckmarkTracking } from './body/filters/checkmark-tracking.js';
import { MobileFilters } from './body/filters/filters-close.js';
import { RecommendationsGrid } from './body/components/RecommendationsGrid.js';
import { CocktailModal } from './body/components/CocktailModal.js';
import { CocktailFilter } from './body/components/CocktailFilter.js';

class App {
  private grid: RecommendationsGrid;
  private modal: CocktailModal;
  private filter: CocktailFilter;
  private allCocktails = mockCocktails;
  private recommendationsContainer: HTMLElement;

  constructor() {
    const container = document.getElementById('recommendations-container');
    if (!container) throw new Error('Контейнер не найден');
    
    this.recommendationsContainer = container;
    this.grid = this.createGrid();
    this.modal = new CocktailModal();
    this.filter = new CocktailFilter();
    
    this.init();
  }

  private createGrid(): RecommendationsGrid {
    return new RecommendationsGrid(
      this.recommendationsContainer,
      this.allCocktails,
      (cocktail) => this.modal.show(cocktail)
    );
  }

  private init(): void {
    initCheckmarkTracking();
    new MobileFilters();
    
    this.grid.render();
    this.subscribeToFilters();
  }

  private subscribeToFilters(): void {
    document.addEventListener('filtersChanged', () => {
      const filtered = this.filter.filterCocktails(this.allCocktails);
      
      if (filtered.length === 0) {
        // Показываем сообщение "нет результатов"
        this.showNoResultsMessage();
      } else {
        // Показываем отфильтрованные коктейли
        this.grid.updateCocktails(filtered);
      }
    });
  }

  private showNoResultsMessage(): void {
    // Очищаем контейнер
    this.recommendationsContainer.innerHTML = '';
    
    // Создаем и добавляем сообщение
    const message = CocktailFilter.createNoResultsMessage();
    this.recommendationsContainer.appendChild(message);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new App();
});