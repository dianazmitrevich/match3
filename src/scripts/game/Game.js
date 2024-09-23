import * as PIXI from "pixi.js";
import { App } from "../system/App";
import { Board } from "./Board";
import { CombinationManager } from "./CombinationManager";

export class Game {
    constructor() {
        this.container = new PIXI.Container();
        this.createBackground();

        this.board = new Board();
        this.container.addChild(this.board.container);

        // обработчик клика по плиткам
        this.board.container.on("tile-touch-start", this.onTileClick.bind(this));

        this.combinationManager = new CombinationManager(this.board);
        this.removeStartMatches(); // удаление стартовых совпадений
    }

    removeStartMatches() {
        let matches = this.combinationManager.getMatches();

        while (matches.length) {
            this.removeMatches(matches); // удаляем плитки, образующие совпадения

            const fields = this.board.fields.filter((field) => field.tile === null); // находим пустые поля

            fields.forEach((field) => {
                this.board.createTile(field); // создаем новые плитки для пустых полей
            });

            matches = this.combinationManager.getMatches(); // проверяем наличие новых совпадений
        }
    }

    createBackground() {
        this.bg = App.sprite("bg");
        this.bg.width = window.innerWidth;
        this.bg.height = window.innerHeight;
        this.container.addChild(this.bg);
    }

    onTileClick(tile) {
        if (this.disabled) {
            return;
        }

        if (this.selectedTile) {
            if (!this.selectedTile.isNeighbour(tile)) {
                this.clearSelection(); // снимаем выделение с предыдущей плитки
                this.selectTile(tile); // выделяем новую плитку
            } else {
                this.swap(this.selectedTile, tile); // меняем местами плитки
            }
        } else {
            this.selectTile(tile);
        }
    }

    // замена двух плиток местами
    swap(selectedTile, tile, reverse) {
        this.disabled = true;
        selectedTile.sprite.zIndex = 2;

        selectedTile.moveTo(tile.field.position, 0.24);

        this.clearSelection();

        tile.moveTo(selectedTile.field.position, 0.24).then(() => {
            this.board.swap(selectedTile, tile);

            if (!reverse) {
                const matches = this.combinationManager.getMatches(); // проверяем на комбинации

                if (matches.length) {
                    this.processMatches(matches);
                } else {
                    this.swap(tile, selectedTile, true); // возвращаем плитки обратно, если комбинаций нет
                }
            } else {
                this.disabled = false;
            }
        });
    }

    removeMatches(matches) {
        matches.forEach((match) => {
            match.forEach((tile) => {
                tile.remove();
            });
        });
    }

    processMatches(matches) {
        this.removeMatches(matches);
        this.processFallDown() // обработка падения плиток
            .then(() => this.addTiles())
            .then(() => this.onFallDownOver()); // проверяем произошло ли падение
    }

    // после завершения падения плиток
    onFallDownOver() {
        const matches = this.combinationManager.getMatches(); // проверяем новые совпадения

        if (matches.length) {
            this.processMatches(matches);
        } else {
            this.disabled = false;
        }
    }

    // добавление новых плиток на пустые места
    addTiles() {
        return new Promise((resolve) => {
            const fields = this.board.fields.filter((field) => field.tile === null);
            let total = fields.length;
            let completed = 0;

            fields.forEach((field) => {
                const tile = this.board.createTile(field);
                tile.sprite.y = -800;

                const delay = (Math.random() * 2) / 10 + 0.3 / (field.row + 1); // задержка перед падением плитки

                tile.fallDownTo(field.position, delay).then(() => {
                    ++completed;

                    if (completed >= total) {
                        resolve();
                    }
                });
            });
        });
    }

    // обработка падения плиток на пустые места
    processFallDown() {
        return new Promise((resolve) => {
            let completed = 0;
            let started = 0;

            for (let row = this.board.rows - 1; row >= 0; row--) {
                for (let col = this.board.cols - 1; col >= 0; col--) {
                    const field = this.board.getField(row, col);

                    if (!field.tile) {
                        ++started;

                        this.fallDownTo(field).then(() => {
                            ++completed;

                            if (completed >= started) {
                                resolve();
                            }
                        });
                    }
                }
            }
        });
    }

    fallDownTo(emptyField) {
        for (let row = emptyField.row - 1; row >= 0; row--) {
            let fallingField = this.board.getField(row, emptyField.col);

            if (fallingField.tile) {
                const fallingTile = fallingField.tile;
                fallingTile.field = emptyField;
                emptyField.tile = fallingTile;
                fallingField.tile = null;

                return fallingTile.fallDownTo(emptyField.position);
            }
        }

        return Promise.resolve();
    }

    clearSelection() {
        if (this.selectedTile) {
            this.selectedTile.field.unselect();
            this.selectedTile = null;
        }
    }

    selectTile(tile) {
        this.selectedTile = tile;
        this.selectedTile.field.select();
    }
}
