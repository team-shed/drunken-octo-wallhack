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
        this.body.setVelocity(3, 3);
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
        this.alwaysUpdate = true;
        this.renderable.addAnimation("walk_down", [0, 1, 2, 3]);
        this.renderable.addAnimation("walk_left", [4, 5, 6, 7]);
        this.renderable.addAnimation("walk_right", [8, 9, 10, 11]);
        this.renderable.addAnimation("walk_up", [12, 13, 14, 15]);
        this.renderable.addAnimation("stand_down", [0]);
        this.renderable.addAnimation("stand_left", [4]);
        this.renderable.addAnimation("stand_right", [8]);
        this.renderable.addAnimation("stand_up", [12]);
        this.renderable.setCurrentAnimation("stand_down");

        this.attributes = {
          perceptive: 1,
          indignant: 3,
          resigned: 1,
          clever: 5
        };
    },

    /**
     * update the entity
     */
    update : function (dt) {
      var dir_set = false;
      this.body.vel.x = this.body.vel.y = 0;
      if (me.input.isKeyPressed("down")) {
        this.body.vel.y += this.body.accel.y * me.timer.tick;
        if (!this.renderable.isCurrentAnimation("walk_down")) {
          this.renderable.setCurrentAnimation("walk_down");
        }
        dir_set = true;
      }
      if (me.input.isKeyPressed("left")) {
        this.body.vel.x -= this.body.accel.x * me.timer.tick;
        if (!this.renderable.isCurrentAnimation("walk_left")) {
          this.renderable.setCurrentAnimation("walk_left");
        }
        dir_set = true;
      }
      if (me.input.isKeyPressed("right")) {
        this.body.vel.x += this.body.accel.x * me.timer.tick;
        if (!this.renderable.isCurrentAnimation("walk_right")) {
          this.renderable.setCurrentAnimation("walk_right");
        }
        dir_set = true;
      }
      if (me.input.isKeyPressed("up")) {
        this.body.vel.y -= this.body.accel.y * me.timer.tick;
        if (!this.renderable.isCurrentAnimation("walk_up")) {
          this.renderable.setCurrentAnimation("walk_up");
        }
        dir_set = true;
      }

      if (!dir_set) {
        if (this.renderable.isCurrentAnimation("walk_down")) {
          this.renderable.setCurrentAnimation("stand_down");
        } else if (this.renderable.isCurrentAnimation("walk_left")) {
          this.renderable.setCurrentAnimation("stand_left");
        } else if (this.renderable.isCurrentAnimation("walk_right")) {
          this.renderable.setCurrentAnimation("stand_right");
        } else if (this.renderable.isCurrentAnimation("walk_up")) {
          this.renderable.setCurrentAnimation("stand_up");
        }
      }

      // apply physics to the body (this moves the entity)
      this.body.update(dt);

      // handle collisions against other shapes
      me.collision.check(this);

      // return true if we moved or if the renderable was updated
      return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
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

game.ArrowEntity = me.Entity.extend({
  init: function(x, y, settings) {
    this._super(me.Entity, 'init', [x, y , settings]);
    this.body.setVelocity(12, 12);
    this.alwaysUpdate = true;
  }
  update: function(dt) {
    this.body.update(dt);
    me.collision.check(this);
    return this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0;
  }
  onCollision: function(response, other) {

  }
})
