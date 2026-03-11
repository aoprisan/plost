import Phaser from 'phaser';
import { DialogueManager } from '../systems/DialogueManager';

export class GardenOfEdenScene extends Phaser.Scene {
  private dialogueManager!: DialogueManager;
  private gardenGraphics!: Phaser.GameObjects.Graphics;
  private elapsed = 0;

  constructor() {
    super({ key: 'GardenOfEdenScene' });
  }

  create(): void {
    const { width, height } = this.cameras.main;

    // Background — use Doré engraving if available, otherwise procedural
    const bgKey = this.textures.exists('dore-satan-views-eden') ? 'dore-satan-views-eden' : 'garden-of-eden-bg';
    const bg = this.add.image(width / 2, height / 2, bgKey);
    if (bgKey === 'dore-satan-views-eden') {
      const scaleX = width / bg.width;
      const scaleY = height / bg.height;
      bg.setScale(Math.min(scaleX, scaleY));
      bg.setTint(0xccddaa);
    }

    // Garden overlay — dappled light and foliage
    this.gardenGraphics = this.add.graphics();

    // Trees and foliage silhouettes
    this.createFoliage();

    // Rivers of Eden
    this.createRivers();

    // Adam and Eve figures in the distance
    this.createFigures();

    // Satan perched in the Tree of Life
    this.createSatanFigure();

    // Fireflies / motes of light
    this.createLightMotes();

    // Fade in from darkness
    this.cameras.main.fadeIn(3000, 0, 0, 0);

    // Gentle garden ambience — shifting light
    this.time.addEvent({
      delay: 50,
      loop: true,
      callback: () => {
        this.elapsed += 50;
        this.updateGardenOverlay();
      },
    });

    // Start dialogue
    this.time.delayedCall(3500, () => {
      this.startDialogue();
    });
  }

  private updateGardenOverlay(): void {
    const { width, height } = this.cameras.main;
    const t = this.elapsed / 1000;

    this.gardenGraphics.clear();

    // Dappled sunlight from above
    const sunAlpha = 0.02 + Math.sin(t * 0.15) * 0.01;
    this.gardenGraphics.fillStyle(0xfff8c0, Math.max(0, sunAlpha));
    this.gardenGraphics.fillRect(0, 0, width, 200);

    // Warm ground glow
    const groundAlpha = 0.015 + Math.sin(t * 0.2) * 0.005;
    this.gardenGraphics.fillStyle(0x88aa44, Math.max(0, groundAlpha));
    this.gardenGraphics.fillRect(0, height - 180, width, 180);
  }

  private createFoliage(): void {
    const { width, height } = this.cameras.main;

    // Tree canopy silhouettes along edges
    const foliage = this.add.graphics();

    // Left canopy
    foliage.fillStyle(0x1a2a0a, 0.6);
    foliage.fillEllipse(80, 150, 200, 250);
    foliage.fillEllipse(40, 300, 140, 200);

    // Right canopy
    foliage.fillStyle(0x1a2a0a, 0.5);
    foliage.fillEllipse(width - 60, 180, 180, 280);
    foliage.fillEllipse(width - 100, 350, 160, 200);

    // Tree of Life — central, towering
    foliage.fillStyle(0x2a1a0a, 0.4);
    foliage.fillRect(width * 0.48, 50, 20, 350);
    foliage.fillStyle(0x1a3a0a, 0.45);
    foliage.fillEllipse(width * 0.49, 80, 200, 140);
    foliage.fillEllipse(width * 0.47, 160, 160, 120);

    foliage.setAlpha(0);
    this.tweens.add({
      targets: foliage,
      alpha: 1,
      duration: 3000,
      ease: 'Power2',
    });
  }

  private createRivers(): void {
    const { width, height } = this.cameras.main;

    // Rivers — sinuous blue-silver lines
    const rivers = this.add.graphics();
    rivers.lineStyle(2, 0x6688aa, 0.3);

    // Main river
    rivers.beginPath();
    rivers.moveTo(width * 0.3, height);
    rivers.splineTo([
      width * 0.35, height * 0.85,
      width * 0.4, height * 0.75,
      width * 0.38, height * 0.65,
      width * 0.45, height * 0.55,
    ]);
    rivers.strokePath();

    // Branch river
    rivers.lineStyle(1.5, 0x6688aa, 0.2);
    rivers.beginPath();
    rivers.moveTo(width * 0.45, height * 0.55);
    rivers.splineTo([
      width * 0.55, height * 0.6,
      width * 0.65, height * 0.7,
      width * 0.75, height * 0.85,
      width * 0.8, height,
    ]);
    rivers.strokePath();

    rivers.setAlpha(0);
    this.tweens.add({
      targets: rivers,
      alpha: 1,
      duration: 4000,
      delay: 500,
      ease: 'Power2',
    });
  }

