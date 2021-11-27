document.addEventListener("DOMContentLoaded", (event) => {
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

    //убираю перетаскивание img
    roomsSlider.sliderPages.forEach((slide) => {
        const slideImage = slide.querySelector("img");
        slideImage.addEventListener("dragstart", (event) => event.preventDefault());
    });
})



