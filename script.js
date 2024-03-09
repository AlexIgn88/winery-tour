(function () {
    const upArrowButton = document.getElementById('up-arrow-button');
    const reserveButton = document.getElementById('reserve');

    window.onscroll = function () {
        if (document.body.scrollTop > 800 || document.documentElement.scrollTop > 800) {
            upArrowButton.style.display = "block";
            reserveButton.style.display = "block";
        } else {
            upArrowButton.style.display = "none";
            reserveButton.style.display = "none";
        }
    };

    upArrowButton.addEventListener('click', () => {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    })
})();