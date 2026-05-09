let ROUTE_VARIANT_ID = '46654011736313';

// 监听购物车 DOM 变化
const cartSection = document.querySelector('[data-cart]');
if (cartSection) {
  const observer = new MutationObserver(() => {
    initCart()
    // syncRouteItem();
  });
  observer.observe(cartSection, { childList: true, subtree: true });
}

// // 监听删除操作
// $(document).on('click', '[data-cart-remove]', (event) => {
//   event.preventDefault();
//   event.stopPropagation();
//   const productId = $(event.currentTarget).attr('data-cart-remove-id')
//   const cartRouteProd = JSON.parse(document.getElementById('cart_items').textContent);

//   delete cartRouteProd[productId];
// })

// // 或在 section ajax 回调里直接调用 syncRouteItem()
// function syncRouteItem() {
//   fetch('/cart.js')
//     .then(res => res.json())
//     .then(cart => {
//       // 计算所有非 route 商品的总数量
//       const nonRouteTotal = cart.items.filter(item => String(item.variant_id) !== ROUTE_VARIANT_ID).length;

//       console.log('nonRouteTotal:', nonRouteTotal)
      
//       // 找到 route 商品（如存在）
//       const routeItem = cart.items.find(item => String(item.variant_id) === ROUTE_VARIANT_ID);

//       // 筛选想要运费险的商品
//       const cartRouteProd = JSON.parse(document.getElementById('cart_items').textContent)
      
//       const needRoutNum = Object.keys(cartRouteProd).filter(key => cartRouteProd[key].need_shipping_route === 'routeprod').map(key => cartRouteProd[key]);
      
//       // 情况1：非 route 商品全清空，且 route 存在，移除 route
//       if (nonRouteTotal === 0 && routeItem) {
//         fetch('/cart/change.js', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ id: ROUTE_VARIANT_ID, quantity: 0 }),
//         }).then(() => {
//           window.location.reload()
//         });
//       }
//       // 情况2：route 存在且数量和非 route 数量不一致，自动调整
//       else if (routeItem && routeItem.quantity !== needRoutNum.length) {

//         fetch('/cart/change.js', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ id: ROUTE_VARIANT_ID, quantity: needRoutNum.length }),
//         }).then(() => {
//           refreshCart(cart);
//           refreshHeaderCartItems(cart);
//         });
//       }
//     });
// }
// // 初始化的时候先调用一次购物车商品, 将商品与运费险匹配上
// syncRouteItem()

