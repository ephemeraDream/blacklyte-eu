(() => {
  jQuery(function ($) {
    $(document).ready(function () {
      $('.recommend_products_contain').slick({
        slidesToShow: 4,
        nextArrow: $('.recommend_products_next'),
        prevArrow: $('.recommend_products_prev'),
        responsive: [
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 2,
            }
          }
        ]
      });

      document.querySelectorAll(".recommend_products_item").forEach(products_item => {
        products_item.addEventListener("click", () => {
          // $(products_item).find('.recommend_products_modal_swiper').not('.slick-initialized').slick({
          //   nextArrow: $('.recommend_products_modal_next'),
          //   prevArrow: $('.recommend_products_modal_prev'),
          //   dots: true,
          // });
          // const modal = products_item.querySelector(".recommend_products_modal")
          // const originalParent = modal.parentElement;
          // const nextSibling = modal.nextElementSibling;
          // document.body.appendChild(modal);
          // modal.style.display = "flex";
          // document.body.style.overflowY = "hidden";
          // window.currentOpenedModal = modal;
          // modal.querySelector(".recommend_products_modal_close").addEventListener("click", closeModal);

          // modal.addEventListener("click", (e) => {
          //   if (e.target === modal) closeModal();
          // });

          // function closeModal() {
          //   modal.style.display = "none";
          //   document.body.style.overflowY = "auto";

          //   if (nextSibling) {
          //     originalParent.insertBefore(modal, nextSibling);
          //   } else {
          //     originalParent.appendChild(modal);
          //   }

          //   window.currentOpenedModal = null;
          // }
        })

        const quantityBindPrice = (quantity) => {
          const $modal = $(window.currentOpenedModal);
          const $discountPriceNode = $modal.find('.recommend_products_item_price_dp');
          const $opNode = $modal.find('.recommend_products_item_price_op');
          const currency_symbol = $("input[name='currency_symbol']").val();

          if ($discountPriceNode.length) {
            const discountPrice = parseLocalizedNumber($opNode.attr("data-value")) - parseLocalizedNumber($discountPriceNode.attr("data-value"));
            const updateDiscountPrice = discountPrice * Number(quantity);

            $discountPriceNode.html(currency_symbol + updateDiscountPrice);
          }

          const opPrice = safeMul(parseLocalizedNumber($opNode.attr("data-value")), Number(quantity));
          $opNode.html(currency_symbol + opPrice);
        };
        const quantityInput = products_item.querySelector(".recommend_products_modal_quantity_input")

        const data = JSON.parse(
          products_item.querySelector('.recommend_products_item_data').textContent
        );
        const option_selects = products_item.querySelectorAll('.recommend_products_modal_select_contain');
        option_selects.forEach((option_select, i) => {
          const index = option_select.getAttribute('data-index');
          const select = option_select.querySelector('.recommend_products_modal_select_itembox');
          const other_options = Array.from(option_selects).filter((_, j) => j !== i);
          select.querySelectorAll('.recommend_products_modal_select_itembox_item').forEach(el => {
            el.addEventListener('click', (e) => {
              const value = el.getAttribute("value");
              select.querySelector(".recommend_products_modal_select_itembox_item[selected]").removeAttribute("selected")
              el.setAttribute("selected", true)
              const initialVariants = data.filter(
                (item) => item.variant[`option${index}`] == value && item.variant.available
              );
              let matchedVariants = [...initialVariants];
              if (matchedVariants.length > 1 && other_options.length) {
                other_options.forEach((other_option) => {
                  const other_index = other_option.getAttribute('data-index');
                  const other_value = other_option.querySelector('.recommend_products_modal_select_itembox_item[selected]').getAttribute("value");

                  if (other_value) {
                    matchedVariants = matchedVariants.filter((item) => item.variant[`option${other_index}`] == other_value);
                  }
                });

                if (matchedVariants.length === 0) {
                  matchedVariants = initialVariants;
                }
              }
              const matchedVariant = matchedVariants[0];
              if (matchedVariant) {
                const $swiper = $(window.currentOpenedModal).find('.recommend_products_modal_swiper');
                if ($swiper.hasClass('slick-initialized')) {
                  $swiper.slick('unslick');
                }
                $swiper.empty();
                matchedVariant.multiple_images.forEach((img) => {
                  $swiper.append(`
                     <img src="${img}" alt="${matchedVariant.variant.title}" class="recommend_products_modal_left_img" />
                  `);
                });
                $swiper.slick({
                  nextArrow: $('.recommend_products_modal_next'),
                  prevArrow: $('.recommend_products_modal_prev'),
                  dots: true,
                });
                products_item.querySelector('.recommend_products_item_img img').src =
                  matchedVariant.variant.featured_image.src;
                products_item.setAttribute('data-id', matchedVariant.variant.id);
                other_options.forEach((item) => {
                  const item_index = item.getAttribute('data-index');
                  const item_select = item.querySelector('.recommend_products_modal_select_itembox');
                  const item_select_value = item_select.querySelector(".recommend_products_modal_select_itembox_item[selected]").getAttribute("value");

                  const newValue = matchedVariant.variant[`option${item_index}`];
                  if (item_select_value !== newValue) {
                    item_select.querySelector(".recommend_products_modal_select_itembox_item[selected]").removeAttribute("selected")
                    item_select.querySelector(`.recommend_products_modal_select_itembox_item[value="${newValue}"]`).setAttribute("selected", true)
                  }
                });
                const discount_price = products_item.querySelector('.recommend_products_item_price_dp');
                const origin_price = products_item.querySelector('.recommend_products_item_price_op');
                origin_price.innerHTML = moneyWithoutTrailingZeros(matchedVariant.variant.price, matchedVariant.symbol);
                origin_price.setAttribute('data-value', (matchedVariant.variant.price / 100).toFixed(2));
                // $(window.currentOpenedModal).find('.recommend_products_item_price_op').html(moneyWithoutTrailingZeros(matchedVariant.variant.price, matchedVariant.symbol));
                $(window.currentOpenedModal).find('.recommend_products_item_price_op').attr('data-value', (matchedVariant.variant.price / 100).toFixed(2));
                if (matchedVariant.discount) {
                  discount_price.classList.add('show');
                  const discountPrice = origin_price.getAttribute('data-value') * 100 - matchedVariant.discount;
                  discount_price.innerHTML = moneyWithoutTrailingZeros(discountPrice, matchedVariant.symbol);
                  discount_price.setAttribute('data-value', (matchedVariant.discount / 100).toFixed(2));
                  // $(window.currentOpenedModal).find('.recommend_products_item_price_dp').html(moneyWithoutTrailingZeros(discountPrice, matchedVariant.symbol));
                  $(window.currentOpenedModal).find('.recommend_products_item_price_dp').attr('data-value', (matchedVariant.discount / 100).toFixed(2));
                } else {
                  discount_price.classList.remove('show');
                }
                quantityBindPrice(quantityInput.value)
              }
            });
          })
        });

        products_item.querySelectorAll(".recommend_products_modal_quantity_btn").forEach((btn) => {
          btn.addEventListener("click", (event) => {
            const type = btn.getAttribute("data-type");
            const quantity = Number(quantityInput.value)
            if (type === "minus" && quantity > 1) {
              quantityInput.value = quantity - 1
            }
            if (type === "plus" && quantity < 20) {
              quantityInput.value = quantity + 1
            }
            quantityBindPrice(quantityInput.value)
          });
        });
        if (quantityInput) {
          quantityInput.addEventListener("input", function (event) {
            let value = quantityInput.value.replace(/\D/g, "");
            if (value === "") {
              quantityInput.value = value;
              return;
            }

            value = Math.max(1, Math.min(20, parseInt(value, 10)));
            quantityInput.value = value;

            quantityBindPrice(value)
          });

          quantityInput.addEventListener('blur', function () {
            let value = quantityInput.value.replace(/\D/g, "");
            if (value == '') {
              quantityInput.value = 1;
              quantityBindPrice(1)
            }
          });
        }

        const butBtn = products_item.querySelector(".recommend_products_modal_btn")
        butBtn.addEventListener("click", async () => {
          const cartIcon = document.querySelector(".header--cart .header__icon--cart");
          const goods_id = products_item.dataset.id
          const cartFormData = { items: [{ id: goods_id, quantity: Number(quantityInput.value) }] };
          butBtn.classList.add("is_loading");
          try {
            await fetch(window.Shopify.routes.root + "cart/add.js", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(cartFormData),
            });

            // Shopify.getCart((cartTotal) => {
            //   document.body.classList.add("cart-sidebar-show");
            //   updateSidebarCart(cartTotal);
            // });
          } finally {
            butBtn.classList.remove("is_loading");
            setTimeout(() => cartIcon?.click(), 0);
          }
        })
      })

      function moneyWithoutTrailingZeros(cents, currencySymbol = '$') {
        const amount = cents / 100;
        const formatted = amount.toFixed(2);
        const final = formatted.replace(/\.0+$/, '').replace(/(\.\d*[1-9])0+$/, '$1');
        return `${currencySymbol}${final}`;
      }

      function safeMul(a, b) {
        const { integer: intA, scale: scaleA } = toInteger(a);
        const { integer: intB, scale: scaleB } = toInteger(b);
        return (intA * intB) / (scaleA * scaleB);
      }

      function parseLocalizedNumber(str) {
        if (typeof str !== 'string') return NaN;
        const hasComma = str.includes(',');
        const hasDot = str.includes('.');

        if (hasComma && hasDot) {
          if (str.lastIndexOf(',') > str.lastIndexOf('.')) {
            return parseFloat(str.replace(/\./g, '').replace(',', '.'));
          } else {
            return parseFloat(str.replace(/,/g, ''));
          }
        }

        if (hasComma) return parseFloat(str.replace(',', '.'));

        return parseFloat(str);
      }
    });
  });
})();