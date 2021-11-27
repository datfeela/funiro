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