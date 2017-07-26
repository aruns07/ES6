(function() {
    let canvas = document.querySelector('#canvas'),
        context = canvas.getContext('2d'),
        width = canvas.width = window.innerWidth,
        height = canvas.height = window.innerHeight;
        particles = [],
        particleCount = 150;

        for (var pIndex = 0; pIndex < particleCount; pIndex++) {
            particles.push(new Particle(width / 2, height / 2, Math.random() * 4 + 1, Math.PI * Math.random() * 2));
        }

    let update = () => {
        context.clearRect(0, 0, width, height);

        particles.forEach(particle => {
            particle.update();
            context.beginPath();
            context.arc(particle.position.x, particle.position.y, 10, 0, Math.PI * 2, false);
            context.fill();
        });

        requestAnimationFrame(update);
    };

    update();
})();