/**
 * Класс для управления закрытием фильтров на мобильных устройствах
 * Закрывает предыдущие открытые меню при открытии нового
 */
export class MobileFilters {
    private mobileQuery = window.matchMedia('(max-width: 768px)');

    constructor() {
        this.init();
    }

    private init(): void {
        // Один обработчик на весь документ
        document.addEventListener('change', this.handleFilterChange);
    }

    private handleFilterChange = (event: Event): void => {
        const target = event.target as HTMLInputElement;
        
        // Проверяем, что это наш toggle и он стал активным на мобильном
        if (target.classList.contains('filters__dropdown-toggle') && 
            target.checked && 
            this.mobileQuery.matches) {
            this.closeOtherDropdowns(target);
        }
    }

    private closeOtherDropdowns(currentToggle: HTMLInputElement): void {
        // Закрываем все другие открытые dropdown'ы
        document.querySelectorAll('.filters__dropdown-toggle:checked').forEach(toggle => {
            if (toggle !== currentToggle) {
                (toggle as HTMLInputElement).checked = false;
            }
        });
    }
}
