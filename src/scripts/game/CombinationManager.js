import { App } from "../system/App";

export class CombinationManager {
    constructor(board) {
        this.board = board;
    }

    getMatches() {
        let result = []; // найденные комбинации

        this.board.fields.forEach((checkingField) => {
            // проход по каждому правилу комбинации, указанному в конфигурации
            App.config.combinationRules.forEach((rule) => {
                let matches = [checkingField.tile];

                rule.forEach((position) => {
                    // определение координат соседнего поля относительно текущего
                    const row = checkingField.row + position.row;
                    const col = checkingField.col + position.col;
                    const comparingField = this.board.getField(row, col);

                    // проверка на существование и цвета плиток
                    if (comparingField && comparingField.tile.color === checkingField.tile.color) {
                        matches.push(comparingField.tile);
                    }
                });

                if (matches.length === rule.length + 1) {
                    result.push(matches);
                }
            });
        });

        return result;
    }
}
