import Phaser from 'phaser';
import { DialogueManager } from '../systems/DialogueManager';

export class TheFallScene extends Phaser.Scene {
  private dialogueManager!: DialogueManager;
  private overlayGraphics!: Phaser.GameObjects.Graphics;
  private elapsed = 0;

  constructor() {
    super({ key: 'TheFallScene' });
  }

  create(): void {
    const { width, height } = this.cameras.main;

    // Background — use Doré engraving if available
    const bgKey = this.textures.exists('dore-temptation-2') ? 'dore-temptation-2' : 'the-fall-bg';
    const bg = this.add.image(width / 2, height / 2, bgKey);
    if (bgKey === 'dore-temptation-2') {
      const scaleX = width / bg.width;
      const scaleY = height / bg.height;
      bg.setScale(Math.min(scaleX, scaleY));
      bg.setTint(0xccbbaa);
    }

    this.overlayGraphics = this.add.graphics();

    // The forbidden tree — centre stage, dominant
    this.createForbiddenTree();

    // Eve before the tree
    this.createEve();

    // Adam arriving from the side
    this.createAdam();

    // The fruit — glowing intensely
    this.createFruit();

    // Darkening sky — Eden responding to the transgression
    this.createDarkeningSky();

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

    // Sky darkening gradually — Eden reacting
    const darkAlpha = Math.min(0.15, t * 0.001);
    this.overlayGraphics.fillStyle(0x0a0a0a, darkAlpha);
    this.overlayGraphics.fillRect(0, 0, width, height);

    // Fruit glow pulsing more urgently
    const glowAlpha = 0.02 + Math.sin(t * 0.4) * 0.015;
    this.overlayGraphics.fillStyle(0xc44a1a, Math.max(0, glowAlpha));
    this.overlayGraphics.fillCircle(width * 0.5, height * 0.3, 80);
  }

  private createForbiddenTree(): void {
    const { width, height } = this.cameras.main;

    const tree = this.add.graphics();

    // Massive trunk — centre of everything
    tree.fillStyle(0x1a0a05, 0.7);
    tree.fillRect(width * 0.47, height * 0.1, 30, height * 0.6);

    // Heavy branches
    tree.lineStyle(5, 0x1a0a05, 0.6);
    tree.beginPath();
    tree.moveTo(width * 0.48, height * 0.2);
    tree.lineTo(width * 0.3, height * 0.1);
    tree.strokePath();
    tree.beginPath();
    tree.moveTo(width * 0.5, height * 0.25);
    tree.lineTo(width * 0.7, height * 0.12);
    tree.strokePath();
    tree.beginPath();
    tree.moveTo(width * 0.48, height * 0.35);
    tree.lineTo(width * 0.28, height * 0.25);
    tree.strokePath();
    tree.beginPath();
    tree.moveTo(width * 0.5, height * 0.4);
    tree.lineTo(width * 0.72, height * 0.3);
    tree.strokePath();

    // Dark canopy
    tree.fillStyle(0x0a1a05, 0.55);
    tree.fillEllipse(width * 0.5, height * 0.18, 350, 180);
    tree.fillEllipse(width * 0.45, height * 0.3, 250, 140);

    tree.setAlpha(0);
    this.tweens.add({
      targets: tree,
      alpha: 1,
      duration: 2500,
      ease: 'Power2',
    });
  }

  private createEve(): void {
    const { width, height } = this.cameras.main;

    const eve = this.add.graphics();
    eve.fillStyle(0xd4b090);
    eve.fillEllipse(0, 0, 14, 38);
    eve.fillCircle(0, -26, 7);
    // Hair
    eve.fillStyle(0x8a6a3a, 0.6);
    eve.fillEllipse(2, -24, 12, 14);
    // Arm reaching upward toward the fruit
    eve.fillStyle(0xd4b090);
    eve.fillTriangle(4, -14, 18, -30, 8, -8);

    eve.setPosition(width * 0.44, height * 0.56);
    eve.setAlpha(0);

    this.tweens.add({
      targets: eve,
      alpha: 0.85,
      duration: 2000,
      delay: 1000,
      ease: 'Power2',
    });
  }

  private createAdam(): void {
    const { width, height } = this.cameras.main;

    const adam = this.add.graphics();
    adam.fillStyle(0xc4a080);
    adam.fillEllipse(0, 0, 16, 42);
    adam.fillCircle(0, -28, 8);

    adam.setPosition(width * 0.62, height * 0.58);
    adam.setAlpha(0);

    // Adam arrives later — finding Eve at the tree
    this.tweens.add({
      targets: adam,
      alpha: 0.7,
      duration: 2500,
      delay: 2500,
      ease: 'Power2',
    });

    this.tweens.add({
      targets: adam,
      x: adam.x - 8,
      duration: 8000,
      delay: 2500,
      ease: 'Sine.easeOut',
    });
  }

  private createFruit(): void {
    const { width, height } = this.cameras.main;

    // The fruit — singular, luminous, the centre of the scene
    const fruitX = width * 0.48;
    const fruitY = height * 0.36;

    const outerGlow = this.add.circle(fruitX, fruitY, 20, 0xc44a1a, 0.06);
    const midGlow = this.add.circle(fruitX, fruitY, 10, 0xc44a1a, 0.15);
    const fruit = this.add.circle(fruitX, fruitY, 5, 0xc44a1a, 0.5);

    [outerGlow, midGlow, fruit].forEach(obj => obj.setAlpha(0));

    this.tweens.add({
      targets: [outerGlow, midGlow, fruit],
      alpha: 1,
      duration: 3000,
      delay: 1500,
      ease: 'Power2',
    });

    // Intense, urgent pulsing
    this.tweens.add({
      targets: outerGlow,
      scaleX: 1.8,
      scaleY: 1.8,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    this.tweens.add({
      targets: midGlow,
      scaleX: 1.3,
      scaleY: 1.3,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  private createDarkeningSky(): void {
    const { width, height } = this.cameras.main;

    // Sky begins bright but will darken — managed partly by updateOverlay
    // Add foliage edges to create enclosure
    const edges = this.add.graphics();
    edges.fillStyle(0x0a1a05, 0.5);
    edges.fillEllipse(50, height * 0.4, 180, 400);
    edges.fillEllipse(width - 50, height * 0.35, 160, 380);

    edges.setAlpha(0);
    this.tweens.add({
      targets: edges,
      alpha: 1,
      duration: 3000,
      ease: 'Power2',
    });
  }

  private async startDialogue(): Promise<void> {
    this.dialogueManager = new DialogueManager();

    const response = await fetch(`${import.meta.env.BASE_URL}assets/dialogue/book9-the-fall.json`);
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
      this.scene.start('JudgmentScene');
    });
  }
}
