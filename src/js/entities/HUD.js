/**
 * a HUD container and child items
 */

game.HUD = game.HUD || {};


game.HUD.Container = me.Container.extend({

    init: function() {
        // call the constructor
        this._super(me.Container, 'init');

        // persistent across level change
        this.isPersistent = true;

        // make sure we use screen coordinates
        this.floating = true;

        // make sure our object is always draw first
        this.z = Infinity;

        // give a name
        this.name = "HUD";

        // add our child score object at the top left corner
        this.addChild(new game.HUD.ScoreItem(630, 440));

        this.charPanel = new game.HUD.CharacterPanel(600, 100, 100, 100);
        this.addChild(this.charPanel);
    },
});


/**
 * a basic HUD item to display score
 */
game.HUD.ScoreItem = me.Renderable.extend({
    /**
     * constructor
     */
    init: function(x, y) {

        // call the parent constructor
        // (size does not matter here)
        this._super(me.Renderable, 'init', [x, y, 10, 10]);

        this.font = new me.BitmapFont("32x32_font", 32);
        this.font.set("right");

        // local copy of the global score
        this.score = -1;
    },

    /**
     * update function
     */
    update : function () {
        // we don't do anything fancy here, so just
        // return true if the score has been updated
        if (this.score !== game.data.score) {
            this.score = game.data.score;
            return true;
        }
        return false;
    },

    /**
     * draw the score
     */
    draw : function (context) {
      this.font.draw(context, game.data.score, this.pos.x, this.pos.y);
    }

});

/**
 * Character stats screen
 */
game.HUD.CharacterPanel = me.Container.extend({
  init: function(x, y, w, h) {
    this._super(me.Container, 'init', [x, y, 10, 10]);
    this.font = new me.BitmapFont("32x32_font", 32);
    this.visible = true;

    var offset = 36;
    var y_off = 0;
    for(i in game.data.player.attributes) {
      this.addChild(new game.HUD.LabeledValue(x, y + y_off, w, h, this.font, i.toUpperCase() + ":", function(key) { return function() {return game.data.player.attributes[key];}}(i)));

      y_off += offset;
    }
  },
  update: function(dt) {
    this._super(me.Container, 'update', [dt]);

    if (me.input.isKeyPressed("charPanel")) {
      this.visible = !this.visible;
    }
    return true;
  },
  draw: function(context) {
    this._super(me.Container, 'draw', [context]);


    if(!this.visible) return;

    for(i in this.children) {
      if(this.children[i] instanceof me.Renderable) {
        this.children[i].draw(context);
      }
    }
  },

});

game.HUD.Label = me.Renderable.extend({
  init: function(x, y, w, h, font, value) {
    this.font = font;
    this.value = "";
    if(value !== null) this.value = value;
  },
  update: function() {
    return false;
  },
  draw: function(context) {
    this.font.draw(context, this.value, this.pos.x, this.pos.y);
  }
});

/*
 * Takes a label and a function used to get the value to be displayed.
 */
game.HUD.LabeledValue = me.Renderable.extend({
  init: function(x, y, w, h, font, label, func) {
    this._super(me.Renderable, 'init', [x, y, w, h]);
    this.font = font;
    this.label = label;
    this.value = 0;
    this.func = func;
  },
  update: function() {
    if(this.func) {
      var v = this.func();
      if(this.value != v) {
        this.value = v;
        return true;
      }
    }
    return false;
  },
  draw: function(context) {
    this.font.set("right");
    this.font.draw(context, this.label, this.pos.x, this.pos.y);
    this.font.set("left");
    this.font.draw(context, this.value, this.pos.x, this.pos.y);
  }
});
