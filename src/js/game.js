
/* Game namespace */
var game = {

    // an object where to store game information
    data : {
        // score
        score : 0,
        // inventory
        inventory: [[null, 0], [null, 0], [null, 0], [null, 0]]
    },


    // Run on page load.
    "onload" : function () {
        // Initialize the video.
        if (!me.video.init("screen",  me.video.CANVAS, 960, 640, true, 0)) {
            alert("Your browser does not support HTML5 canvas.");
            return;
        }

        // add "#debug" to the URL to enable the debug Panel
        if (document.location.hash === "#debug") {
            window.onReady(function () {
                me.plugin.register.defer(this, me.debug.Panel, "debug", me.input.KEY.V);
            });
        }

        // Disable gravity
        me.sys.gravity = 0;

        // Initialize the audio.
        me.audio.init("mp3,ogg");

        // Set a callback to run when loading is complete.
        me.loader.onload = this.loaded.bind(this);

        // Load the resources.
        me.loader.preload(game.resources);

        // Initialize melonJS and display a loading screen.
        me.state.change(me.state.LOADING);
    },

    // Run on game resources loaded.
    "loaded" : function () {
        me.state.set(me.state.MENU, new game.TitleScreen());
        me.state.set(me.state.PLAY, new game.PlayScreen());

        // add our player entity in the entity pool
        me.pool.register("mainPlayer", game.PlayerEntity);
        me.pool.register("arrow", game.ArrowEntity);

        me.input.bindKey(me.input.KEY.LEFT, "left");
        me.input.bindKey(me.input.KEY.A, "left");
        me.input.bindKey(me.input.KEY.RIGHT, "right");
        me.input.bindKey(me.input.KEY.D, "right");
        me.input.bindKey(me.input.KEY.UP, "up");
        me.input.bindKey(me.input.KEY.W, "up");
        me.input.bindKey(me.input.KEY.DOWN, "down");
        me.input.bindKey(me.input.KEY.S, "down");

        me.input.bindKey(me.input.KEY.C, "charPanel", true);

        me.input.bindKey(me.input.KEY.ONE, "item1");
        me.input.bindKey(me.input.KEY.TWO, "item2");
        me.input.bindKey(me.input.KEY.THREE, "item3");
        me.input.bindKey(me.input.KEY.FOUR, "item4");

        // Start the game.
        me.state.change(me.state.PLAY);
    }
};
