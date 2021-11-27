document.addEventListener("DOMContentLoaded", (event) => {
    createSliderDots(
        document.querySelectorAll(".slider-tips__page"),
        document.querySelector(".slider-tips__controls"),
        "slider-dots controls-slider-tips__dots",
        "slider-dots__dot controls-slider-tips__dot controls-slider-tips__dot_",
        "sliderTipsDot"
    );

    let slidesPerSwipeTips = 3;
    if (document.documentElement.clientWidth < 1350) slidesPerSwipeTips = 2;
    if (document.documentElement.clientWidth < 768) slidesPerSwipeTips = 1;

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
        if (document.documentElement.clientWidth >= 768 && document.documentElement.clientWidth <= 1350 && tipsSlider.slidesPerSwipe != 2) {
            tipsSlider.slidesPerSwipe = 2;
            tipsSlider.hideDots();
            tipsSlider.sliderPos = 0;
            tipsSlider.swipeSlider();
        }
        if (document.documentElement.clientWidth < 768 && tipsSlider.slidesPerSwipe != 1) {
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
    });
})