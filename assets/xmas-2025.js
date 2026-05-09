$(document).ready(function () {
    $('.item-button').on('click', function(){
        window.omnisend = window.omnisend || [];
        window.omnisend.push(['openForm', '693695f81eca2200613c3170']);
    })

    $('.xmas-event-section .has-data-url-link').on('click', function(){
        const url = $(this).data('url')
        if(url){
            window.location.href = url
        }
    })

    $('.xmas-event-section .target-button').on('click', function(){
        if ($(this).hasClass('target-button-active')) {
            return;
        }

        $(".xmas-event-section .target-button").removeClass('target-button-active');
        $(this).addClass('target-button-active');

        // 获取当前点击按钮的索引
        const index = $(this).index('.xmas-event-section .target-button');

        // 根据索引切换对应内容
        const $boxes = $(".xmas-event-section .container-box");
        $boxes.addClass('hidden');
        $boxes.eq(index).removeClass('hidden');

        // 如果点击的是索引为1的按钮（第二个，bundle）
        if (index === 1) {
            const url = new URL(window.location.href);
            url.searchParams.set('tab', 'bundle'); 
            window.history.replaceState(null, '', url.toString());
        } else {
            // 如果点击的是其他按钮，就移除 tab 参数（可选）
            const url = new URL(window.location.href);
            url.searchParams.delete('tab');
            window.history.replaceState(null, '', url.toString());
        }
    })

    // reviews
    let reviewsSwiper = new Swiper('.xmas-event-section .xmas-reviews .reviews-lists',{
      loop: true,
      grabCursor : true,
      slidesPerView : 3.5,
      spaceBetween : 16,
      slidesPerGroup: 3,
      pagination: {
        el: '.xmas-reviews-blocks .swiper-pagination',
        clickable :true,
      },
      breakpoints: {
        320: {
          slidesPerView: 1.4,
          slidesPerGroup: 1,
        },
        768: {
            slidesPerView: 1.4,
        },
        992: {
          slidesPerView: 3.5,
        },
        1280: {
          slidesPerView: 3.5,
        }
      }
    })

    // 点击显示所有产品
    $('.xmas-event-section .prod-total-button').on('click', function(){
        document.querySelector('.collections-lists').classList.remove('limit-items')
        $('.xmas-event-section .variant-total-cont').css('display', 'none')
    })
    // 点击播放video
    $('.xmas-event-section .videos-module .video-lists .video-item').on('click', function () {
        const video = $(this).find('.video-item-settings')[0];
        const icon = $(this).find('.video-play-icon');

        if (!video) return;

        if (video.paused) {
            video.play();
            icon.hide();
        } else {
            video.pause();
            icon.show();
        }
    });
    new Swiper('.xmas-event-section .videos-module .video-lists', {
        loop: true,
        grabCursor: true,
        spaceBetween: 10,
        breakpoints: {
            // Mobile
            320: {
                slidesPerView: 1.5,
                slidesPerGroup: 1,
            },

            768: {
                slidesPerView: 1.5,
                slidesPerGroup: 1,
            },

            // Desktop
            992: {
                slidesPerView: 4,
                slidesPerGroup: 4,
            },
            1280: {
                slidesPerView: 4,
                slidesPerGroup: 4,
            }
        }
    });
    // remove gaming chair
    setTimeout(() => {
        $('.xmas-event-section .collections-prods .collections-lists .prod_item .prod_item_title').each(function() {
            var $title = $(this);
            var txt = $title.text().trim();

            var index = txt.indexOf('-');

            if (index === -1) return;

            var part0 = txt.slice(0, index).trim();
            var part1 = txt.slice(index + 1).trim();

            
            part0 = part0.replace(/ Gaming Chair$/i, '');

           
            $title.text(part0);

           
            $title.siblings('.prod_item-variants').text(part1);

            var $seriesName = $title.siblings('.prod_item_series_name');
            var seriesTxt = $seriesName.text().trim();
            var seriesIndex = seriesTxt.indexOf('-');
            
            if (seriesIndex !== -1) {
                var cleanSeries = seriesTxt.slice(0, seriesIndex).trim();
                $seriesName.text(cleanSeries);
            }
        });
    }, 1000);
    

    // 重写价格
    setTimeout(() => {
        // 1. 锁定唯一的数据源容器，防止从多个 list 中提取数据
        const $primaryDiscountList = $('.disocunt-price-lists').first();
        
        // 如果页面上一个 list 都没有，直接跳出
        if ($primaryDiscountList.length === 0) return;

        // 获取唯一的数据前缀（如货币符号）
        const matchedAmount = $primaryDiscountList.find('.variant-box').first().data('current-amount') || '';

        $('.prod_item.has-data-url-link.variable-products').each(function () {
            const prodItem = $(this);
            const prodVariantId = prodItem.data('variant-id');

            // 2. 只在锁定的第一个容器内查找对应的变体
            const matchedBox = $primaryDiscountList.find('.variant-box[data-variant-id="' + prodVariantId + '"]');

            if (matchedBox.length > 0) {
                const originalPrice = parseFloat(matchedBox.find('.orgina-price').text().trim());
                const discountPrice = parseFloat(matchedBox.find('.discount-price').text().trim());

                if (!isNaN(discountPrice) && discountPrice > 0) {
                    const finalPrice = originalPrice - discountPrice;
                    const finalValue = (finalPrice / 100);
                    const finalFormatted = finalValue % 1 === 0 ? finalValue.toFixed(0) : finalValue.toFixed(2); 
                    const result = matchedAmount + finalFormatted + ',00';
                    
                    // 直接执行，无需再嵌套 setTimeout 0
                    const priceWrapper = prodItem.find('.prod_item_price .price');
                    const originalSalePrice = priceWrapper.find('.prod_item_sale_price').text().trim();

                    priceWrapper.html(`
                        <span class="prod_item_discount_price">${result}</span>
                        <span class="prod_item_sale_price prod_item_sale_price_new">${originalSalePrice}</span>
                    `);
                    prodItem.find('.prod-sale-tag').show();
                } else {
                    var salePriceBlock = prodItem.find('.prod_item_sale_price');
                    salePriceBlock.removeClass('prod_item_sale_price_new');
                    prodItem.find('.prod-sale-tag').hide();
                    prodItem.find('.prod_item_discount_price').hide();
                }
            } 
        });
    }, 1000);

});

