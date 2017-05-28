(function(){
    const $nav = document.querySelector('nav');
    const $container = document.querySelector('main');
    $nav.addEventListener('click', navigate);


    function navigate(event) {
        const element = event.target;
        if (element.nodeName === 'BUTTON') {
            fetch(element.dataset.path)
                .then((response) => {
                    return response.text();
                })
                .then((data) => {
                    $container.innerHTML = data;
                })
                .catch(()=>{
                    $container.innerHTML = "Can't load resources.";
                })
        }
    }
})();

(function(){
    navigator.serviceWorker.register('sw.js');
})();