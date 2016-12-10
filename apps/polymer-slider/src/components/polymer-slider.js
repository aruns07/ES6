const BULLET_RADIUS = 20;
const OPTION_RADIUS = 10;
const PUST_TO_NEAREST = true;
const Util = {
              /**
               * Find the nearest option between two options on the track
               * @param  {Array} optionPosList array of options positions
               * @param  {number } xOnTrack  a position on the track
               * @return {number}           option's postion nearest
               */
             findOptionNearMean: function (optionPosList, xOnTrack) {
                let firstPos = -1;
                let secondPos = 0;
                let finalPos = 0;
                let xMean = 0;

                while (secondPos < optionPosList.length - 1 && xOnTrack > optionPosList[secondPos]) {
                  firstPos = secondPos;
                  secondPos++;
                }
                xMean = (optionPosList[firstPos] + optionPosList[secondPos]) / 2;
                
                if ( xOnTrack > xMean ) {
                  finalPos = secondPos;
                } else {
                  finalPos = firstPos;
                }
                return finalPos;
            },
            /**
             * Based on mouse or touch event find the X position on the page
             * @param  {event} event
             * @return {number}
             */
             getPageX: function(event) {
                if (event.type === 'mousemove') {
                  ePageX = event.pageX;
                } else if (event.type === 'touchmove') {
                  let touchList = event.changedTouches;
                  let index = 0;
                  let meanPageX = 0;
                  for (index; index < touchList.length; index++) {
                    meanPageX += touchList[index].pageX;
                  }
                  ePageX = Math.round(meanPageX / touchList.length);
                }
                return ePageX;
            }, 
            /**
             * Throttle
             * @param  {Function} fn    
             * @param  {number}   delay 
             * @return {Function}
             */
             throttle: function(fn, delay) {
                let timer = null;
                return function(arg) {
                  if (!timer) {
                    timer = window.setTimeout((function() {
                      window.clearTimeout(timer);
                      timer = null;
                      fn.call(this, arg);
                    }).bind(this), delay);
                  }
                }
            }
          };

/**
 * Constructor
 */
class PolymerSlider  extends Polymer.Element {
  static get is() { return 'polymer-slider'};
  static get config() {
    let getDefaultOptions = function(){
      return [
        {text:"Poor", color:"red"},
        {text:"Fair", color:"yellow"},
        {text:"Good", color:"green"},
        {text:"Very Good", color:"green"},
        {text:"Excelent", color:"green"}
      ];};

    return {
      properties: { sliderRtl: { type: Boolean, value:false},
                    sliderOptions: { type: Array, value: getDefaultOptions},
                    sliderMin: { type: Number, value: 0},
                    sliderMax: { type: Number, value: 4}
                  }
    };
  }

  constructor() {
    super();

    this.bulletCaptured = false;
    this.optionPosList = [];
    this.$currentBullet = {};
    this.$otherBullet = {};
  
  }

  connectedCallback() {
    super.connectedCallback();

    //Wait for repaint, then calcaulate the dimensions
    window.requestAnimationFrame((function(){
        this.$container = this.$.container;
        this.$bullets = this.$container.querySelectorAll('.slider-bullet');
        this.$track = this.$container.querySelector('.slider-track');
        this.$options = this.$container.querySelectorAll('.slider-option');
        this.$statusBar = this.$container.querySelector('.slider-status');

        this.bindData();
        this.setElementPositions();
        this.bindEvents();

      }).bind(this));
  }

  /**
   * Binds required data to fixed 5 options
   */
  bindData() {
    let index = 0;
    let $option = {};
    let optionData = {};
    for(index; index < this.$options.length && this.sliderOptions[index]; index++) {
      $option = this.$options[index];
      optionData = this.sliderOptions[index]
      $option.dataset.value = optionData.text;
      $option.dataset.color = optionData.color;
      $option.querySelector('.slider-option-text').innerText = optionData.text;
    }

    this.$bullets[0].dataset.currentpos = this.sliderRtl ? 4 - this.sliderMax : this.sliderMin;
    this.$bullets[1].dataset.currentpos = this.sliderRtl ? 4 - this.sliderMin : this.sliderMax;
  }

