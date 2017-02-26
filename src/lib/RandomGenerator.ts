/**
 * Генератор случайных чисел без повторений.
 */
export class RandomGenerator {

    /**
     * Вспомогательный массив с индексами (набор случайных чисел).
     *
     * @type number[]
     */
    private remaining: number[];

    /**
     * Конструктор.
     *
     * @param {number} low Нижняя граница для генерируемых чисел (указывается null, если передается remaining).
     * @param {number} high Верхняя граница для генерируемых чисел (указывается null, если передается remaining).
     * @param {number[]} [remaining] Набор случайных чисел (по умолчанию формируется автоматически исходы из нижней и верхней границ).
     */
    constructor(low: number, high: number, remaining: number[] = null) {
        if (remaining === null) {
            this.init(low, high);
        } else {
            this.remaining = remaining;
        }
    }

    /**
     * Инициализация вспомогательного массива с индексами (набора случайных чисел).
     *
     * @param {number} low Нижняя граница для генерируемых чисел.
     * @param {number} high Верхняя граница для генерируемых чисел.
     */
    private init(low, high) {
        this.remaining = [];
        for (var i = low; i <= high; i++) {
            this.remaining.push(i);
        }
    }

    /**
     * Принудительное извлечение числа (извлеченное число более не будет участвовать в генерации).
     *
     * @param {number} number Извлекаемое число.
     */
    public extract(number: number) {
        const index = this.remaining.indexOf(number);
        if (index === -1) {
            throw new Error('Извлекаемое число находится за пределах указанных границ.');
        }
        this.remaining.splice(index, 1);
    }

    /**
     * Получение очередного случайного числа в пределах указанных границ.
     *
     * @return number Случайное число.
     */
    public get(): number {
        var index = Math.floor(Math.random() * this.remaining.length);
        var val = this.remaining[index];
        this.remaining.splice(index, 1);
        return val;
    }
}
