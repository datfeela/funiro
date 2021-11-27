document.addEventListener("DOMContentLoaded", (event) => {
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
})