Ioc.define('person', function(taxi){
    return {
        workAddress : 'Apple Computer, Inc. 1 Infinite Loop Cupertino, CA 95014',
        goToWork : function () {
            taxi.goTo(this.workAddress)
        }
    }
    /*
    function(taxi){

    
    */
})