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
            }, 1000);
        }
        slideShow() {
            return setInterval(() => this.nextSlide(), 6000);
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

//Форма обратной связи с валидацией
const feedbackFormValidation = (function () {

    const
        form = document.querySelector('.feedback-form'),
        inputName = document.getElementById('form-name'),
        inputPhone = document.getElementById('form-phone'),

        regexName = /^[a-zA-Zа-яА-ЯёЁ]{2,30}$/,
        regexPhone = /^\+?\d{10,15}$/,

        errorName = 'Имя должно содержать только кириллицу/латиницу и быть от 2 до 30 символов',
        errorPhone = 'Телефон должен содержать от 10 до 15 цифр и может начинаться с плюса';


    form.addEventListener('submit', formSend);

    async function formSend(evt) {
        evt.preventDefault();
        if (!validateForm()) return

        form.classList.add('sending');
        changeText('');
        const formData = new FormData(form);
        const formDataObject = {};
        formData.forEach((item, i) => {
            formDataObject[i] = item.trim().replace(/\s+/g, ' ')
        });

        // console.log('formDataObject', formDataObject);

        sendFormData(formDataObject);
    }

    async function sendFormData(formDataObject) {
        try {
            const response = await fetch('https://winery-tour.vercel.app/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formDataObject),
            });
            // console.log('response', response);

            switch (true) {
                case response.ok:
                    const result = await response.json();

                    // console.log('result.message', result?.message);

                    changeText('Спасибо за ваше сообщение! Мы свяжемся с вами в ближайшее время.');
                    disableScrolling();
                    toggleModalWindow();
                    form.reset();
                    break;
                case 422 === response.status:
                    const errors = await response.json();
                    console.log('errors', errors);
                    throw new Error('Ошибка валидации данных');
                default:
                    throw new Error(response?.statusText);
            }

        } catch (error) {
            // console.log(error.message);
            changeText('Сообщение не передано! Попробуйте, пожалуйста, позже');
            disableScrolling();
            toggleModalWindow();
        } finally {
            form.classList.remove('sending');
        }
    }

    function validateForm() {
        const isNameValid = validateInputValue(inputName, regexName, errorName);
        const isPhoneValid = validateInputValue(inputPhone, regexPhone, errorPhone);
        return isNameValid && isPhoneValid;
    }

    document.querySelector('.notification__close-modal-window').addEventListener('click', () => {
        enableScrolling();
        toggleModalWindow();
    });

    function validateInputValue(input, regex, errorText) {
        const
            inputValue = input.value,
            isValueValid = regex.test(inputValue);

        if ('' === inputValue) return showTextForRequiredField(input)

        if (!isValueValid) {
            showError(input, errorText);
            return isValueValid;
        }
        else {
            showValid(input);
            return isValueValid;
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

//Вспомогательная функция
function switchDisplayValue(elem, value) {
    elem.style.display = value;
}