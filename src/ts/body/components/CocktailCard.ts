// src/ts/body/components/CocktailCard.ts
import { Cocktail } from '../../types/cocktail';

export class CocktailCard {
  private element: HTMLElement;
  
  constructor(
    private cocktail: Cocktail,
    private onClick: (cocktail: Cocktail) => void
  ) {
    this.element = this.createFromTemplate();
    this.attachEvents();
  }

  private createFromTemplate(): HTMLElement {
    // 1. Берем шаблон из HTML
    const template = document.getElementById('cocktail-card-template');
    if (!template) throw new Error('Шаблон карточки не найден');
    
    // 2. Клонируем
    const clone = (template as HTMLTemplateElement).content.cloneNode(true) as DocumentFragment;
    const card = clone.querySelector('.cocktail-card') as HTMLElement;
    
    // 3. Заполняем ТОЛЬКО данные, без создания HTML
    this.fillCardData(card);
    
    return card;
  }

  private fillCardData(card: HTMLElement): void {
    // Все элементы уже есть в шаблоне, просто заполняем
    const img = card.querySelector('.cocktail-card__image') as HTMLImageElement;
    const title = card.querySelector('.cocktail-card__title') as HTMLElement;
    const desc = card.querySelector('.cocktail-card__description') as HTMLElement;
    const glass = card.querySelector('.cocktail-card__glass') as HTMLElement;
    const category = card.querySelector('.cocktail-card__category') as HTMLElement;
    const count = card.querySelector('.cocktail-card__ingredients-count') as HTMLElement;
    const badge = card.querySelector('.cocktail-card__alcohol-badge') as HTMLElement;
    const tagsContainer = card.querySelector('.cocktail-card__tags') as HTMLElement;
    
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

  private fillTags(container: HTMLElement): void {
    // Создаем элементы для тегов
    this.cocktail.tags.slice(0, 3).forEach(tag => {
      const span = document.createElement('span');
      span.className = 'cocktail-card__tag';
      span.textContent = tag;
      container.appendChild(span);
    });
  }

  private attachEvents(): void {
    this.element.addEventListener('click', () => this.onClick(this.cocktail));
  }

  getElement(): HTMLElement {
    return this.element;
  }
}