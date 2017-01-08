//Circle
(function(){
    let canvas = document.querySelector('#canvas'),
        context = canvas.getContext('2d'),
        width = canvas.width = window.innerWidth,
        height = canvas.height = window.innerHeight;

    let centerX = width / 2,
        centerY = height / 2,
        radiusX = 100,
        radiusY = 200,
        angle = 0.1;

    const SPEED = 0.05;
    
    function render() {
        let x = centerX + radiusX * Math.cos(angle);
        let y = centerY + radiusY * Math.sin(angle);

        context.clearRect(0, 0, width, height);
        context.beginPath();
        context.arc(centerX, centerY, 2, 0, Math.PI * 2, false);
        context.arc(x, y, 10, 0, Math.PI * 2, false);
        context.fill();

        angle += SPEED;

        requestAnimationFrame(render);

    }

    render();

})();