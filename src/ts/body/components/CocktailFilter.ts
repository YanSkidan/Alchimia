// src/ts/body/components/CocktailFilter.ts
import { Cocktail } from '../../types/cocktail.js';

type FilterType = 'taste' | 'type' | 'ingredient';

export class CocktailFilter {
  private activeFilters: Record<FilterType, Set<string>> = {
    taste: new Set(),
    type: new Set(),
    ingredient: new Set()
  };

  private searchQuery: string = '';

  constructor() {
    this.initEventDelegation();
    // Инициализируем hover с небольшой задержкой
    setTimeout(() => this.initDropdownHover(), 100);
  }

  private initEventDelegation(): void {
    document.addEventListener('change', (e: Event) => this.handleChange(e));
    document.addEventListener('input', (e: Event) => this.handleSearch(e));
    document.addEventListener('click', (e: MouseEvent) => this.handleClick(e));
    document.addEventListener('keydown', (e: KeyboardEvent) => this.handleKeydown(e));
    
    // Обработчик для удаления тегов (делегирование)
    document.addEventListener('click', (e) => this.handleTagRemove(e));
  }

  // ДОБАВЛЕНО: закрытие меню при уходе мыши на ПК
  private initDropdownHover(): void {
    // Только для ПК (ширина больше 768px)
    if (window.innerWidth <= 768) return;

    const dropdowns = document.querySelectorAll('.filters__dropdown');
    
    dropdowns.forEach(dropdown => {
      const content = dropdown.querySelector('.filters__dropdown-content');
      
      if (!content) return;
      
      // Навешиваем обработчик mouseleave только на контент меню
      content.addEventListener('mouseleave', (e) => {
        // ПРОВЕРЯЕМ ЕЩЕ РАЗ, ЧТО МЫ НА ПК
        if (window.innerWidth <= 768) return;
        
        const relatedTarget = (e as MouseEvent).relatedTarget as HTMLElement;
        
        // Если мышь ушла из контента меню
        // Закрываем меню через небольшое время
        setTimeout(() => {
          const toggle = dropdown.querySelector('.filters__dropdown-toggle') as HTMLInputElement;
          if (toggle && toggle.checked) {
            // Проверяем, что мышь не вернулась в триггер или другое меню
            const isMouseInTrigger = relatedTarget?.closest('.filters__dropdown-trigger');
            const isMouseInOtherMenu = relatedTarget?.closest('.filters__dropdown-content');
            
            if (!isMouseInTrigger && !isMouseInOtherMenu) {
              toggle.checked = false;
            }
          }
        }, 150);
      });
    });
  }

