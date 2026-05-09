$(document).ready(function(){
    document.addEventListener("click", async function(e) {
        // apply discount code
        const applybtn = e.target.closest(".cart-sticky-module .cart_coupon_applybtn");

        if (applybtn){
            applybtn.classList.add("is-loading")

            const coupon_code = document.querySelector("#cart-coupon-code-input").value;
            const nowDiscount = document.querySelector(".cart-sticky-module #now_coupon_used").value;
            const tipContain = document.querySelector(".cart-sticky-module .cart_coupon_tip_box");

            tipContain.innerHTML = '';

            if (coupon_code === "") {
                tipContain.innerHTML = 'Enter a valid discount code';
                applybtn.classList.remove("is-loading")
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
          applybtn.classList.remove("is-loading")
          return;
        }

        const payload = res.data?.cartDiscountCodesUpdate;
        if (!payload) {
          console.error("No cartDiscountCodesUpdate in response:", res);
          applybtn.classList.remove("is-loading")
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
          applybtn.classList.remove("is-loading")
          return;
        }

        // 成功后再继续你的 cart/update.js
        const body = JSON.stringify({
                discount: nowDiscount ? nowDiscount + "," + coupon_code : coupon_code,
                sections: $('#main-cart-items').data('id'),
                sections_url: window.location.pathname
            });

            fetch(window.Shopify.routes.root + 'cart/update.js', { ...fetchConfig(), ...{ body } })
                .then((response) => {
                    return response.json();
                })
                .then((parsedState) => {
                    applybtn.classList.remove("is-loading")
                    const sectionID = $('#main-cart-items').data('id')
                    const sectionHtml = parsedState.sections[sectionID];
                    const newDoc = new DOMParser().parseFromString(sectionHtml, 'text/html');
                    let canUpdate = true;
                    
                    parsedState.discount_codes.forEach(codeObj => {
                        if (!codeObj.applicable) {
                            tipContain.innerHTML = `${codeObj.code} couldn’t be used with your existing discounts.`;
                            canUpdate = false;
                        }
                    });

                    if(canUpdate){
                        document.querySelector('#main-cart-items #cart_list_container').innerHTML = newDoc.querySelector('#main-cart-items #cart_list_container').innerHTML
                        document.querySelector('#main-cart-items #cart_subtotal_container').innerHTML = newDoc.querySelector('#main-cart-items #cart_subtotal_container').innerHTML
                        document.querySelector('#main-cart-items .cart_coupon_contain_box').innerHTML = newDoc.querySelector('#main-cart-items .cart_coupon_contain_box').innerHTML
                        document.querySelector('#main-cart-items .cart-discount.cart-total-savings').innerHTML = newDoc.querySelector('#main-cart-items .cart-discount.cart-total-savings').innerHTML
                        document.querySelector('#main-cart-items .cart-code-discount-item').innerHTML = newDoc.querySelector('#main-cart-items .cart-code-discount-item').innerHTML
                        document.querySelector('#main-cart-items .cart-total.cart-total-grandtotal').innerHTML = newDoc.querySelector('#main-cart-items .cart-total.cart-total-grandtotal').innerHTML

                        document.querySelector('.cart-sticky-module .cart-sticky-info').innerHTML = newDoc.querySelector('.cart-sticky-module .cart-sticky-info').innerHTML

                        if(window.bindDiscountDelete){
                            window.bindDiscountDelete()
                        }

                    }
                    

                })
                .catch(() => { })
                .finally(() => {
                    applybtn.classList.remove("is_loading")
                });
      } catch (e) {
        console.error(e);
      } finally {
        applybtn.classList.remove("is_loading");
      }
    });
        }

        // delete discount code
        const deleteBtn = e.target.closest(".cart-sticky-module .delete_discount_icon");

        if (deleteBtn) {
            const coupon_code = deleteBtn.closest(".cart-sticky-module .cart_coupon_contain_item").getAttribute("data-value")
            const input = document.querySelector(".cart-sticky-module #now_coupon_used");
            const discountArr = (input.value || "").split(",").map(code => code.trim()).filter(Boolean);
            const newArr = discountArr.filter(code => code !== coupon_code);
            input.value = newArr.join(",");

            const body = JSON.stringify({
                discount: input.value,
                sections: $('#main-cart-items').data('id'),
                sections_url: window.location.pathname,
            });

            fetch(window.Shopify.routes.root + 'cart/update.js', { ...fetchConfig(), ...{ body } })
                .then((response) => {
                    return response.json()}
                )
                .then((parsedState) => {
                    const sectionID = $('#main-cart-items').data('id')
                    const sectionHtml = parsedState.sections[sectionID];
                    const newDoc = new DOMParser().parseFromString(sectionHtml, 'text/html');

                    document.querySelector('#main-cart-items #cart_list_container').innerHTML = newDoc.querySelector('#main-cart-items #cart_list_container').innerHTML
                    document.querySelector('#main-cart-items #cart_subtotal_container').innerHTML = newDoc.querySelector('#main-cart-items #cart_subtotal_container').innerHTML
                    document.querySelector('#main-cart-items .cart_coupon_contain_box').innerHTML = newDoc.querySelector('#main-cart-items .cart_coupon_contain_box').innerHTML
                    document.querySelector('#main-cart-items .cart-discount.cart-total-savings').innerHTML = newDoc.querySelector('#main-cart-items .cart-discount.cart-total-savings').innerHTML
                    document.querySelector('#main-cart-items .cart-code-discount-item').innerHTML = newDoc.querySelector('#main-cart-items .cart-code-discount-item').innerHTML
                    document.querySelector('#main-cart-items .cart-total.cart-total-grandtotal').innerHTML = newDoc.querySelector('#main-cart-items .cart-total.cart-total-grandtotal').innerHTML

                    document.querySelector('.cart-sticky-module .cart-sticky-info').innerHTML = newDoc.querySelector('.cart-sticky-module .cart-sticky-info').innerHTML

                    if(window.bindDiscountDelete){
                        window.bindDiscountDelete()
                    }

                })
                .catch(() => { })
                .finally(() => { });
        }

        // open modal
        const openModlBtn = e.target.closest(".cart-sticky-module .cart-total.cart-total-grandtotal .cart-total-value");
        const stickyModuleDom = document.querySelector(".cart-sticky-module")
        

        if(openModlBtn){
            stickyModuleDom.classList.add("cart-sticky-module-open")
            document.querySelector('body').classList.add('cart-mask-open')
            
        }

        // close modal
        const closeModal = e.target.closest(".cart-sticky-module .cart-sticky-info .head-cont-title .icon")

        if(closeModal){
            stickyModuleDom.classList.remove("cart-sticky-module-open")
            document.querySelector('body').classList.remove('cart-mask-open')

        }

        // click overlay
        const overlay = e.target.closest('.cart-sticky-module.cart-sticky-module-open');
        
        if (overlay) {
            if (!e.target.closest('.cart-sticky-info')) {
                stickyModuleDom.classList.remove("cart-sticky-module-open")
                document.querySelector('body').classList.remove('cart-mask-open')

            }
        }

    })

})



document.addEventListener('DOMContentLoaded', function() {
    const summaryElement = document.querySelector('.cart-content-item.cart-total .cart--totals-title');
    const stickyModule = document.querySelector('.cart-sticky-module');

    if (!summaryElement || !stickyModule) return;

    const toggleStickyVisibility = (shouldHide) => {
        if (shouldHide) {
            stickyModule.style.opacity = '0';
            stickyModule.style.pointerEvents = 'none';
            stickyModule.style.visibility = 'hidden';
        } else {
            stickyModule.style.opacity = '1';
            stickyModule.style.pointerEvents = 'auto';
            stickyModule.style.visibility = 'visible';
        }
    };

    // --- 核心逻辑：精准距离控制 ---
    const observerOptions = {
        root: null,
        rootMargin: '100px 0px -150px 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            toggleStickyVisibility(entry.isIntersecting);
        });
    }, observerOptions);

    // 初始化检测
    const checkInitialPosition = () => {
        const rect = summaryElement.getBoundingClientRect();
        const isVisible = rect.top < (window.innerHeight - 150) && rect.bottom > 150;
        toggleStickyVisibility(isVisible);
    };

    checkInitialPosition();
    observer.observe(summaryElement);
});


