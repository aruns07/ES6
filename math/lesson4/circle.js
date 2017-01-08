//Circle
(function(){
    let canvas = document.querySelector('#canvas'),
        context = canvas.getContext('2d'),
        width = canvas.width = window.innerWidth,
        height = canvas.height = window.innerHeight;

    let centerX = width / 2,
        centerY = height / 2,
        radius = 200,
        angle = 0,
        numberOfSteps = 30,
        sliceSize = (Math.PI * 2) / numberOfSteps,
        x, y;

    const SPEED = 0.05;
    
    function render() {


        context.clearRect(0, 0, width, height);

        for (var slice = 0 ; slice < (Math.PI * 2); slice += sliceSize) {
            x = centerX + radius * Math.cos(slice);
            y = centerY + radius * Math.sin(slice);
            context.beginPath();
            context.arc(x, y, 10, 0, Math.PI * 2, false);
            context.fill();
        }


        x = centerX + radius * Math.cos(angle);
        y = centerY + radius * Math.sin(angle);
        context.beginPath();
        context.arc(centerX, centerY, 2, 0, Math.PI * 2, false);
        context.arc(x, y, 10, 0, Math.PI * 2, false);
        context.fill();

        angle += SPEED;

        requestAnimationFrame(render);

    }

    render();

})();