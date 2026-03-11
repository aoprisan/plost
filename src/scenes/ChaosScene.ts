import Phaser from 'phaser';
import { DialogueManager } from '../systems/DialogueManager';

export class ChaosScene extends Phaser.Scene {
  private dialogueManager!: DialogueManager;
  private chaosGraphics!: Phaser.GameObjects.Graphics;
  private chaosMotes: Phaser.GameObjects.Arc[] = [];
  private chaosFragments: Phaser.GameObjects.Graphics[] = [];
  private elapsed = 0;

  constructor() {
    super({ key: 'ChaosScene' });
  }

  create(): void {
    const { width, height } = this.cameras.main;

    // Background — use Doré engraving if available, otherwise procedural
    const bgKey = this.textures.exists('dore-chaos') ? 'dore-chaos' : 'chaos-bg';
    const bg = this.add.image(width / 2, height / 2, bgKey);
    if (bgKey === 'dore-chaos') {
      const scaleX = width / bg.width;
      const scaleY = height / bg.height;
      bg.setScale(Math.min(scaleX, scaleY));
      bg.setTint(0x998877);
    }

    // Roiling chaos overlay — shifting colors representing warring elements
    this.chaosGraphics = this.add.graphics();

    // Drifting chaos motes — fragments of un-matter
    this.createChaosMotes();

    // Floating fragments — shards of half-formed worlds
    this.createChaosFragments();

    // Satan silhouette — tiny, battered, mid-flight
    this.createSatanFigure();

    // Dramatic entrance — longer fade for the disorienting void
    this.cameras.main.fadeIn(4000, 0, 0, 0);

    // Continuous chaos animation
    this.time.addEvent({
      delay: 50,
      loop: true,
      callback: () => {
        this.elapsed += 50;
        this.updateChaosOverlay();
      },
    });

    // Start dialogue after scene settles
    this.time.delayedCall(4500, () => {
      this.startDialogue();
    });
  }

  private updateChaosOverlay(): void {
    const { width, height } = this.cameras.main;
    const t = this.elapsed / 1000;

    this.chaosGraphics.clear();

    // Shifting bands of elemental conflict — fire, ice, darkness, light
    const bandCount = 6;
    for (let i = 0; i < bandCount; i++) {
      const yOffset = Math.sin(t * 0.3 + i * 1.2) * 60;
      const bandY = (height / bandCount) * i + yOffset;
      const bandH = height / bandCount + 40;

      // Alternate between elemental colors
      const colors = [0xc44a1a, 0x2244aa, 0x1a1a2a, 0xaa8833, 0x224422, 0x551133];
      const alpha = 0.03 + Math.sin(t * 0.5 + i * 0.8) * 0.02;

      this.chaosGraphics.fillStyle(colors[i % colors.length], Math.max(0, alpha));
      this.chaosGraphics.fillRect(0, bandY, width, bandH);
    }

    // Occasional flash — lightning in the void
    if (Math.random() < 0.008) {
      this.chaosGraphics.fillStyle(0xffffff, 0.06);
      this.chaosGraphics.fillRect(0, 0, width, height);
    }
  }

  private createChaosMotes(): void {
    const { width, height } = this.cameras.main;

    for (let i = 0; i < 30; i++) {
      // Varied colors — elements at war
      const colors = [0xc44a1a, 0x4488cc, 0xccaa44, 0x88cc88, 0xcc44aa, 0xffffff];
      const color = colors[Phaser.Math.Between(0, colors.length - 1)];
      const size = Phaser.Math.Between(1, 3);

      const mote = this.add.circle(
        Phaser.Math.Between(0, width),
        Phaser.Math.Between(0, height),
        size,
        color,
        Phaser.Math.FloatBetween(0.05, 0.25)
      );

      this.chaosMotes.push(mote);

      // Wild, unpredictable motion — chaos has no order
      this.tweens.add({
        targets: mote,
        x: mote.x + Phaser.Math.Between(-200, 200),
        y: mote.y + Phaser.Math.Between(-200, 200),
        alpha: { from: mote.alpha, to: 0 },
        scale: { from: 1, to: Phaser.Math.FloatBetween(0.2, 2.5) },
        duration: Phaser.Math.Between(2000, 6000),
        repeat: -1,
        delay: Phaser.Math.Between(0, 3000),
        ease: 'Sine.easeInOut',
        onRepeat: () => {
          mote.setPosition(
            Phaser.Math.Between(0, width),
            Phaser.Math.Between(0, height)
          );
          mote.setAlpha(Phaser.Math.FloatBetween(0.05, 0.25));
          mote.setScale(1);
        },
      });
    }
  }

