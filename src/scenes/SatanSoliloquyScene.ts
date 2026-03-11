import Phaser from 'phaser';
import { DialogueManager } from '../systems/DialogueManager';

export class SatanSoliloquyScene extends Phaser.Scene {
  private dialogueManager!: DialogueManager;
  private skyGraphics!: Phaser.GameObjects.Graphics;
  private elapsed = 0;

  constructor() {
    super({ key: 'SatanSoliloquyScene' });
  }

  create(): void {
    const { width, height } = this.cameras.main;

    // Background — use Doré engraving if available, otherwise procedural
    const bgKey = this.textures.exists('dore-satan-despair') ? 'dore-satan-despair' : 'satan-soliloquy-bg';
    const bg = this.add.image(width / 2, height / 2, bgKey);
    if (bgKey === 'dore-satan-despair') {
      const scaleX = width / bg.width;
      const scaleY = height / bg.height;
      bg.setScale(Math.min(scaleX, scaleY));
      bg.setTint(0xccbbaa);
    }

    // Dynamic sky overlay
    this.skyGraphics = this.add.graphics();

    // Mountain peak environment
    this.createMountainSilhouette();

    // Rising sun
    this.createSunrise();

    // Satan — standing alone on the precipice
    this.createSatanFigure();

    // Wind-blown particles
    this.createWindParticles();

    // Eden visible below
    this.createEdenBelow();

    // Fade in from dark
    this.cameras.main.fadeIn(3000, 0, 0, 0);

    // Shifting light as sun rises
    this.time.addEvent({
      delay: 50,
      loop: true,
      callback: () => {
        this.elapsed += 50;
        this.updateSkyOverlay();
      },
    });

    // Start dialogue
    this.time.delayedCall(3500, () => {
      this.startDialogue();
    });
  }

  private updateSkyOverlay(): void {
    const { width, height } = this.cameras.main;
    const t = this.elapsed / 1000;

    this.skyGraphics.clear();

    // Sunrise glow intensifying from the right
    const sunAlpha = 0.02 + Math.sin(t * 0.1) * 0.01;
    this.skyGraphics.fillStyle(0xffcc66, Math.max(0, sunAlpha));
    this.skyGraphics.fillRect(width * 0.6, 0, width * 0.4, height * 0.4);

    // Cool mountain shadow from below
    const shadowAlpha = 0.015 + Math.sin(t * 0.15) * 0.005;
    this.skyGraphics.fillStyle(0x1a1a2a, Math.max(0, shadowAlpha));
    this.skyGraphics.fillRect(0, height * 0.7, width, height * 0.3);
  }

  private createMountainSilhouette(): void {
    const { width, height } = this.cameras.main;

    const mountains = this.add.graphics();

    // Distant mountain range — dark blue-grey
    mountains.fillStyle(0x1a1a2a, 0.5);
    mountains.beginPath();
    mountains.moveTo(0, height * 0.6);
    mountains.lineTo(width * 0.15, height * 0.35);
    mountains.lineTo(width * 0.3, height * 0.45);
    mountains.lineTo(width * 0.45, height * 0.25);
    mountains.lineTo(width * 0.6, height * 0.4);
    mountains.lineTo(width * 0.75, height * 0.3);
    mountains.lineTo(width * 0.9, height * 0.38);
    mountains.lineTo(width, height * 0.5);
    mountains.lineTo(width, height);
    mountains.lineTo(0, height);
    mountains.closePath();
    mountains.fillPath();

    // Foreground ridge — the peak where Satan stands
    mountains.fillStyle(0x0a0a15, 0.7);
    mountains.beginPath();
    mountains.moveTo(0, height);
    mountains.lineTo(0, height * 0.75);
    mountains.lineTo(width * 0.2, height * 0.65);
    mountains.lineTo(width * 0.35, height * 0.55);
    mountains.lineTo(width * 0.45, height * 0.45); // The peak
    mountains.lineTo(width * 0.55, height * 0.55);
    mountains.lineTo(width * 0.7, height * 0.7);
    mountains.lineTo(width, height * 0.8);
    mountains.lineTo(width, height);
    mountains.closePath();
    mountains.fillPath();

    mountains.setAlpha(0);
    this.tweens.add({
      targets: mountains,
      alpha: 1,
      duration: 3000,
      ease: 'Power2',
    });
  }

