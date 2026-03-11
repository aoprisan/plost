import Phaser from 'phaser';
import { DialogueManager } from '../systems/DialogueManager';

export class TemptationScene extends Phaser.Scene {
  private dialogueManager!: DialogueManager;
  private gardenGraphics!: Phaser.GameObjects.Graphics;
  private elapsed = 0;

  constructor() {
    super({ key: 'TemptationScene' });
  }

  create(): void {
    const { width, height } = this.cameras.main;

    // Background — use Doré engraving if available, otherwise procedural
    const bgKey = this.textures.exists('dore-temptation-1') ? 'dore-temptation-1' : 'temptation-bg';
    const bg = this.add.image(width / 2, height / 2, bgKey);
    if (bgKey === 'dore-temptation-1') {
      const scaleX = width / bg.width;
      const scaleY = height / bg.height;
      bg.setScale(Math.min(scaleX, scaleY));
      bg.setTint(0xbbccaa);
    }

    // Dynamic light overlay
    this.gardenGraphics = this.add.graphics();

    // Garden canopy — close, intimate, enclosing
    this.createCanopy();

    // The forbidden tree at centre
    this.createForbiddenTree();

    // Eve
    this.createEve();

    // The serpent
    this.createSerpent();

    // Fruit glow
    this.createFruitGlow();

    // Dappled light motes
    this.createLightMotes();

    // Fade in
    this.cameras.main.fadeIn(3000, 0, 0, 0);

    // Shifting garden light
    this.time.addEvent({
      delay: 50,
      loop: true,
      callback: () => {
        this.elapsed += 50;
        this.updateOverlay();
      },
    });

    // Start dialogue
    this.time.delayedCall(3500, () => {
      this.startDialogue();
    });
  }

  private updateOverlay(): void {
    const { width, height } = this.cameras.main;
    const t = this.elapsed / 1000;

    this.gardenGraphics.clear();

    // Dappled canopy light — shifting patterns
    const lightAlpha = 0.015 + Math.sin(t * 0.2) * 0.008;
    this.gardenGraphics.fillStyle(0xfff8c0, Math.max(0, lightAlpha));
    this.gardenGraphics.fillRect(width * 0.3, 0, width * 0.4, height * 0.3);

    // Warm ground light near the tree
    const groundAlpha = 0.01 + Math.sin(t * 0.15 + 1) * 0.005;
    this.gardenGraphics.fillStyle(0xc4a45a, Math.max(0, groundAlpha));
    this.gardenGraphics.fillRect(width * 0.3, height * 0.6, width * 0.4, height * 0.2);
  }

  private createCanopy(): void {
    const { width, height } = this.cameras.main;

    const canopy = this.add.graphics();

    // Dense foliage framing the scene — darker, closer than Eden scene
    canopy.fillStyle(0x0a1a05, 0.7);
    canopy.fillEllipse(60, 120, 220, 300);
    canopy.fillEllipse(20, 350, 160, 250);

    canopy.fillStyle(0x0a1a05, 0.65);
    canopy.fillEllipse(width - 40, 100, 200, 280);
    canopy.fillEllipse(width - 80, 380, 180, 240);

    // Overhead canopy — vines and branches
    canopy.fillStyle(0x0a1a05, 0.4);
    canopy.fillEllipse(width * 0.3, 30, 300, 100);
    canopy.fillEllipse(width * 0.7, 20, 280, 90);

    canopy.setAlpha(0);
    this.tweens.add({
      targets: canopy,
      alpha: 1,
      duration: 3000,
      ease: 'Power2',
    });
  }

  private createForbiddenTree(): void {
    const { width, height } = this.cameras.main;

    const tree = this.add.graphics();

    // Trunk — darker than other trees, with a presence
    tree.fillStyle(0x1a0a05, 0.6);
    tree.fillRect(width * 0.48, height * 0.15, 24, height * 0.55);

    // Branches spreading
    tree.lineStyle(4, 0x1a0a05, 0.5);
    tree.beginPath();
    tree.moveTo(width * 0.49, height * 0.25);
    tree.lineTo(width * 0.38, height * 0.15);
    tree.strokePath();
    tree.beginPath();
    tree.moveTo(width * 0.5, height * 0.3);
    tree.lineTo(width * 0.62, height * 0.18);
    tree.strokePath();
    tree.beginPath();
    tree.moveTo(width * 0.49, height * 0.4);
    tree.lineTo(width * 0.35, height * 0.32);
    tree.strokePath();

    // Canopy — dark, heavy, laden with fruit
    tree.fillStyle(0x0a2a0a, 0.5);
    tree.fillEllipse(width * 0.5, height * 0.2, 280, 160);
    tree.fillEllipse(width * 0.45, height * 0.3, 200, 120);

    tree.setAlpha(0);
    this.tweens.add({
      targets: tree,
      alpha: 1,
      duration: 2500,
      delay: 500,
      ease: 'Power2',
    });
  }

