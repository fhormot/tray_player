import electron from 'electron';

const { app, BrowserWindow } = electron;

const windowWidth = 250;

class MainWindown extends BrowserWindow {
    constructor(url) {
        // this.windowWidth = 250;

        super({
            width: windowWidth,
            height: 1.6*windowWidth,
            webPreferences: {
              nodeIntegration: true
            },
            movable: false,
            resizable: false,
            frame: false,
            show: false
        });

        this.on('blur', this.onBlur.bind(this));

        this.loadURL(url);
    }

    onBlur() {
        this.hide();
    }
}

module.exports = MainWindown;