  private handleChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    
    if (target.matches('.filters__checkbox')) {
      this.updateFilter(target);
    }
  }

  private handleSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    
    if (target.matches('.hat__div-search__search')) {
      this.searchQuery = target.value.trim().toLowerCase();
      this.triggerFilter();
    }
  }

  private handleClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    
    if (target.matches('.hat__div-search__button')) {
      const searchInput = document.querySelector('.hat__div-search__search') as HTMLInputElement;
      this.searchQuery = searchInput.value.trim().toLowerCase();
      this.triggerFilter();
    }
    
    // Двойной клик по триггеру для сброса группы фильтров
    if (event.detail === 2 && target.matches('.filters__dropdown-trigger')) {
      const dropdown = target.closest('.filters__dropdown');
      if (dropdown) {
        this.resetFilterGroup(dropdown as HTMLElement);
      }
    }
  }

  private handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && 
        (event.target as HTMLElement).matches('.hat__div-search__search')) {
      const searchInput = event.target as HTMLInputElement;
      this.searchQuery = searchInput.value.trim().toLowerCase();
      this.triggerFilter();
    }
    
    if (event.key === 'Escape' && 
        document.activeElement?.matches('.hat__div-search__search')) {
      const searchInput = document.activeElement as HTMLInputElement;
      searchInput.value = '';
      this.searchQuery = '';
      this.triggerFilter();
    }
  }

  private handleTagRemove(event: Event): void {
    const target = event.target as HTMLElement;
    
    // Проверяем, что кликнули на кнопку удаления
    if (target.matches('.selected-tag__remove') || 
        target.closest('.selected-tag__remove')) {
      const tagElement = target.closest('.selected-tag') as HTMLElement;
      if (!tagElement) return;
      
      const type = tagElement.dataset.type as FilterType;
      const value = tagElement.dataset.value;
      
      if (type && value) {
        // Находим соответствующий чекбокс и снимаем его
        const checkbox = document.querySelector<HTMLInputElement>(
          `.filters__checkbox[name="${type}"][value="${value}"]`
        );
        
        if (checkbox) {
          checkbox.checked = false;
          this.updateFilter(checkbox);
        }
      }
      
      event.stopPropagation();
    }
  }

  private updateFilter(checkbox: HTMLInputElement): void {
    const { name, value, checked } = checkbox;
    const filterType = name as FilterType;
    const filterSet = this.activeFilters[filterType];

    if (!filterSet) return;

    if (checked) {
      filterSet.add(value);
      this.addSelectedTag(name, value);
    } else {
      filterSet.delete(value);
      this.removeSelectedTag(name, value);
    }

    this.updateTriggerState(checkbox);
    this.triggerFilter();
  }

  private addSelectedTag(name: string, value: string): void {
    const label = this.getFilterLabel(name, value);
    
    // Найти контейнер для этой группы фильтров
    const container = this.getTagContainer(name);
    
    if (!container) {
      console.error(`Контейнер для тегов ${name} не найден`);
      return;
    }
    
    // Проверяем, не добавлен ли уже такой тег
    const existingTag = container.querySelector(
      `.selected-tag[data-value="${value}"]`
    );
    
    if (existingTag) return;
    
    const tagElement = document.createElement('div');
    tagElement.className = 'selected-tag';
    tagElement.dataset.type = name;
    tagElement.dataset.value = value;
    
    tagElement.innerHTML = `
      <span class="selected-tag__label">${label}</span>
      <button type="button" class="selected-tag__remove" aria-label="Удалить фильтр ${label}">
        ×
      </button>
    `;
    
    container.appendChild(tagElement);
    container.classList.add('has-tags');
  }

  private removeSelectedTag(name: string, value: string): void {
    // Найти контейнер для этой группы
    const container = this.getTagContainer(name);
    
    if (!container) return;
    
    const tagElement = container.querySelector(
      `.selected-tag[data-value="${value}"]`
    );
    
    if (tagElement) {
      tagElement.remove();
    }
    
    // Скрываем контейнер, если тегов нет
    if (container.children.length === 0) {
      container.classList.remove('has-tags');
    }
  }

  private getTagContainer(filterType: string): HTMLElement | null {
    return document.querySelector(`.filters__dropdown-tags[data-type="${filterType}"]`);
  }

  private updateTriggerState(checkbox: HTMLInputElement): void {
    const dropdown = checkbox.closest('.filters__dropdown');
    if (!dropdown) return;
    
    const trigger = dropdown.querySelector('.filters__dropdown-trigger');
    
    if (trigger) {
      const checkboxes = dropdown.querySelectorAll<HTMLInputElement>('.filters__checkbox');
      const hasSelection = Array.from(checkboxes).some(cb => cb.checked);
      (trigger as HTMLElement).classList.toggle('has-selection', hasSelection);
    }
  }

  private resetFilterGroup(dropdown: HTMLElement): void {
    const checkboxes = dropdown.querySelectorAll<HTMLInputElement>('.filters__checkbox');
    const firstCheckbox = checkboxes[0];
    
    if (!firstCheckbox) return;
    
    const filterType = firstCheckbox.name as FilterType;
    
    // Найти контейнер тегов этой группы
    const tagContainer = this.getTagContainer(filterType);
    
    if (tagContainer) {
      // Очищаем теги
      tagContainer.innerHTML = '';
      tagContainer.classList.remove('has-tags');
    }
    
    // Снимаем галочки
    checkboxes.forEach(checkbox => {
      checkbox.checked = false;
    });
    
    // Очищаем в памяти
    this.activeFilters[filterType].clear();
    
    // Обновляем триггер
    const trigger = dropdown.querySelector('.filters__dropdown-trigger');
    if (trigger) {
      (trigger as HTMLElement).classList.remove('has-selection');
    }
    
    this.triggerFilter();
  }

  private getFilterLabel(name: string, value: string): string {
    const labelMap: Record<string, Record<string, string>> = {
      taste: {
        'sweet': 'Сладкий',
        'sour': 'Кислый',
        'bitter': 'Горький',
        'fresh': 'Свежий'
      },
      type: {
        'aperitif': 'Аперитив',
        'digestif': 'Дежестив',
        'strong': 'Крепкий',
        'light': 'Легкий'
      },
      ingredient: {
        'rum': 'Ром',
        'vodka': 'Водка',
        'gin': 'Джин',
        'whiskey': 'Виски'
      }
    };

    return labelMap[name]?.[value] || value;
  }

  public filterCocktails(cocktails: Cocktail[]): Cocktail[] {
    if (!this.hasActiveFilters() && !this.searchQuery) {
      return cocktails;
    }

    return cocktails.filter(cocktail => {
      if (this.searchQuery && !this.matchesSearch(cocktail)) {
        return false;
      }

      // Для вкусов: ОДИН ИЗ выбранных должен совпадать (ИЛИ)
      if (this.activeFilters.taste.size > 0) {
        const hasAnyTaste = this.matchesAnyTags(cocktail.tags, this.activeFilters.taste, 'taste');
        if (!hasAnyTaste) return false;
      }

      // Для типов: ОДИН ИЗ выбранных должен совпадать (ИЛИ)
      if (this.activeFilters.type.size > 0) {
        const hasAnyType = this.matchesAnyTags(cocktail.tags, this.activeFilters.type, 'type');
        if (!hasAnyType) return false;
      }

      // Для ингредиентов: ОДИН ИЗ выбранных должен совпадать (ИЛИ)
      if (this.activeFilters.ingredient.size > 0) {
        const hasAnyIngredient = this.matchesAnyIngredients(cocktail);
        if (!hasAnyIngredient) return false;
      }

      return true;
    });
  }

  // НОВЫЙ МЕТОД: проверяет есть ли активные фильтры
  public hasActiveFilters(): boolean {
    return this.activeFilters.taste.size > 0 ||
           this.activeFilters.type.size > 0 ||
           this.activeFilters.ingredient.size > 0 ||
           this.searchQuery !== '';
  }

  // НОВЫЙ МЕТОД: создает сообщение "нет результатов"
  // НОВЫЙ МЕТОД: создает сообщение "нет результатов"
  public static createNoResultsMessage(): HTMLElement {
    const message = document.createElement('div');
    message.className = 'no-results-message';
    message.innerHTML = `
      <div class="no-results__content">
        <svg class="no-results__icon" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M9.172 9.172a4 4 0 015.656 5.656M15 9a6 6 0 00-9 5.25"/>
          <path d="M12 19a7 7 0 100-14 7 7 0 000 14z"/>
          <path d="M3 3l18 18"/>
        </svg>
        <h3 class="no-results__title">Коктейли не найдены</h3>
        <p class="no-results__text">
          Попробуйте изменить фильтры
        </p>
      </div>
    `;
    return message;
  }

  private matchesSearch(cocktail: Cocktail): boolean {
    const query = this.searchQuery.toLowerCase();
    const searchableText = [
      cocktail.name,
      cocktail.description,
      cocktail.category,
      cocktail.glassType,
      ...cocktail.tags,
      ...cocktail.ingredients.map(i => i.name)
    ].join(' ').toLowerCase();

    return searchableText.includes(query);
  }

  // НОВЫЙ МЕТОД: проверяет, что ХОТЯ БЫ ОДИН тег совпадает (ИЛИ)
  private matchesAnyTags(cocktailTags: string[], filterSet: Set<string>, filterType: 'taste' | 'type'): boolean {
    const tagMap: Record<string, Record<string, string[]>> = {
      taste: {
        'sweet': ['сладкий', 'сладкое', 'сладкая'],
        'sour': ['кислый', 'кислое', 'кислая'],
        'bitter': ['горький', 'горькое', 'горькая'],
        'fresh': ['свежий', 'свежее', 'свежая', 'освежающий']
      },
      type: {
        'aperitif': ['аперитив'],
        'digestif': ['дежестив', 'дижестив'],
        'strong': ['крепкий', 'крепкое', 'крепкая'],
        'light': ['легкий', 'легкое', 'легкая']
      }
    };

    const typeMap = tagMap[filterType];
    
    // ХОТЯ БЫ ОДИН фильтр должен совпадать
    return Array.from(filterSet).some(filterValue => {
      const matchingTags = typeMap[filterValue] || [filterValue];
      return matchingTags.some(tag => {
        const tagLower = tag.toLowerCase();
        return cocktailTags.some(cocktailTag => 
          cocktailTag.toLowerCase().includes(tagLower) ||
          tagLower.includes(cocktailTag.toLowerCase())
        );
      });
    });
  }

  // НОВЫЙ МЕТОД: проверяет, что ХОТЯ БЫ ОДИН ингредиент совпадает (ИЛИ)
  private matchesAnyIngredients(cocktail: Cocktail): boolean {
    const ingredientMap: Record<string, string[]> = {
      'rum': ['ром'],
      'vodka': ['водка'],
      'gin': ['джин'],
      'whiskey': ['виски', 'бурбон']
    };

    const cocktailIngredients = cocktail.ingredients.map(i => i.name.toLowerCase());

    // ХОТЯ БЫ ОДИН фильтр должен совпадать
    return Array.from(this.activeFilters.ingredient).some(filter => {
      const mappedIngredients = ingredientMap[filter] || [filter];
      return mappedIngredients.some(mapped => 
        cocktailIngredients.some(ci => ci.includes(mapped))
      );
    });
  }

  // СТАРЫЕ МЕТОДЫ (оставляем на случай если понадобятся для других целей)
  private matchesAllTags(cocktailTags: string[], filterSet: Set<string>, filterType: 'taste' | 'type'): boolean {
    const tagMap: Record<string, Record<string, string[]>> = {
      taste: {
        'sweet': ['сладкий', 'сладкое', 'сладкая'],
        'sour': ['кислый', 'кислое', 'кислая'],
        'bitter': ['горький', 'горькое', 'горькая'],
        'fresh': ['свежий', 'свежее', 'свежая', 'освежающий']
      },
      type: {
        'aperitif': ['аперитив'],
        'digestif': ['дежестив', 'дижестив'],
        'strong': ['крепкий', 'крепкое', 'крепкая'],
        'light': ['легкий', 'легкое', 'легкая']
      }
    };

    const typeMap = tagMap[filterType];
    
    return Array.from(filterSet).every(filterValue => {
      const matchingTags = typeMap[filterValue] || [filterValue];
      return matchingTags.some(tag => {
        const tagLower = tag.toLowerCase();
        return cocktailTags.some(cocktailTag => 
          cocktailTag.toLowerCase().includes(tagLower) ||
          tagLower.includes(cocktailTag.toLowerCase())
        );
      });
    });
  }

  private matchesAllIngredients(cocktail: Cocktail): boolean {
    const ingredientMap: Record<string, string[]> = {
      'rum': ['ром'],
      'vodka': ['водка'],
      'gin': ['джин'],
      'whiskey': ['виски', 'бурбон']
    };

    const cocktailIngredients = cocktail.ingredients.map(i => i.name.toLowerCase());

    return Array.from(this.activeFilters.ingredient).every(filter => {
      const mappedIngredients = ingredientMap[filter] || [filter];
      return mappedIngredients.some(mapped => 
        cocktailIngredients.some(ci => ci.includes(mapped))
      );
    });
  }

  private triggerFilter(): void {
    document.dispatchEvent(new CustomEvent('filtersChanged'));
  }

  public resetAllFilters(): void {
    this.activeFilters.taste.clear();
    this.activeFilters.type.clear();
    this.activeFilters.ingredient.clear();
    this.searchQuery = '';

    // Сбрасываем все чекбоксы
    const checkboxes = document.querySelectorAll<HTMLInputElement>('.filters__checkbox');
    checkboxes.forEach(cb => {
      cb.checked = false;
    });

    // Очищаем все контейнеры тегов
    const tagContainers = document.querySelectorAll<HTMLElement>('.filters__dropdown-tags');
    tagContainers.forEach(container => {
      container.innerHTML = '';
      container.classList.remove('has-tags');
    });

    // Очищаем поле поиска
    const searchInput = document.querySelector<HTMLInputElement>('.hat__div-search__search');
    if (searchInput) {
      searchInput.value = '';
    }

    // Сбрасываем состояние триггеров
    const triggers = document.querySelectorAll('.has-selection');
    triggers.forEach(el => {
      (el as HTMLElement).classList.remove('has-selection');
    });

    this.triggerFilter();
  }
}