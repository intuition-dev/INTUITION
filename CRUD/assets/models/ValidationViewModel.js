var ValidationViewModel = (function () {
    function ValidationViewModel() {
    }
    ValidationViewModel.prototype.valid = function (row) {
        var col1 = row['col1'];
        var col2 = row['col2'];
        if (validator.isEmpty(col1, { ignore_whitespace: true }))
            return 'Col1 is blank';
        if (validator.isEmpty(col2, { ignore_whitespace: true }))
            return 'Col2 is blank';
        return 'OK';
    };
    return ValidationViewModel;
}());
