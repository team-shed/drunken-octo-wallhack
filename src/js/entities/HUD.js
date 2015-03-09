/**
 * a HUD container and child items
 */

game.HUD = game.HUD || {};


// This is the top level (single) container for the whole UI.
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

        atlas = new me.TextureAtlas(
          me.loader.getJSON("gui0_atlas"),
          me.loader.getImage("gui0_texture")
        );

        sprite_names = [
          "GUI0_frame_blue_tl",
          "GUI0_frame_blue_t",
          "GUI0_frame_blue_tr",
          "GUI0_frame_blue_l",
          "GUI0_frame_blue_c",
          "GUI0_frame_blue_r",
          "GUI0_frame_blue_bl",
          "GUI0_frame_blue_b",
          "GUI0_frame_blue_br",
        ];

        this.charPanel = new game.HUD.CharacterPanel(270, 50, 400, 150, atlas, sprite_names);
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

/*
 * A panel with a tiled background and borders.  Example:
 * var p = new game.HUD.Panel(10, 10, 160, 160, texture_atlas, ["tl", "top", "tr", "left", "center", "right", "bl", "bottom", "br"]);
 *
 * sprite_names is an array of nine names indicating the sprites to use for:
 *      top-left corner
 *      top border
 *      top-right corner
 *      left border
 *      center tiles
 *      right border
 *      bottom-left corner
 *      bottom border
 *      bottom-right corner
 *
 * These names are used to get sprites from the atlas and then draw the background of the panel.
 */
game.HUD.Panel = me.Container.extend({
  init: function(x, y, w, h, atlas, sprite_names) {
    this._super(me.Container, 'init', [x, y, w, h]);

    this.sprites = {};
    for(i = 0; i < sprite_names.length; i++) {
      // technically could use getRegion and skip the whole sprite thing
      var sprite = atlas.createSpriteFromName(sprite_names[i]);
      this.sprites[i] = sprite;
    }
  },
  update: function(dt) {
    this._super(me.Container, 'update', [dt]);
  },
  draw: function(context) {
    this.sprites[0].pos.setV(this.pos);
    this.sprites[0].draw(context);

    context.drawImage(this.sprites[1].image,
        this.sprites[1].offset.x, this.sprites[1].offset.y, this.sprites[1].width, this.sprites[1].height,
        this.pos.x + this.sprites[0].width, this.pos.y, this.width - this.sprites[2].width, this.sprites[1].height
    );

    this.sprites[2].pos.x = this.pos.x + this.width - this.sprites[2].width;
    this.sprites[2].pos.y = this.pos.y;
    this.sprites[2].draw(context);

    context.drawImage(this.sprites[3].image,
        this.sprites[3].offset.x, this.sprites[3].offset.y, this.sprites[3].width, this.sprites[3].height,
        this.pos.x, this.pos.y + this.sprites[0].height, this.sprites[3].width, this.height - this.sprites[6].height
    );

    context.drawImage(this.sprites[4].image,
        this.sprites[4].offset.x, this.sprites[4].offset.y, this.sprites[4].width, this.sprites[4].height,
        this.pos.x + this.sprites[3].width, this.pos.y + this.sprites[1].height, this.width - this.sprites[3].width - this.sprites[5].width, this.height - this.sprites[1].height - this.sprites[7].height
    );

    context.drawImage(this.sprites[5].image,
        this.sprites[5].offset.x, this.sprites[5].offset.y, this.sprites[5].width, this.sprites[5].height,
        this.pos.x + this.width - this.sprites[5].width, this.pos.y + this.sprites[2].height, this.sprites[5].width, this.height - this.sprites[2].height - this.sprites[8].height
    );
    
    this.sprites[6].pos.x = this.pos.x;
    this.sprites[6].pos.y = this.pos.y + this.height - this.sprites[6].height;
    this.sprites[6].draw(context);

    context.drawImage(this.sprites[7].image,
        this.sprites[7].offset.x, this.sprites[7].offset.y, this.sprites[7].width, this.sprites[7].height,
        this.pos.x + this.sprites[6].width, this.pos.y + this.height - this.sprites[7].height, this.width - this.sprites[6].width - this.sprites[8].width, this.sprites[7].height
    );

    this.sprites[8].pos.x = this.pos.x + this.width - this.sprites[8].width;
    this.sprites[8].pos.y = this.pos.y + this.height - this.sprites[8].height;
    this.sprites[8].draw(context);

        /*
         * renderer draw call parameters for reference:
        context.drawImage(image, 
          this.offset.x, this.offset.y,   // sx,sy
          w, h,                           // sw,sh
          xpos, ypos,                     // dx,dy
          w, h                            // dw,dh
        );
        */

    // Now draw children on top of the panel
    this._super(me.Container, 'draw', [context]);
  }
});

/**
 * Character stats screen
 */
game.HUD.CharacterPanel = game.HUD.Panel.extend({
  init: function(x, y, w, h, atlas, sprite_names) {
    this._super(game.HUD.Panel, 'init', [x, y, w, h, atlas, sprite_names]);

    // Maybe use a default panel style and/or take a style name?

    this.font = new me.BitmapFont("32x32_font", 32);
    this.visible = false;

    var offset = 36;
    var y_off = 4;
    for(i in game.data.player.attributes) {
      this.addChild(new game.HUD.LabeledValue(356, y_off, w, h, this.font, i.toUpperCase() + ":", function(key) { return function() {return game.data.player.attributes[key];}}(i)));

      y_off += offset;
    }
  },
  update: function(dt) {
    this._super(game.HUD.Panel, 'update', [dt]);

    if (me.input.isKeyPressed("charPanel")) {
      this.visible = !this.visible;
    }
    return true;
  },
  draw: function(context) {
    if(!this.visible) return;
    this._super(game.HUD.Panel, 'draw', [context]);
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
