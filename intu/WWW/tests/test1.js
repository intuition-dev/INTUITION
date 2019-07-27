
function tests1() {
    console.log('tests1')
    
    QUnit.start()

    QUnit.test( "hello test", function( assert ) {
        assert.ok( 1 == "1", "Passed!" )
    })

}


 