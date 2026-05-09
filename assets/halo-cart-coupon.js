$(document).ready(function(){
    // recommed products
    let cartRecommendSwiper = null;

    function initCartRecommendSwiper() {
        const el = document.querySelector('.cart-recommend-module .cart-recommend-lists');
        if (!el) return;

        if (cartRecommendSwiper) {
            cartRecommendSwiper.destroy(true, true);
            cartRecommendSwiper = null;
        }

        cartRecommendSwiper = new Swiper(el, {
            loop: true,
            grabCursor: true,
            simulateTouch: true,
            slidesPerView: 1.5,
            spaceBetween: 16,
            pagination: {
                el: '.cart-recommend-module .swiper-pagination',
                clickable: true,
            },
            breakpoints: { 
                320: {
                    slidesPerView: 1.2,
                },
                768: {
                    slidesPerView: 1.5,
                },
                992: {
                    slidesPerView: 1.5,
                }
            }
        });

    }

    function setupCartRecommendModule() {
        initCartRecommendSwiper();
    }

    // 首次
    $(document).ready(setupCartRecommendModule);

    // 每次 Cart AJAX 更新后
    document.addEventListener("cart-update", () => {
        requestAnimationFrame(setupCartRecommendModule);
    });

    document.addEventListener("click", async function(e) {
        // apply discount code
        const applybtn = e.target.closest(".cart_coupon_applybtn");

        if (applybtn){
            applybtn.classList.add("is-loading");

            const coupon_code = document.querySelector("#cart-coupon-code").value;
            const nowDiscount = document.querySelector("#now_coupon_used").value;
            const tipContain = document.querySelector(".cart_coupon_tip_box");
            tipContain.innerHTML = '';

            if (coupon_code === "") {
                tipContain.innerHTML = 'Enter a valid discount code';
                applybtn.classList.remove("is-loading");
                return;
            }


                         const API_VERSION = '2025-07';
    const GRAPHQL_URL = `/api/${API_VERSION}/graphql.json`;
    const STOREFRONT_TOKEN = '4335256c4579b074431a2f87c10d5e2c';
    const mutation = `
      mutation cartDiscountCodesUpdate($cartId: ID!, $discountCodes: [String!]) {
        cartDiscountCodesUpdate(cartId: $cartId, discountCodes: $discountCodes) {
          warnings {
            code
            message
          }
        }
      }
    `;

    let discount = nowDiscount ? nowDiscount + "," + coupon_code : coupon_code;
    Shopify.getCart(async (cartTotal) => {
      try {
        const token = cartTotal.token;

        const variables = {
          cartId: `gid://shopify/Cart/${token}`,
          discountCodes: discount.split(",")
        };

        const res = await fetch(GRAPHQL_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN
          },
          body: JSON.stringify({ query: mutation, variables })
        }).then(r => r.json());

        console.log("graphql res", res);

        if (res.errors?.length) {
          console.error("GraphQL errors:", res.errors);
          return;
        }

        const payload = res.data?.cartDiscountCodesUpdate;
        if (!payload) {
          console.error("No cartDiscountCodesUpdate in response:", res);
          return;
        }

        const warnings = payload.warnings || [];

        if (warnings.length) {
          if (warnings[0].code === 'DISCOUNT_NOT_FOUND' || warnings[0].code === 'DISCOUNT_CURRENTLY_INACTIVE') {
            tipContain.innerHTML = warnings[0].message;
          } else {
            tipContain.innerHTML = 'A higher-value automatic discount is already applied. Discount codes cannot be combined.'
          }
          console.warn("warnings:", warnings);
          return;
        }

        // 成功后再继续你的 cart/update.js
                    const body = JSON.stringify({
                discount: nowDiscount ? nowDiscount + "," + coupon_code : coupon_code,
                sections_url: window.location.pathname,
            });

            fetch(window.Shopify.routes.root + 'cart/update.js', { ...fetchConfig(), body })
                .then((response) => response.text())
                .then((state) => {
                    const parsedState = JSON.parse(state);
                    
                    const currentCodeObj = parsedState.discount_codes.find(
                        codeObj => codeObj.code.toLowerCase() === coupon_code.toLowerCase()
                    );

                    if (!currentCodeObj || !currentCodeObj.applicable) {
                        tipContain.innerHTML = `${coupon_code} couldn’t be used with your existing discounts.`;
                        return;
                    }
                
                    window.updateSidebarCart(parsedState);
                })
                .finally(() => {
                    applybtn.classList.remove("is-loading");
                });
      } catch (e) {
        console.error(e);
      } finally {
        applybtn.classList.remove("is-loading");
      }
    });
        } 

    
        // delete discount code
        const deleteBtn = e.target.closest(".delete_discount_icon");

        if (deleteBtn) {
            const coupon_code = deleteBtn.closest(".cart_coupon_contain_item").getAttribute("data-value")
            const input = document.querySelector("#now_coupon_used");
            const discountArr = (input.value || "").split(",").map(code => code.trim()).filter(Boolean);
            const newArr = discountArr.filter(code => code !== coupon_code);
            input.value = newArr.join(",");

            const body = JSON.stringify({
                discount: input.value,
                sections_url: window.location.pathname,
            });

            fetch(window.Shopify.routes.root + 'cart/update.js', { ...fetchConfig(), ...{ body } })
                .then((response) => {
                    return response.text()}
                )
                .then((state) => {
                    const parsedState = JSON.parse(state);
                    window.updateSidebarCart(parsedState);
                })
                .catch(() => { })
                .finally(() => { });
        }

        // atc
        const atcBtn = e.target.closest(".cart-recommend-module .recommend-add");
        if (atcBtn) {
            const id = atcBtn.dataset.variant;
            atcBtn.classList.add('is-loading')

            fetch(window.Shopify.routes.root + 'cart/add.js', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, quantity: 1 })
            })
            .then(r => r.json())
            .then(cart => {
                Shopify.getCart((cartTotal) => {
                    $('[data-cart-count]').text(cartTotal.item_count)
                    window.updateSidebarCart(cartTotal) 

                });

            });
        }

        // pre page
        const preBtn = e.target.closest(".cart-recommend-module .custom-pagina .pre-pagination")
        if(preBtn){
            cartRecommendSwiper.slidePrev()
        }

        // next page
        const nextBtn = e.target.closest(".cart-recommend-module .custom-pagina .next-pagination")
        if(nextBtn){
            cartRecommendSwiper.slideNext()
        }

    });


});