import Phaser from 'phaser';
import { DialogueManager } from '../systems/DialogueManager';

export class PandemoniumScene extends Phaser.Scene {
  private dialogueManager!: DialogueManager;
  private embers: Phaser.GameObjects.Arc[] = [];

  constructor() {
    super({ key: 'PandemoniumScene' });
  }

  create(): void {
    const { width, height } = this.cameras.main;

    // Background — use Doré engraving if available, otherwise procedural
    const bgKey = this.textures.exists('dore-assembly') ? 'dore-assembly' : 'pandemonium-bg';
    const bg = this.add.image(width / 2, height / 2, bgKey);
    if (bgKey === 'dore-assembly') {
      const scaleX = width / bg.width;
      const scaleY = height / bg.height;
      bg.setScale(Math.min(scaleX, scaleY));
      bg.setTint(0xddaa88);
    }

    // Golden glow from below — Pandemonium's interior light
    const glow = this.add.graphics();
    this.tweens.addCounter({
      from: 0,
      to: 1,
      duration: 4000,
      yoyo: true,
      repeat: -1,
      onUpdate: (tween) => {
        const v = tween.getValue() ?? 0;
        glow.clear();
        glow.fillStyle(0xc4a45a, 0.08 + v * 0.12);
        glow.fillRect(0, 450, width, 270);
      },
    });

    // Rising pillars effect — vertical lines fading in
    const useDore = bgKey === 'dore-assembly';
    if (!useDore) {
      this.createPillars();
    }

    // Floating embers — fewer, more golden (construction sparks)
    this.createEmbers();

    // Dramatic entrance
    this.cameras.main.fadeIn(3000, 0, 0, 0);

    // Start dialogue after scene settles
    this.time.delayedCall(3500, () => {
      this.startDialogue();
    });
  }

  private createPillars(): void {
    const { width, height } = this.cameras.main;
    const pillarCount = 6;
    for (let i = 0; i < pillarCount; i++) {
      const x = width * (0.15 + (i / (pillarCount - 1)) * 0.7);
      const pillar = this.add.graphics();
      pillar.fillStyle(0x2a2218);
      pillar.fillRect(x - 12, 150, 24, height - 150);
      // Gold highlight strip
      pillar.fillStyle(0xc4a45a, 0.3);
      pillar.fillRect(x - 2, 150, 4, height - 150);
      pillar.setAlpha(0);

      this.tweens.add({
        targets: pillar,
        alpha: 0.7,
        duration: 2000,
        delay: 500 + i * 300,
        ease: 'Power2',
      });
    }
  }

  private async startDialogue(): Promise<void> {
    this.dialogueManager = new DialogueManager();

    const response = await fetch(`${import.meta.env.BASE_URL}assets/dialogue/book1-pandemonium.json`);
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

    // Transition to Council of Hell
    this.cameras.main.fadeOut(2000, 0, 0, 0);
    this.time.delayedCall(2000, () => {
      this.scene.start('CouncilScene');
    });
  }

  private createEmbers(): void {
    const { width, height } = this.cameras.main;
    for (let i = 0; i < 25; i++) {
      const ember = this.add.circle(
        Phaser.Math.Between(0, width),
        Phaser.Math.Between(height * 0.5, height),
        Phaser.Math.Between(1, 2),
        Phaser.Math.Between(0, 1) > 0.3 ? 0xc4a45a : 0xc44a1a,
        Phaser.Math.FloatBetween(0.15, 0.5)
      );
      this.embers.push(ember);

      this.tweens.add({
        targets: ember,
        y: ember.y - Phaser.Math.Between(150, 400),
        x: ember.x + Phaser.Math.Between(-60, 60),
        alpha: 0,
        duration: Phaser.Math.Between(3000, 7000),
        repeat: -1,
        delay: Phaser.Math.Between(0, 3000),
        onRepeat: () => {
          ember.setPosition(
            Phaser.Math.Between(0, width),
            height + 10
          );
          ember.setAlpha(Phaser.Math.FloatBetween(0.15, 0.5));
        },
      });
    }
  }
}
