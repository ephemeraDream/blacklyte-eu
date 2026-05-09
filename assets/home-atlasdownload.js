$(document).ready(function() {
    // 检查是否为 Web 端 (宽度大于 1024px，可根据你的 CSS 断点调整)
    if (window.innerWidth > 1024) {
        
        const $container = $('.mode-switcher');
        const $items = $('.conts-gaming-and-office .cont-items');

        $items.on('mouseenter', function() {
            // 获取当前 hover 元素的 data-type
            const type = $(this).data('type'); 

            if (type === 'office') {
                $container.removeClass('is-gaming')
                $container.addClass('is-office')
                
            } else if (type === 'gaming') {
                $container.removeClass('is-office')
                $container.addClass('is-gaming')

            }
        });
    }
});