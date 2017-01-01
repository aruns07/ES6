//Trignometry : Sin and Cos
(function(){
    let canvas = document.querySelector('#canvas'),
        context = canvas.getContext('2d'),
        width = canvas.width = window.innerWidth,
        height = canvas.height = window.innerHeight;

    let centerX = width / 2,
        centerY = height / 2,
        angle = 0.1;

    const SPEED = 0.05;
    const OFFSET = height / 4;
    const SCALE_FACTOR = 100;
    const TRIG_FUNCTION = 'cos';

    context.translate(0, height);
    context.scale(1, -1);

    function render() {
        let y = centerY + Math[TRIG_FUNCTION](angle) * OFFSET;

        context.clearRect(0, 0, width, height);
        context.beginPath();
        context.arc(centerX, y, 50, 0, Math.PI * 2, false);
        context.fill();

        angle += SPEED;

        requestAnimationFrame(render);

    }

    render();

})();