function refreshCart(cart) {
  const $sectionId = $('#main-cart-items').data('id');
  const $cart = $('[data-cart]')
  const $cartContent = $cart.find('[data-cart-content]');
  const $cartTotals = $cart.find('[data-cart-total]');
  const $cartLoading = '<div class="loading-overlay loading-overlay--custom">\
          <div class="loading-overlay__spinner">\
              <svg aria-hidden="true" focusable="false" role="presentation" class="spinner" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">\
                  <circle class="path" fill="none" stroke-width="6" cx="33" cy="33" r="30"></circle>\
              </svg>\
          </div>\
      </div>';
  const loadingClass = 'is-loading';

  
  $.ajax({
      type: 'GET',
      url: `/cart?section_id=${$sectionId}`,
      cache: false,
      success: function (data) {
          var jsPreventedData = data.replaceAll('cart-coupon-discount', 'div');
          var response = $(jsPreventedData);
  
          $cart.removeClass(loadingClass);
          $cart.find('.loading-overlay').remove();
  
          if(cart.item_count > 0){
              var contentCart =  response.find('[data-cart-content] .cart').html(),
                  subTotal = response.find('[data-cart-total] .cart-total-subtotal').html(),
                  grandTotal = response.find('[data-cart-total] .cart-total-grandtotal').html(),
                  savings = response.find('[data-cart-total] .cart-total-savings').html();
  
              $cartContent.find('.cart').html(contentCart);
              $cartTotals.find('.cart-total-subtotal').html(subTotal);
              $cartTotals.find('.cart-total-grandtotal').html(grandTotal);
              $cartTotals.find('.cart-total-savings').html(savings);
  
              if(response.find('.haloCalculatorShipping').length > 0){
                  var calculatorShipping = response.find('.haloCalculatorShipping');
  
                  $cart.find('.haloCalculatorShipping').replaceWith(calculatorShipping);
              }
          } else {
              var contentCart =  response.find('#main-cart-items').html(),
                  headerCart =  response.find('.page-header').html();
                  cartCountdownText1 = response.find('.cart-countdown').data('coundown-text-empty-1');
                  cartCountdownText2 = response.find('.cart-countdown').data('coundown-text-empty-2');
                  cartCountdownProductUrl = response.find('.cart-countdown').data('coundown-prd-empty-url');
                  cartCountdownProductTitle = response.find('.cart-countdown').data('coundown-prd-empty-title');
              var cartCountdownHtml = cartCountdownText1 + ' <a href="'+ cartCountdownProductUrl +'" class="cart-countdown-product link-effect p-relative"><span class="text">'+ cartCountdownProductTitle +'</span></a> ' + cartCountdownText2;
  
              $('#main-cart-items').html(contentCart);
              $('.page-header').html(headerCart);
              $('.cart-countdown .text-wrap').html(cartCountdownHtml);
          }
          
      },
      error: function (xhr, text) {
        showWarning($.parseJSON(xhr.responseText).description)
      },
      complete: function () {
        $('body').find('[data-cart-count]').text(cart.item_count)
        if (cart.item_count == 1){
            $('body').find('[data-cart-text]').text(window.cartStrings.item)
        } else {
            $('body').find('[data-cart-text]').text(window.cartStrings.items)
        }
      }
  });
}

// 报错提示
function showWarning(content, time = 2000) { // 设置默认时间
    // 如果有已存在的 timerId，先清除
    if (this.warningTimerId) {
        clearTimeout(this.warningTimerId);
    }

    this.warningPopupContent.textContent = content;
    document.body.classList.add('has-warning');
    
    if (time) {
        this.warningTimerId = setTimeout(() => {
            document.body.classList.remove('has-warning');
        }, time);
    }
}

// 刷新头部的购物车内容
function refreshHeaderCartItems(cart) {
    const sectionId = $('.header-nav-cart').data('section')
    $.ajax({
      type: "GET",
      url: `/cart?section_id=${sectionId}`,
      cache: false,
      success: function(data) {
        // 解析返回的 section HTML
        let response = $(data);
  
        // 提取新的商品列表块
        let newCartContent = response.find('.cart_doesnot_empty_cont').html();
        $('.cart_doesnot_empty_cont').html(newCartContent);
  
        // 刷新底部按钮和小计
        let newCartBottom = response.find('.cart_bottom_btns').html();
        $('.cart_bottom_btns').html(newCartBottom);
  
        // 检查是否已变为空购物车
        if(response.find('.cart_doesnot_empty').length === 0) {
          $('.cart_doesnot_empty').remove();
          $('.cart-container').addClass('cart-container-empty');
          $('.cart-container').append(response.find('.empty_cart'));
        }
        
      },
      error: function() {  },
      complete: function() {
        $('body').find('[data-cart-count]').text(cart.item_count)
        if (cart.item_count == 1){
            $('body').find('[data-cart-text]').text(window.cartStrings.item)
        } else {
            $('body').find('[data-cart-text]').text(window.cartStrings.items)
        }
      }
    })
}

function initCart() {
  fetch('/cart.js')
    .then(res => res.json())
    .then(cart => {
      // find route product
      const routeItem = cart.items.find(item => String(item.variant_id) === ROUTE_VARIANT_ID);
      if(routeItem) {
        fetch('/cart/change.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: ROUTE_VARIANT_ID,
            quantity: 0
          })
        })
          .then(response => response.json())
          .then(cart => {
            refreshCart(cart);
            refreshHeaderCartItems(cart);
          })
          .catch(err => console.error("Error removing item:", err));
      }
    })
}
// init
initCart()










