import {RandomGenerator} from "./RandomGenerator";

/**
 * Типы вещей, которые могут находиться за дверьми.
 */
export enum EThingType {
    /**
     * Машина.
     */
    CAR,
    /**
     * Коза.
     */
    GOAT
}

/**
 * Парадокс Монти Холла.
 */
export class MontyHallProblem {
    /**
     * Генератор случайных чисел без повторений для расстановки вещей за дверьми.
     *
     * @type RandomGenerator
     */
    private arrangeRandomGenerator: RandomGenerator;

    /**
     * Генератор случайных чисел без повторений для открытия дверей с невыигрышными вещами после совершения выбора.
     *
     * @type RandomGenerator
     */
    private opensDoorRandomGenerator: RandomGenerator;

    /**
     * Перечисление количеств вещей разных типов за дверьми.
     *
     * @type { [key: number]: number }
     */
    private numbers: {
        [key: number]: number;
    };

    /**
     * Количество открываемых дверей с невыигрышными вещами.
     *
     * @type number
     */
    private opensDoorsNumber: number;

    /**
     * Перечисление вещей, которые были расставлены за соответсвующими дверями.
     *
     * @type number[]
     */
    private doors: number[] = [];

    /**
     * Выбранная игроком дверь.
     *
     * @type number
     */
    private choice: number;

    /**
     * Тип выигрышной вещи.
     *
     * @type number
     */
    private winningThing: EThingType;

    /**
     * Конструктор.
     *
     * @param { [key: number]: number } things Перечисление количеств вещей разных типов за дверьми.
     * @param {number} opensDoors Количество открываемых дверей с невыигрышными вещами.
     * @param {number[]} winningThing Тип выигрышной вещи.
     */
    constructor({things, opensDoors, winningThing}) {
        this.numbers = things;
        this.opensDoorsNumber = opensDoors;
        this.winningThing = winningThing;
    }

    /**
     * Расстановка вещей за двери.
     *
     * @param {EThingType} EThingType Тип расставляемых вещей.
     */
    private arrange(EThingType: EThingType) {
        for (let i = 0; i < this.numbers[EThingType]; i++) {
            this.doors[this.arrangeRandomGenerator.get()] = EThingType;
        }
    }

    /**
     * Определение того, выбрал ли игрок дверь с выигрышной вещью.
     *
     * @return boolean Флаг, указывающий на то, выбрал ли игрок дверь с выигрышной вещью.
     */
    public isWinner() {
        return this.doors[this.choice] === this.winningThing;
    }

    /**
     * Открытие дверей с невыигрышными вещами после совершения выбора игроком.
     *
     * @return number[] Массив с открытыми дверьми с невыигрышными вещами.
     */
    public openDoors(): number[] {
        if (this.choice === undefined) {
            throw new Error('Попытка открыть двери с невыигрышными вещами, когда выбор игроком ещё не сделан.');
        }
        const notWinningThingIndexes: number[] = this.doors.map((value, index) => {
            return value === this.winningThing || index === this.choice ? null : index;
        }).filter((value) => value !== null);
        const notWinningRandomGenerator: RandomGenerator = new RandomGenerator(null, null, notWinningThingIndexes);

        let openedDoors: number[] = [];
        for (let i = 0; i < this.opensDoorsNumber; i++) {
            const notWinningIndex = notWinningRandomGenerator.get();
            this.opensDoorRandomGenerator.extract(notWinningIndex);
            openedDoors.push(notWinningIndex);
        }

        return openedDoors;
    }

    /**
     * Выбор двери игроком.
     *
     * @param {number} doorNumber Номер выбираемой двери (по умолчанию выбирается случайная дверь).
     *
     * @return number Номер выбранной двери.
     */
    public choose(doorNumber: number = null) {
        if (doorNumber !== null) {
            this.opensDoorRandomGenerator.extract(doorNumber);
            this.choice = doorNumber;
        } else {
            this.choice = this.opensDoorRandomGenerator.get();
        }
        return this.choice;
    }

    /**
     * Запуск игры: инициализация генераторов случайных чисел и расстановка вещей за двери.
     */
    public run() {
        const thingsNumber: number = Object.keys(this.numbers).reduce((a, b) => a + this.numbers[b], 0);
        this.arrangeRandomGenerator = new RandomGenerator(1, thingsNumber);
        this.opensDoorRandomGenerator = new RandomGenerator(1, thingsNumber);
        for (const thing in this.numbers) {
            this.arrange(parseInt(thing));
        }
    }
}
