document.addEventListener("DOMContentLoaded", (event) => {

    const header = document.querySelector(".header");
    const productsItems = document.querySelector(".products__items");
    const productsSection = document.querySelector(".products");
    let count = 0;
    productsSection.addEventListener("click", function (event) {
        if (event.target.closest(".products__load-more-button")) getProducts(event.target.closest(".products__load-more-button"));
    });

    async function getProducts(button) {
        if (!button.classList.contains("_hold")) {
            button.classList.add("_hold");
            const file = "json/products.json";
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

    function loadProducts(data, button) {
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
            <a href="" class="product__title">${productTitle}</a>
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
                    <button class="popup-product__share-button">
                        <svg class="popup-product__icon popup-product__icon_share">
                            <use xlink:href="#share"></use>
                        </svg>
                        <span class="popup-product__text">Share</span>
                    </button>
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

    //попап при нажатии на мобильных устройствах
    productsItems.addEventListener("click", (event) => {
        const targetElement = event.target,
            activeProduct = document.querySelector(".product._active");

        if (targetElement.closest(".product") && !targetElement.classList.contains("product__title")) {
            if (activeProduct != null) activeProduct.classList.remove("_active");
            targetElement.closest(".product").classList.add("_active");
        }
    })

    //снятие _active с итемов
    document.addEventListener("click", (event) => {
        const targetElement = event.target,
            activeProduct = document.querySelector(".product._active");
        if (!targetElement.closest(".product._active") && activeProduct != null) {
            activeProduct.classList.remove("_active");
        }
    });


    //добавление товаров в корзину
    const cart = document.querySelector(".actions__item.cart");
    const cartQuantity = cart.querySelector("span");
    const cartList = cart.querySelector(".cart__list");
    let cartProductsCount = +cartQuantity.innerHTML;

    productsSection.addEventListener("click", (event) => {
        const targetElement = event.target;

            if (targetElement.closest(".popup-product__button")) {
                event.preventDefault();
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
});