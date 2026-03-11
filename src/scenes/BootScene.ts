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

    // Load Doré illustrations (falls back to generated placeholders if missing)
    this.loadIllustrations();

    // Generate placeholder textures programmatically
    this.generatePlaceholderAssets();
  }

  private loadIllustrations(): void {
    const base = import.meta.env.BASE_URL;
    const illustrations: Record<string, string> = {
      'dore-fall-of-rebels':       'assets/illustrations/dore/paradise-lost-01.jpg',
      'dore-satan-rises':          'assets/illustrations/dore/paradise-lost-02.jpg',
      'dore-fallen-angels-roused': 'assets/illustrations/dore/paradise-lost-03.jpg',
      'dore-assembly':             'assets/illustrations/dore/paradise-lost-05.jpg',
      'dore-satan-throne':         'assets/illustrations/dore/paradise-lost-06.jpg',
      'dore-gates-of-hell':        'assets/illustrations/dore/paradise-lost-08.jpg',
      'dore-chaos':                'assets/illustrations/dore/paradise-lost-09.jpg',
      'dore-satan-descends':       'assets/illustrations/dore/paradise-lost-12.jpg',
      'dore-satan-despair':        'assets/illustrations/dore/paradise-lost-13.jpg',
      'dore-satan-views-eden':     'assets/illustrations/dore/paradise-lost-14.jpg',
      'dore-temptation-1':         'assets/illustrations/dore/paradise-lost-36.jpg',
      'dore-temptation-2':         'assets/illustrations/dore/paradise-lost-37.jpg',
      'dore-temptation-3':         'assets/illustrations/dore/paradise-lost-38.jpg',
      'dore-expulsion':            'assets/illustrations/dore/paradise-lost-49.jpg',
    };

    for (const [key, path] of Object.entries(illustrations)) {
      this.load.image(key, `${base}${path}`);
    }

    // Don't fail if illustrations haven't been downloaded yet
    this.load.on('loaderror', (file: Phaser.Loader.File) => {
      console.warn(`Optional asset not found: ${file.key} — using placeholder`);
    });
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

    // Pandemonium background — dark palace interior with golden tones
    const pandBg = this.make.graphics({ x: 0, y: 0 });
    for (let y = 0; y < 720; y++) {
      const t = y / 720;
      const r = Math.floor(15 + t * 35);
      const g = Math.floor(12 + t * 20);
      const b = Math.floor(5 + t * 8);
      pandBg.fillStyle(Phaser.Display.Color.GetColor(r, g, b));
      pandBg.fillRect(0, y, 1280, 1);
    }
    // Golden floor reflection
    for (let y = 500; y < 720; y++) {
      const t = (y - 500) / 220;
      const r = Math.floor(100 + t * 96);
      const g = Math.floor(80 + t * 64);
      const b = Math.floor(30 + t * 20);
      pandBg.fillStyle(Phaser.Display.Color.GetColor(r, g, b), 0.2 + t * 0.3);
      pandBg.fillRect(0, y, 1280, 1);
    }
    pandBg.generateTexture('pandemonium-bg', 1280, 720);
    pandBg.destroy();

    // Council chamber background — darker, more enclosed, warm upper glow
    const councilBg = this.make.graphics({ x: 0, y: 0 });
    for (let y = 0; y < 720; y++) {
      const t = y / 720;
      const r = Math.floor(10 + t * 20);
      const g = Math.floor(8 + t * 15);
      const b = Math.floor(5 + t * 8);
      councilBg.fillStyle(Phaser.Display.Color.GetColor(r, g, b));
      councilBg.fillRect(0, y, 1280, 1);
    }
    // Warm lamplight from above
    for (let y = 0; y < 200; y++) {
      const t = 1 - y / 200;
      councilBg.fillStyle(0xc4a45a, t * 0.1);
      councilBg.fillRect(0, y, 1280, 1);
    }
    councilBg.generateTexture('council-bg', 1280, 720);
    councilBg.destroy();

    // Gates of Hell background — cold void meeting hellfire, ominous threshold
    const gatesBg = this.make.graphics({ x: 0, y: 0 });
    for (let y = 0; y < 720; y++) {
      const t = y / 720;
      // Transition from cold blue-black (void above) to warm dark red (hellfire below)
      const r = Math.floor(8 + t * 30);
      const g = Math.floor(8 + (1 - t) * 15);
      const b = Math.floor(12 + (1 - t) * 25);
      gatesBg.fillStyle(Phaser.Display.Color.GetColor(r, g, b));
      gatesBg.fillRect(0, y, 1280, 1);
    }
    // Hellfire glow at the bottom
    for (let y = 520; y < 720; y++) {
      const t = (y - 520) / 200;
      const r = Math.floor(100 + t * 96);
      const g = Math.floor(30 + t * 20);
      const b = Math.floor(8);
      gatesBg.fillStyle(Phaser.Display.Color.GetColor(r, g, b), 0.15 + t * 0.35);
      gatesBg.fillRect(0, y, 1280, 1);
    }
    gatesBg.generateTexture('gates-of-hell-bg', 1280, 720);
    gatesBg.destroy();

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
