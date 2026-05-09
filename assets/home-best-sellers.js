$(function () {

  const $section = $('.home_besetsells_collection');
  const $reviewsList = $section.find('.review-list');
  const $prevBtn = $section.find('.pre-btn-icon');
  const $nextBtn = $section.find('.next-btn-icon');
  const $moreLink = $section.find('.target-cont-link');

  let seller_swiper = null;
  let SLIDE_MAP = {};

  $reviewsList.find('.swiper-slide').each(function () {
    const key = this.dataset.targetKey;
    if (!SLIDE_MAP[key]) SLIDE_MAP[key] = [];
    SLIDE_MAP[key].push(this.outerHTML);
  });


  function initSwiper() {
    seller_swiper = new Swiper('.home_besetsells_collection .review-list', {
      loop: false,
      grabCursor: true,
      slidesPerView: 3.8,
      spaceBetween: 18,
      pagination: {
        el: '.home_besetsells_collection .swiper-pagination',
        clickable: true,
      },
      breakpoints: {
        320: { slidesPerView: 1.5, spaceBetween: 10 },
        768: { slidesPerView: 1.5, spaceBetween: 10 },
        992: { slidesPerView: 3.8 },
        1400: { slidesPerView: 4 }
      },
      on: {
        init: function () {
          toggleButtons(this);
        },
        slideChange: function () {
          toggleButtons(this);
        },
      }
    });
  }

 
  function toggleButtons(swiper) {
    const isMob = window.innerWidth <= 768;
    
    const showPrev = !swiper.isBeginning;
    const showNext = !swiper.isEnd;

    if (isMob) {
      $prevBtn.css({ 'opacity': showPrev ? '1' : '0', 'pointer-events': showPrev ? 'auto' : 'none' });
      $nextBtn.css({ 'opacity': showNext ? '1' : '0', 'pointer-events': showNext ? 'auto' : 'none' });
    } else {
      // PC端：默认设为0，等待 mousemove 触发，但要受首尾限制
      // 保持你原来的逻辑，但需要结合下面的mousemove修改
    }
  }


  function switchCategory(type) {
    if (!seller_swiper || !SLIDE_MAP[type]) return;
    seller_swiper.removeAllSlides();
    seller_swiper.appendSlide(SLIDE_MAP[type]);
    seller_swiper.update();
    seller_swiper.slideTo(0, 0);
    toggleButtons(seller_swiper); // <-- 新增：强制同步按钮状态
  }


  let hoverRAF = null;
  $reviewsList.on('mousemove', function (e) {
    if (window.innerWidth <= 768) return;

    cancelAnimationFrame(hoverRAF);
    hoverRAF = requestAnimationFrame(() => {
      const rect = this.getBoundingClientRect();
      const mid = rect.left + rect.width / 2;
      
      // 只有不在第一页时，左侧移动才显示 prev
      $prevBtn.css('opacity', (e.clientX < mid && !seller_swiper.isBeginning) ? 1 : 0);
      // 只有不在最后一页时，右侧移动才显示 next
      $nextBtn.css('opacity', (e.clientX >= mid && !seller_swiper.isEnd) ? 1 : 0);
    });
  });

  $section.on('mouseleave', () => {
    $prevBtn.css('opacity', 0);
    $nextBtn.css('opacity', 0);
  });


  $prevBtn.on('click', () => seller_swiper?.slidePrev());
  $nextBtn.on('click', () => seller_swiper?.slideNext());


  $section.on('click', '.target-item', function () {
    const $item = $(this);
    const type = $item.find('.target-item-title').data('target-key');
    const url = $item.data('target-url');

    $item.addClass('target-item-active')
         .siblings().removeClass('target-item-active');

    if (url) {
      $moreLink.attr('href', url).removeAttr('aria-disabled');
    } else {
      $moreLink.removeAttr('href').attr('aria-disabled', 'true');
    }

    switchCategory(type);
  });


  $section.on('click', '.info-footer-button', function (e) {
    e.stopPropagation();
    const $btn = $(this);
    const variantId = $btn.data('variant');
    if (!variantId) return;

    $btn.addClass('is-loading');

    fetch(window.Shopify.routes.root + 'cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: [{ id: variantId, quantity: 1 }] })
    })
    .then(() => {
      $btn.removeClass('is-loading');
      Shopify.getCart(cart => {
        document.body.classList.add("cart-sidebar-show");
        window.updateSidebarCart(cart);
      });
    })
    .catch(() => $btn.removeClass('is-loading'));
  });

  $section.on('click', '.inner', function () {
    const url = $(this).data('url');
    if (url) window.location.href = url;
  });

  initSwiper();
  switchCategory('Chairs');

});