  private createFigures(): void {
    const { width, height } = this.cameras.main;

    // Adam and Eve — small distant figures walking together
    const figures = this.add.graphics();

    // Adam
    figures.fillStyle(0xc4a080);
    figures.fillEllipse(width * 0.55, height * 0.68, 8, 20);
    figures.fillCircle(width * 0.55, height * 0.655, 4);

    // Eve
    figures.fillStyle(0xd4b090);
    figures.fillEllipse(width * 0.57, height * 0.685, 7, 18);
    figures.fillCircle(width * 0.57, height * 0.67, 3.5);

    figures.setAlpha(0);
    this.tweens.add({
      targets: figures,
      alpha: 0.7,
      duration: 3000,
      delay: 1500,
      ease: 'Power2',
    });

    // Gentle movement — walking together
    this.tweens.add({
      targets: figures,
      x: 30,
      duration: 20000,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1,
    });
  }

  private createSatanFigure(): void {
    const { width, height } = this.cameras.main;

    // Satan perched in the Tree of Life, watching from above
    const satan = this.add.graphics();
    satan.fillStyle(0x1a1a1a);
    // Crouching body
    satan.fillEllipse(0, 0, 16, 24);
    // Head
    satan.fillCircle(0, -16, 7);
    // Wings folded back
    satan.fillTriangle(-8, -5, -22, -14, -4, 6);
    satan.fillTriangle(8, -5, 22, -14, 4, 6);
    // Dark aura
    satan.fillStyle(0x0a0a0a, 0.12);
    satan.fillCircle(0, -4, 22);

    satan.setPosition(width * 0.49, 200);
    satan.setAlpha(0);

    // Fade in late — the watcher revealed
    this.tweens.add({
      targets: satan,
      alpha: 0.65,
      duration: 2000,
      delay: 2500,
      ease: 'Power2',
    });

    // Subtle sway — perched, restless
    this.tweens.add({
      targets: satan,
      x: satan.x + 3,
      duration: 4000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  private createLightMotes(): void {
    const { width, height } = this.cameras.main;

    // Floating motes of golden light — pollen, fireflies, Eden's radiance
    for (let i = 0; i < 25; i++) {
      const x = Phaser.Math.Between(100, width - 100);
      const y = Phaser.Math.Between(100, height - 100);
      const size = Phaser.Math.FloatBetween(0.8, 2);
      const brightness = Phaser.Math.FloatBetween(0.1, 0.35);

      const mote = this.add.circle(x, y, size, 0xc4a45a, brightness);

      // Float upward slowly
      this.tweens.add({
        targets: mote,
        y: y - Phaser.Math.Between(40, 120),
        alpha: 0,
        duration: Phaser.Math.Between(4000, 8000),
        delay: Phaser.Math.Between(0, 5000),
        ease: 'Sine.easeIn',
        onComplete: () => {
          mote.setPosition(
            Phaser.Math.Between(100, width - 100),
            Phaser.Math.Between(height * 0.5, height - 50)
          );
          mote.setAlpha(brightness);
          this.tweens.add({
            targets: mote,
            y: mote.y - Phaser.Math.Between(40, 120),
            alpha: 0,
            duration: Phaser.Math.Between(4000, 8000),
            ease: 'Sine.easeIn',
            repeat: -1,
          });
        },
      });
    }
  }

  private async startDialogue(): Promise<void> {
    this.dialogueManager = new DialogueManager();

    const response = await fetch(`${import.meta.env.BASE_URL}assets/dialogue/book4-garden-of-eden.json`);
    const storyJson = await response.json();
    this.dialogueManager.loadStory(JSON.stringify(storyJson));

    this.scene.launch('DialogueScene', {
      dialogueManager: this.dialogueManager,
      onComplete: () => {
        this.onDialogueComplete();
      },
    });
  }

  private onDialogueComplete(): void {
    const { width, height } = this.cameras.main;

    this.scene.stop('DialogueScene');

    const endText = this.add.text(width / 2, height / 2, 'Book IV: The Garden of Eden\n— To be continued —', {
      fontFamily: 'Georgia, serif',
      fontSize: '32px',
      color: '#c4a45a',
      align: 'center',
    }).setOrigin(0.5).setAlpha(0);

    this.cameras.main.fadeOut(2000, 0, 0, 0);
    this.time.delayedCall(2000, () => {
      this.cameras.main.fadeIn(1000, 0, 0, 0);
      this.tweens.add({
        targets: endText,
        alpha: 1,
        duration: 2000,
      });
    });
  }
}
