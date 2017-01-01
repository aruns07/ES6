//Trignometry : Sin and Cos
(function(){
    let canvas = document.querySelector('#canvas'),
        context = canvas.getContext('2d'),
        width = canvas.width = window.innerWidth,
        height = canvas.height = window.innerHeight,
        x, y;
    const SCALE_FACTOR = 100;
    const TRIG_FUNCTION = 'sin'

    context.translate(0, height / 2);
    context.scale(1, -1);

    for(let angle = 0; angle < Math.PI * 2; angle += 0.01) {
        x = angle * SCALE_FACTOR;
        y = Math[TRIG_FUNCTION](angle) * SCALE_FACTOR;

        context.fillRect(x, y, 1, 1);
    }

})();