import Phaser from 'phaser';
import { DialogueManager } from '../systems/DialogueManager';

export class LakeOfFireScene extends Phaser.Scene {
  private dialogueManager!: DialogueManager;
  private embers: Phaser.GameObjects.Arc[] = [];

  constructor() {
    super({ key: 'LakeOfFireScene' });
  }

  create(): void {
    const { width, height } = this.cameras.main;

    // Background — use Doré engraving if available, otherwise procedural
    const bgKey = this.textures.exists('dore-satan-rises') ? 'dore-satan-rises' : 'lake-of-fire-bg';
    const bg = this.add.image(width / 2, height / 2, bgKey);
    // Scale Doré illustration to fit entirely within the viewport
    if (bgKey === 'dore-satan-rises') {
      const scaleX = width / bg.width;
      const scaleY = height / bg.height;
      bg.setScale(Math.min(scaleX, scaleY));
      bg.setTint(0xddaa88); // warm sepia tone
    }

    // Animated fire glow at bottom
    const fireGlow = this.add.graphics();
    this.tweens.addCounter({
      from: 0,
      to: 1,
      duration: 3000,
      yoyo: true,
      repeat: -1,
      onUpdate: (tween) => {
        const v = tween.getValue() ?? 0;
        fireGlow.clear();
        fireGlow.fillStyle(0xc44a1a, 0.1 + v * 0.15);
        fireGlow.fillRect(0, 500, width, 220);
      },
    });

    // Character silhouettes — only shown when using procedural background
    const useDore = bgKey === 'dore-satan-rises';
    const satan = this.add.image(width * 0.35, height * 0.65, 'satan-silhouette')
      .setScale(2.5)
      .setAlpha(0)
      .setVisible(!useDore);

    const beelzebub = this.add.image(width * 0.6, height * 0.68, 'beelzebub-silhouette')
      .setScale(2)
      .setAlpha(0)
      .setVisible(!useDore);

    // Floating embers
    this.createEmbers();

    // Dramatic entrance
    this.cameras.main.fadeIn(3000, 0, 0, 0);

    // Fade in Satan first, then Beelzebub
    this.time.delayedCall(2000, () => {
      this.tweens.add({
        targets: satan,
        alpha: 0.8,
        y: height * 0.6,
        duration: 2000,
        ease: 'Power2',
      });
    });

    this.time.delayedCall(3000, () => {
      this.tweens.add({
        targets: beelzebub,
        alpha: 0.6,
        y: height * 0.64,
        duration: 1500,
        ease: 'Power2',
      });
    });

    // Start dialogue after scene settles
    this.time.delayedCall(4500, () => {
      this.startDialogue();
    });
  }

  private async startDialogue(): Promise<void> {
    this.dialogueManager = new DialogueManager();

    const response = await fetch(`${import.meta.env.BASE_URL}assets/dialogue/book1-lake-of-fire.json`);
    const storyJson = await response.json();
    this.dialogueManager.loadStory(JSON.stringify(storyJson));

    // Launch the dialogue overlay scene
    this.scene.launch('DialogueScene', {
      dialogueManager: this.dialogueManager,
      onComplete: () => {
        this.onDialogueComplete();
      },
    });
  }

  private onDialogueComplete(): void {
    // Fade to black and show chapter end
    const { width, height } = this.cameras.main;

    this.scene.stop('DialogueScene');

    const endText = this.add.text(width / 2, height / 2, 'Book I: The Lake of Fire\n— To be continued —', {
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

  private createEmbers(): void {
    const { width, height } = this.cameras.main;
    for (let i = 0; i < 40; i++) {
      const ember = this.add.circle(
        Phaser.Math.Between(0, width),
        Phaser.Math.Between(height * 0.6, height),
        Phaser.Math.Between(1, 3),
        Phaser.Math.Between(0, 1) > 0.5 ? 0xc44a1a : 0xc4a45a,
        Phaser.Math.FloatBetween(0.2, 0.6)
      );
      this.embers.push(ember);

      this.tweens.add({
        targets: ember,
        y: ember.y - Phaser.Math.Between(200, 500),
        x: ember.x + Phaser.Math.Between(-80, 80),
        alpha: 0,
        duration: Phaser.Math.Between(2000, 6000),
        repeat: -1,
        delay: Phaser.Math.Between(0, 3000),
        onRepeat: () => {
          ember.setPosition(
            Phaser.Math.Between(0, width),
            height + 10
          );
          ember.setAlpha(Phaser.Math.FloatBetween(0.2, 0.6));
        },
      });
    }
  }
}
