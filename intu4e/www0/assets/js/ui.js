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
    var sleeve = $('.js-sleeve').data('class')
    var item_id = $('.js-size.selected').data('id')

    setSizeBasedOnColorAndSleeve(color, sleeve);
    setPriceBasedOnSize(price, item_id)

    $('.js-color').off('click').on('click', function(ev) {
        ev.preventDefault()
        $('.js-size').removeClass('selected')
        $('.js-color').removeClass('selected')
        // $('.js-sleeve').removeClass('selected')
        $(this).addClass('selected')

        color = $(this).data('class');

        setSizeBasedOnColorAndSleeve(color, sleeve)

        //if color changed, size == 0, get the id and set it to the button
        var id = $('.js-size.selected').data('id')

        setPriceBasedOnSize(price, id)
    })

    $('.js-sleeve').off('click').on('click', function(ev) {
        ev.preventDefault()
        $('.js-size').removeClass('selected')
        // $('.js-color').removeClass('selected')
        $('.js-sleeve').removeClass('selected')
        $(this).addClass('selected')

        sleeve = $(this).data('class')
        
        setSizeBasedOnColorAndSleeve(color, sleeve)

        //if sleeve changed, size == 0, get the id and set it to the button
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
function setSizeBasedOnColorAndSleeve(color, sleeve) {
    let dataclassPrevent = false;

    $('.js-size').hide();
    $('.js-size').each(function() {
        let dataClass = $(this).data('class');

        if (dataClass.includes(color) && dataClass.includes(sleeve)) {

            $(this).show();

            if(!dataclassPrevent) {
                $(this).addClass('selected')
                dataclassPrevent = true;
            }
        }
    })
      
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
