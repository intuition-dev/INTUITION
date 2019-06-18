depp.require(['general'], function () {
    if (window.location.href.indexOf("admin/crudEditors") > -1) {

        let editors = new Editors();

        editors.drawTable();

        /*
        * add editor
        */
        $(document).on('click', '#add-editor', function (e) {
            e.preventDefault();
            $(this).attr("disabled", "disabled");
            $('.loader').addClass('active');
            editors
                .save()
                .then(() => {
                    $(this).removeAttr("disabled");
                    $('.loader').removeClass('active');
                });
        });
        /* 
        * edit editor
        */
        $(document).find('#edit-editor').on('click', function (e) {
            e.preventDefault();
            if (typeof rowUid !== 'undefined' && rowUid !== '') {
                $(this).attr("disabled", "disabled");
                $('.loader').addClass('active');
                editors
                    .save(rowUid)
                    .then(() => {
                        $(this).removeAttr("disabled");
                        $('.loader').removeClass('active');
                    })
            } else {
                $('.notification').removeClass('d-hide').find('.text').text('Please, select user to edit');
                setTimeout(function() {
                    $('.notification').addClass('d-hide').find('.text').text('');
                }, 2000);
            }
        });
        /* 
        * delete editor
        */
        $(document).on('click', '#delete-editor', function (e) {
            e.preventDefault();
            if (typeof rowUid !== 'undefined' && rowUid !== '') {

                $(this).attr("disabled", "disabled");
                $('.loader').addClass('active');
                editors
                    .remove(rowUid)
                    .then(() => {
                        $(this).removeAttr("disabled");
                        $('.loader').removeClass('active');
                    });

            } else {
                $('.notification').removeClass('d-hide').find('.text').text('Please, select user to delete');
                setTimeout(function() {
                    $('.notification').addClass('d-hide').find('.text').text('');
                }, 2000);
            }
        });
    }

});