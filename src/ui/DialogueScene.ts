import Phaser from 'phaser';
import { DialogueManager, DialogueLine, DialogueChoice } from '../systems/DialogueManager';
import { recordChoice } from '../systems/GameState';

interface DialogueSceneData {
  dialogueManager: DialogueManager;
  onComplete: () => void;
}

export class DialogueScene extends Phaser.Scene {
  private dialogueManager!: DialogueManager;
  private onComplete!: () => void;

  // UI elements
  private dialogueBox!: Phaser.GameObjects.Graphics;
  private speakerText!: Phaser.GameObjects.Text;
  private bodyText!: Phaser.GameObjects.Text;
  private continuePrompt!: Phaser.GameObjects.Text;
  private choiceTexts: Phaser.GameObjects.Text[] = [];

  private isShowingChoices = false;
  private isAnimating = false;
  private justSelectedChoice = false;
  private currentFullText = '';
  private charIndex = 0;
  private typewriterTimer?: Phaser.Time.TimerEvent;

  constructor() {
    super({ key: 'DialogueScene' });
  }

  init(data: DialogueSceneData): void {
    this.dialogueManager = data.dialogueManager;
    this.onComplete = data.onComplete;
  }

  create(): void {
    const { width, height } = this.cameras.main;

    // Ensure this overlay scene receives game object input
    this.input.setTopOnly(false);
    this.scene.bringToTop();

    // Semi-transparent dialogue box at the bottom
    this.dialogueBox = this.add.graphics();
    this.drawDialogueBox();

    // Speaker name
    this.speakerText = this.add.text(100, height - 195, '', {
      fontFamily: 'Georgia, serif',
      fontSize: '20px',
      color: '#c4a45a',
      fontStyle: 'bold',
    });

    // Body text
    this.bodyText = this.add.text(100, height - 165, '', {
      fontFamily: 'Georgia, serif',
      fontSize: '18px',
      color: '#e0d8c8',
      wordWrap: { width: width - 200 },
      lineSpacing: 6,
    });

    // Continue prompt
    this.continuePrompt = this.add.text(width - 120, height - 40, '▶ Continue', {
      fontFamily: 'Georgia, serif',
      fontSize: '14px',
      color: '#8a7a5a',
    }).setAlpha(0);

    // Blinking continue prompt
    this.tweens.add({
      targets: this.continuePrompt,
      alpha: { from: 0.4, to: 1 },
      duration: 800,
      yoyo: true,
      repeat: -1,
    });

    // Click/tap to advance
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      console.log('[DialogueScene] pointerdown', { x: pointer.x, y: pointer.y, isShowingChoices: this.isShowingChoices, isAnimating: this.isAnimating });
      if (this.justSelectedChoice) {
        this.justSelectedChoice = false;
        return;
      }
      if (this.isAnimating) {
        // Skip typewriter, show full text
        this.skipTypewriter();
      } else if (!this.isShowingChoices) {
        this.advanceDialogue();
      }
    });

    // Keyboard support
    this.input.keyboard!.on('keydown-SPACE', () => {
      if (this.isAnimating) {
        this.skipTypewriter();
      } else if (!this.isShowingChoices) {
        this.advanceDialogue();
      }
    });

    // Start the dialogue
    this.advanceDialogue();
  }

  private drawDialogueBox(): void {
    const { width, height } = this.cameras.main;
    this.dialogueBox.clear();

    // Dark box with gold border
    this.dialogueBox.fillStyle(0x0a0a0a, 0.85);
    this.dialogueBox.fillRoundedRect(60, height - 210, width - 120, 195, 8);

    this.dialogueBox.lineStyle(1, 0xc4a45a, 0.6);
    this.dialogueBox.strokeRoundedRect(60, height - 210, width - 120, 195, 8);
  }

  private advanceDialogue(): void {
    // Clear previous choices
    this.clearChoices();

    const line = this.dialogueManager.continue();

    if (line) {
      this.showLine(line);
    } else {
      // Check for choices
      const choices = this.dialogueManager.getChoices();
      if (choices.length > 0) {
        this.showChoices(choices);
      } else if (this.dialogueManager.isEnded()) {
        this.endDialogue();
      }
    }
  }

  private showLine(line: DialogueLine): void {
    // Update speaker
    this.speakerText.setText(line.speaker ?? '');

    // Typewriter effect for body
    this.currentFullText = line.text;
    this.charIndex = 0;
    this.bodyText.setText('');
    this.isAnimating = true;
    this.continuePrompt.setVisible(false);

    this.typewriterTimer = this.time.addEvent({
      delay: 30,
      callback: () => {
        this.charIndex++;
        this.bodyText.setText(this.currentFullText.slice(0, this.charIndex));

        if (this.charIndex >= this.currentFullText.length) {
          this.isAnimating = false;
          this.typewriterTimer?.destroy();
          this.onLineComplete();
        }
      },
      repeat: this.currentFullText.length - 1,
    });
  }

  private skipTypewriter(): void {
    this.typewriterTimer?.destroy();
    this.bodyText.setText(this.currentFullText);
    this.charIndex = this.currentFullText.length;
    this.isAnimating = false;
    this.onLineComplete();
  }

  private onLineComplete(): void {
    // Check if there are choices waiting
    const choices = this.dialogueManager.getChoices();
    if (choices.length > 0) {
      this.time.delayedCall(300, () => this.showChoices(choices));
    } else if (this.dialogueManager.isEnded()) {
      this.continuePrompt.setText('▶ End');
      this.continuePrompt.setVisible(true);
      // One more click will end
    } else {
      this.continuePrompt.setVisible(true);
    }
  }

  private showChoices(choices: DialogueChoice[]): void {
    this.isShowingChoices = true;
    this.continuePrompt.setVisible(false);
    const { width, height } = this.cameras.main;

    choices.forEach((choice, i) => {
      const y = height - 155 + i * 40;
      const choiceText = this.add.text(140, y, `${i + 1}. ${choice.text}`, {
        fontFamily: 'Georgia, serif',
        fontSize: '17px',
        color: '#c4a45a',
      })
        .setInteractive({ useHandCursor: true })
        .setAlpha(0);

      // Fade in staggered
      this.tweens.add({
        targets: choiceText,
        alpha: 1,
        x: 120,
        duration: 400,
        delay: i * 150,
      });

      choiceText.on('pointerover', () => {
        choiceText.setColor('#fff0c0');
      });
      choiceText.on('pointerout', () => {
        choiceText.setColor('#c4a45a');
      });
      choiceText.on('pointerdown', () => {
        console.log('[DialogueScene] choice clicked', choice.index);
        this.selectChoice(choice.index);
      });

      this.choiceTexts.push(choiceText);

      // Keyboard shortcut
      this.input.keyboard!.once(`keydown-${i + 1}`, () => {
        if (this.isShowingChoices) {
          this.selectChoice(choice.index);
        }
      });
    });
  }

  private selectChoice(index: number): void {
    recordChoice(`choice_${index}`);
    this.dialogueManager.choose(index);
    this.isShowingChoices = false;
    this.justSelectedChoice = true;
    this.clearChoices();
    this.advanceDialogue();
  }

  private clearChoices(): void {
    this.choiceTexts.forEach(t => t.destroy());
    this.choiceTexts = [];
  }

  private endDialogue(): void {
    const { height } = this.cameras.main;

    this.tweens.add({
      targets: [this.dialogueBox, this.speakerText, this.bodyText, this.continuePrompt],
      alpha: 0,
      duration: 1000,
      onComplete: () => {
        this.onComplete();
      },
    });
  }
}