  private createSunrise(): void {
    const { width, height } = this.cameras.main;

    // Sun — rising from the eastern horizon (right side)
    const sun = this.add.graphics();
    const sunX = width * 0.82;
    const sunY = height * 0.28;

    // Outer glow
    sun.fillStyle(0xffdd88, 0.06);
    sun.fillCircle(sunX, sunY, 120);
    sun.fillStyle(0xffcc66, 0.08);
    sun.fillCircle(sunX, sunY, 80);
    sun.fillStyle(0xffeeaa, 0.12);
    sun.fillCircle(sunX, sunY, 45);
    // Core
    sun.fillStyle(0xfff8dd, 0.25);
    sun.fillCircle(sunX, sunY, 20);

    sun.setAlpha(0);

    // Sun rises slowly
    this.tweens.add({
      targets: sun,
      alpha: 1,
      duration: 5000,
      delay: 500,
      ease: 'Power2',
    });

    this.tweens.add({
      targets: sun,
      y: -15,
      duration: 30000,
      ease: 'Sine.easeOut',
    });

    // Gentle pulse
    this.tweens.add({
      targets: sun,
      scaleX: 1.03,
      scaleY: 1.03,
      duration: 4000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  private createSatanFigure(): void {
    const { width, height } = this.cameras.main;

    // Satan — standing on the peak, facing the sun, arms slightly raised
    const satan = this.add.graphics();
    satan.fillStyle(0x0a0a0a);
    // Body — tall, defiant posture
    satan.fillEllipse(0, 0, 18, 44);
    // Head
    satan.fillCircle(0, -28, 8);
    // Wings spread wide — silhouetted against the sunrise
    satan.fillTriangle(-10, -10, -40, -28, -6, 8);
    satan.fillTriangle(10, -10, 40, -28, 6, 8);
    // Arms slightly raised — addressing the sun
    satan.fillTriangle(-8, -12, -22, -20, -6, -4);
    satan.fillTriangle(8, -12, 22, -20, 6, -4);
    // Dark aura of torment
    satan.fillStyle(0x0a0a0a, 0.1);
    satan.fillCircle(0, -6, 35);

    satan.setPosition(width * 0.45, height * 0.42);
    satan.setAlpha(0);

    // Dramatic reveal
    this.tweens.add({
      targets: satan,
      alpha: 0.85,
      duration: 2500,
      delay: 1500,
      ease: 'Power2',
    });

    // Subtle sway — tormented, restless
    this.tweens.add({
      targets: satan,
      x: satan.x + 2,
      y: satan.y - 1,
      duration: 5000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  private createWindParticles(): void {
    const { width, height } = this.cameras.main;

    // Wind-blown dust and debris on the mountaintop
    for (let i = 0; i < 15; i++) {
      const startX = Phaser.Math.Between(-50, width * 0.3);
      const y = Phaser.Math.Between(height * 0.35, height * 0.6);
      const size = Phaser.Math.FloatBetween(0.5, 1.5);

      const particle = this.add.circle(startX, y, size, 0x8a7a5a, 0.2);

      // Blow across the screen
      this.tweens.add({
        targets: particle,
        x: width + 50,
        y: y + Phaser.Math.Between(-30, 30),
        alpha: 0,
        duration: Phaser.Math.Between(6000, 12000),
        delay: Phaser.Math.Between(0, 8000),
        ease: 'Sine.easeIn',
        onComplete: () => {
          particle.setPosition(
            Phaser.Math.Between(-50, 0),
            Phaser.Math.Between(height * 0.35, height * 0.6)
          );
          particle.setAlpha(0.2);
          this.tweens.add({
            targets: particle,
            x: width + 50,
            y: particle.y + Phaser.Math.Between(-30, 30),
            alpha: 0,
            duration: Phaser.Math.Between(6000, 12000),
            ease: 'Sine.easeIn',
            repeat: -1,
          });
        },
      });
    }
  }

  private createEdenBelow(): void {
    const { width, height } = this.cameras.main;

    // Eden — visible below the mountains, a faint green glow
    const eden = this.add.graphics();

    eden.fillStyle(0x2a4a1a, 0.08);
    eden.fillRect(0, height * 0.65, width, height * 0.15);
    eden.fillStyle(0x44aa44, 0.04);
    eden.fillRect(width * 0.1, height * 0.68, width * 0.8, height * 0.08);

    // Tiny river glints
    eden.lineStyle(1, 0x6688aa, 0.1);
    eden.beginPath();
    eden.moveTo(width * 0.3, height * 0.7);
    eden.lineTo(width * 0.5, height * 0.72);
    eden.lineTo(width * 0.7, height * 0.69);
    eden.strokePath();

    eden.setAlpha(0);
    this.tweens.add({
      targets: eden,
      alpha: 1,
      duration: 4000,
      delay: 2000,
      ease: 'Power2',
    });
  }

  private async startDialogue(): Promise<void> {
    this.dialogueManager = new DialogueManager();

    const response = await fetch(`${import.meta.env.BASE_URL}assets/dialogue/book4-satan-soliloquy.json`);
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

    const endText = this.add.text(width / 2, height / 2, 'Book IV: Satan\'s Soliloquy\n— To be continued —', {
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