document.addEventListener("DOMContentLoaded", function () {
    const countdownEl = document.querySelector(".collection-countdown");
    if (!countdownEl) return;

    const endTime = new Date(countdownEl.getAttribute("data-end")).getTime();

    const dayEl = countdownEl.querySelector('[data-type="days"]');
    const hourEl = countdownEl.querySelector('[data-type="hours"]');
    const minEl = countdownEl.querySelector('[data-type="mins"]');
    const secEl = countdownEl.querySelector('[data-type="secs"]');

    function updateCountdown() {
        const now = Date.now();
        let diff = endTime - now;

        if (diff <= 0) {
            dayEl.textContent = "00";
            hourEl.textContent = "00";
            minEl.textContent = "00";
            secEl.textContent = "00";
            clearInterval(timer);
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);

        dayEl.textContent = String(days).padStart(2, "0");
        hourEl.textContent = String(hours).padStart(2, "0");
        minEl.textContent = String(mins).padStart(2, "0");
        secEl.textContent = String(secs).padStart(2, "0");
    }

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
});

// url has bundle tab
if (new URLSearchParams(window.location.search).get('tab') === 'bundle') {
    $(".xmas-event-section .target-button").removeClass('target-button-active');

    $(".xmas-event-section .target-button").eq(1).addClass('target-button-active');

    const $boxes = $(".xmas-event-section .container-box");

    $boxes.addClass('hidden');

    $boxes.eq(1).removeClass('hidden');
}