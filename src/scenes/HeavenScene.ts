import Phaser from 'phaser';
import { DialogueManager } from '../systems/DialogueManager';

export class HeavenScene extends Phaser.Scene {
  private dialogueManager!: DialogueManager;
  private gloryGraphics!: Phaser.GameObjects.Graphics;
  private elapsed = 0;

  constructor() {
    super({ key: 'HeavenScene' });
  }

  create(): void {
    const { width, height } = this.cameras.main;

    // Background — use Doré engraving if available, otherwise procedural
    const bgKey = this.textures.exists('dore-heaven') ? 'dore-heaven' : 'heaven-bg';
    const bg = this.add.image(width / 2, height / 2, bgKey);
    if (bgKey === 'dore-heaven') {
      const scaleX = width / bg.width;
      const scaleY = height / bg.height;
      bg.setScale(Math.min(scaleX, scaleY));
      bg.setTint(0xddeeff);
    }

    // Divine radiance overlay — pulsing golden-white light from the throne
    this.gloryGraphics = this.add.graphics();

    // Celestial particles — golden motes drifting upward
    this.createCelestialMotes();

    // Angelic ranks — faint silhouettes flanking the throne
    this.createAngelicRanks();

    // The throne glow — central radiance
    this.createThroneGlow();

    // Fade in — gentle, not harsh like Hell's scenes
    this.cameras.main.fadeIn(3000, 255, 255, 255);

    // Continuous glory animation
    this.time.addEvent({
      delay: 50,
      loop: true,
      callback: () => {
        this.elapsed += 50;
        this.updateGloryOverlay();
      },
    });

    // Start dialogue after the light settles
    this.time.delayedCall(3500, () => {
      this.startDialogue();
    });
  }

  private updateGloryOverlay(): void {
    const { width, height } = this.cameras.main;
    const t = this.elapsed / 1000;

    this.gloryGraphics.clear();

    // Radial glow from center-top (the throne)
    const throneX = width / 2;
    const throneY = height * 0.15;
    const pulseAlpha = 0.02 + Math.sin(t * 0.4) * 0.015;

    // Concentric rings of light
    for (let r = 0; r < 5; r++) {
      const radius = 120 + r * 100 + Math.sin(t * 0.3 + r) * 20;
      const alpha = pulseAlpha * (1 - r * 0.18);
      this.gloryGraphics.fillStyle(0xfff8e0, Math.max(0, alpha));
      this.gloryGraphics.fillCircle(throneX, throneY, radius);
    }

    // Faint golden wash over the whole scene
    this.gloryGraphics.fillStyle(0xc4a45a, 0.01 + Math.sin(t * 0.2) * 0.005);
    this.gloryGraphics.fillRect(0, 0, width, height);
  }

  private createCelestialMotes(): void {
    const { width, height } = this.cameras.main;

    for (let i = 0; i < 25; i++) {
      // Golden-white motes — pure, gentle light
      const isGold = Math.random() > 0.3;
      const color = isGold ? 0xc4a45a : 0xffffff;
      const size = Phaser.Math.FloatBetween(0.5, 2);

      const mote = this.add.circle(
        Phaser.Math.Between(50, width - 50),
        Phaser.Math.Between(100, height),
        size,
        color,
        Phaser.Math.FloatBetween(0.1, 0.4)
      );

      // Gentle upward drift — Heaven's light rises
      this.tweens.add({
        targets: mote,
        y: mote.y - Phaser.Math.Between(80, 200),
        x: mote.x + Phaser.Math.Between(-30, 30),
        alpha: 0,
        duration: Phaser.Math.Between(4000, 8000),
        repeat: -1,
        delay: Phaser.Math.Between(0, 4000),
        ease: 'Sine.easeIn',
        onRepeat: () => {
          mote.setPosition(
            Phaser.Math.Between(50, width - 50),
            Phaser.Math.Between(height * 0.4, height)
          );
          mote.setAlpha(Phaser.Math.FloatBetween(0.1, 0.4));
        },
      });
    }
  }

  private createAngelicRanks(): void {
    const { width, height } = this.cameras.main;

    // Two ranks of faint angelic silhouettes flanking center
    const positions = [
      // Left rank
      { x: width * 0.15, y: height * 0.45 },
      { x: width * 0.2, y: height * 0.5 },
      { x: width * 0.12, y: height * 0.55 },
      { x: width * 0.22, y: height * 0.6 },
      { x: width * 0.17, y: height * 0.65 },
      // Right rank
      { x: width * 0.85, y: height * 0.45 },
      { x: width * 0.8, y: height * 0.5 },
      { x: width * 0.88, y: height * 0.55 },
      { x: width * 0.78, y: height * 0.6 },
      { x: width * 0.83, y: height * 0.65 },
    ];

    positions.forEach((pos, i) => {
      const angel = this.add.graphics();
      angel.fillStyle(0xfff8e0, 0.08);
      // Simple winged figure
      angel.fillCircle(0, -10, 5); // head
      angel.fillEllipse(0, 5, 10, 20); // body
      angel.fillTriangle(-5, 0, -18, -8, -3, 8); // left wing
      angel.fillTriangle(5, 0, 18, -8, 3, 8); // right wing
      angel.setPosition(pos.x, pos.y);
      angel.setAlpha(0);

      this.tweens.add({
        targets: angel,
        alpha: 0.4 + Math.random() * 0.2,
        duration: 2000,
        delay: 1000 + i * 200,
        ease: 'Power2',
      });

      // Gentle sway
      this.tweens.add({
        targets: angel,
        y: pos.y - 3,
        duration: 3000 + i * 200,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    });
  }

  private createThroneGlow(): void {
    const { width, height } = this.cameras.main;

    // Central throne — a burst of golden-white radiance
    const throne = this.add.graphics();
    throne.fillStyle(0xfff8e0, 0.15);
    throne.fillCircle(width / 2, height * 0.15, 40);
    throne.fillStyle(0xc4a45a, 0.1);
    throne.fillCircle(width / 2, height * 0.15, 60);
    throne.fillStyle(0xffffff, 0.05);
    throne.fillCircle(width / 2, height * 0.15, 90);
    throne.setAlpha(0);

    this.tweens.add({
      targets: throne,
      alpha: 1,
      duration: 3000,
      delay: 500,
      ease: 'Power2',
    });

    // Pulsing radiance
    this.tweens.add({
      targets: throne,
      scaleX: 1.05,
      scaleY: 1.05,
      duration: 4000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // The Son — a brighter point at the right of the throne
    const son = this.add.graphics();
    son.fillStyle(0xffffff, 0.2);
    son.fillCircle(width / 2 + 50, height * 0.18, 15);
    son.fillStyle(0xc4a45a, 0.12);
    son.fillCircle(width / 2 + 50, height * 0.18, 25);
    son.setAlpha(0);

    this.tweens.add({
      targets: son,
      alpha: 1,
      duration: 2000,
      delay: 2000,
      ease: 'Power2',
    });
  }

  private async startDialogue(): Promise<void> {
    this.dialogueManager = new DialogueManager();

    const response = await fetch(`${import.meta.env.BASE_URL}assets/dialogue/book3-heaven.json`);
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

    const endText = this.add.text(width / 2, height / 2, 'Book III: Heaven\n— To be continued —', {
      fontFamily: 'Georgia, serif',
      fontSize: '32px',
      color: '#c4a45a',
      align: 'center',
    }).setOrigin(0.5).setAlpha(0);

    this.cameras.main.fadeOut(2000, 255, 255, 255);
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
