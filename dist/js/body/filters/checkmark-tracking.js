/**
 * Отслеживание состояния чекбоксов и добавление классов для стилизации
 * При выборе любой галочки добавляет класс has-selection к триггеру dropdown
 */
export const initCheckmarkTracking = () => {
    // Вешаем ОДИН обработчик на весь документ
    document.addEventListener('change', (event) => {
        const target = event.target;
        // Проверяем, что кликнули по чекбоксу фильтра
        if (!target.matches('.filters__checkbox'))
            return;
        // Находим родительский dropdown
        const dropdown = target.closest('.filters__dropdown');
        if (!dropdown)
            return;
        // Находим все чекбоксы и триггер в ЭТОМ dropdown
        const checkboxes = dropdown.querySelectorAll('.filters__checkbox');
        const trigger = dropdown.querySelector('.filters__dropdown-trigger');
        if (!trigger)
            return;
        // Проверяем есть ли выбранные чекбоксы
        const hasSelection = Array.from(checkboxes).some((cb) => cb.checked);
        trigger.classList.toggle('has-selection', hasSelection);
    });
};
