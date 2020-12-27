import electron from 'electron';

const { Tray, app, Menu, nativeImage } = electron;

class TrayIcon extends Tray {
  constructor(iconPath, mainWindow) {
    super(nativeImage.createEmpty());

    this.setImage(nativeImage.createFromPath(iconPath));
    this.mainWindow = mainWindow;

    this.setToolTip('TrayPlayer');
    this.on('click', this.onClick.bind(this));
    this.on('right-click', this.onRightClick.bind(this));
  }

  onClick(event, bounds) {
    // Click event bounds
    const { x, y } = bounds;

    // Window height and width
    const { height, width } = this.mainWindow.getBounds();

    if (this.mainWindow.isVisible()) {
      // this.mainWindow.hide();
    } else {
      const yPosition = process.platform === 'darwin' ? y : y - height;
      this.mainWindow.setBounds({
        x: x - width / 2,
        y: yPosition,
        height,
        width
      });
      this.mainWindow.show();
    }
  }

  onRightClick() {
    const menuConfig = Menu.buildFromTemplate([
      {
        label: 'Play/Pause',
        click: () => this.mainWindow.webContents.send('control:playback')
      },
      {
        label: 'Next',
        click: () => this.mainWindow.webContents.send('control:next')
      },
      {
        label: 'Previous',
        click: () => this.mainWindow.webContents.send('control:back')
      },
      {
        label: 'Mute',
        click: () => this.mainWindow.webContents.send('control:mute')
      },
      { type: "separator" },
      {
        label: 'Quit',
        click: () => app.quit()
      }
    ]);

    this.popUpContextMenu(menuConfig);
  }
}

module.exports = TrayIcon;