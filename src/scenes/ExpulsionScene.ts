import Phaser from 'phaser';
import { DialogueManager } from '../systems/DialogueManager';

export class ExpulsionScene extends Phaser.Scene {
  private dialogueManager!: DialogueManager;
  private overlayGraphics!: Phaser.GameObjects.Graphics;
  private elapsed = 0;

  constructor() {
    super({ key: 'ExpulsionScene' });
  }

  create(): void {
    const { width, height } = this.cameras.main;

    // Background — use Doré engraving if available
    const bgKey = this.textures.exists('dore-expulsion') ? 'dore-expulsion' : 'expulsion-bg';
    const bg = this.add.image(width / 2, height / 2, bgKey);
    if (bgKey === 'dore-expulsion') {
      const scaleX = width / bg.width;
      const scaleY = height / bg.height;
      bg.setScale(Math.min(scaleX, scaleY));
      bg.setTint(0xccbbaa);
    }

    this.overlayGraphics = this.add.graphics();

    // The gate of Eden — blazing with cherubim fire
    this.createGateOfEden();

    // Michael with flaming sword
    this.createMichael();

    // Adam and Eve departing
    this.createAdamAndEve();

    // The world beyond — vast, empty, grey
    this.createTheWorld();

    this.cameras.main.fadeIn(3000, 0, 0, 0);

    this.time.addEvent({
      delay: 50,
      loop: true,
      callback: () => {
        this.elapsed += 50;
        this.updateOverlay();
      },
    });

    this.time.delayedCall(3500, () => {
      this.startDialogue();
    });
  }

  private updateOverlay(): void {
    const { width, height } = this.cameras.main;
    const t = this.elapsed / 1000;

    this.overlayGraphics.clear();

    // Gate fire flickering on the left
    const fireAlpha = 0.02 + Math.sin(t * 0.5) * 0.01 + Math.sin(t * 1.3) * 0.005;
    this.overlayGraphics.fillStyle(0xc44a1a, Math.max(0, fireAlpha));
    this.overlayGraphics.fillRect(0, 0, width * 0.15, height);

    // Dawn light from the right — the new world
    const dawnAlpha = 0.01 + Math.sin(t * 0.1) * 0.005;
    this.overlayGraphics.fillStyle(0xddccaa, Math.max(0, dawnAlpha));
    this.overlayGraphics.fillRect(width * 0.7, 0, width * 0.3, height);
  }

  private createGateOfEden(): void {
    const { width, height } = this.cameras.main;

    const gate = this.add.graphics();

    // Gate pillars
    gate.fillStyle(0xc4a45a, 0.3);
    gate.fillRect(width * 0.08, height * 0.1, 12, height * 0.7);
    gate.fillRect(width * 0.18, height * 0.1, 12, height * 0.7);

    // Gate arch
    gate.lineStyle(3, 0xc4a45a, 0.3);
    gate.beginPath();
    gate.arc(width * 0.14, height * 0.12, width * 0.055, Math.PI, 0, false);
    gate.strokePath();

    // Fire — the flaming swords of the Cherubim
    for (let i = 0; i < 8; i++) {
      const flameX = width * 0.1 + Math.random() * width * 0.1;
      const flameY = height * 0.15 + Math.random() * height * 0.6;
      const flameSize = Phaser.Math.FloatBetween(3, 8);

      const flame = this.add.circle(flameX, flameY, flameSize, 0xc44a1a, 0.2);

      this.tweens.add({
        targets: flame,
        y: flameY - Phaser.Math.Between(20, 50),
        alpha: 0,
        scaleX: 0.3,
        scaleY: 1.5,
        duration: Phaser.Math.Between(800, 1500),
        delay: Phaser.Math.Between(0, 2000),
        ease: 'Sine.easeIn',
        onComplete: () => {
          flame.setPosition(
            width * 0.1 + Math.random() * width * 0.1,
            height * 0.2 + Math.random() * height * 0.5
          );
          flame.setAlpha(0.2);
          flame.setScale(1);
          this.tweens.add({
            targets: flame,
            y: flame.y - Phaser.Math.Between(20, 50),
            alpha: 0,
            scaleX: 0.3,
            scaleY: 1.5,
            duration: Phaser.Math.Between(800, 1500),
            ease: 'Sine.easeIn',
            repeat: -1,
          });
        },
      });
    }

    gate.setAlpha(0);
    this.tweens.add({
      targets: gate,
      alpha: 1,
      duration: 3000,
      ease: 'Power2',
    });
  }

