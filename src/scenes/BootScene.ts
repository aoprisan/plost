import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload(): void {
    // Create loading bar
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(width / 2 - 160, height / 2 - 15, 320, 30);

    const loadingText = this.add.text(width / 2, height / 2 - 40, 'Descending...', {
      fontFamily: 'Georgia, serif',
      fontSize: '18px',
      color: '#c4a45a',
    });
    loadingText.setOrigin(0.5, 0.5);

    this.load.on('progress', (value: number) => {
      progressBar.clear();
      progressBar.fillStyle(0xc4a45a, 1);
      progressBar.fillRect(width / 2 - 155, height / 2 - 10, 310 * value, 20);
    });

    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
    });

    // Generate placeholder textures programmatically
    this.generatePlaceholderAssets();
  }

  private generatePlaceholderAssets(): void {
    // Lake of Fire background — dark, fiery landscape
    const bgGraphics = this.make.graphics({ x: 0, y: 0 });
    // Sky — dark crimson gradient
    for (let y = 0; y < 720; y++) {
      const t = y / 720;
      const r = Math.floor(10 + t * 40);
      const g = Math.floor(5 + t * 10);
      const b = Math.floor(5);
      bgGraphics.fillStyle(Phaser.Display.Color.GetColor(r, g, b));
      bgGraphics.fillRect(0, y, 1280, 1);
    }
    // Fiery lake at the bottom
    for (let y = 500; y < 720; y++) {
      const t = (y - 500) / 220;
      const r = Math.floor(120 + t * 80);
      const g = Math.floor(30 + t * 30);
      const b = Math.floor(5);
      const alpha = 0.3 + t * 0.5;
      bgGraphics.fillStyle(Phaser.Display.Color.GetColor(r, g, b), alpha);
      bgGraphics.fillRect(0, y, 1280, 1);
    }
    bgGraphics.generateTexture('lake-of-fire-bg', 1280, 720);
    bgGraphics.destroy();

    // Satan silhouette — tall, imposing figure
    const satanGraphics = this.make.graphics({ x: 0, y: 0 });
    satanGraphics.fillStyle(0x1a1a1a);
    // Body
    satanGraphics.fillEllipse(50, 140, 40, 80);
    // Head
    satanGraphics.fillCircle(50, 90, 18);
    // Wings (left)
    satanGraphics.fillTriangle(20, 110, -20, 60, 40, 120);
    // Wings (right)
    satanGraphics.fillTriangle(80, 110, 120, 60, 60, 120);
    // Crown-like horns
    satanGraphics.fillTriangle(42, 75, 38, 60, 46, 78);
    satanGraphics.fillTriangle(58, 75, 62, 60, 54, 78);
    satanGraphics.generateTexture('satan-silhouette', 140, 200);
    satanGraphics.destroy();

    // Beelzebub silhouette
    const beelGraphics = this.make.graphics({ x: 0, y: 0 });
    beelGraphics.fillStyle(0x222222);
    beelGraphics.fillEllipse(45, 130, 35, 70);
    beelGraphics.fillCircle(45, 85, 15);
    beelGraphics.fillTriangle(15, 100, -10, 65, 35, 110);
    beelGraphics.fillTriangle(75, 100, 100, 65, 55, 110);
    beelGraphics.generateTexture('beelzebub-silhouette', 120, 180);
    beelGraphics.destroy();
  }

  create(): void {
    this.scene.start('MainMenuScene');
  }
}
