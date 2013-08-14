/*  ContentFlowAddOn_slideshow, version $CF$CFVERSION$CF$CF 
 *  (c) 2008 - 2010 Sebastian Kutsch
 *  <http://www.jacksasylum.eu/ContentFlow/>
 *
 *  This file is distributed under the terms of the MIT license.
 *  (see http://www.jacksasylum.eu/ContentFlow/LICENSE)
 */

new ContentFlowAddOn ('slideshow', {

    conf: {
        showControlls: true,
        duration: 2000,
        startOnLoad: true
    },

    init: function() {
        this.addStylesheet();
    },
    
    
    onloadInit: function (flow) {
        this._slideshow_timer = null;
        var conf = flow.getAddOnConf('slideshow');

        /* run slideshow */
        flow._startSlideshow = function () {
            var dur = this._slideshow_duration;
            var mn = function () {
                this.moveTo('next');
                this._slideshow_stoped = false;
            }.bind(this);
            window.clearTimeout(this._slideshow_timer);
            this._slideshow_timer = window.setTimeout( mn, dur);
        };

        /* pause slideshow */
        flow._stopSlideshow = function () {
            window.clearTimeout(this._slideshow_timer);
            this._slideshow_stoped = true;
        }; 

        /* set the speed of the slideshow */
        flow._setSlideshowSpeed = function (dur) {
            this._slideshow_duration = dur;
        };

        
        if (conf.showControlls) {
            var c = document.createElement('div');
            var p = document.createElement('div');
        }

        /* toggle slideshow on and off */
        flow.toggleSlideshow = function (force) {

            if (this._slideshow_locked) var t = "stop";
            else var t = "play";
            if (force) {
                switch (force) {
                case "stop":
                case "play":
                    var t = force;
                    break;
                }
            }

            switch (t) {
                case "stop":
                    if (p) {
                        p.removeClassName('play');
                        p.addClassName('pause');
                        p.setAttribute('title', "pause");
                    }
                    this._slideshow_locked = false;
                    this._startSlideshow();
                    break;

                case "play":
                    if (p) {
                        p.removeClassName('pause');
                        p.addClassName('play');
                        p.setAttribute('title', "play");
                    }
                    this._slideshow_locked = true;
                    this._stopSlideshow();
                    break;
            }
        };

        /* add spacebar key event */
        flow.conf.keys[32] = function () { this.toggleSlideshow() };

        /* add controll elements */
        if (c) {
            $CF(c).addClassName('controlls');
            $CF(p).addClassName('button');
            p.addEvent('click', flow.toggleSlideshow.bind(flow), '');
            $CF(p).addClassName('button');

            var ff = document.createElement('div');
            $CF(ff).addClassName('button');
            ff.addClassName('ff');
            ff.setAttribute('title', "faster");
            ff.addEvent('click', function (e) { Event.stop(e); flow._setSlideshowSpeed(flow._slideshow_duration*0.5);}, '');

            var slow = document.createElement('div');
            $CF(slow).addClassName('button');
            slow.addClassName('slow');
            slow.setAttribute('title', "slower");
            slow.addEvent('click', function (e) { Event.stop(e); flow._setSlideshowSpeed(flow._slideshow_duration*2);}, '');

            var pre = document.createElement('div');
            $CF(pre).addClassName('button');
            pre.addClassName('preButton');
            pre.setAttribute('title', "previouse");

            var next = document.createElement('div');
            $CF(next).addClassName('button');
            next.addClassName('nextButton');
            next.setAttribute('title', "next");

            c.appendChild(pre);
            c.appendChild(slow);
            c.appendChild(p);
            c.appendChild(ff);
            c.appendChild(next);
            flow.Container.appendChild(c);
        }

        var dur = conf.duration;
        flow._setSlideshowSpeed(dur);


        var status = conf.startOnLoad;
        flow._slideshow_stoped = status;
        flow._slideshow_locked = status;

        flow.toggleSlideshow();

    },
	
    /*
     * ContentFlow configuration.
     * Will overwrite the default configuration (or configuration of previously loaded AddOns).
     * For a detailed explanation of each value take a look at the documentation.
     */
	ContentFlowConf: {
        circularFlow: true,             // should the flow wrap around at begging and end?


        onInit: function () {
        },

        /*
         * called after the inactive item is clicked.
         */
        onclickInactiveItem : function (item) {
            this._stopSlideshow();
        },

        /*
         * called when an item becomes active.
         */
        onMakeActive: function (item) {
            if (this._slideshow_stoped || this._slideshow_locked) return;
            this._startSlideshow();
        },
        
        /*
         * called when the target item/position is reached
         */
        onReachTarget: function(item) {
            if (this._slideshow_stoped && !this._slideshow_locked) {
                this._startSlideshow();
            }
        },

        /*
         * called when a new target is set
         */
        onMoveTo: function(item) {
            this._stopSlideshow();
        }

	
    }

});
