import Phaser from 'phaser';
import { DialogueManager } from '../systems/DialogueManager';

export class CouncilScene extends Phaser.Scene {
  private dialogueManager!: DialogueManager;

  constructor() {
    super({ key: 'CouncilScene' });
  }

  create(): void {
    const { width, height } = this.cameras.main;

    // Background — use Doré engraving if available, otherwise procedural
    const bgKey = this.textures.exists('dore-council') ? 'dore-council' : 'council-bg';
    const bg = this.add.image(width / 2, height / 2, bgKey);
    if (bgKey === 'dore-council') {
      const scaleX = width / bg.width;
      const scaleY = height / bg.height;
      bg.setScale(Math.min(scaleX, scaleY));
      bg.setTint(0xddaa88);
    }

    // Naphtha lamp glow — warm flickering light from above
    const lampGlow = this.add.graphics();
    this.tweens.addCounter({
      from: 0,
      to: 1,
      duration: 2500,
      yoyo: true,
      repeat: -1,
      onUpdate: (tween) => {
        const v = tween.getValue() ?? 0;
        lampGlow.clear();
        // Upper warm light
        lampGlow.fillStyle(0xc4a45a, 0.05 + v * 0.08);
        lampGlow.fillRect(0, 0, width, 200);
        // Lower reflected glow on the council floor
        lampGlow.fillStyle(0xc4a45a, 0.04 + v * 0.06);
        lampGlow.fillRect(0, 500, width, 220);
      },
    });

    // Council seats — silhouettes of the lords, procedural only
    const useDore = bgKey === 'dore-council';
    if (!useDore) {
      this.createCouncilSeats();
    }

    // Slow-drifting motes of dust in the lamplight
    this.createDustMotes();

    // Dramatic entrance
    this.cameras.main.fadeIn(3000, 0, 0, 0);

    // Start dialogue after scene settles
    this.time.delayedCall(3500, () => {
      this.startDialogue();
    });
  }

  private createCouncilSeats(): void {
    const { width, height } = this.cameras.main;
    // Central table
    const table = this.add.graphics();
    table.fillStyle(0x1a1410);
    table.fillRoundedRect(width * 0.2, height * 0.55, width * 0.6, 30, 8);
    table.fillStyle(0xc4a45a, 0.15);
    table.fillRoundedRect(width * 0.2, height * 0.55, width * 0.6, 4, 2);
    table.setAlpha(0);

    this.tweens.add({
      targets: table,
      alpha: 0.8,
      duration: 2000,
      delay: 500,
      ease: 'Power2',
    });

    // Seated figures — dark shapes behind the table
    const seats = [
      { x: 0.25, label: 'Moloch' },
      { x: 0.38, label: 'Belial' },
      { x: 0.50, label: 'Satan' },
      { x: 0.62, label: 'Mammon' },
      { x: 0.75, label: 'Beelzebub' },
    ];

    seats.forEach((seat, i) => {
      const figure = this.add.graphics();
      // Head
      figure.fillStyle(0x151210);
      figure.fillCircle(width * seat.x, height * 0.46, 18);
      // Shoulders
      figure.fillStyle(0x151210);
      figure.fillRect(width * seat.x - 22, height * 0.48, 44, 40);
      figure.setAlpha(0);

      this.tweens.add({
        targets: figure,
        alpha: 0.6,
        duration: 1500,
        delay: 800 + i * 400,
        ease: 'Power2',
      });
    });
  }

  private async startDialogue(): Promise<void> {
    this.dialogueManager = new DialogueManager();

    const response = await fetch(`${import.meta.env.BASE_URL}assets/dialogue/book2-council.json`);
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

    // Transition to Gates of Hell
    this.cameras.main.fadeOut(2000, 0, 0, 0);
    this.time.delayedCall(2000, () => {
      this.scene.start('GatesOfHellScene');
    });
  }

  private createDustMotes(): void {
    const { width, height } = this.cameras.main;
    for (let i = 0; i < 20; i++) {
      const mote = this.add.circle(
        Phaser.Math.Between(width * 0.15, width * 0.85),
        Phaser.Math.Between(100, height * 0.5),
        Phaser.Math.Between(1, 2),
        0xc4a45a,
        Phaser.Math.FloatBetween(0.05, 0.2)
      );

      this.tweens.add({
        targets: mote,
        y: mote.y + Phaser.Math.Between(30, 80),
        x: mote.x + Phaser.Math.Between(-40, 40),
        alpha: 0,
        duration: Phaser.Math.Between(4000, 8000),
        repeat: -1,
        delay: Phaser.Math.Between(0, 4000),
        ease: 'Sine.easeInOut',
        onRepeat: () => {
          mote.setPosition(
            Phaser.Math.Between(width * 0.15, width * 0.85),
            Phaser.Math.Between(50, 150)
          );
          mote.setAlpha(Phaser.Math.FloatBetween(0.05, 0.2));
        },
      });
    }
  }
}
