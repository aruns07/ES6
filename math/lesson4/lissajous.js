//Lissajous Curves
(function(){
    let canvas = document.querySelector('#canvas'),
        context = canvas.getContext('2d'),
        width = canvas.width = window.innerWidth,
        height = canvas.height = window.innerHeight;

    let centerX = width / 2,
        centerY = height / 2,
        radiusX = 100,
        radiusY = 200,
        angleX = 0;
        angleY = 0;

    const SPEEDX = 0.1;
    const SPEEDY = 0.131;
    
    function render() {
        let x = centerX + radiusX * Math.cos(angleX);
        let y = centerY + radiusY * Math.sin(angleY);

        context.clearRect(0, 0, width, height);
        context.beginPath();
        context.arc(centerX, centerY, 2, 0, Math.PI * 2, false);
        context.arc(x, y, 10, 0, Math.PI * 2, false);
        context.fill();

        angleX += SPEEDX;
        angleY += SPEEDY;

        requestAnimationFrame(render);

    }

    render();

})();