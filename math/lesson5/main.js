//arcTangent/ inverse tangent
(function(){
    let canvas = document.querySelector('#canvas'),
        context = canvas.getContext('2d'),
        width = canvas.width = window.innerWidth,
        height = canvas.height = window.innerHeight;

    let arrowX = width / 2,
        arrowY = height / 2,
        dx, dy,
        angle = 0;

    
    function render() {


        context.clearRect(0, 0, width, height);

        context.save();
        context.translate(arrowX, arrowY);
        context.rotate(angle);

        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(20, 0);
        context.lineTo(15, -5);
        context.moveTo(20, 0);
        context.lineTo(15, 5);
        context.stroke();

        context.restore();
        requestAnimationFrame(render);
    }

    render();

    document.body.addEventListener('mousemove', function(event) {

        dy = event.clientY - arrowY;
        dx = event.clientX - arrowX;
        angle = Math.atan2(dy, dx);
        console.log(angle)
    });

})();