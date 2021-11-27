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
});