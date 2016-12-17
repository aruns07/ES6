(function(){
    const $loader = document.querySelector('.loader'),
        $world = document.querySelector('.world'),
        $canvas = document.querySelector('.canvas')
        $body = document.querySelector('body');

    const CONST = {
        startIndex: 0,
        lastIndex: 195,
        lazyWindow: 10,
        imagePath: './images/',
        imagePrefix: 'loop_',
        imageType: '.jpg'
    };

    const viewList = [];
    let currentPosition = 0;
    let lastTouchY = $body.offsetHeight;

    const Util = {
             getPageY: function(event) {
                let ePageY, meanPageY;
                if (event.type === 'mousemove') {
                  ePageY = event.pageY;
                } else if (event.type.indexOf('touch') >= 0) {
                  let touchList = event.changedTouches;
                  let index = 0;
                  let meanPageY = 0;
                  for (index; index < touchList.length; index++) {
                    meanPageY += touchList[index].pageY;
                  }
                  ePageY = Math.round(meanPageY / touchList.length);
                }
                return ePageY;
            },
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


    class View {

        constructor(requestUrl) {
            this.requestUrl = requestUrl;
            this.imageUrl = "";
            this.hasLoaded = false;
            this.requested = false;            
        }

        loadImage() {
            
            if (this.requested === false) {
                this.requested = true;
                this.loadPromise = new Promise((resolve, reject) => {
                    if (this.hasLoaded === false) {
                        fetch(this.requestUrl).then((response) => {
                            if (response.ok) {
                                return response.blob();
                            }
                        }).then((blob) => {
                            this.imageUrl = URL.createObjectURL(blob);
                            this.hasLoaded = true;
                            resolve(this.imageUrl);
                        }).catch((err) => {
                            reject(err);
                        });
                    } else {
                        resolve(this.imageUrl);
                    }                
                });

                return this.loadPromise;
            } else  {
                return this.loadPromise;
            }
        }
    }

    function fillBuffer(currentPosition) {
        for (var index = currentPosition + 1; 
                index <= currentPosition + CONST.lazyWindow && index <= CONST.lastIndex;
                index++) {
            viewList[index].loadImage();
        }
    }

    function drawCanvas() {
        viewList[currentPosition].loadImage().then((imageUrl) => {
            $canvas.src = imageUrl;
        });        
        fillBuffer(currentPosition);
    }

    function registerTouchStart(event) {
        lastTouchY = Util.getPageY(event);
    }

    function moveWorld(event) {
        let newTouchY = Util.getPageY(event);
        if (Math.abs(newTouchY - lastTouchY) > 1) {
            currentPosition = (newTouchY < lastTouchY) ? ++currentPosition : --currentPosition;

            if (currentPosition > CONST.lastIndex) {
                currentPosition = CONST.startIndex;
            } else if (currentPosition < CONST.startIndex) {
                currentPosition = CONST.lastIndex;
            }



            lastTouchY = newTouchY;
            drawCanvas();
        }
    }


    function bindEvents() {
        $body.addEventListener('touchstart', registerTouchStart);
        $body.addEventListener('touchmove', Util.throttle(moveWorld, 5).bind(this), {passive: true});
    }

    function init() {
        for(var index=0; index <= CONST.lastIndex; index++) {
            viewList.push(new View(CONST.imagePath + CONST.imagePrefix + index + CONST.imageType));
        }
        drawCanvas();
        bindEvents();
    }

    init();

})();