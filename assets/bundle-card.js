document.querySelectorAll(".bundle_card").forEach(item => {
  const modal_btn = item.querySelector(".bundle_card_btn")
  const modal_btn_two = item.querySelector(".bundle_card_bundlelist_text")
  const modal = item.nextElementSibling;

  // modal_btn.addEventListener("click", () => {
  //   openModal()
  // })
  // modal_btn_two.addEventListener("click", () => {
  //   openModal()
  // })
  item.addEventListener("click", () => {
    openModal()
  })
  
  function openModal() {
    const originalParent = modal.parentElement;
    const nextSibling = modal.nextElementSibling;
    document.body.appendChild(modal);
    modal.style.display = 'block';
    document.body.classList.add("bundle_card_modals_show")

    modal.querySelector('.bundle_card_modal_close').addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal.querySelector(".bundle_card_modal_mask")) closeModal();
    });
  }

  function closeModal() {
    const originalParent = modal.parentElement;
    const nextSibling = modal.nextElementSibling;
    modal.style.display = 'none';
    document.body.classList.remove("bundle_card_modals_show")

    if (nextSibling) {
      originalParent.insertBefore(modal, nextSibling);
    } else {
      originalParent.appendChild(modal);
    }
  }

  const bundle_prodcuts = modal.querySelectorAll(".bundle_card_modal_product")

  bundle_prodcuts.forEach(item => {
    const type = item.getAttribute("data-type")
    const img = item.querySelector(".bundle_card_modal_product_img")
    const product_data = JSON.parse(
      item.querySelector('.bundle_card_modal_product_data').textContent
    );
    const product = product_data.product
    const currency_symbol = product_data.symbol
    let variant
    const option_selects = item.querySelectorAll(".bundle_card_modal_product_option_item")

    option_selects.forEach(select => {
      select.addEventListener("click", () => {
        if (select.classList.contains("bundle_card_modal_product_option_item_active") || select.classList.contains("bundle_card_modal_product_option_item_diasbled")) return
        const select_parent = select.closest(".bundle_card_modal_product_option")
        const select_title = select_parent.querySelector(".bundle_card_modal_product_option_text span")
        select_parent.querySelector(".bundle_card_modal_product_option_item_active").classList.remove("bundle_card_modal_product_option_item_active")
        select.classList.add("bundle_card_modal_product_option_item_active")
        if (type === "chairs") {
          const color = select.getAttribute("data-color")
          const material = select.getAttribute("data-material")
          variant = product.variants.find(variant => variant.option1 === material && variant.option2 === color)
          select_title.innerHTML = color + " - " + material
          changePriceShow(type, item, variant, currency_symbol)
        }
        if (type === "accessories") {
          const color = select.getAttribute("data-color")
          variant = product.variants.find(variant => variant.option1 === color)
          select_title.innerHTML = color
        }
        if (type === "desk") {
          const select_type = select_parent.getAttribute("data-type")
          const value = select.getAttribute("data-value")
          select_title.innerHTML = select_type === "Color" ? value : value + " " + select.getAttribute("data-size").replaceAll('/', '"')
          if (select_type === "Color") {
            const variants = product.variants.filter(variant => variant.option1 === value && variant.available)
            const size_selects = item.querySelectorAll(".bundle_card_modal_product_option[data-type='Size'] .bundle_card_modal_product_option_item")
            size_selects.forEach(size_select => {
              size_select.classList.remove("bundle_card_modal_product_option_item_diasbled")
              const size_value = size_select.getAttribute("data-value")
              if (!variants.find(variant => variant.option2 === size_value)) {
                size_select.classList.add("bundle_card_modal_product_option_item_diasbled")
              }
            })
            const active_size = item.querySelector(".bundle_card_modal_product_option[data-type='Size'] .bundle_card_modal_product_option_item_active").getAttribute("data-value")
            variant = variants.find(variant => variant.option2 === active_size)
            if (!variant) {
              variant = variants[0]
              size_selects.forEach(size_select => {
                size_select.classList.remove("bundle_card_modal_product_option_item_active")
                const size_value = size_select.getAttribute("data-value")
                if (size_value === variant.option2) {
                  size_select.classList.add("bundle_card_modal_product_option_item_active")
                  item.querySelector(".bundle_card_modal_product_option[data-type='Size'] .bundle_card_modal_product_option_text span").innerHTML = size_value + " " + size_select.getAttribute("data-size").replaceAll('/', '"')
                }
              })
            }

          }
          if (select_type === "Size") {
            const active_color = item.querySelector(".bundle_card_modal_product_option[data-type='Color'] .bundle_card_modal_product_option_item_active").getAttribute("data-value")
            variant = product.variants.find(variant => variant.option1 === active_color && variant.option2 === value)
          }
          changePriceShow(type, item, variant, currency_symbol)
        }
        img.src = variant.featured_image.src
        item.setAttribute("data-id", variant.id)
      })
    })
  })

  function changePriceShow(type, item, variant, currency_symbol) {
    const product_price = item.querySelector(".bundle_card_modal_product_price")
    const product_price_op_el = product_price.querySelector(".bundle_card_modal_product_price_op")
    const bundle_save = item.closest(".bundle_card_modal").querySelector(".bundle_card_modal_salebox_list_price")
    const total_save = item.closest(".bundle_card_modal").querySelector(".bundle_card_modal_saletotal_save")
    const product_price_op = priceToCents(product_price.querySelector(".bundle_card_modal_product_price_op").innerHTML)
    if (type === "chairs") {
      // if (variant.option2 === "Camo") {
      //   product_price.innerHTML = `${currency_symbol}${(variant.price - 0) / 100} <span class="bundle_card_modal_product_price_op hidden">${currency_symbol}${(variant.price) / 100}</span>`
      //   if (!product_price_op_el.classList.contains("hidden")) {
      //     bundle_save.innerHTML = formatPrice(priceToCents(bundle_save.innerHTML) - 7000, currency_symbol)
      //     total_save.innerHTML = formatPrice(priceToCents(total_save.innerHTML) - 7000, currency_symbol)
      //   }
      // } else {
        product_price.innerHTML = `${currency_symbol}${(variant.price - 11000) / 100} <span class="bundle_card_modal_product_price_op">${currency_symbol}${(variant.price) / 100}</span>`
        if (product_price_op_el.classList.contains("hidden")) {
          bundle_save.innerHTML = formatPrice(priceToCents(bundle_save.innerHTML) + 11000, currency_symbol)
          total_save.innerHTML = formatPrice(priceToCents(total_save.innerHTML) + 11000, currency_symbol)
        }
      // }
    }
    if (type === "desk") {
      // if (variant.option2 === "Large" || variant.option2 === "Small") {
      //   product_price.innerHTML = `${currency_symbol}${(variant.price - 14000) / 100} <span class="bundle_card_modal_product_price_op">${currency_symbol}${(variant.price) / 100}</span>`
      //   if (product_price_op_el.classList.contains("hidden")) {
      //     bundle_save.innerHTML = formatPrice(priceToCents(bundle_save.innerHTML) + 14000, currency_symbol)
      //     total_save.innerHTML = formatPrice(priceToCents(total_save.innerHTML) + 14000, currency_symbol)
      //   }
      // } else {
      //   product_price.innerHTML = `${currency_symbol}${(variant.price - 0) / 100} <span class="bundle_card_modal_product_price_op hidden">${currency_symbol}${(variant.price) / 100}</span>`
      //   if (!product_price_op_el.classList.contains("hidden")) {
      //     bundle_save.innerHTML = formatPrice(priceToCents(bundle_save.innerHTML) - 14000, currency_symbol)
      //     total_save.innerHTML = formatPrice(priceToCents(total_save.innerHTML) - 14000, currency_symbol)
      //   }
      // }
      product_price.innerHTML = `${currency_symbol}${(variant.price - 18000) / 100} <span class="bundle_card_modal_product_price_op">${currency_symbol}${(variant.price) / 100}</span>`
      if (product_price_op_el.classList.contains("hidden")) {
        bundle_save.innerHTML = formatPrice(priceToCents(bundle_save.innerHTML) + 18000, currency_symbol)
        total_save.innerHTML = formatPrice(priceToCents(total_save.innerHTML) + 18000, currency_symbol)
      }
    }
    const bundle_price = item.closest(".bundle_card_modal").querySelector(".bundle_card_modal_saletotal_text")
    const saletotal_dp = priceToCents(bundle_price.querySelector(".bundle_card_modal_saletotal_dp").innerHTML)
    const saletotal_op = priceToCents(bundle_price.querySelector(".bundle_card_modal_saletotal_op").innerHTML.replace(/[^0-9,.]/g, ""))
    // bundle_price.innerHTML =
    //   `<span class="bundle_card_modal_saletotal_op">Was ${formatPrice((saletotal_op - product_price_op + variant.price), currency_symbol)}</span>
    //   <span class="bundle_card_modal_saletotal_dp">${formatPrice((saletotal_dp - product_price_op + variant.price), currency_symbol)}</span>
    //   `
    bundle_price.innerHTML =
      `<span class="bundle_card_modal_saletotal_op">Was ${formatPrice((saletotal_op - product_price_op + variant.price), currency_symbol)}</span>
      <span class="bundle_card_modal_saletotal_dp">${formatPrice((saletotal_op - product_price_op + variant.price - priceToCents(total_save.innerHTML)), currency_symbol)}</span>
      `
  }

  // 价格格式化
  function priceToCents(priceStr) {
    if (!priceStr) return 0;

    let clean = priceStr.replace(/[\p{Sc}\s]/gu, '');

    const hasCommaDecimal = /,\d{1,2}$/.test(clean);
    if (hasCommaDecimal) {
      clean = clean.replace(/\./g, '').replace(',', '.');
    } else {
      const dot3Match = /\.\d{3}$/.test(clean) && !/,/.test(clean);
      if (dot3Match) {
        clean = clean.replace(/\./g, '');
      } else {
        clean = clean.replace(/,/g, '');
      }
    }

    const num = parseFloat(clean);
    if (isNaN(num)) return 0;

    return Math.round(num * 100);
  }

  function formatPrice(cents, symbol = '$') {
    if (typeof cents !== 'number' || isNaN(cents)) return '';

    const amount = cents / 100;

    const map = {
      '$': { locale: 'en-US', currency: 'USD' },
      '€': { locale: 'de-DE', currency: 'EUR' },
      '£': { locale: 'en-GB', currency: 'GBP' },
    };

    const { locale, currency } = map[symbol] || map['$'];

    // 使用 Intl 格式化
    let formatted = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);

    // 把货币符号去掉再手动放前面
    formatted = formatted.replace(/[^\d.,\s]+/g, '').trim();

    // 手动加货币符号在前
    return symbol + formatted;
  }

  const addBundleToCartBtn = modal.querySelector(".bundle_card_modal_btn")
  addBundleToCartBtn.addEventListener("click", async () => {
    const cartIcon = document.querySelector(".header--cart .header__icon--cart");
    let cartFormData = { items: [] };
    modal.querySelectorAll(".bundle_card_modal_product").forEach(item => {
      cartFormData.items.push({ id: item.getAttribute("data-id"), quantity: 1 })
    })
    modal.querySelectorAll(".bundle_card_modal_freebox_item").forEach(item => {
      cartFormData.items.push({ id: item.getAttribute("data-id"), quantity: 1 })
    })
    addBundleToCartBtn.classList.add("is_loading");
    try {
      await fetch(window.Shopify.routes.root + "cart/add.js", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cartFormData),
      });

      Shopify.getCart((cartTotal) => {
        document.body.classList.add("cart-sidebar-show");
        updateSidebarCart(cartTotal);
      });
    } finally {
      addBundleToCartBtn.classList.remove("is_loading");
      closeModal()
      setTimeout(() => cartIcon?.click(), 0);
    }
  })
})

