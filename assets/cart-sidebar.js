(function ($, window) {
    // 更新侧边栏购物车
    function updateSidebarCart(cart) {
        if (cart && Object.keys(cart).length > 0) {
            const cartDropdown = document.querySelector(
                "#halo-cart-sidebar .halo-sidebar-wrapper .previewCart-wrapper"
            );

            if (!cartDropdown) return;

            const cartLoading = document.createElement("div");
            cartLoading.classList.add("loading-overlay", "loading-overlay--custom");
            cartLoading.innerHTML = `
                <div class="loading-overlay__spinner">
                    <svg aria-hidden="true" focusable="false" role="presentation" class="spinner" viewBox="0 0 66 66">
                        <circle class="path" fill="none" stroke-width="6" cx="33" cy="33" r="30"></circle>
                    </svg>
                </div>
            `;

            cartDropdown.classList.add("is-loading");
            cartDropdown.prepend(cartLoading);

            fetch(window.routes.root + "/cart?view=ajax_side_cart", {
                cache: "no-store",
            })
                .then((response) => response.text())
                .then((data) => {
                    cartDropdown.classList.remove("is-loading");
                    cartDropdown.innerHTML = data;
                })
                .catch((error) => {
                    console.error("Cart update error:", error);
                })
                .finally(() => {
                    document
                        .querySelectorAll("[data-cart-count]")
                        .forEach((el) => (el.textContent = cart.item_count));

                    document.querySelectorAll("[data-cart-text]").forEach((el) => {
                        el.textContent =
                            cart.item_count === 1
                                ? window.cartStrings.item
                                : window.cartStrings.items;
                    });

                    document.dispatchEvent(
                        new CustomEvent("cart-update", { detail: cart })
                    );
                });
        }
    }

    // 暴露到全局
    window.updateSidebarCart = updateSidebarCart;

})(jQuery, window);
