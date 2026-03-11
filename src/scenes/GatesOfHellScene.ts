import Phaser from 'phaser';
import { DialogueManager } from '../systems/DialogueManager';

export class GatesOfHellScene extends Phaser.Scene {
  private dialogueManager!: DialogueManager;

  constructor() {
    super({ key: 'GatesOfHellScene' });
  }

  create(): void {
    const { width, height } = this.cameras.main;

    // Background — use Doré engraving if available, otherwise procedural
    const bgKey = this.textures.exists('dore-gates-of-hell') ? 'dore-gates-of-hell' : 'gates-of-hell-bg';
    const bg = this.add.image(width / 2, height / 2, bgKey);
    if (bgKey === 'dore-gates-of-hell') {
      const scaleX = width / bg.width;
      const scaleY = height / bg.height;
      bg.setScale(Math.min(scaleX, scaleY));
      bg.setTint(0xccaa99);
    }

    // Cold void light seeping through the gates — alternating warm/cold
    const voidGlow = this.add.graphics();
    this.tweens.addCounter({
      from: 0,
      to: 1,
      duration: 3000,
      yoyo: true,
      repeat: -1,
      onUpdate: (tween) => {
        const v = tween.getValue() ?? 0;
        voidGlow.clear();
        // Cold blue-white light from beyond the gates (upper)
        voidGlow.fillStyle(0x8899bb, 0.03 + v * 0.06);
        voidGlow.fillRect(0, 0, width, 250);
        // Hellfire glow from below (warm)
        voidGlow.fillStyle(0xc44a1a, 0.04 + (1 - v) * 0.08);
        voidGlow.fillRect(0, 520, width, 200);
      },
    });

    // Gate silhouettes — procedural only when no Doré image
    const useDore = bgKey === 'dore-gates-of-hell';
    if (!useDore) {
      this.createGateSilhouettes();
    }

    // Drifting void particles — eerie, cold motes
    this.createVoidParticles();

    // Dramatic entrance
    this.cameras.main.fadeIn(3000, 0, 0, 0);

    // Start dialogue after scene settles
    this.time.delayedCall(3500, () => {
      this.startDialogue();
    });
  }

  private createGateSilhouettes(): void {
    const { width, height } = this.cameras.main;

    // Two massive gate pillars
    const leftPillar = this.add.graphics();
    leftPillar.fillStyle(0x0e0a08);
    leftPillar.fillRect(width * 0.25 - 30, 50, 60, height - 100);
    leftPillar.fillStyle(0x8a7a5a, 0.15);
    leftPillar.fillRect(width * 0.25 - 3, 50, 6, height - 100);
    leftPillar.setAlpha(0);

    const rightPillar = this.add.graphics();
    rightPillar.fillStyle(0x0e0a08);
    rightPillar.fillRect(width * 0.75 - 30, 50, 60, height - 100);
    rightPillar.fillStyle(0x8a7a5a, 0.15);
    rightPillar.fillRect(width * 0.75 - 3, 50, 6, height - 100);
    rightPillar.setAlpha(0);

    // Arch connecting them
    const arch = this.add.graphics();
    arch.fillStyle(0x0e0a08);
    arch.fillRect(width * 0.25 - 30, 50, width * 0.5 + 60, 40);
    arch.fillStyle(0x8a7a5a, 0.1);
    arch.fillRect(width * 0.25, 85, width * 0.5, 5);
    arch.setAlpha(0);

    // Sin's silhouette — woman above, serpents below (center-left)
    const sinFigure = this.add.graphics();
    sinFigure.fillStyle(0x120e0c);
    // Upper body
    sinFigure.fillCircle(width * 0.4, height * 0.42, 14);
    sinFigure.fillEllipse(width * 0.4, height * 0.5, 28, 50);
    // Serpentine lower half
    for (let i = 0; i < 5; i++) {
      const yOff = height * 0.56 + i * 18;
      const xOff = Math.sin(i * 0.8) * 12;
      sinFigure.fillCircle(width * 0.4 + xOff, yOff, 6 - i * 0.5);
    }
    sinFigure.setAlpha(0);

    // Death's silhouette — formless, crowned shadow (center-right)
    const deathFigure = this.add.graphics();
    deathFigure.fillStyle(0x080608);
    deathFigure.fillEllipse(width * 0.6, height * 0.48, 40, 80);
    // Crown
    deathFigure.fillTriangle(
      width * 0.6 - 10, height * 0.4,
      width * 0.6, height * 0.35,
      width * 0.6 + 10, height * 0.4
    );
    deathFigure.setAlpha(0);

    // Staggered fade-in
    this.tweens.add({ targets: leftPillar, alpha: 0.8, duration: 2000, delay: 400, ease: 'Power2' });
    this.tweens.add({ targets: rightPillar, alpha: 0.8, duration: 2000, delay: 600, ease: 'Power2' });
    this.tweens.add({ targets: arch, alpha: 0.7, duration: 2000, delay: 800, ease: 'Power2' });
    this.tweens.add({ targets: sinFigure, alpha: 0.6, duration: 1500, delay: 1200, ease: 'Power2' });
    this.tweens.add({ targets: deathFigure, alpha: 0.5, duration: 1500, delay: 1500, ease: 'Power2' });
  }

  private createVoidParticles(): void {
    const { width, height } = this.cameras.main;
    for (let i = 0; i < 18; i++) {
      // Mix of cold blue-white and hellfire particles
      const isCold = Math.random() > 0.4;
      const color = isCold ? 0x8899bb : 0xc44a1a;
      const mote = this.add.circle(
        Phaser.Math.Between(width * 0.2, width * 0.8),
        Phaser.Math.Between(50, height - 50),
        Phaser.Math.Between(1, 2),
        color,
        Phaser.Math.FloatBetween(0.08, 0.3)
      );

      // Slow, drifting motion — void motes float unpredictably
      this.tweens.add({
        targets: mote,
        y: mote.y + Phaser.Math.Between(-80, 80),
        x: mote.x + Phaser.Math.Between(-50, 50),
        alpha: 0,
        duration: Phaser.Math.Between(4000, 8000),
        repeat: -1,
        delay: Phaser.Math.Between(0, 3000),
        ease: 'Sine.easeInOut',
        onRepeat: () => {
          mote.setPosition(
            Phaser.Math.Between(width * 0.2, width * 0.8),
            Phaser.Math.Between(50, height - 50)
          );
          mote.setAlpha(Phaser.Math.FloatBetween(0.08, 0.3));
        },
      });
    }
  }

  private async startDialogue(): Promise<void> {
    this.dialogueManager = new DialogueManager();

    const response = await fetch(`${import.meta.env.BASE_URL}assets/dialogue/book2-gates-of-hell.json`);
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

    this.cameras.main.fadeOut(2000, 0, 0, 0);
    this.time.delayedCall(2500, () => {
      this.scene.start('ChaosScene');
    });
  }
}
