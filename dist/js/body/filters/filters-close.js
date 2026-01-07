/**
 * Класс для управления закрытием фильтров на мобильных устройствах
 * Закрывает предыдущие открытые меню при открытии нового
 */
export class MobileFilters {
    constructor() {
        this.mobileQuery = window.matchMedia('(max-width: 768px)');
        this.handleFilterChange = (event) => {
            const target = event.target;
            // Проверяем, что это наш toggle и он стал активным на мобильном
            if (target.classList.contains('filters__dropdown-toggle') &&
                target.checked &&
                this.mobileQuery.matches) {
                this.closeOtherDropdowns(target);
            }
        };
        this.init();
    }
    init() {
        // Один обработчик на весь документ
        document.addEventListener('change', this.handleFilterChange);
    }
    closeOtherDropdowns(currentToggle) {
        // Закрываем все другие открытые dropdown'ы
        document.querySelectorAll('.filters__dropdown-toggle:checked').forEach(toggle => {
            if (toggle !== currentToggle) {
                toggle.checked = false;
            }
        });
    }
}
