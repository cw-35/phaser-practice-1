import Phaser from "phaser";

export class GameScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'GameScene'
        });
    }

    private score: number = 0;
    private difficulty: number = 1;

    wasd!: {
        W: Phaser.Input.Keyboard.Key;
        A: Phaser.Input.Keyboard.Key;
        S: Phaser.Input.Keyboard.Key;
        D: Phaser.Input.Keyboard.Key;
    }

    player!: Phaser.Physics.Arcade.Sprite;
    aim!: Phaser.GameObjects.Image;
    player_bullet!: Phaser.Physics.Arcade.Image;
    scoreText!: Phaser.GameObjects.Text;

    bullets!: Phaser.Physics.Arcade.Group;
    enemies!: Phaser.Physics.Arcade.Group;

    preload() {
        this.load.image('background', '/assets/background.png');
        this.load.image('player', '/assets/player.png');
        this.load.image('enemy', '/assets/enemy.png');
        this.load.image('aim', '/assets/aim.png');
        this.load.image('player_bullet', '/assets/player_bullet.png');
    }

    create() {

        const PLAYER_BULLET_SPEED = 750;
        this.score = 0;

        const bg = this.add.image(0, 0, 'background');
        bg.setOrigin(0, 0);

        this.wasd = this.input.keyboard!.addKeys({
            W: Phaser.Input.Keyboard.KeyCodes.W,
            A: Phaser.Input.Keyboard.KeyCodes.A,
            S: Phaser.Input.Keyboard.KeyCodes.S,
            D: Phaser.Input.Keyboard.KeyCodes.D,
        }) as {
            W: Phaser.Input.Keyboard.Key;
            A: Phaser.Input.Keyboard.Key;
            S: Phaser.Input.Keyboard.Key;
            D: Phaser.Input.Keyboard.Key;
        };

        this.player = this.physics.add.sprite(200, 200, 'player');
        this.player.setScale(.25);
        this.player.setCollideWorldBounds(true);
        this.player.setDepth(2);

        this.aim = this.add.image(0, 0, 'aim');
        this.aim.setDepth(3);
        this.aim.setScale(.5);

        this.scoreText = this.add.text(16, 16, "Score: 0", {
            fontSize: "24px",
            color: "#ffffff"
        })
        this.scoreText.setDepth(4);

        this.bullets = this.physics.add.group();
        this.enemies = this.physics.add.group();

        let debounce = true;

        this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
            if (debounce == false) { return; }
            debounce = false;
            const player_bullet = this.physics.add.sprite(0, 0, 'player_bullet');
            player_bullet.setScale(.2)
            player_bullet.setOrigin(0.5, 0.5);
            player_bullet.copyPosition(this.player);
            this.bullets.add(player_bullet);
            let scale = PLAYER_BULLET_SPEED / Math.sqrt(Math.pow(pointer.x - this.player.x, 2) + Math.pow(pointer.y - this.player.y, 2))
            player_bullet.setVelocity((pointer.x - this.player.x) * scale, (pointer.y - this.player.y) * scale);  
            this.time.delayedCall(100, () => {
                debounce = true;
            });
            this.time.delayedCall(3000, () => {
                if (player_bullet.active) {
                    if (this.player_bullet && this.player_bullet.active){
                        this.player_bullet.destroy();
                    }
                }
            })
        })

        this.physics.add.overlap(
            this.bullets,
            this.enemies,
            this.onBulletHitEnemy,
            undefined,
            this
        );

        this.physics.add.overlap(
            this.player,
            this.enemies,
            this.gameOver,
            undefined,
            this
        )

        this.time.addEvent({
            delay: 5000,
            loop: true,
            callback: () => {
                this.difficulty += .2;
            }
        })

        this.spawnEnemiesForever();
    }

    update() {

        this.score += 1;
        this.scoreText.setText("Score: "+this.score);

        this.player.setVelocity(0);

        if (this.wasd.A.isDown) {
            this.player.setVelocityX(-200);
        }

        if (this.wasd.D.isDown) {
            this.player.setVelocityX(200);
        }

        if (this.wasd.W.isDown) {
            this.player.setVelocityY(-200);
        }

        if (this.wasd.S.isDown) {
            this.player.setVelocityY(200);
        }

        this.aim.setPosition(
            this.input.mousePointer.x,
            this.input.mousePointer.y
        );

        this.enemies.children.forEach((enemy) => {
            const e = enemy as Phaser.Physics.Arcade.Sprite;

            const angle = Phaser.Math.Angle.Between(
                e.x, e.y,
                this.player.x, this.player.y
            );

            const speed = 75 + this.difficulty * 25;

            e.setVelocity(
                Math.cos(angle) * speed,
                Math.sin(angle) * speed
            );
        })

    }

    onBulletHitEnemy (
        bulletObj: any,
        enemyObj: any
    ) {
        const bullet = bulletObj as Phaser.Physics.Arcade.Sprite;
        const enemy = enemyObj as Phaser.Physics.Arcade.Sprite;

        bullet.destroy();
        enemy.destroy();
    }

    gameOver () {
        this.scene.start("GameOverScene", {
            score: this.score,
        });
    }

    spawnEnemiesForever() {
        this.spawnEnemy();

        const delay = Math.max(200, 2000/ this.difficulty);

        this.time.delayedCall(delay, () => {
            this.spawnEnemiesForever();
        });
    }

    private spawnEnemy() {
        const angle = Math.random() * Math.PI * 2;
        const radius = 500;
        
        const x = this.player.x + Math.cos(angle) * radius;
        const y = this.player.y + Math.sin(angle) * radius;

        const enemy = this.physics.add.sprite(x, y, 'enemy');
        enemy.setScale(.4);

        this.enemies.add(enemy);
    }
}