  /**
   * Bind events
   */
  bindEvents() {
    this.$bullets.forEach(($bullet) => {
      $bullet.addEventListener('mousedown', this.captureBullet.bind(this));
      $bullet.addEventListener('mouseup', this.releaseBullet.bind(this));
      $bullet.addEventListener('touchstart', this.captureBullet.bind(this));  
      $bullet.addEventListener('touchend', this.releaseBullet.bind(this));
    });

    this.$container.addEventListener('mousemove', Util.throttle(this.moveBullet, 50).bind(this));
    this.$container.addEventListener('touchmove', Util.throttle(this.moveBullet, 50).bind(this));
    window.addEventListener('resize', Util.throttle(this.setElementPositions, 50).bind(this));   
  }
  
  /**
   * On intial load and resize 
   * calculate positions and set options and bullets
   */
  setElementPositions() {
    this.trackBox = this.$track.getBoundingClientRect();
    this.leftBound = this.trackBox.left + window.pageXOffset;
    this.rightBound = this.trackBox.width;

    this.optionPosList = [];
    this.$options.forEach((option) => {
      this.optionPosList.push(option.getBoundingClientRect().left - this.leftBound + OPTION_RADIUS);
    });

    this.setBullet(this.$bullets[0], this.optionPosList[this.$bullets[0].dataset.currentpos] + 1, PUST_TO_NEAREST);
    this.setBullet(this.$bullets[1], this.optionPosList[this.$bullets[1].dataset.currentpos] - 1, PUST_TO_NEAREST);
  }

  /**
   * Bullet's touchstart event handler
   * Register clicked element as active
   */
  captureBullet(event) {
    this.bulletCaptured = true;
    this.$currentBullet = event.target;
    this.$otherBullet = this.$currentBullet.dataset.role === 'left' ? this.$bullets[1] : this.$bullets[0];
    this.$currentBullet.classList.add('active');
  }

  /**
   * Bullet's touchend event handler
   * Unregister clicked active element
   */
  releaseBullet(event) {
    let ePageX = Util.getPageX(event);
    let xOnTrack = ePageX - this.leftBound ;
    let pushToNearest = true;
    this.setBullet(this.$currentBullet, xOnTrack, pushToNearest);
    this.bulletCaptured = false;
    this.$currentBullet.classList.remove('active');
    this.$currentBullet = {};
    this.notify();
  }

  /**
   * Notify external world about the changes
   * Triggers custom event
   */
  notify() {
    
    let min = this.$bullets[(this.sliderRtl ? 1 : 0)].dataset.currentpos;
    let max = this.$bullets[(this.sliderRtl ? 0 : 1)].dataset.currentpos;
    let minValue = this.$options[min].dataset.value;
    let maxValue = this.$options[max].dataset.value;
    let sliderEvent = new CustomEvent("change", {
      detail: {
        min: min,
        max: max,
        minValue: minValue,
        maxValue: maxValue
      }
    });
    this.dispatchEvent(sliderEvent);    
  }

  /**
   * With the mouse move change position of active bullet
   */
  moveBullet(event) {

    let ePageX = Util.getPageX(event);

    let xOnTrack = ePageX - this.leftBound;

    //Limit the movement within the bounded track length
    if (this.bulletCaptured && xOnTrack > 0 && xOnTrack < this.rightBound) {
      this.setBullet(this.$currentBullet, xOnTrack);

      let xOtherBullet = this.optionPosList[this.$otherBullet.dataset.currentpos]

      //When bullets crosses each other, swap active with inactive one
      if ((this.$currentBullet.dataset.role === 'left' && xOnTrack >= xOtherBullet) 
         || (this.$currentBullet.dataset.role === 'right' && xOnTrack <= xOtherBullet) ) {
          this.swithBulletSelection(xOnTrack);
      }
    }
    event.stopPropagation();
    event.preventDefault();
  }

