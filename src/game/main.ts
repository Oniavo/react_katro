import { GameOver } from './scenes/GameOver';
import { Game as MainGame } from './scenes/Game';
import { MainMenu } from './scenes/MainMenu';
import { AUTO, Game } from 'phaser';

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: 737,
    height: 707,
    parent: 'game-container',
    backgroundColor: '#028af8',
    physics: {
        default: 'arcade', // Ensure arcade physics is enabled
        arcade: {
            debug: false,      // Enable debug mode for troubleshooting collisions
        },
    },
    scene: [
        MainMenu,
        GameOver
    ]
};

const StartGame = (parent: string) => {

    return new Game({ ...config, parent });

}

export default StartGame;
