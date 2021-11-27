//-------------------------------- HEADER__MENU --------------------------------//

document.addEventListener("DOMContentLoaded", (event) => {
    // делегирование click для смены класса menu__item
    const header = document.querySelector(".header");
    const headerMenu = document.querySelector(".header__menu");
    const burger = document.querySelector(".burger");
    headerMenu.addEventListener("click", changeMenuItemClass);
    headerMenu.addEventListener("mouseover", removeMenuItemClass);

    function changeMenuItemClass(event) {
        const targetElement = event.target;

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

    function removeMenuItemClass(event) {
        const targetElement = event.target;
        const menuItems = Array.from(headerMenu.querySelectorAll(".menu__item"));

        if (document.documentElement.clientWidth > 768 && targetElement.closest(".menu__item") && !(targetElement.closest(".menu__item").classList.contains("_hover"))) {
            for (let count = 0; count < menuItems.length; count++) {
                if (menuItems[count] != targetElement) menuItems[count].classList.remove("_hover");
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
    burger.addEventListener("click", (event) => {
        headerMenu.classList.toggle("_active");
    });

    //---//
    //observer за шапкой

    const callback = function (entries, observer) {
        if (entries[0].isIntersecting) {
            header.classList.remove("_scroll");
        } else {
            header.classList.add("_scroll");
        }
    };

    const headerObserver = new IntersectionObserver(callback);
    headerObserver.observe(header);
})