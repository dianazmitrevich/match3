import * as PIXI from "pixi.js";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { Loader } from "./Loader";

class Application {
    run(config) {
        gsap.registerPlugin(PixiPlugin);
        PixiPlugin.registerPIXI(PIXI);

        this.config = config;

        // экземпляр приложения pixi.js
        this.app = new PIXI.Application({ resizeTo: window });
        document.body.appendChild(this.app.view);

        // загрузчик ресурсов с помощью переданной конфигурации
        this.loader = new Loader(this.app.loader, this.config);

        // процесс предзагрузки ресурсов и после завершения вызываем метод start
        this.loader.preload().then(() => this.start());
    }

    // получение текстуры загруженного ресурса по ключу
    res(key) {
        return this.loader.resources[key].texture;
    }

    // создание спрайта на основе загруженного ресурса
    sprite(key) {
        return new PIXI.Sprite(this.res(key));
    }

    // стартовая сцена приложения
    start() {
        this.scene = new this.config["startScene"](); // экземпляр стартовой сцены
        this.app.stage.addChild(this.scene.container);
    }
}

export const App = new Application();
