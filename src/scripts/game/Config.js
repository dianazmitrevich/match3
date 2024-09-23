import { Game } from "./Game";
import { Tools } from "../system/Tools";

// определение количества столбцов на доске в зависимости от ширины окна
const getBoardColumns = () => {
    return window.innerWidth < 600 ? 5 : 7;
};

export const Config = {
    loader: Tools.massiveRequire(require["context"]("./../../sprites/", true, /\.(mp3|png|jpe?g)$/)),
    startScene: Game,
    tilesColors: ["icon1", "icon2", "icon3", "icon4", "icon5", "icon6"],
    board: {
        rows: 7,
        cols: getBoardColumns(),
    },
    // правила для определения комбинаций плиток
    combinationRules: [
        [
            { col: 1, row: 0 }, // совпадение из трёх плиток по горизонтали, 1 плитка справа
            { col: 2, row: 0 }, // 2 плитка справа от текущей
        ],
        [
            { col: 0, row: 1 }, // совпадение из трёх плиток по вертикали, 1 плитка снизу
            { col: 0, row: 2 }, // ещё одна снизу
        ],
    ],
};
