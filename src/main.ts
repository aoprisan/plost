import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { MainMenuScene } from './scenes/MainMenuScene';
import { LakeOfFireScene } from './scenes/LakeOfFireScene';
import { PandemoniumScene } from './scenes/PandemoniumScene';
import { CouncilScene } from './scenes/CouncilScene';
import { GatesOfHellScene } from './scenes/GatesOfHellScene';
import { ChaosScene } from './scenes/ChaosScene';
import { HeavenScene } from './scenes/HeavenScene';
import { DialogueScene } from './ui/DialogueScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  parent: 'game-container',
  backgroundColor: '#0a0a0a',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [BootScene, MainMenuScene, LakeOfFireScene, PandemoniumScene, CouncilScene, GatesOfHellScene, ChaosScene, HeavenScene, DialogueScene],
};

new Phaser.Game(config);
