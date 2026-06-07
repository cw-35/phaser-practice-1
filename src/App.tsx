import { useEffect } from 'react';
import { GameScene } from './scenes/game-scene';
import { GameOverScene } from './scenes/game-over';
import './App.css';
import Phaser from 'phaser';

function App() {

  const config = {
    type: Phaser.AUTO,
    scene: [GameScene, GameOverScene],
    scale: {
      width: 1024,
      height: 768,
      mode: Phaser.Scale.FIT,
    },
    physics: {
      default: "arcade",
      arcade: {
        gravity: { 
          x: 0,
          y: 0
        },
        debug: false,
      },
    },
    backgroundColor: '#028af8',
    parent: "phaser-container",
  };

  useEffect(() => {
    const game = new Phaser.Game(config);

    return () => {
      game.destroy(true);
    }
  },[])

  return (
    <div>
      <div id = "phaser-container">

      </div>
    </div>
  )
}

export default App