  private createEve(): void {
    const { width, height } = this.cameras.main;

    // Eve — standing before the tree, hand partly raised
    const eve = this.add.graphics();

    // Body
    eve.fillStyle(0xd4b090);
    eve.fillEllipse(0, 0, 14, 36);
    // Head
    eve.fillCircle(0, -24, 7);
    // Hair flowing
    eve.fillStyle(0x8a6a3a, 0.6);
    eve.fillEllipse(2, -22, 12, 14);
    // Raised arm
    eve.fillStyle(0xd4b090);
    eve.fillTriangle(4, -12, 16, -22, 6, -6);

    eve.setPosition(width * 0.42, height * 0.55);
    eve.setAlpha(0);

    this.tweens.add({
      targets: eve,
      alpha: 0.8,
      duration: 2000,
      delay: 1500,
      ease: 'Power2',
    });

    // Slight sway — wonder, hesitation
    this.tweens.add({
      targets: eve,
      x: eve.x + 2,
      duration: 4000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  private createSerpent(): void {
    const { width, height } = this.cameras.main;

    // Serpent — coiled at the base of the tree, head raised toward Eve
    const serpent = this.add.graphics();

    // Body coils
    serpent.lineStyle(3, 0x3a6a2a, 0.6);
    serpent.beginPath();
    serpent.arc(0, 12, 10, 0, Math.PI * 1.5, false);
    serpent.strokePath();
    serpent.beginPath();
    serpent.arc(4, 8, 14, Math.PI * 0.5, Math.PI * 2, false);
    serpent.strokePath();

    // Raised head and neck — elegant, attentive
    serpent.lineStyle(2.5, 0x4a8a3a, 0.7);
    serpent.beginPath();
    serpent.moveTo(8, 0);
    serpent.lineTo(10, -10);
    serpent.lineTo(8, -20);
    serpent.lineTo(4, -28);
    serpent.strokePath();

    // Head — small diamond shape
    serpent.fillStyle(0x4a8a3a, 0.8);
    serpent.fillTriangle(0, -30, 4, -36, 8, -30);

    // Eyes — glinting, intelligent
    serpent.fillStyle(0xc4a45a, 0.9);
    serpent.fillCircle(3, -32, 1.5);

    // Iridescent scale highlights
    serpent.fillStyle(0x88cc66, 0.15);
    serpent.fillCircle(6, -15, 3);
    serpent.fillCircle(2, -5, 3);

    serpent.setPosition(width * 0.56, height * 0.6);
    serpent.setAlpha(0);

    // Slither in after Eve appears
    this.tweens.add({
      targets: serpent,
      alpha: 0.85,
      duration: 2000,
      delay: 2500,
      ease: 'Power2',
    });

    // Subtle swaying — hypnotic
    this.tweens.add({
      targets: serpent,
      x: serpent.x + 3,
      y: serpent.y - 1,
      duration: 3000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  private createFruitGlow(): void {
    const { width, height } = this.cameras.main;

    // The forbidden fruit — warm, pulsing glow among the branches
    const fruits: { x: number; y: number }[] = [
      { x: width * 0.44, y: height * 0.22 },
      { x: width * 0.52, y: height * 0.18 },
      { x: width * 0.48, y: height * 0.28 },
      { x: width * 0.55, y: height * 0.25 },
      { x: width * 0.4, y: height * 0.3 },
    ];

    fruits.forEach((pos, i) => {
      // Outer glow
      const glow = this.add.circle(pos.x, pos.y, 8, 0xc44a1a, 0.08);
      // Inner fruit
      const fruit = this.add.circle(pos.x, pos.y, 3.5, 0xc44a1a, 0.4);

      glow.setAlpha(0);
      fruit.setAlpha(0);

      this.tweens.add({
        targets: [glow, fruit],
        alpha: 1,
        duration: 2000,
        delay: 2000 + i * 200,
        ease: 'Power2',
      });

      // Gentle pulse — alluring
      this.tweens.add({
        targets: glow,
        scaleX: 1.3,
        scaleY: 1.3,
        alpha: 0.6,
        duration: 2500 + i * 300,
        yoyo: true,
        repeat: -1,
        delay: i * 400,
        ease: 'Sine.easeInOut',
      });
    });
  }

  private createLightMotes(): void {
    const { width, height } = this.cameras.main;

    // Fewer, more focused motes — concentrated near the tree
    for (let i = 0; i < 12; i++) {
      const x = Phaser.Math.Between(width * 0.3, width * 0.7);
      const y = Phaser.Math.Between(height * 0.1, height * 0.5);
      const size = Phaser.Math.FloatBetween(0.5, 1.5);
      const brightness = Phaser.Math.FloatBetween(0.08, 0.25);

      const mote = this.add.circle(x, y, size, 0xfff8c0, brightness);

      this.tweens.add({
        targets: mote,
        y: y - Phaser.Math.Between(30, 80),
        alpha: 0,
        duration: Phaser.Math.Between(5000, 10000),
        delay: Phaser.Math.Between(0, 6000),
        ease: 'Sine.easeIn',
        onComplete: () => {
          mote.setPosition(
            Phaser.Math.Between(width * 0.3, width * 0.7),
            Phaser.Math.Between(height * 0.3, height * 0.6)
          );
          mote.setAlpha(brightness);
          this.tweens.add({
            targets: mote,
            y: mote.y - Phaser.Math.Between(30, 80),
            alpha: 0,
            duration: Phaser.Math.Between(5000, 10000),
            ease: 'Sine.easeIn',
            repeat: -1,
          });
        },
      });
    }
  }

  private async startDialogue(): Promise<void> {
    this.dialogueManager = new DialogueManager();

    const response = await fetch(`${import.meta.env.BASE_URL}assets/dialogue/book4-temptation-begins.json`);
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
      this.scene.start('TheFallScene');
    });
  }
}
