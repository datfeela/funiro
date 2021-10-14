"use strict";
// ;
const isMobile = {
    Android: function () {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function () {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function () {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function () {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function () {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function () {
        return isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows();
    },
};

document.addEventListener("DOMContentLoaded", (event) => {
    let checkEndTime = new Date().getTime();

    document.addEventListener("click", (event) => {
        const targetElement = event.target;
        if (targetElement.closest("a")) event.preventDefault(); //!контрю переход по ссылке, убрать позже
        // console.log(targetElement); //прикол
    });

    //-------------------------------- HEADER__MENU --------------------------------//
    // делегирование click для смены класса menu__item
    const headerMenu = document.querySelector(".header__menu");
    headerMenu.addEventListener("click", changeMenuItemClass);

    function changeMenuItemClass(event) {
        const targetElement = event.target;

        //??! как проверить ТОЛЬКО тачскрин?
        // if (isMobile.any() && document.documentElement.clientWidth > 768) {
        if (document.documentElement.clientWidth > 768) {
            if (!targetElement.closest(".menu__sub-list") && targetElement.closest(".menu__item._hover")) {
                targetElement.closest(".menu__item").classList.toggle("_hover");
            } else if (targetElement.closest(".menu__item")) {
                let itemHover = headerMenu.querySelector(".menu__item._hover");
                if (itemHover) itemHover.classList.remove("_hover");
                targetElement.closest(".menu__item").classList.toggle("_hover");
            }
        }
    }

    //сворачиваю sub-menu при клике вне menu__item
    document.addEventListener("click", (event) => {
        const targetElement = event.target,
            itemHover = document.querySelector("._hover");
        if (!targetElement.closest(".menu__item") && itemHover != null) {
            itemHover.classList.remove("_hover");
        }
    });

    //\\ JQUERY //\\
    $(".menu__arrow").click(function () {
        if (document.documentElement.clientWidth <= 768) {
            $(this).next(".menu__sub-list").slideToggle();
            $(this).toggleClass("_active");
        }
    });

    $(window).resize(function () {
        //делаю видимыми свернутые спойлеры и убираю их при изменении разрешения
        //меню в хедере
        if (document.documentElement.clientWidth > 768) {
            $(".menu__sub-list").css("display", "block");
            if ($(".menu__arrow").hasClass("_active")) {
                $(".menu__arrow").removeClass("_active");
            }
        }
        if (document.documentElement.clientWidth < 768) {
            if (!$(".menu__arrow").hasClass("_active")) {
                $(".menu__sub-list").css("display", "none");
            }
        }
    });

    //------------------------------- HEADER__SEARCH ------------------------------------//
    //вывод поисковой строки на мобильных
    const searchForm = document.querySelector(".search-form");
    searchForm.addEventListener("click", (event) => {
        const targetElement = event.target;
        if (targetElement.closest(".search-form__button_lowres")) searchForm.classList.toggle("_active");
    });

    //сворачиваю search-form__input
    document.addEventListener("click", (event) => {
        const targetElement = event.target,
            searchForm = document.querySelector(".search-form");
        if (!targetElement.closest(".search-form") && searchForm.classList.contains("_active")) {
            searchForm.classList.remove("_active");
        }
    });

    //------------------------------- HEADER__BURGER ------------------------------------//
    //бургер
    const burger = document.querySelector(".burger");
    burger.addEventListener("click", (event) => {
        headerMenu.classList.toggle("_active");
    });

    //---//
    //observer за шапкой
    const header = document.querySelector(".header");

    const callback = function (entries, observer) {
        if (entries[0].isIntersecting) {
            header.classList.remove("_scroll");
        } else {
            header.classList.add("_scroll");
        }
    };

    const headerObserver = new IntersectionObserver(callback);
    headerObserver.observe(header);

    //------------------------------- Слайдеры ------------------------------------//
    //Класс

    class Slider {
        constructor(params) {
            this.sliderWrap = params.sliderWrap;
            this.nextBtn = params.nextBtn;
            this.prevBtn = params.prevBtn;
            this.sliderPos = params.sliderPos;
            this.isDragging = false;
            this.startPos;
            this.slidesPerSwipe = params.slidesPerSwipe;
            this.currentTranslate;
            // this.currentTranslateX = 0;
            this.prevTranslate = 0;
            this.startTime;
            this.endTime;
            this.activeDot = params.activeDot;
            this.sliderPages = params.sliderPages;
            this.activePage;
            this.dots = params.dots;
            this.sliderName = params.sliderName;
        }

        //methods

        touchStart(event) {
            this.startPos = this.getPositionX(event);
            this.isDragging = true;
            this.startTime = new Date().getTime();
        }

        touchMove(event) {
            if (this.isDragging) {
                const currentPosition = this.getPositionX(event);
                this.currentTranslate = this.prevTranslate + currentPosition - this.startPos;
            }
        }

        touchEnd() {
            this.isDragging = false;
            const movedBy = this.currentTranslate - this.prevTranslate;
            this.endTime = new Date().getTime() - this.startTime;
            if (movedBy < -150 && this.endTime < 400) {
                this.swipeRight();
            }
            if (movedBy > 150 && this.endTime < 400) {
                this.swipeLeft();
            }
        }

        getPositionX(event) {
            if (event.type.includes("mouse")) return event.pageX;
            else return event.touches[0].clientX;
        }

        swipeRight() {
            if (this.sliderPos < Math.ceil(this.sliderWrap.childElementCount / this.slidesPerSwipe) - 1) {
                this.sliderPos += 1;
                this.swipeSlider();
                this.changeActiveSlide();
            }
        }

        swipeLeft() {
            if (this.sliderPos > 0) {
                this.sliderPos -= 1;
                this.swipeSlider();
                this.changeActiveSlide();
            }
        }

        swipeOnDot(event) {
            if (event.target.classList.contains(`controls-${this.sliderName}__dot`) && !event.target.classList.contains("_active")) {
                this.activeDot.classList.remove("_active");
                event.target.classList.add("_active");
                let idLength = this.dots.firstElementChild.id.length - 1; //для удобного slice из id вне зависимости от кол-ва слайдов
                this.activeDot = event.target;
                this.sliderPos = event.target.id.slice(idLength) - 1;
                this.sliderWrap.style.transform = `translateX(${this.sliderPos * -this.calcSlideWidth() * this.slidesPerSwipe}px)`;
                this.changeActiveSlide();
                this.blockButtons();
            }
        }

        calcSlideWidth() {
            let imgWidth = getComputedStyle(this.activePage).width;
            imgWidth = imgWidth.slice(0, 3);
            let margin = getComputedStyle(this.activePage).marginRight;
            margin = margin.slice(0, 2);
            imgWidth = +imgWidth + +margin;
            return imgWidth;
        }

        swipeSlider() {
            this.sliderWrap.style.transform = `translateX(${this.sliderPos * -this.calcSlideWidth() * this.slidesPerSwipe}px)`;
            this.activeDot.classList.remove("_active");
            this.activeDot = document.querySelector(`.controls-${this.sliderName}__dot_${this.sliderPos + 1}`);
            this.activeDot.classList.add("_active");
            this.blockButtons();
        }

        changeActiveSlide() {
            this.activePage.classList.remove("_active");
            this.activePage = document.getElementById(`${this.sliderName}-page-${this.sliderPos * this.slidesPerSwipe + 1}`);
            this.activePage.classList.add("_active");
        }

        blockButtons() {
            switch (this.sliderPos) {
                case 0:
                    if (!this.prevBtn.classList.contains("_blocked")) this.prevBtn.classList.add("_blocked");
                    if (this.nextBtn.classList.contains("_blocked")) this.nextBtn.classList.remove("_blocked");
                    break;
                case Math.ceil(this.sliderWrap.childElementCount / this.slidesPerSwipe) - 1:
                    if (!this.nextBtn.classList.contains("_blocked")) this.nextBtn.classList.add("_blocked");
                    if (this.prevBtn.classList.contains("_blocked")) this.prevBtn.classList.remove("_blocked");
                    break;
                default:
                    if (this.nextBtn.classList.contains("_blocked")) this.nextBtn.classList.remove("_blocked");
                    if (this.prevBtn.classList.contains("_blocked")) this.prevBtn.classList.remove("_blocked");
                    break;
            }
        }

        hideDots() {
            let dotsArray = Array.from(this.dots.children);
            let dotsNeeded = Math.ceil(dotsArray.length / this.slidesPerSwipe);
            for (let i = dotsNeeded; i < dotsArray.length; i++) {
                dotsArray[i].style.display = "none";
            }
            for (let i = 0; i < dotsNeeded; i++) {
                dotsArray[i].style.display = "block";
            }
            this.dots.style.width = `${dotsNeeded * 11 + (dotsNeeded - 1) * 20}px`;
        }
    }

    //------------------------------- MAIN-SLIDER ------------------------------------//
    // буллеты для main-slider
    createSliderDots(
        document.querySelectorAll(".slider-main__page"),
        document.querySelector(".slider-main__controls"),
        "slider-dots controls-slider-main__dots",
        "slider-dots__dot controls-slider-main__dot controls-slider-main__dot_",
        "sliderMainDot"
    );

    const mainSlider = new Slider({
        sliderWrap: document.querySelector(".slider-main__wrapper"),
        nextBtn: document.querySelector("#main-slider-arrow-right"),
        prevBtn: document.querySelector("#main-slider-arrow-left"),
        sliderPos: 0,
        slidesPerSwipe: 1,
        activeDot: document.querySelector(".controls-slider-main__dot_1"),
        sliderPages: Array.from(document.querySelectorAll(".slider-main__page")),
        dots: document.querySelector(".controls-slider-main__dots"),
        sliderName: "slider-main",
    });

    //делаю активными слайд и буллет
    mainSlider.activePage = mainSlider.sliderPages[0];
    mainSlider.activePage.classList.add("_active");
    mainSlider.activeDot.classList.add("_active");

    //сдвигаю на 1 позицию
    setTimeout(() => {
        mainSlider.swipeRight();
    }, 1000);

    //button events
    mainSlider.nextBtn.addEventListener("click", () => {
        mainSlider.swipeRight();
    });
    mainSlider.prevBtn.addEventListener("click", () => {
        mainSlider.swipeLeft();
    });
    mainSlider.dots.addEventListener("click", (event) => {
        mainSlider.swipeOnDot(event);
    });

    // Touch events
    mainSlider.sliderWrap.addEventListener("touchstart", (event) => {
        mainSlider.touchStart(event);
    });
    mainSlider.sliderWrap.addEventListener("touchmove", (event) => {
        mainSlider.touchMove(event);
    });
    mainSlider.sliderWrap.addEventListener("touchend", () => {
        mainSlider.touchEnd();
    });

    // Mouse events
    mainSlider.sliderWrap.addEventListener("mousedown", (event) => {
        mainSlider.touchStart(event);
    });
    mainSlider.sliderWrap.addEventListener("mouseup", () => {
        mainSlider.touchEnd();
    });
    mainSlider.sliderWrap.addEventListener("mouseleave", () => {
        mainSlider.touchEnd();
    });
    mainSlider.sliderWrap.addEventListener("mousemove", (event) => {
        mainSlider.touchMove(event);
    });

    //window events
    $(window).resize(function () {
        mainSlider.sliderWrap.style.transform = `translateX(${mainSlider.sliderPos * -mainSlider.calcSlideWidth()}px)`;
    });

    //functions

    //убираю перетаскивание img
    mainSlider.sliderPages.forEach((slide) => {
        const slideImage = slide.querySelector("img");
        slideImage.addEventListener("dragstart", (event) => event.preventDefault());
    });

    function createSliderDots(pages, dotsPosition, dotsClassName, dotClassName, dotID) {
        const childElemsCount = pages.length;
        const dotsPos = dotsPosition;
        let dots = document.createElement("div");
        dots.className = `${dotsClassName}`;
        dots.style.width = `${27 + 20 * (childElemsCount - 1) + 11 * (childElemsCount - 1)}px`;
        for (let i = 0; i < childElemsCount; i++) {
            let dot = document.createElement("div");
            dot.className = `${dotClassName}${i + 1}`;
            dot.id = `${dotID}${i + 1}`;
            dots.append(dot);
        }
        dotsPos.prepend(dots);
    }

    //------------------------------- ROOMS-SLIDER ------------------------------------//
    // буллеты для rooms-slider
    createSliderDots(
        document.querySelectorAll(".slider-rooms__page"),
        document.querySelector(".slider-rooms__controls"),
        "slider-dots controls-slider-rooms__dots",
        "slider-dots__dot controls-slider-rooms__dot controls-slider-rooms__dot_",
        "sliderRoomsDot"
    );

    const roomsSlider = new Slider({
        sliderWrap: document.querySelector(".slider-rooms__wrapper"),
        nextBtn: document.querySelector("#rooms-slider-arrow-right"),
        prevBtn: document.querySelector("#rooms-slider-arrow-left"),
        sliderPos: 0,
        slidesPerSwipe: 1,
        activeDot: document.querySelector(".controls-slider-rooms__dot_1"),
        sliderPages: Array.from(document.querySelectorAll(".slider-rooms__page")),
        dots: document.querySelector(".controls-slider-rooms__dots"),
        sliderName: "slider-rooms",
    });

    roomsSlider.activePage = roomsSlider.sliderPages[0];
    roomsSlider.activeDot.classList.add("_active");
    roomsSlider.activePage.classList.add("_active");

    //скрываю булеты для копий слайдов
    roomsSlider.dots.children[0].style.opacity = "0";
    roomsSlider.dots.children[roomsSlider.dots.childElementCount - 1].style.opacity = "0";
    roomsSlider.dots.children[roomsSlider.dots.childElementCount - 2].style.opacity = "0";
    roomsSlider.dots.children[roomsSlider.dots.childElementCount - 3].style.opacity = "0";

    //сдвигаю слайдер с копии
    setTimeout(() => {
        roomsSlider.swipeRight();
    }, 1000);

    //methods
    roomsSlider.calcSlideWidth = () => {
        let imgWidth;
        if (roomsSlider.activePage.nextElementSibling) imgWidth = getComputedStyle(roomsSlider.activePage.nextElementSibling).width;
        else imgWidth = getComputedStyle(roomsSlider.activePage.previousElementSibling).width;
        imgWidth = imgWidth.slice(0, 3);
        let margin = getComputedStyle(roomsSlider.activePage).marginRight;
        margin = margin.slice(0, 2);
        imgWidth = +imgWidth + +margin;
        return imgWidth;
    };

    roomsSlider.swipeRight = () => {
        roomsSlider.unlockAnimations();
        if (roomsSlider.sliderPos < roomsSlider.sliderWrap.childElementCount - 4) {
            roomsSlider.sliderPos += 1;
            roomsSlider.swipeSlider();
            roomsSlider.changeActiveSlide();
        } else {
            if (!roomsSlider.nextBtn.classList.contains("_blocked")) {
                roomsSlider.sliderPos += 1;
                roomsSlider.swipeSlider();
                roomsSlider.changeActiveSlide();

                setTimeout(() => {
                    roomsSlider.lockAnimations();
                    roomsSlider.sliderPos = 1;
                    roomsSlider.swipeSlider();
                    roomsSlider.changeActiveSlide();
                }, 600);
            }
        }
    };

    roomsSlider.swipeLeft = () => {
        roomsSlider.unlockAnimations();
        if (roomsSlider.sliderPos > 1) {
            roomsSlider.sliderPos -= 1;
            roomsSlider.swipeSlider();
            roomsSlider.changeActiveSlide();
        } else {
            if (!roomsSlider.nextBtn.classList.contains("_blocked")) {
                roomsSlider.sliderPos -= 1;
                roomsSlider.swipeSlider();
                roomsSlider.changeActiveSlide();

                setTimeout(() => {
                    roomsSlider.lockAnimations();
                    roomsSlider.sliderPos = 6;
                    roomsSlider.swipeSlider();
                    roomsSlider.changeActiveSlide();
                }, 600);
            }
        }
    };

    roomsSlider.blockButtons = () => {
        switch (roomsSlider.sliderPos) {
            case 0:
                if (!roomsSlider.prevBtn.classList.contains("_blocked")) roomsSlider.prevBtn.classList.add("_blocked");
                if (!roomsSlider.nextBtn.classList.contains("_blocked")) roomsSlider.nextBtn.classList.add("_blocked");
                break;
            case roomsSlider.sliderWrap.childElementCount - 3:
                if (!roomsSlider.nextBtn.classList.contains("_blocked")) roomsSlider.nextBtn.classList.add("_blocked");
                if (!roomsSlider.prevBtn.classList.contains("_blocked")) roomsSlider.prevBtn.classList.add("_blocked");
                break;
            default:
                if (roomsSlider.nextBtn.classList.contains("_blocked")) roomsSlider.nextBtn.classList.remove("_blocked");
                if (roomsSlider.prevBtn.classList.contains("_blocked")) roomsSlider.prevBtn.classList.remove("_blocked");
                break;
        }
    };

    roomsSlider.lockAnimations = () => {
        roomsSlider.sliderWrap.style.transition = "none";
        $(".page-slider-rooms__image").css("transition", "none");
        $(".page-slider-rooms__content").css("transition", "none");
    };

    roomsSlider.unlockAnimations = () => {
        roomsSlider.sliderWrap.style.transition = "";
        $(".page-slider-rooms__image").css("transition", "");
        $(".page-slider-rooms__content").css("transition", "");
    };

    //button events
    roomsSlider.nextBtn.addEventListener("click", () => {
        roomsSlider.swipeRight();
    });
    roomsSlider.prevBtn.addEventListener("click", () => {
        roomsSlider.swipeLeft();
    });
    roomsSlider.dots.addEventListener("click", (event) => {
        roomsSlider.unlockAnimations();
        roomsSlider.swipeOnDot(event);
    });

    // Touch events
    roomsSlider.sliderWrap.addEventListener("touchstart", (event) => {
        roomsSlider.touchStart(event);
    });
    roomsSlider.sliderWrap.addEventListener("touchmove", (event) => {
        roomsSlider.touchMove(event);
    });
    roomsSlider.sliderWrap.addEventListener("touchend", () => {
        roomsSlider.touchEnd();
    });

    // Mouse events
    roomsSlider.sliderWrap.addEventListener("mousedown", (event) => {
        roomsSlider.touchStart(event);
    });
    roomsSlider.sliderWrap.addEventListener("mouseup", () => {
        roomsSlider.touchEnd();
    });
    roomsSlider.sliderWrap.addEventListener("mouseleave", () => {
        roomsSlider.touchEnd();
    });
    roomsSlider.sliderWrap.addEventListener("mousemove", (event) => {
        roomsSlider.touchMove(event);
    });

    //window events
    $(window).resize(function () {
        setTimeout(() => {
            roomsSlider.sliderWrap.style.transform = `translateX(${roomsSlider.sliderPos * -roomsSlider.calcSlideWidth()}px)`;
        }, 1500);
    });

    //functions

    //убираю перетаскивание img
    roomsSlider.sliderPages.forEach((slide) => {
        const slideImage = slide.querySelector("img");
        slideImage.addEventListener("dragstart", (event) => event.preventDefault());
    });

    //------------------------------- TIPS-SLIDER ------------------------------------//
    // буллеты для tips-slider
    createSliderDots(
        document.querySelectorAll(".slider-tips__page"),
        document.querySelector(".slider-tips__controls"),
        "slider-dots controls-slider-tips__dots",
        "slider-dots__dot controls-slider-tips__dot controls-slider-tips__dot_",
        "sliderTipsDot"
    );

    let slidesPerSwipeTips = 3;
    if (document.documentElement.clientWidth < 1350) slidesPerSwipeTips = 2;

    const tipsSlider = new Slider({
        sliderWrap: document.querySelector(".slider-tips__wrapper"),
        nextBtn: document.querySelector("#tips-slider-arrow-right"),
        prevBtn: document.querySelector("#tips-slider-arrow-left"),
        sliderPos: 0,
        slidesPerSwipe: slidesPerSwipeTips,
        activeDot: document.querySelector(".controls-slider-tips__dot_1"),
        sliderPages: Array.from(document.querySelectorAll(".slider-tips__page")),
        dots: document.querySelector(".controls-slider-tips__dots"),
        sliderName: "slider-tips",
    });

    tipsSlider.activePage = tipsSlider.sliderPages[0];
    tipsSlider.activeDot.classList.add("_active");
    tipsSlider.activePage.classList.add("_active");
    tipsSlider.blockButtons();

    tipsSlider.hideDots();

    //methods

    //button events
    tipsSlider.nextBtn.addEventListener("click", () => {
        tipsSlider.swipeRight();
    });
    tipsSlider.prevBtn.addEventListener("click", () => {
        tipsSlider.swipeLeft();
    });
    tipsSlider.dots.addEventListener("click", (event) => {
        tipsSlider.swipeOnDot(event);
    });

    // Touch events
    tipsSlider.sliderWrap.addEventListener("touchstart", (event) => {
        tipsSlider.touchStart(event);
    });
    tipsSlider.sliderWrap.addEventListener("touchmove", (event) => {
        tipsSlider.touchMove(event);
    });
    tipsSlider.sliderWrap.addEventListener("touchend", () => {
        tipsSlider.touchEnd();
    });

    // Mouse events
    tipsSlider.sliderWrap.addEventListener("mousedown", (event) => {
        tipsSlider.touchStart(event);
    });
    tipsSlider.sliderWrap.addEventListener("mouseup", () => {
        tipsSlider.touchEnd();
    });
    tipsSlider.sliderWrap.addEventListener("mouseleave", () => {
        tipsSlider.touchEnd();
    });
    tipsSlider.sliderWrap.addEventListener("mousemove", (event) => {
        tipsSlider.touchMove(event);
    });

    //window events
    $(window).resize(function () {
        tipsSlider.sliderWrap.style.transform = `translateX(${tipsSlider.sliderPos * -tipsSlider.calcSlideWidth() * tipsSlider.slidesPerSwipe}px)`;
        if (document.documentElement.clientWidth > 1350 && tipsSlider.slidesPerSwipe != 3) {
            tipsSlider.slidesPerSwipe = 3;
            tipsSlider.hideDots();
            tipsSlider.sliderPos = 0;
            tipsSlider.swipeSlider();
        }
        if (document.documentElement.clientWidth >= 700 && document.documentElement.clientWidth <= 1350 && tipsSlider.slidesPerSwipe != 2) {
            tipsSlider.slidesPerSwipe = 2;
            tipsSlider.hideDots();
            tipsSlider.sliderPos = 0;
            tipsSlider.swipeSlider();
        }
        if (document.documentElement.clientWidth < 700 && tipsSlider.slidesPerSwipe != 1) {
            tipsSlider.slidesPerSwipe = 1;
            tipsSlider.sliderPos = 0;
            tipsSlider.swipeSlider();
        }
    });

    //functions

    //убираю перетаскивание img
    tipsSlider.sliderPages.forEach((slide) => {
        const slideImage = slide.querySelector("img");
        slideImage.addEventListener("dragstart", (event) => event.preventDefault());
    }); //!fix!!!!

    //------------------------------- MAIN__PRODUCTS ------------------------------------//
    //подгрузка новых продуктов
    const productsSection = document.querySelector(".products");
    let count = 0;
    productsSection.addEventListener("click", function (event) {
        if (event.target.closest(".products__load-more-button")) getProducts(event.target.closest(".products__load-more-button"));
    });

    async function getProducts(button) {
        if (!button.classList.contains("_hold")) {
            button.classList.add("_hold");
            const file = "../json/products.json";
            let response = await fetch(file, { method: "GET" });
            if (response.ok) {
                let result = await response.json();
                loadProducts(result, button);
                button.classList.remove("_hold");
            } else {
                alert("something went wrong...");
            }
        }
    }

    function prekol() {
        fetch('https://jsonplaceholder.typicode.com/todos/1')
            .then(response => response.json())
            .then(json => console.log(json))
        fetch('https://jsonplaceholder.typicode.com/todos/2')
            .then(response => response.json())
            .then(json => console.log(json))

    }

    prekol();

    function loadProducts(data, button) {
        const productsItems = document.querySelector(".products__items");
        if (count >= data.products.length) {
            button.classList.add("_blocked");
            return;
        }
        let cycleCount = 0;
        for (let arrCount = count; arrCount < count + 4; arrCount++) {
            let item = data.products[arrCount];
            //---------------

            const productId = item.id;
            const productImage = item.image;
            const productTitle = item.title;
            const productText = item.text;
            const productPrice = item.price;
            const productOldPrice = item.priceOld;
            const productShareUrl = item.shareUrl;
            const productLabels = item.labels;

            let productTemplateStart = `<div data-prodid="${productId}" class="products__product product">`;
            let productTemplateEnd = `</div>`;

            let productTemplateLabels = "";
            if (productLabels) {
                let productTemplateLabelsStart = `<div class="product__labels">`;
                let productTemplateLabelsEnd = `</div>`;
                let productTemplateLabelsContent = "";

                productLabels.forEach((labelItem) => {
                    productTemplateLabelsContent += `<div class="product__label product__label_${labelItem.type}">${labelItem.value}</div>`;
                });

                productTemplateLabels += productTemplateLabelsStart;
                productTemplateLabels += productTemplateLabelsContent;
                productTemplateLabels += productTemplateLabelsEnd;
            }

            let productTemplateImage = `
            <img class="product__image" src="${productImage}" alt="${productTitle}" />
            `;

            let productTemplateContent = "";
            let productTemplateContentStart = `<div class="product__content">`;
            let productTemplateContentEnd = `</div>`;
            let productTemplateContentBody = `
            <h2 class="product__title">${productTitle}</h2>
            <span class="product__description">${productText}</span>
	        `;

            let productTemplatePrices = "";
            let productTemplatePricesStart = `<div class="product__prices">`;
            let productTemplatePricesCurrent = `<span class="product__price">Rp ${productPrice}</span>`;
            let productTemplatePricesOld = `<span class="product__old-price">Rp ${productOldPrice}</span>`;
            let productTemplatePricesEnd = `</div>`;

            productTemplatePrices = productTemplatePricesStart;
            productTemplatePrices += productTemplatePricesCurrent;
            if (productOldPrice) {
                productTemplatePrices += productTemplatePricesOld;
            }
            productTemplatePrices += productTemplatePricesEnd;

            productTemplateContent += productTemplateContentStart;
            productTemplateContent += productTemplateContentBody;
            productTemplateContent += productTemplatePrices;
            productTemplateContent += productTemplateContentEnd;

            let productTemplatePopup = `
            <div class="product__popup popup-product">
                <div class="popup-product__actions">
                    <a href="" class="popup-product__button">Add to cart</a>
                    <a href="${productShareUrl}" class="popup-product__link">
                        <svg class="popup-product__icon popup-product__icon_share">
                            <use xlink:href="#share"></use>
                        </svg>
                        <span class="popup-product__text">Share</span>
                    </a>
                    <button class="popup-product__like-button">
                        <svg class="popup-product__icon popup-product__icon_like">
                            <use xlink:href="#favorite"></use>
                        </svg>
                        <span class="popup-product__text">Like</span>
                    </button>
                </div>
            </div>
	    `;

            let productTemplateBody = "";
            productTemplateBody += productTemplateContent;
            productTemplateBody += productTemplatePopup;

            let productTemplate = "";
            productTemplate += productTemplateStart;
            productTemplate += productTemplateLabels;
            productTemplate += productTemplateImage;
            productTemplate += productTemplateBody;
            productTemplate += productTemplateEnd;

            productsItems.insertAdjacentHTML("beforeend", productTemplate);
            //----------------

            cycleCount++;
            if (count + cycleCount >= data.products.length) {
                count += cycleCount;
                button.classList.add("_blocked");
                return;
            }
        }
        count += cycleCount;
    }

    function closeCart() {
        cart.classList.remove("_active");
        cart.classList.remove("_opened");
        cartQuantity.style.opacity = "0";
        cartQuantity.style.visibility = "hidden";
    }

    //добавление товаров в корзину
    const cart = document.querySelector(".actions__item.cart");
    const cartQuantity = cart.querySelector("span");
    const cartList = cart.querySelector(".cart__list");
    let cartProductsCount = +cartQuantity.innerHTML;

    productsSection.addEventListener("click", (event) => {
        const targetElement = event.target;

        if (targetElement.closest(".popup-product__button")) {
            let product = targetElement.closest(".product");

            if (product.classList.contains("_added")) {
                const itemID = product.dataset.prodid;
                const cartListItem = document.querySelector(`.item-cart[data-prodid="${itemID}"]`);
                let cartListItemCounter = cartListItem.querySelector(".quantity-cart__counter").innerHTML;
                cartListItem.querySelector(".quantity-cart__counter").innerHTML = ++cartListItemCounter;
                cartProductsCount++;
            } else {
                product.classList.add("_added");
                //cоздаю копию продукта

                let productCart = document.createElement("li");
                productCart.dataset.prodid = product.dataset.prodid;
                productCart.className = "cart__item item-cart";

                productCart.insertAdjacentHTML(
                    "afterBegin",
                    `
                <img class="item-cart__image" src="${product.querySelector(".product__image").getAttribute("src")}" alt="">
                <h2 class="item-cart__title">${product.querySelector(".product__title").innerHTML}</h2>
                <span class="item-cart__price">${product.querySelector(".product__price").innerHTML}</span>
                <div class="item-cart__quantity quantity-cart">
                <button class="quantity-cart__button quantity-cart__button_minus">-</button>
                <span class="quantity-cart__counter">1</span>
                <button class="quantity-cart__button quantity-cart__button_plus">+</button>
                </div>
                <button class="item-cart__delete-button">
                    <svg class="item-cart__icon">
                        <use xlink:href="#delete"></use>
                    </svg>
                </button>
                `
                );

                cartList.append(productCart);

                cartProductsCount++;
            }

            //делаю корзину активной
            if (!cart.classList.contains("_active")) {
                cart.classList.add("_active");
                cartQuantity.style.opacity = "1";
                cartQuantity.style.visibility = "visible";
            }

            if (cartProductsCount > 99) {
                cartQuantity.innerHTML = "99+";
                cartQuantity.style.height = "20px";
                cartQuantity.style.width = "20px";
            } else {
                cartQuantity.innerHTML = `${cartProductsCount}`;
                cartQuantity.style.height = "16px";
                cartQuantity.style.width = "16px";
            }
        }
    });

    //изменение количества товаров в корзине на +-
    cartList.addEventListener("click", (event) => {
        const targetElement = event.target;

        if (event.target.classList.contains("quantity-cart__button_minus")) {
            let counter = targetElement.nextElementSibling.innerHTML;
            if (counter > 1) {
                targetElement.nextElementSibling.innerHTML = --counter;
                cartProductsCount--;
            } else {
                event.preventDefault();

                const itemID = targetElement.closest(".item-cart").dataset.prodid;
                const product = document.querySelector(`.product[data-prodid="${itemID}"]`);
                product.classList.remove("_added");

                targetElement.closest(".item-cart").remove();
                cartProductsCount--;
            }
        }

        if (event.target.classList.contains("quantity-cart__button_plus")) {
            let counter = targetElement.previousElementSibling.innerHTML;
            targetElement.previousElementSibling.innerHTML = ++counter;
            cartProductsCount++;
        }

        if (cartProductsCount > 99) {
            cartQuantity.innerHTML = "99+";
            cartQuantity.style.height = "20px";
            cartQuantity.style.width = "20px";
        } else {
            cartQuantity.innerHTML = `${cartProductsCount}`;
            cartQuantity.style.height = "16px";
            cartQuantity.style.width = "16px";
        }

        if (cartProductsCount < 1) closeCart();
    });

    //удаление одного товара из корзины
    header.addEventListener("click", (event) => {
        const targetElement = event.target;

        if (targetElement.closest(".item-cart__delete-button")) {
            event.preventDefault();

            let counter = targetElement.closest(".item-cart").querySelector(".quantity-cart__counter").innerHTML;
            const itemID = targetElement.closest(".item-cart").dataset.prodid;
            const product = document.querySelector(`.product[data-prodid="${itemID}"]`);
            product.classList.remove("_added");

            cartProductsCount -= counter;
            targetElement.closest(".item-cart").remove();

            cartQuantity.innerHTML = `${cartProductsCount}`;
            if (cartProductsCount < 1) closeCart();
        }
    });

    //удаление всех товаров из корзины
    header.addEventListener("click", (event) => {
        const targetElement = event.target;
        const cartPopup = document.querySelector(".cart__delete-popup");
        const deleteButton = document.querySelector(".cart__delete-popup-button_yes");
        const cancelButton = document.querySelector(".cart__delete-popup-button_no");

        if (targetElement.classList.contains("cart__delete-button")) {
            cartPopup.classList.add("_active");

            deleteButton.onclick = () => {
                document.querySelectorAll(".product._added").forEach((element) => {
                    element.classList.remove("_added");
                });

                // event.preventDefault();
                targetElement.previousElementSibling.innerHTML = "";

                cartProductsCount = 0;
                closeCart();
                cartPopup.classList.remove("_active");
            };

            cancelButton.onclick = () => {
                cartPopup.classList.remove("_active");
            };
        }
    });

    //открытие/закрытие корзины
    header.addEventListener("click", (event) => {
        const targetElement = event.target;

        if ((targetElement.closest(".cart__icon") || targetElement.closest(".search-form")) && cart.classList.contains("_opened")) {
            cart.classList.remove("_opened");
        } else if (targetElement.closest(".cart__icon") && !cart.classList.contains("_opened") && cart.classList.contains("_active"))
            cart.classList.add("_opened");
    });

    //------------------------------- FOOTER ------------------------------------//

    //\\ JQUERY //\\

    //спойлеры в футере на <576px
    $(".footer__title").click(function () {
        if (document.documentElement.clientWidth <= 576) {
            $(this).next(".footer__list").slideToggle();
            $(this).parent().toggleClass("_active");
        }
    });

    $(window).resize(function () {
        //делаю видимыми свернутые спойлеры и убираю их при изменении разрешения
        //меню в футере
        if (document.documentElement.clientWidth > 576) {
            $(".footer__list").css("display", "block");
            if ($(".footer__block").hasClass("_active")) {
                $(".footer__block").removeClass("_active");
            }
        }
        if (document.documentElement.clientWidth < 576) {
            if (!$(".footer__block").hasClass("_active")) {
                $(".footer__list").css("display", "none");
            }
        }

        // if (document.documentElement.clientWidth < 800) {
        //     // $(".controls-slider-rooms__dots").css('left', `${}`);
        //     const dots = document.querySelector(".controls-slider-rooms__dots");
        //     dots.style.left = `calc(50% - ${getComputedStyle(dots).width} / 2 + 31px)`;
        // }

        // if (document.documentElement.clientWidth > 800) {
        //     // $(".controls-slider-rooms__dots").css('left', `${}`);
        //     const dots = document.querySelector(".controls-slider-rooms__dots");
        //     dots.style.left = "";
        // }
    });
});
