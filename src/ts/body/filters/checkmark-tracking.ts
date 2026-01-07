/**
 * Отслеживание состояния чекбоксов и добавление классов для стилизации
 * При выборе любой галочки добавляет класс has-selection к триггеру dropdown
 */
export const initCheckmarkTracking = (): void => {
  // Вешаем ОДИН обработчик на весь документ
  document.addEventListener('change', (event: Event) => {
    const target = event.target as HTMLInputElement;
    
    // Проверяем, что кликнули по чекбоксу фильтра
    if (!target.matches('.filters__checkbox')) return;
    
    // Находим родительский dropdown
    const dropdown = target.closest('.filters__dropdown') as HTMLElement;
    if (!dropdown) return;
    
    // Находим все чекбоксы и триггер в ЭТОМ dropdown
    const checkboxes = dropdown.querySelectorAll<HTMLInputElement>('.filters__checkbox');
    const trigger = dropdown.querySelector<HTMLElement>('.filters__dropdown-trigger');
    
    if (!trigger) return;
    
    // Проверяем есть ли выбранные чекбоксы
    const hasSelection = Array.from(checkboxes).some((cb: HTMLInputElement) => cb.checked);
    trigger.classList.toggle('has-selection', hasSelection);
  });
};
