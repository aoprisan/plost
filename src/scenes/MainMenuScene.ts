import Phaser from 'phaser';

export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainMenuScene' });
  }

  create(): void {
    const { width, height } = this.cameras.main;

    // Dark background with subtle gradient
    const bg = this.add.graphics();
    for (let y = 0; y < height; y++) {
      const t = y / height;
      const r = Math.floor(8 + t * 15);
      const g = Math.floor(4 + t * 8);
      const b = Math.floor(4 + t * 5);
      bg.fillStyle(Phaser.Display.Color.GetColor(r, g, b));
      bg.fillRect(0, y, width, 1);
    }

    // Title
    this.add.text(width / 2, height * 0.25, 'PARADISE LOST', {
      fontFamily: 'Georgia, serif',
      fontSize: '64px',
      color: '#c4a45a',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Subtitle
    this.add.text(width / 2, height * 0.35, 'THE FALLEN', {
      fontFamily: 'Georgia, serif',
      fontSize: '28px',
      color: '#8a7a5a',
      letterSpacing: 12,
    }).setOrigin(0.5);

    // Epigraph from Book I
    const epigraph = this.add.text(width / 2, height * 0.48,
      '"Better to reign in Hell, than serve in Heaven."', {
      fontFamily: 'Georgia, serif',
      fontSize: '18px',
      color: '#6a5a3a',
      fontStyle: 'italic',
    }).setOrigin(0.5);

    // Pulsing effect on epigraph
    this.tweens.add({
      targets: epigraph,
      alpha: { from: 0.6, to: 1 },
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Menu buttons
    const menuItems = [
      { text: 'Begin the Fall', scene: 'LakeOfFireScene' },
      { text: 'Continue', scene: null },
      { text: 'About', scene: null },
    ];

    menuItems.forEach((item, index) => {
      const y = height * 0.62 + index * 55;
      const btn = this.add.text(width / 2, y, item.text, {
        fontFamily: 'Georgia, serif',
        fontSize: '24px',
        color: item.scene ? '#c4a45a' : '#4a4a3a',
      }).setOrigin(0.5);

      if (item.scene) {
        btn.setInteractive({ useHandCursor: true });
        btn.on('pointerover', () => {
          btn.setColor('#fff0c0');
          btn.setScale(1.05);
        });
        btn.on('pointerout', () => {
          btn.setColor('#c4a45a');
          btn.setScale(1);
        });
        btn.on('pointerdown', () => {
          this.cameras.main.fadeOut(1500, 0, 0, 0);
          this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start(item.scene!);
          });
        });
      }
    });

    // Fade in
    this.cameras.main.fadeIn(2000, 0, 0, 0);

    // Floating ember particles
    this.createEmbers();
  }

  private createEmbers(): void {
    const { width, height } = this.cameras.main;
    for (let i = 0; i < 30; i++) {
      const ember = this.add.circle(
        Phaser.Math.Between(0, width),
        Phaser.Math.Between(0, height),
        Phaser.Math.Between(1, 3),
        0xc4a45a,
        Phaser.Math.FloatBetween(0.1, 0.4)
      );

      this.tweens.add({
        targets: ember,
        y: ember.y - Phaser.Math.Between(100, 300),
        x: ember.x + Phaser.Math.Between(-50, 50),
        alpha: 0,
        duration: Phaser.Math.Between(3000, 8000),
        repeat: -1,
        delay: Phaser.Math.Between(0, 3000),
        onRepeat: () => {
          ember.setPosition(
            Phaser.Math.Between(0, width),
            height + 20
          );
          ember.setAlpha(Phaser.Math.FloatBetween(0.1, 0.4));
        },
      });
    }
  }
}
