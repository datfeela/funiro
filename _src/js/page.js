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