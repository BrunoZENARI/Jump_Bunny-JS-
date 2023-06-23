import Phaser from "../lib/phaser.js"

export default class Game extends Phaser.Scene{
    /** @type {Phaser.Physics.Arcade.StaticGroup} */
    platforms

    /** @type {Phaser.Physics.Arcade.Sprite} */
    player

    /** @type {Phaser.Types.Input.Keyboard.CursorKeys} */
    cursors

    constructor() {
        super('game')
    }

    preload(){
        this.load.image('background', 'assets/bg_layer1.png')

        // load the platform imahe
        this.load.image('platform', 'assets/ground_grass.png')

        // load the player
        this.load.image('bunny-stand', 'assets/bunny1_stand.png')

        this.cursors = this.input.keyboard.createCursorKeys()
    }

    create(){
        this.add.image(240, 320, 'background').setScrollFactor(1, 0)

        this.platforms = this.physics.add.staticGroup()
        
        for (let i = 0; i < 6; i++){
            const x = Phaser.Math.Between(80,400)
            const y = 150 * i

            /** @type {Phaser.Physics.Arcade.Sprite} */
            const platform = this.platforms.create(x, y, 'platform')
            platform.scale = 0.5

            /** @type {Phaser.Physics.Arcade.StaticBody} */
            const body = platform.body
            body.updateFromGameObject()
        }


        // change to use class property this.player
        this.player = this.physics.add.sprite(240, 320, 'bunny-stand').setScale(0.5)

        // same thing here in the second parameter
        this.physics.add.collider(this.platforms, this.player)

        this.player.body.checkCollision.up = false
        this.player.body.checkCollision.left = false
        this.player.body.checkCollision.right = false

        this.cameras.main.startFollow(this.player)

        this.cameras.main.setDeadzone(this.scale.width * 1.5)

        
    }

    update(){
        this.platforms.children.iterate(child => {
            /** @type {Phaser.Physics.Arcade.Sprite} */
            const platform = child

            const scrollY = this.cameras.main.scrollY
            if (platform.y >= scrollY + 900) {
                platform.y = scrollY - Phaser.Math.Between(50, 100)
                platform.body.updateFromGameObject()
            }
        })

        // find out from Arcade Physics if the player's physic body is touching something below it
        const touchingDown = this.player.body.touching.down

        if (touchingDown) {
            // this make the bunny jump straight up
            this.player.setVelocityY(-400)
        }

        // left and right input logic
        if(this.cursors.left.isDown && !touchingDown) {
            this.player.setVelocityX(-200)
        }else if (this.cursors.right.isDown && !touchingDown){
            this.player.setVelocityX(200)
        }else {
            // Stop movement if not left or right
            this.player.setVelocityX(0)
        }

        this.horizontalWrap(this.player)
        }

        horizontalWrap(sprite){
            const halfWidth = sprite.displayWidth * 0.5
            const gameWidth = this.scale.width

            if (sprite.x < -halfWidth) {
                sprite.x = gameWidth + halfWidth
            }else if(sprite.x > gameWidth + halfWidth){
                sprite.x = -halfWidth
            }
        }
    }