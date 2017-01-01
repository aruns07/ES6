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
    
    const BASE_RADIUS = 50;
    const RADIUS_OFFSET = 20;

    const BASE_ALPHA = 0.5;
    const ALPHA_OFFSET = 0.5;

    const TRIG_FUNCTION = 'sin';

    context.translate(0, height);
    context.scale(1, -1);

    function render() {
        let y = centerY + Math[TRIG_FUNCTION](angle) * OFFSET;
        let radius = BASE_RADIUS + Math[TRIG_FUNCTION](angle) * RADIUS_OFFSET;
        let alpha = BASE_ALPHA + Math[TRIG_FUNCTION](angle) * ALPHA_OFFSET;

        context.clearRect(0, 0, width, height);
        context.beginPath();
        context.fillStyle = 'rgba(0, 0, 0,' + alpha + ')';
        context.arc(centerX, y, radius, 0, Math.PI * 2, false);
        context.fill();

        context.beginPath();
        context.fillStyle = 'rgba(0, 0, 0, 1)';
        context.arc(centerX, y, radius / 2, 0, Math.PI * 2, false);
        context.fill();

        angle += SPEED;

        requestAnimationFrame(render);

    }

    render();

})();