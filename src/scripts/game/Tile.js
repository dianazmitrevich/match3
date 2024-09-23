import { gsap } from "gsap";
import { App } from "../system/App";

export class Tile {
    constructor(color) {
        this.color = color;
        this.sprite = App.sprite(this.color);
        this.sprite.anchor.set(0.5);
    }

    setPosition(position) {
        this.sprite.x = position.x;
        this.sprite.y = position.y;
    }

    moveTo(position, duration, delay, ease) {
        return new Promise((resolve) => {
            gsap.to(this.sprite, {
                duration, // длительность анимации
                delay, // задержка перед началом
                ease, // эффект плавности движения
                pixi: {
                    x: position.x,
                    y: position.y,
                },
                onComplete: () => {
                    resolve();
                },
            });
        });
    }

    // проверка на соседа
    isNeighbour(tile) {
        return Math.abs(this.field.row - tile.field.row) + Math.abs(this.field.col - tile.field.col) === 1;
    }

    remove() {
        if (!this.sprite) {
            return;
        }

        this.sprite.destroy();
        this.sprite = null;

        if (this.field) {
            this.field.tile = null;
            this.field = null;
        }
    }

    // анимация падения плитки с использованием bounce-эффекта
    fallDownTo(position, delay) {
        return this.moveTo(position, 0.5, delay, "bounce.out");
    }
}
