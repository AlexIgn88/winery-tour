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

const feedbackFormValidation = (function () {

    const
        form = document.querySelector('.feedback-form'),

        nameInput = document.getElementById('form-name'),
        phoneInput = document.getElementById('form-phone'),

        nameError = document.getElementById('form-name-error'),
        phoneError = document.getElementById('form-phone-error');

    form.addEventListener('submit', validateForm);

    function validateForm(event) {
        event.preventDefault();
        const isNameValid = validateName();
        const isPhoneValid = validatePhone();

        if (isNameValid && isPhoneValid) {
            // toggleModalWindow();
            alert('Ваше сообщение передано. С Вами свяжется наш менеджер');
            form.reset();
        }
    }

    // document.querySelector('.notification__close-modal-window').addEventListener('click', () => toggleModalWindow());

    function validateName() {
        const name = nameInput.value.trim();
        const validName = /^[a-zA-Zа-яА-ЯёЁ]{3,30}$/.test(name);
        const errorText = 'Имя должно содержать только кириллицу/латиницу и быть от 3 до 30 символов';

        if (name === '') return showTextForRequiredField(nameInput, nameError)

        if (!validName)
            return showError(nameInput, nameError, errorText, validName)
        else return showValid(nameInput, nameError, validName);
    }

    function validatePhone() {
        const phone = phoneInput.value.trim();
        const validPhone = /^\+?\d{10,15}$/.test(phone);
        const errorText = 'Телефон должен содержать от 10 до 15 цифр и может начинаться с плюса';

        if (phone === '') return showTextForRequiredField(phoneInput, phoneError)

        if (!validPhone)
            return showError(phoneInput, phoneError, errorText, validPhone)
        else return showValid(phoneInput, phoneError, validPhone);
    }

    //показываю ошибку, если неверно
    function showError(inputElem, messageErrorElem, errorText, validValue) {
        inputElem.classList.add('input-invalid');
        messageErrorElem.textContent = errorText;
        return validValue;
    }

    //убираю ошибку
    function showValid(inputElem, messageErrorElem, validValue) {
        inputElem.classList.remove('input-invalid');
        messageErrorElem.textContent = '';
        return validValue;
    }

    //если не использовать атрибут required в html, незаполненное поле подсветится
    function showTextForRequiredField(inputElem, messageErrorElem) {
        const text = 'Поле обязательно для заполнения';
        inputElem.classList.add('input-invalid');
        messageErrorElem.textContent = text;
        return false;
    }

    function toggleModalWindow() {
        const modalWindow = document.querySelector('.modal-window');
        modalWindow.classList.toggle('modal-window-hide');
    }

})();

function switchDisplayValue(elem, value) {
    elem.style.display = value;
}