import Phaser from 'phaser';
import { DialogueManager } from '../systems/DialogueManager';

export class JudgmentScene extends Phaser.Scene {
  private dialogueManager!: DialogueManager;
  private overlayGraphics!: Phaser.GameObjects.Graphics;
  private elapsed = 0;

  constructor() {
    super({ key: 'JudgmentScene' });
  }

  create(): void {
    const { width, height } = this.cameras.main;

    // Background — use Doré engraving if available
    const bgKey = this.textures.exists('dore-temptation-3') ? 'dore-temptation-3' : 'judgment-bg';
    const bg = this.add.image(width / 2, height / 2, bgKey);
    if (bgKey === 'dore-temptation-3') {
      const scaleX = width / bg.width;
      const scaleY = height / bg.height;
      bg.setScale(Math.min(scaleX, scaleY));
      bg.setTint(0xbbaaaa);
    }

    this.overlayGraphics = this.add.graphics();

    // The Son descending — divine light from above
    this.createDivineLight();

    // Adam and Eve cowering
    this.createAdamAndEve();

    // The cursed serpent
    this.createCursedSerpent();

    // Hell's bridge forming in the distance
    this.createHellBridge();

    this.cameras.main.fadeIn(3000, 10, 10, 10);

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

    // Divine light pulsing from above — solemn, steady
    const lightAlpha = 0.02 + Math.sin(t * 0.12) * 0.01;
    this.overlayGraphics.fillStyle(0xfff8dd, Math.max(0, lightAlpha));
    this.overlayGraphics.fillRect(width * 0.3, 0, width * 0.4, height * 0.3);

    // Hellfire glow creeping in from below-right
    const hellAlpha = Math.min(0.03, t * 0.0005);
    this.overlayGraphics.fillStyle(0xc44a1a, Math.max(0, hellAlpha));
    this.overlayGraphics.fillRect(width * 0.7, height * 0.7, width * 0.3, height * 0.3);
  }

  private createDivineLight(): void {
    const { width, height } = this.cameras.main;

    // The Son's presence — column of warm light descending
    const light = this.add.graphics();

    // Broad radiance
    light.fillStyle(0xfff8dd, 0.04);
    light.fillRect(width * 0.35, 0, width * 0.3, height * 0.6);

    // Concentrated beam
    light.fillStyle(0xfff8dd, 0.08);
    light.fillRect(width * 0.42, 0, width * 0.16, height * 0.5);

    // Bright core
    light.fillStyle(0xffffff, 0.06);
    light.fillEllipse(width * 0.5, height * 0.15, 120, 80);

    light.setAlpha(0);
    this.tweens.add({
      targets: light,
      alpha: 1,
      duration: 4000,
      delay: 500,
      ease: 'Power2',
    });

    // Gentle pulse
    this.tweens.add({
      targets: light,
      scaleY: 1.02,
      duration: 3000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  private createAdamAndEve(): void {
    const { width, height } = this.cameras.main;

    // Adam and Eve — cowering, clothed in fig leaves, heads bowed
    const figures = this.add.graphics();

    // Adam — hunched
    figures.fillStyle(0x5a7a4a, 0.6); // Fig-leaf garment
    figures.fillEllipse(width * 0.4, height * 0.65, 14, 30);
    figures.fillStyle(0xc4a080);
    figures.fillCircle(width * 0.4, height * 0.625, 6);

    // Eve — beside him, head bowed
    figures.fillStyle(0x5a7a4a, 0.6);
    figures.fillEllipse(width * 0.45, height * 0.66, 12, 28);
    figures.fillStyle(0xd4b090);
    figures.fillCircle(width * 0.45, height * 0.635, 5.5);

    figures.setAlpha(0);
    this.tweens.add({
      targets: figures,
      alpha: 0.8,
      duration: 2500,
      delay: 1500,
      ease: 'Power2',
    });
  }

  private createCursedSerpent(): void {
    const { width, height } = this.cameras.main;

    // Serpent — writhing on the ground, legs withering
    const serpent = this.add.graphics();

    serpent.lineStyle(2.5, 0x3a5a2a, 0.5);
    serpent.beginPath();
    serpent.moveTo(width * 0.55, height * 0.72);
    serpent.splineTo([
      width * 0.57, height * 0.7,
      width * 0.54, height * 0.68,
      width * 0.58, height * 0.66,
      width * 0.55, height * 0.64,
    ]);
    serpent.strokePath();

    // Head flat to ground
    serpent.fillStyle(0x3a5a2a, 0.6);
    serpent.fillEllipse(width * 0.55, height * 0.635, 5, 3);

    serpent.setAlpha(0);
    this.tweens.add({
      targets: serpent,
      alpha: 0.7,
      duration: 2000,
      delay: 2000,
      ease: 'Power2',
    });

    // Writhing
    this.tweens.add({
      targets: serpent,
      x: 3,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  private createHellBridge(): void {
    const { width, height } = this.cameras.main;

    // Distant suggestion of Sin and Death's bridge — faint, ominous
    const bridge = this.add.graphics();

    bridge.lineStyle(1.5, 0x8a3a1a, 0.15);
    bridge.beginPath();
    bridge.moveTo(width, height * 0.85);
    bridge.splineTo([
      width * 0.9, height * 0.82,
      width * 0.85, height * 0.8,
      width * 0.82, height * 0.78,
    ]);
    bridge.strokePath();

    // Hellfire glow at the far end
    bridge.fillStyle(0xc44a1a, 0.04);
    bridge.fillCircle(width, height * 0.85, 60);

    bridge.setAlpha(0);
    this.tweens.add({
      targets: bridge,
      alpha: 1,
      duration: 6000,
      delay: 4000,
      ease: 'Power2',
    });
  }

  private async startDialogue(): Promise<void> {
    this.dialogueManager = new DialogueManager();

    const response = await fetch(`${import.meta.env.BASE_URL}assets/dialogue/book10-judgment.json`);
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
      this.scene.start('ExpulsionScene');
    });
  }
}
