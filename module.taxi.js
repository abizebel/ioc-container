Ioc.define('taxi', function(gasoline){
    return {
        goTo : function (address) {
            gasoline.fill();
        }
    }
})