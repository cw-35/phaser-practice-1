import Phaser from "phaser";

export class GameOverScene extends Phaser.Scene {

    private score: number = 0;
    private restartKey!: Phaser.Input.Keyboard.Key;

    constructor() {
        super({
            key: 'GameOverScene'
        });
    }

    init(data: { score: number }) {
        this.score = data.score;
    }

    create() {
        this.add.text(this.scale.width/2, 250, "GAME OVER", {
            fontSize: "48px",
            color: "#ffffff",
        }).setOrigin(0.5);

        this.add.text(this.scale.width/2, 320, `Score: ${this.score}`, {
            fontSize: "32px",
            color: "#ffffff",
        }).setOrigin(.5);

        this.add.text(this.scale.width/2, 420, "Press Space to Restart", {
            fontSize: "24px",
            color: "#aaaaaa",
        }).setOrigin(.5);

        this.restartKey = this.input.keyboard!.addKey(
            Phaser.Input.Keyboard.KeyCodes.SPACE
        );

        this.restartKey.once("down", () => {
            this.scene.start("GameScene");
        });
    }

}