  private createChaosFragments(): void {
    const { width, height } = this.cameras.main;

    // Shards of half-formed worlds tumbling through the void
    for (let i = 0; i < 8; i++) {
      const fragment = this.add.graphics();
      const fragWidth = Phaser.Math.Between(10, 40);
      const fragHeight = Phaser.Math.Between(8, 30);
      const color = [0x554433, 0x334455, 0x553322, 0x445544][i % 4];

      fragment.fillStyle(color, 0.15);
      fragment.fillRect(-fragWidth / 2, -fragHeight / 2, fragWidth, fragHeight);

      fragment.setPosition(
        Phaser.Math.Between(0, width),
        Phaser.Math.Between(0, height)
      );
      fragment.setAlpha(0);

      this.chaosFragments.push(fragment);

      // Tumbling, dissolving motion
      this.tweens.add({
        targets: fragment,
        x: fragment.x + Phaser.Math.Between(-300, 300),
        y: fragment.y + Phaser.Math.Between(-200, 200),
        angle: Phaser.Math.Between(-180, 180),
        alpha: { from: 0.3, to: 0 },
        scaleX: { from: 1, to: Phaser.Math.FloatBetween(0.1, 0.5) },
        scaleY: { from: 1, to: Phaser.Math.FloatBetween(0.1, 0.5) },
        duration: Phaser.Math.Between(5000, 10000),
        repeat: -1,
        delay: Phaser.Math.Between(0, 5000),
        ease: 'Power1',
        onRepeat: () => {
          fragment.setPosition(
            Phaser.Math.Between(0, width),
            Phaser.Math.Between(0, height)
          );
          fragment.setAlpha(0);
          fragment.setScale(1);
          fragment.setAngle(0);
        },
      });
    }
  }

  private createSatanFigure(): void {
    const { width, height } = this.cameras.main;

    // Small Satan figure — alone, battered, mid-flight through the void
    const satan = this.add.graphics();
    satan.fillStyle(0x1a1a1a);
    // Body — small to emphasize the vastness of Chaos
    satan.fillEllipse(0, 0, 16, 30);
    // Head
    satan.fillCircle(0, -20, 7);
    // Broken wings — ragged, splayed
    satan.fillTriangle(-8, -5, -28, -18, -5, 5);
    satan.fillTriangle(8, -5, 28, -18, 5, 5);
    // Wing tears
    satan.lineStyle(1, 0x0a0a0a);
    satan.lineBetween(-18, -12, -22, -8);
    satan.lineBetween(18, -12, 22, -8);

    satan.setPosition(width * 0.5, height * 0.45);
    satan.setAlpha(0);

    // Fade in after a moment
    this.tweens.add({
      targets: satan,
      alpha: 0.7,
      duration: 2000,
      delay: 2000,
      ease: 'Power2',
    });

    // Buffeted by the void — slight, continuous wobble
    this.tweens.add({
      targets: satan,
      x: satan.x + 8,
      y: satan.y - 5,
      angle: 3,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  private async startDialogue(): Promise<void> {
    this.dialogueManager = new DialogueManager();

    const response = await fetch(`${import.meta.env.BASE_URL}assets/dialogue/book2-chaos.json`);
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

    const endText = this.add.text(width / 2, height / 2, 'Book II: Chaos\n— To be continued —', {
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
}
