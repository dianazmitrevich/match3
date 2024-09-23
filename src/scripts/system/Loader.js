export class Loader {
    constructor(loader, config) {
        this.loader = loader;
        this.config = config;
        this.resources = {};
    }

    preload() {
        for (const asset of this.config.loader) {
            // извлечение имени файла
            let key = asset.key.substr(asset.key.lastIndexOf("/") + 1);
            key = key.substring(0, key.indexOf("."));

            // проверка является ли изображением
            if (asset.key.indexOf(".png") !== -1 || asset.key.indexOf(".jpg") !== -1) {
                // добавление ресурса в очередь загрузки
                this.loader.add(key, asset.data.default);
            }
        }

        // возвращаем промис, который разрешится после загрузки всех ресурсов
        return new Promise((resolve) => {
            this.loader.load((loader, resources) => {
                this.resources = resources;
                // разрешаем промис
                resolve();
            });
        });
    }
}
