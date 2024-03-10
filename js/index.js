'use strict';

//кнопки навигации
const navigationButtons = (function () {

    const upArrowButton = document.getElementById('up-arrow-button');

    window.onscroll = function () {
        const isScrolled = document.body.scrollTop > 800 || document.documentElement.scrollTop > 800;

        isScrolled ? switchDisplayValue(upArrowButton, "block") : switchDisplayValue(upArrowButton, "none");

    };

    upArrowButton.addEventListener('click', () => {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    });
})();

//слайдер для галереи
const slider = (function () {
    const sliderDiv = document.querySelector('.slider');
    const backArrow = document.querySelector('.back');
    const forwardArrow = document.querySelector('.forward');

    sliderDiv.addEventListener('mouseover', () => {
        switchDisplayValue(backArrow, 'block');
        switchDisplayValue(forwardArrow, 'block');
    });
    sliderDiv.addEventListener('mouseout', () => {
        switchDisplayValue(backArrow, 'none');
        switchDisplayValue(forwardArrow, 'none');
    });

    const slideImages = [
        "img/galary-section/slider/1.jpg",
        "img/galary-section/slider/2.jpg",
        "img/galary-section/slider/3.jpg",
        "img/galary-section/slider/4.jpg",
        "img/galary-section/slider/5.jpg",
        "img/galary-section/slider/6.jpg",
        "img/galary-section/slider/7.jpg",
    ];

    class Slider {
        constructor(images) {
            this.images = images;
            this.currentSlideIndex = 0;
            this.totalSlides = this.images.length;
            this.sliderImage = document.querySelector('.container__img');
        }

        nextSlide() {
            this.currentSlideIndex++;
            if (this.currentSlideIndex >= this.totalSlides) {
                this.currentSlideIndex = 0;
            }
            this.displaySlide();
        }

        previousSlide() {
            this.currentSlideIndex--;
            if (this.currentSlideIndex < 0) {
                this.currentSlideIndex = this.totalSlides - 1;
            }
            this.displaySlide();
        }
        displaySlide() {
            const currentSlideImage = this.images[this.currentSlideIndex];
            this.sliderImage.classList.add('fade-out');
            setTimeout(() => {
                this.sliderImage.setAttribute('src', currentSlideImage);
                this.sliderImage.classList.remove('fade-out');
            }, 500);
        }
        slideShow() {
            return setInterval(() => this.nextSlide(), 5000);
        }
    }

    const slider = new Slider(slideImages);

    const slideShow = slider.slideShow();

    backArrow.addEventListener('click', () => {
        clearInterval(slideShow);
        slider.previousSlide();
    });

    forwardArrow.addEventListener('click', () => {
        clearInterval(slideShow);
        slider.nextSlide();
    });
})();

function switchDisplayValue(elem, value) {
    elem.style.display = value;
}