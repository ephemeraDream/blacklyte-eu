$(document).ready(function() {
    // 1. 初始化 Swiper
    const faqSwiper = new Swiper('.resource-collapse-swiper', {
        grabCursor : false,
        loop: false,
        slidesPerView: 1,
        allowTouchMove: false
    });

    window.faqSwiper = faqSwiper

    // 2. 折叠逻辑 (使用你提供的 scrollHeight 方案)
    $('.resource-faq-item .resource-titles').on('click', function(event) {
        const btn = event.currentTarget;
        const container = btn.closest('.resource-faq-item');
        const content = container.querySelector('.resource-desc');
        const activeClass = 'resource-faq-item-active';

        // 排他性逻辑：关闭同一 Slide 下的其他项
        const currentSlide = btn.closest('.swiper-slide');
        const allItemsInSlide = currentSlide.querySelectorAll('.resource-faq-item');

        allItemsInSlide.forEach(item => {
            if (item !== container && item.classList.contains(activeClass)) {
                const otherContent = item.querySelector('.resource-desc');
                const otherBtn = item.querySelector('.resource-titles');
                item.classList.remove(activeClass);
                if (otherContent) otherContent.style.maxHeight = null;
            }
        });

        // 当前项切换
        btn.classList.toggle('collapsed');
        const isOpening = !container.classList.contains(activeClass);

        if (isOpening) {
            container.classList.add(activeClass);
            content.style.maxHeight = content.scrollHeight + 'px';
        } else {
            container.classList.remove(activeClass);
            content.style.maxHeight = null;
        }

    });
});