  private createMichael(): void {
    const { width, height } = this.cameras.main;

    // Michael — tall, blazing, stern
    const michael = this.add.graphics();

    // Body — armoured, luminous
    michael.fillStyle(0xfff8dd, 0.2);
    michael.fillEllipse(0, 0, 16, 44);
    // Head
    michael.fillStyle(0xfff8dd, 0.3);
    michael.fillCircle(0, -28, 8);
    // Wings — spread wide, blocking the gate
    michael.fillStyle(0xfff8dd, 0.12);
    michael.fillTriangle(-8, -10, -35, -30, -4, 10);
    michael.fillTriangle(8, -10, 35, -30, 4, 10);
    // Flaming sword
    michael.lineStyle(2, 0xc44a1a, 0.6);
    michael.beginPath();
    michael.moveTo(10, -18);
    michael.lineTo(28, -40);
    michael.strokePath();
    // Sword fire
    michael.fillStyle(0xc44a1a, 0.3);
    michael.fillCircle(28, -40, 5);

    michael.setPosition(width * 0.14, height * 0.45);
    michael.setAlpha(0);

    this.tweens.add({
      targets: michael,
      alpha: 0.8,
      duration: 2500,
      delay: 1000,
      ease: 'Power2',
    });

    // Gentle radiance pulse
    this.tweens.add({
      targets: michael,
      scaleX: 1.02,
      scaleY: 1.02,
      duration: 2500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  private createAdamAndEve(): void {
    const { width, height } = this.cameras.main;

    // Adam and Eve — walking away from Eden, hand in hand
    const figures = this.add.graphics();

    // Adam
    figures.fillStyle(0x8a7a5a, 0.6); // Skin garments
    figures.fillEllipse(0, 0, 14, 38);
    figures.fillStyle(0xc4a080);
    figures.fillCircle(0, -25, 7);

    // Eve — beside him
    figures.fillStyle(0x8a7a5a, 0.6);
    figures.fillEllipse(16, 2, 12, 34);
    figures.fillStyle(0xd4b090);
    figures.fillCircle(16, -22, 6);

    // Joined hands — a simple line
    figures.lineStyle(1.5, 0xc4a080, 0.5);
    figures.beginPath();
    figures.moveTo(6, -4);
    figures.lineTo(10, -3);
    figures.strokePath();

    figures.setPosition(width * 0.45, height * 0.6);
    figures.setAlpha(0);

    this.tweens.add({
      targets: figures,
      alpha: 0.8,
      duration: 2500,
      delay: 1500,
      ease: 'Power2',
    });

    // Walking slowly away from Eden — toward the right
    this.tweens.add({
      targets: figures,
      x: figures.x + 60,
      duration: 30000,
      ease: 'Linear',
    });
  }

  private createTheWorld(): void {
    const { width, height } = this.cameras.main;

    // The world beyond Eden — grey, vast, empty but not hopeless
    const world = this.add.graphics();

    // Barren hills on the right
    world.fillStyle(0x4a4a3a, 0.2);
    world.beginPath();
    world.moveTo(width * 0.5, height);
    world.lineTo(width * 0.6, height * 0.7);
    world.lineTo(width * 0.75, height * 0.75);
    world.lineTo(width * 0.85, height * 0.65);
    world.lineTo(width, height * 0.72);
    world.lineTo(width, height);
    world.closePath();
    world.fillPath();

    // Horizon — faint dawn light, suggesting hope
    world.fillStyle(0xddccaa, 0.06);
    world.fillRect(width * 0.5, height * 0.3, width * 0.5, height * 0.15);
    world.fillStyle(0xcc9966, 0.04);
    world.fillRect(width * 0.6, height * 0.35, width * 0.4, height * 0.1);

    // Distant sun — new dawn for a new world
    world.fillStyle(0xffdd88, 0.05);
    world.fillCircle(width * 0.85, height * 0.35, 40);
    world.fillStyle(0xfff8dd, 0.08);
    world.fillCircle(width * 0.85, height * 0.35, 20);

    world.setAlpha(0);
    this.tweens.add({
      targets: world,
      alpha: 1,
      duration: 4000,
      delay: 2000,
      ease: 'Power2',
    });
  }

  private async startDialogue(): Promise<void> {
    this.dialogueManager = new DialogueManager();

    const response = await fetch(`${import.meta.env.BASE_URL}assets/dialogue/book12-expulsion.json`);
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

    // Final ending — the whole epic is complete
    this.cameras.main.fadeOut(3000, 0, 0, 0);
    this.time.delayedCall(3000, () => {
      this.cameras.main.fadeIn(2000, 0, 0, 0);

      const titleText = this.add.text(width / 2, height * 0.35, 'PARADISE LOST', {
        fontFamily: 'Georgia, serif',
        fontSize: '48px',
        color: '#c4a45a',
        align: 'center',
      }).setOrigin(0.5).setAlpha(0);

      const subtitleText = this.add.text(width / 2, height * 0.45, 'The Fallen', {
        fontFamily: 'Georgia, serif',
        fontSize: '28px',
        color: '#8a7a5a',
        align: 'center',
        fontStyle: 'italic',
      }).setOrigin(0.5).setAlpha(0);

      const endText = this.add.text(width / 2, height * 0.58, '— Finis —', {
        fontFamily: 'Georgia, serif',
        fontSize: '24px',
        color: '#e0d8c8',
        align: 'center',
      }).setOrigin(0.5).setAlpha(0);

      const creditText = this.add.text(width / 2, height * 0.72, 'After John Milton\nIllustrations by Gustave Doré', {
        fontFamily: 'Georgia, serif',
        fontSize: '16px',
        color: '#8a7a5a',
        align: 'center',
      }).setOrigin(0.5).setAlpha(0);

      this.tweens.add({ targets: titleText, alpha: 1, duration: 2000, delay: 500 });
      this.tweens.add({ targets: subtitleText, alpha: 1, duration: 2000, delay: 1200 });
      this.tweens.add({ targets: endText, alpha: 1, duration: 2000, delay: 2000 });
      this.tweens.add({ targets: creditText, alpha: 1, duration: 2000, delay: 3000 });
    });
  }
}
