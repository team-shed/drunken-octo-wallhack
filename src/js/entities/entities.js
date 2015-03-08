/**
 * Player Entity
 */
game.PlayerEntity = me.Entity.extend({

    /**
     * constructor
     */
    init:function (x, y, settings) {
        // call the constructor
        this._super(me.Entity, 'init', [x, y , settings]);

        // turn off gravity for the player
        this.gravity = 0;

	// set the default horizontal & vertical speed (accel vector)
        this.body.setVelocity(3, 15);

        // set the display to follow our position on both axis
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);

        // ensure the player is updated even when outside of the viewport
        this.alwaysUpdate = true;
        
        // define a basic walking animation (using all frames)
        this.renderable.addAnimation("walk",  [0, 1]);
        // define a standing animation (using the first frame)
        this.renderable.addAnimation("stand",  [0, 1]);
        // set the standing animation as default
        this.renderable.setCurrentAnimation("stand");
    },

    /**
     * update the entity
     */
    update : function (dt) {
        if (me.input.isKeyPressed('left')) {
          // flip the sprite on horizontal axis
          this.renderable.flipX(false);
          // update the entity velocity
          this.body.vel.x -= this.body.accel.x * me.timer.tick;
          // change to the walking animation
          if (!this.renderable.isCurrentAnimation("walk")) {
            this.renderable.setCurrentAnimation("walk");
          }
        } else if (me.input.isKeyPressed('right')) {
          // unflip the sprite
          this.renderable.flipX(true);
          // update the entity velocity
          this.body.vel.x += this.body.accel.x * me.timer.tick;
          // change to the walking animation
          if (!this.renderable.isCurrentAnimation("walk")) {
            this.renderable.setCurrentAnimation("walk");
          }
        } else if (me.input.isKeyPressed('up')) {
          // update the entity velocity
          this.body.vel.y += this.body.accel.y * me.timer.tick;
          // change to the walking animation
          if (!this.renderable.isCurrentAnimation("walk")) {
            this.renderable.setCurrentAnimation("walk");
          }
        } else if (me.input.isKeyPressed('down')) {
          // update the entity velocity
          this.body.vel.y += this.body.accel.y * me.timer.tick;
          // change to the walking animation
          if (!this.renderable.isCurrentAnimation("walk")) {
            this.renderable.setCurrentAnimation("walk");
          }
        } else {
          this.body.vel.x = 0;
          // change to the standing animation
          this.renderable.setCurrentAnimation("stand");
        }


        // apply physics to the body (this moves the entity)
        this.body.update(dt);

        // handle collisions against other shapes
        me.collision.check(this);

        this.body.falling = false;
        var msg = "Gravity: " + this.body.gravity + ", falling: " + this.body.falling;
        // return true if we moved or if the renderable was updated
        var r = (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
        this.body.falling = false;

        msg += "\n" + "Gravity: " + this.body.gravity + ", falling: " + this.body.falling;
        console.log(msg);
        return r;
    },

   /**
     * colision handler
     * (called when colliding with other objects)
     */
    onCollision : function (response, other) {
        // Make all other objects solid
        return true;
    }
});
