import {ThingType, MontyHallProblem} from "./lib/MontyHallProblem";

/**
 * Перечисление количеств вещей разных типов за дверьми.
 */
const THINGS_COUNT = {
    [ThingType.CAR]: 1,
    [ThingType.GOAT]: 2
};

/**
 * Количество открываемых дверей ведущим.
 */
const OPENS_DOORS_COUNT = 1;

/**
 * Перечисление вариантов статистик.
 */
enum EStatisticType {
    WINNINGS = <any>'winnings',
    LOSSES = <any>'losses'
}

/**
 * Статистика.
 */
interface IStatistic {
    winnings: number;
    losses: number
}

/**
 * Запуск серии эксперементов.
 *
 * @param {number} experimentsNumber Количество проводимых экспериментов.
 * @param {boolean} changeChoose Флаг, указывающий на то, следует ли игроку менять выбор после открытия дверей ведущим.
 *
 * @return IStatistic Статистика побед и проигрышей.
 */
function experimentRun(experimentsNumber: number, changeChoose: boolean = false): IStatistic {
    // Храним здесь статистику побед и проигрышей.
    let statistic = {
        winnings: 0,
        losses: 0
    };

    for (var i = 0; i < experimentsNumber; i++) {
        // Инициализируем функционал игры.
        const mhp = new MontyHallProblem({
            things: THINGS_COUNT,
            opensDoors: OPENS_DOORS_COUNT,
            winningThing: ThingType.CAR
        });

        // Запускаем игру.
        mhp.run();

        // Делаем выбор двери.
        const choiceDoor = mhp.choose();

        // Просим открыть двери с невыигрышными вещами.
        const openedDoors = mhp.openDoors();

        // Меняем выбор только если передали changeChoose = true.
        changeChoose && mhp.choose();

        // Просим сказать, выбрали ли мы дверь с выигрышной вещью (выиграли ли).
        const isWinner = mhp.isWinner();

        if (isWinner) {
            statistic.winnings++;
        } else {
            statistic.losses++;
        }
    }
    return statistic;
}

/**
 * Подсчет математического ожидания.
 *
 * @param {IStatistic} statistic Статистика побед и проигрышей.
 * @param {EStatisticType} target Требуемый тип статистики (статистика побед или проигрышей).
 *
 * @return number Математическое ожидание.
 */
function calcMean(statistic: IStatistic, target: EStatisticType): number {
    return statistic[target] / (statistic.losses + statistic.winnings);
}

/**
 * Печать результатов (статистики) серии экспериментов.
 *
 * @param {number} experimentsNumber Количество проводимых экспериментов.
 * @param {IStatistic} statistic Статистика побед и проигрышей.
 * @param {IStatistic} theoreticalValues Теоритические ожидания по статистике побед и проигрышей.
 */
function printResults(experimentsNumber: number, statistic: IStatistic, theoreticalValues: IStatistic) {
    const meanWinnings = calcMean(statistic, EStatisticType.WINNINGS);
    const meanLosses = calcMean(statistic, EStatisticType.LOSSES);

    console.log(`Серия из ${experimentsNumber} испытаний: ${meanWinnings} побед, ${meanLosses} проигрышей`);
    console.log(`Отклонения: победы - ${Math.abs(meanWinnings - theoreticalValues.winnings)}, проигрыши - ${Math.abs(meanLosses - theoreticalValues.losses)}`);
    console.log('-------------------------------------------');
}

/**
 * Подсчет отклонения от теоритических ожиданий в серии испытаний.
 *
 * @param {IStatistic} statistic Статистика побед и проигрышей.
 * @param {IStatistic} theoreticalValues Теоритические ожидания по статистике побед и проигрышей.
 */
function calcDeviation(statistic: IStatistic, theoreticalValues: IStatistic) {
    const meanWinnings = calcMean(statistic, EStatisticType.WINNINGS);
    const meanLosses = calcMean(statistic, EStatisticType.LOSSES);
    return {
        winnings: Math.abs(meanWinnings - theoreticalValues.winnings),
        losses: Math.abs(meanLosses - theoreticalValues.losses)
    }
}

/**
 * Теоритические ожидания по статистике побед и проигрышей (без смены выбора двери игроком).
 *
 * @type IStatistic
 */
const THEORETICAL_VALUES_WITHOUT_CHANGE_CHOOSE: IStatistic = {
    winnings: 0.333332,
    losses: 0.666667
};

/**
 * Теоритические ожидания по статистике побед и проигрышей (со сменой выбора двери игроком).
 *
 * @type IStatistic
 */
const THEORETICAL_VALUES_WITH_CHANGE_CHOOSE: IStatistic = {
    winnings: 0.666667,
    losses: 0.333332
};

/**
 * Множитель, применяемый к числу проводимых испытаний при их увеличении.
 *
 * @type number
 */
const EXPERIMENTS_NUMBER_FACTOR = 10;

/**
 * Верхняя граница числа проводимых испытаний (множитель EXPERIMENTS_NUMBER_FACTOR в заданной степени).
 *
 * @type number
 */
const EXPERIMENTS_NUMBER_UPPER_BOUND = Math.pow(EXPERIMENTS_NUMBER_FACTOR, 6);

// Осуществляем серии эксперементов, постепенно увеличивая их число, и считая при этом мат. ожидания и отклонения.
for (var i = EXPERIMENTS_NUMBER_FACTOR; i <= EXPERIMENTS_NUMBER_UPPER_BOUND; i*=EXPERIMENTS_NUMBER_FACTOR) {
    // Устанавливаем количество проводимых экспериментов.
    const EXPERIMENTS_NUMBER = i;

    const statisticWithoutChangeChoose: IStatistic = experimentRun(EXPERIMENTS_NUMBER, false);
    printResults(EXPERIMENTS_NUMBER, statisticWithoutChangeChoose, THEORETICAL_VALUES_WITHOUT_CHANGE_CHOOSE);

    const statisticWithChangeChoose: IStatistic = experimentRun(EXPERIMENTS_NUMBER, true);
    printResults(EXPERIMENTS_NUMBER, statisticWithChangeChoose, THEORETICAL_VALUES_WITH_CHANGE_CHOOSE);
}
