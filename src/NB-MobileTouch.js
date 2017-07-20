;(() => {
  const defOptions = {
    tap: () => false,
    swipeTop: () => false,
    swipeLeft: () => false,
    swipeBottom: () => false,
    swipeRight: () => false
  };

  function transferTouch(process) {
    return function (e) {
      e.preventDefault();
      let touch;

      if (!(touch = e.targetTouches[0]) || (e.scale && e.scale == 1)) {
        return;
      }

      return process.call(this, e.targetTouches[0], e)
    };
  }

  const NBMobileTouch = NBClass({
    initialize(el, options) {
      const {
        tap, swipeTop, swipeLeft,
        swipeBottom, swipeRight } = NBUtil.copy({}, defOptions, options);

      this.el = el;
      this.distanceX = this.distanceY = this.startTime = null;
      this.readyX = this.readyY = 0;
      this.tap = tap;
      this.swipeTop = swipeTop;
      this.swipeLeft = swipeLeft;
      this.swipeBottom = swipeBottom;
      this.swipeRight = swipeRight;

      this.touchstart = this.touchstart.bind(this);
      this.touchend = this.touchend.bind(this);
      this.touchmove = this.touchmove.bind(this);

      this.bindElEvent();
    },

    isTap() {
      return +new Date() - this.startTime < 300
        || (Math.abs(this.distanceX) < 50 && Math.abs(this.distanceY) < 50);
    },

    isSwipeTop() {
      return Math.abs(this.distanceX) <= Math.abs(this.distanceY) && this.distanceY < 0;
    },

    isSwipeLeft() {
      return Math.abs(this.distanceY) <= Math.abs(this.distanceX) && this.distanceX < 0;
    },

    isSwipeBottom() {
      return Math.abs(this.distanceY) > Math.abs(this.distanceX) && this.distanceY > 0;
    },

    isSwipeRight() {
      return Math.abs(this.distanceX) > Math.abs(this.distanceY) && this.distanceX > 0;
    },

    touchstart: transferTouch(function (touch, e) {
      this.startTime = +new Date;
      this.readyX = touch.pageX;
      this.readyY = touch.pageY;
    }),

    touchmove: transferTouch(function (touch, e) {
      this.distanceX = touch.pageX - this.readyX;
      this.distanceY = touch.pageY - this.readyY;
    }),

    touchend(e) {
      e.preventDefault();

      if (this.isTap()) {
        this.tap.call(this, e);
      } else if (this.isSwipeTop()) {
        this.swipeTop.call(this, e);
      } else if (this.isSwipeLeft()) {
        this.swipeLeft.call(this, e);
      } else if (this.isSwipeBottom()) {
        this.swipeBottom.call(this, e);
      } else if (this.isSwipeRight()) {
        this.swipeRight.call(this, e);
      }
    },

    bindElEvent() {
      this.el.addEventListener('touchstart', this.touchstart, false);
      this.el.addEventListener('touchmove', this.touchmove, false);
      this.el.addEventListener('touchend', this.touchend, false);
    },

    unBindElEvent() {
      this.el.removeEventListener('touchstart', this.touchstart, false);
      this.el.removeEventListener('touchmove', this.touchmove, false);
      this.el.removeEventListener('touchend', this.touchend, false);
    }
  });

  window.NBMobileTouch = (options) => new NBMobileTouch(options);
})();
