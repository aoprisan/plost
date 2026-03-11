import Phaser from 'phaser';
import { DialogueManager } from '../systems/DialogueManager';

export class SatanLandsScene extends Phaser.Scene {
  private dialogueManager!: DialogueManager;
  private skyGraphics!: Phaser.GameObjects.Graphics;
  private elapsed = 0;

  constructor() {
    super({ key: 'SatanLandsScene' });
  }

  create(): void {
    const { width, height } = this.cameras.main;

    // Background — use Doré engraving if available, otherwise procedural
    const bgKey = this.textures.exists('dore-satan-descends') ? 'dore-satan-descends' : 'satan-lands-bg';
    const bg = this.add.image(width / 2, height / 2, bgKey);
    if (bgKey === 'dore-satan-descends') {
      const scaleX = width / bg.width;
      const scaleY = height / bg.height;
      bg.setScale(Math.min(scaleX, scaleY));
      bg.setTint(0xbbccdd);
    }

    // Cosmic overlay — shifting starfield and sphere-light
    this.skyGraphics = this.add.graphics();

    // Stars — tiny fixed points of light
    this.createStarfield();

    // Planetary spheres — concentric rings of faint light
    this.createSpheres();

    // Satan silhouette descending
    this.createSatanFigure();

    // Earth below — green-blue glow at the bottom
    this.createEarthGlow();

    // Fade from white (coming from Heaven) to the star-lit cosmos
    this.cameras.main.fadeIn(3500, 200, 210, 230);

    // Gentle cosmic shimmer
    this.time.addEvent({
      delay: 50,
      loop: true,
      callback: () => {
        this.elapsed += 50;
        this.updateSkyOverlay();
      },
    });

    // Start dialogue
    this.time.delayedCall(4000, () => {
      this.startDialogue();
    });
  }

  private updateSkyOverlay(): void {
    const { width, height } = this.cameras.main;
    const t = this.elapsed / 1000;

    this.skyGraphics.clear();

    // Faint golden radiance from above (Heaven's light fading)
    const heavenAlpha = 0.01 + Math.sin(t * 0.2) * 0.005;
    this.skyGraphics.fillStyle(0xfff8e0, Math.max(0, heavenAlpha));
    this.skyGraphics.fillRect(0, 0, width, 120);

    // Earth-glow from below — green-blue, pulsing gently
    const earthAlpha = 0.02 + Math.sin(t * 0.3) * 0.01;
    this.skyGraphics.fillStyle(0x44aa66, Math.max(0, earthAlpha));
    this.skyGraphics.fillRect(0, height - 150, width, 150);
  }

  private createStarfield(): void {
    const { width, height } = this.cameras.main;

    for (let i = 0; i < 60; i++) {
      const x = Phaser.Math.Between(0, width);
      const y = Phaser.Math.Between(0, height * 0.7);
      const size = Phaser.Math.FloatBetween(0.5, 1.5);
      const brightness = Phaser.Math.FloatBetween(0.15, 0.5);

      const star = this.add.circle(x, y, size, 0xffffff, brightness);

      // Gentle twinkle
      this.tweens.add({
        targets: star,
        alpha: brightness * 0.3,
        duration: Phaser.Math.Between(2000, 5000),
        yoyo: true,
        repeat: -1,
        delay: Phaser.Math.Between(0, 3000),
        ease: 'Sine.easeInOut',
      });
    }
  }

  private createSpheres(): void {
    const { width, height } = this.cameras.main;
    const centerX = width / 2;
    const centerY = height + 200; // Spheres curve up from below

    // Concentric arcs representing the planetary spheres
    const sphereColors = [
      { color: 0xcccc88, label: 'Moon' },
      { color: 0x88aacc, label: 'Mercury' },
      { color: 0xccaa77, label: 'Venus' },
      { color: 0xffdd44, label: 'Sun' },
      { color: 0xcc6644, label: 'Mars' },
      { color: 0xddbb88, label: 'Jupiter' },
      { color: 0x99aa88, label: 'Saturn' },
    ];

    sphereColors.forEach((sphere, i) => {
      const radius = 300 + i * 70;
      const arc = this.add.graphics();
      arc.lineStyle(1, sphere.color, 0.06 + (sphereColors.length - i) * 0.01);
      arc.beginPath();
      arc.arc(centerX, centerY, radius, Phaser.Math.DegToRad(220), Phaser.Math.DegToRad(320), false);
      arc.strokePath();
      arc.setAlpha(0);

      // Staggered reveal
      this.tweens.add({
        targets: arc,
        alpha: 1,
        duration: 1500,
        delay: 500 + i * 300,
        ease: 'Power2',
      });
    });
  }

  private createSatanFigure(): void {
    const { width, height } = this.cameras.main;

    // Satan — descending, wings spread, slightly larger than in Chaos (closer now)
    const satan = this.add.graphics();
    satan.fillStyle(0x1a1a1a);
    // Body
    satan.fillEllipse(0, 0, 20, 40);
    // Head
    satan.fillCircle(0, -26, 9);
    // Wings spread wide — descending posture
    satan.fillTriangle(-10, -8, -35, -20, -6, 8);
    satan.fillTriangle(10, -8, 35, -20, 6, 8);
    // Faint dark aura
    satan.fillStyle(0x0a0a0a, 0.15);
    satan.fillCircle(0, -5, 30);

    satan.setPosition(width * 0.45, height * 0.35);
    satan.setAlpha(0);

    // Fade in
    this.tweens.add({
      targets: satan,
      alpha: 0.75,
      duration: 2500,
      delay: 1500,
      ease: 'Power2',
    });

    // Slow descent
    this.tweens.add({
      targets: satan,
      y: satan.y + 40,
      duration: 15000,
      ease: 'Sine.easeInOut',
    });
  }

  private createEarthGlow(): void {
    const { width, height } = this.cameras.main;

    // Earth — a gentle green-blue arc at the bottom
    const earth = this.add.graphics();

    // Atmospheric glow
    earth.fillStyle(0x4488aa, 0.08);
    earth.fillEllipse(width / 2, height + 80, width * 0.7, 200);
    earth.fillStyle(0x44aa66, 0.06);
    earth.fillEllipse(width / 2, height + 80, width * 0.5, 160);
    earth.fillStyle(0x88cc88, 0.04);
    earth.fillEllipse(width / 2, height + 80, width * 0.3, 120);

    earth.setAlpha(0);

    this.tweens.add({
      targets: earth,
      alpha: 1,
      duration: 4000,
      delay: 2000,
      ease: 'Power2',
    });

    // Gentle pulse
    this.tweens.add({
      targets: earth,
      scaleX: 1.02,
      scaleY: 1.02,
      duration: 5000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  private async startDialogue(): Promise<void> {
    this.dialogueManager = new DialogueManager();

    const response = await fetch(`${import.meta.env.BASE_URL}assets/dialogue/book3-satan-lands.json`);
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
    this.scene.stop('DialogueScene');

    this.cameras.main.fadeOut(2000, 0, 0, 0);
    this.time.delayedCall(2000, () => {
      this.scene.start('GardenOfEdenScene');
    });
  }
}
