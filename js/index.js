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
        phoneInput = document.getElementById('form-phone');

    form.addEventListener('submit', formSend);

    async function formSend(evt) {
        evt.preventDefault();
        if (!validateForm()) return

        const formData = new FormData(form);
        form.classList.add('sending');


        // console.log('отправка формы на сервер');
        // console.log(formData);
        const response = await fetch('sendmail.php', {
            method: 'POST',
            body: formData
        });
        console.log('response', response);

        if (response.ok) {
            const result = await response.json();

            console.log('result.message', result?.message);

            changeText('В ближайшее время с Вами свяжется менеджер');
            disableScrolling();
            toggleModalWindow();
            form.reset();
            form.classList.remove('sending');
        } else {
            console.log('данные не переданы');
            changeText('Сообщение не передано. Попробуйте, пожалуйста, позже');
            disableScrolling();
            toggleModalWindow();
            form.classList.remove('sending');
        }
    }

    function validateForm() {
        const isNameValid = validateName();
        const isPhoneValid = validatePhone();
        return isNameValid && isPhoneValid
    }

    document.querySelector('.notification__close-modal-window').addEventListener('click', () => {
        enableScrolling();
        toggleModalWindow();
    });

    function validateName() {
        const name = nameInput.value.trim();
        const validName = /^[a-zA-Zа-яА-ЯёЁ]{2,30}$/.test(name);
        const errorText = 'Имя должно содержать только кириллицу/латиницу и быть от 2 до 30 символов';

        if (name === '') return showTextForRequiredField(nameInput)

        if (!validName) {
            showError(nameInput, errorText);
            return validName;
        }
        else {
            showValid(nameInput);
            return validName;
        }

    }

    function validatePhone() {
        const phone = phoneInput.value.trim();
        const validPhone = /^\+?\d{10,15}$/.test(phone);
        const errorText = 'Телефон должен содержать от 10 до 15 цифр и может начинаться с плюса';

        if (phone === '') return showTextForRequiredField(phoneInput)

        if (!validPhone) {
            showError(phoneInput, errorText);
            return validPhone;
        }
        else {
            showValid(phoneInput);
            return validPhone;
        }
    }

    function showError(inputElem, errorText) {
        const messageErrorElem = inputElem.nextElementSibling;

        inputElem.classList.add('input-invalid');
        messageErrorElem.textContent = errorText;
    }

    function showValid(inputElem) {
        const messageErrorElem = inputElem.nextElementSibling;

        inputElem.classList.remove('input-invalid');
        messageErrorElem.textContent = '';
    }

    function showTextForRequiredField(inputElem) {
        const messageErrorElem = inputElem.nextElementSibling;
        const text = 'Поле обязательно для заполнения';

        inputElem.classList.add('input-invalid');
        messageErrorElem.textContent = text;
        return false;
    }

    function toggleModalWindow() {
        const modalWindow = document.querySelector('.modal-window');
        modalWindow.classList.toggle('modal-window-hide');
    }

    function changeText(text) {
        const textInModalWindowDiv = document.querySelector('.notification__text');
        textInModalWindowDiv.textContent = text;
    }

    function disableScrolling() {
        document.body.style.overflow = "hidden";
    }

    function enableScrolling() {
        document.body.style.overflow = "";
    }

})();

function switchDisplayValue(elem, value) {
    elem.style.display = value;
}