  /**
   * swap active with inactive one
   * @param  {number} xSwithingPoint x position when switching was decided
   */
  swithBulletSelection(xSwithingPoint) {

        this.setBullet(this.$currentBullet, xSwithingPoint, true);

        let temp = this.$currentBullet;
        this.$currentBullet = this.$otherBullet;
        this.$otherBullet = temp;

        this.setBullet(this.$currentBullet, xSwithingPoint);

        window.requestAnimationFrame((function() {
          this.$otherBullet.classList.remove('active');
          this.$currentBullet.classList.add('active');        
        }).bind(this));
  }

  /**
   * Set position and other propeties of bullet based on its position
   * @param {HTMLElement} $bullet  bullet to move/set position of
   * @param {number} xOnTrack      position on the track
   * @param {boolean} pushToNearest should it place to nearest postion or exact position
   */
  setBullet($bullet, xOnTrack, pushToNearest) {
    let finalPos = Util.findOptionNearMean(this.optionPosList, xOnTrack);
    xOnTrack = pushToNearest ? this.optionPosList[finalPos] : xOnTrack;

    let left = xOnTrack - BULLET_RADIUS;
    let color = this.$options[finalPos].dataset.color;
    let style = 'left: ' + left + 'px; --slider-bullet-highlight-color: ' + color + ';';
    $bullet.setAttribute('style', style);

    this.setActiveText($bullet, finalPos);
    this.setStatusBar($bullet, xOnTrack);
    this.setOptionsColor($bullet, left);
  }

  /**
   * Set width of status/progress bar
   * @param {HTMLElement} $bullet  the side where bar need to be set
   * @param {number} xOnTrack current position on track
   */
  setStatusBar($bullet, xOnTrack) {
    let role = $bullet.dataset.role;
    let pos = role === 'left' ? xOnTrack + BULLET_RADIUS : this.rightBound - xOnTrack - BULLET_RADIUS;
    this.$statusBar.style[role] = pos + 'px';
  }

  /**
   * Decide and start showing the options text 
   * which is either active or the nearst one
   * @param {HTMLElement} $bullet  the bullet active
   * @param {number} finalPos the postion bullet is heading to
   */
  setActiveText($bullet, finalPos) {
      let currentpos = $bullet.dataset.currentpos;
      if (currentpos !== finalPos 
          && (!this.$otherBullet.dataset
              || currentpos !== this.$otherBullet.dataset.currentpos)) {
        this.$options[currentpos].querySelector('.slider-option-text').style.display = 'none';
         this.$options[finalPos].querySelector('.slider-option-text').style.display = 'block';
      }
      $bullet.dataset.currentpos = finalPos;
  }

  /**
   * Due to movement of bullet the track selected and unselected range
   * Functions decides the range and set the option's properties on the track
   * @param {HTMLElement} $bullet  the bullet active
   * @param {number} xPosition bullet's postion from the left edge of the track
   */
  setOptionsColor($bullet, xPosition) {
    let role = $bullet.dataset.role;
    let start = 0;
    let end = this.optionPosList.length;
    if (role === 'left') {
      for(start = 0; start < this.$bullets[1].dataset.currentpos; start++) {
          if (this.optionPosList[start] < xPosition) {
            this.$options[start].style.backgroundColor = '';
          } else {
            this.$options[start].style.backgroundColor = this.$options[start].dataset.color;
          }
      }
    } else {
      for(start = +this.$bullets[0].dataset.currentpos + 1 ; start < end; start++) {
          if (this.optionPosList[start] < xPosition) {
            this.$options[start].style.backgroundColor = this.$options[start].dataset.color;
          } else {
            this.$options[start].style.backgroundColor = '';          
          }
      }
    }
  }
}

customElements.define('polymer-slider', PolymerSlider);

