$(document).ready(function(){
    // ATC
    $('.prod-atc-btn').click(function(ev){
        ev.stopPropagation()
        ev.preventDefault();
        const variantId = $(this).data('variant-id')
        if(variantId){
            let formData = {
                'items': [{ 'id': variantId, 'quantity': 1 }]
            };

            fetch(window.Shopify.routes.root + 'cart/add.js', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(response => {
                $(this).removeClass('is-loading')
                // window.location.href = '/cart'
                
                Shopify.getCart((cartTotal) => {
                    document.body.classList.add("cart-sidebar-show")
                    window.updateSidebarCart(cartTotal)
                });


            })
            .catch((error) => {
                console.error('Error:', error);
            });
        } else { }
    })
    // ATC
    $('.xmas-event-section .collections-prods .collections-lists .prod_item .atc_btn').click(function(ev){
        ev.stopPropagation()
        ev.preventDefault();
        const variantId = $(this).closest('.prod_item').attr('data-variant-id');

        if(variantId){
            let formData = {
                'items': [{ 'id': variantId, 'quantity': 1 }]
            };

            fetch(window.Shopify.routes.root + 'cart/add.js', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(response => {
                $(this).removeClass('is-loading')
                // window.location.href = '/cart'
                Shopify.getCart((cartTotal) => {
                    document.body.classList.add("cart-sidebar-show")
                    window.updateSidebarCart(cartTotal)
                });

            })
            .catch((error) => {
                console.error('Error:', error);
            });
        }
    })

    const $productItems = $('.collections-prods.all-products-module .prod_item');
    const $imageModules = $('.images-lists .item-module-cont');
    const activeClass = 'all-prods-tab-item-active';

    $productItems.hide();
    $imageModules.hide();
    
    $productItems.filter('[data-product-type="chairs"]').show();
    $('.chairs-main-iamge').show(); 

        $('.all-prods-tab-item').on('click', function() {
        const $this = $(this);
        
        $('.all-prods-tab-item').removeClass(activeClass);

        $this.addClass(activeClass);
        const targetType = $this.data('value');

        console.log(targetType)

        $productItems.hide();
        $productItems.filter(`[data-product-type="${targetType}"]`).fadeIn(400);

        $imageModules.hide();
        const $targetImg = $imageModules.filter(`[data-module-type="${targetType}"]`);
        
        if ($targetImg.length > 0) {
            $targetImg.fadeIn(400);
        } else {
            if (targetType === 'chairs') {
                $('.chairs-main-iamge').fadeIn(400);
            }
        }
        });
})