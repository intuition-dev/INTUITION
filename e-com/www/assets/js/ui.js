function snipCartRelatedStuff() {
    /**
     * SNIPCART related ui stuff
     */

    //clear all items from the cart
    document.addEventListener('snipcart.ready', function() {
        var count = Snipcart.api.items.count();

        //clean the card
        $('.js-clean-cart').on('click', function(ev) {
            ev.preventDefault()
            Snipcart.api.items.clear()
        })
    });

    //set price at the top in card-header
    var price = $('.js-snipcart-btn').data('item-price')

    //shop item id is based on color and size
    var color = $('.js-color').data('class')
    var item_id = $('.js-size.selected').data('id')

    setSizeBasedOnColor(color)
    setPriceBasedOnSize(price, item_id)

    $('.js-color').off('click').on('click', function(ev) {
        ev.preventDefault()
        $('.js-size').removeClass('selected')
        $('.js-color').removeClass('selected')
        $(this).addClass('selected')

        color = $(this).data('class')
        setSizeBasedOnColor(color)

        //if color changed, size == 0, get the id and set it to the button
        var id = $('.js-size.selected').data('id')

        setPriceBasedOnSize(price, id)
    })

    $('.js-size').off('click').on('click', function(ev) {
        ev.preventDefault()
        $('.js-size').removeClass('selected')
        $(this).addClass('selected')

        var price = $('.js-snipcart-btn[data-item-id="' + $(this).data('id') + '"]').data('item-price')

        setPriceBasedOnSize(price, $(this).data('id'))
    })
}

//hide sizes that doesnt match color
function setSizeBasedOnColor(color) {
    switch (color) {
        case 'white':
            $('.js-size').hide()
            $('.js-size[data-class="white"]').show()
            $('.js-size[data-class="white"]').each(function(index, el) {
                if (index == 0) {
                    $(el).addClass('selected')
                }
            })
            break;
        case 'black':
            $('.js-size').hide()
            $('.js-size[data-class="black"]').show()
            $('.js-size[data-class="black"]').each(function(index, el) {
                if (index == 0) {
                    $(el).addClass('selected')
                }
            })

            break;
        default:
            $('.js-size').hide()
            $('.js-size[data-class="white"]').show()
            $('.js-size[data-class="white"]').each(function(index, el) {
                if (index == 0) {
                    $(el).addClass('selected')
                }
            })
            break;
    }
}
//set the price on top
function setPriceBasedOnSize(price, id) {
    //ui stuff
    $('.js-price').html('US $' + price + '<span> / piece</span>')

    //change snipcart button
    $('.snipcart-add-item').hide(); //show only first item
    var s = $('.snipcart-add-item[data-item-id="' + id + '"]');
    s.show();
}