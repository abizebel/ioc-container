/*******************************************************************************************
 * @ Name : Rcore ioc container
 * @ Author : Abbas Hosseini
 * @ Description : a simple library that provides you a modular JavaScript 
 * @ Version : 1.0.0
 * @ Last update : Tuesday - 2018 29 May
 ******************************************************************************************/


var Ioc = (function () {
    var containers = {};
    var cache = {};
    /* 
     *@ injector tasks :
     *@ 1- annotate : instnaciate injection modules for factory function
     *@ 2- create factory instance with injected modules
     *@ 3- check if factory has injectables then instnaciate it again with injections arguments
     */
    var injector = {
         /*
         * @param {String} name is module name
         * @returns {Array} 
         * @description : show list of injected moduleNames
         */
        getInjectList : function(name){
            return containers[name].injects
        },
        /*
         * @param {String} name is module name
         * @returns {Object} return a instance with injection mdoules
         * @description : create a factory instance of module
         */
        instanciate: function (name) {
            var factory = containers[name].factory,
                injects = containers[name].injects;
            return factory.apply(null, injector.annotate(injects));
        },
        /*
         * @param {Array} fnArgs is injection arguments
         * @returns {Array} instanciate all injected modules as array
         * @description : with annotation process injector knows what modules to inject into the function
         */
        annotate: function (fnArgs) {
            var injectedModules = [];
            fnArgs.forEach(function (arg) {
                var injectedModuleName = arg.trim();
                var injectedModule = injector.processModule(injectedModuleName);
                injectedModules.push(injectedModule);

            });
            return injectedModules;
        },
        /*
         * @param {String} name is the module name
         * @returns {Object} return a instance of requested module factory
         * @description : check chached & injactables factories then return module
         */
        processModule: function (name) {
            if (!containers[name]) {
                return
            }
            if (isCached(name)) {
                return getCache(name)
            } else {
                var factory = containers[name].factory;
                if (injector.hasInject(name)) {
                    //if factory has injectables should instnaciate again with injections arguments
                    setCache(name, injector.instanciate(name))
                } else {
                    setCache(name, factory())
                }
                return getCache(name);
            }
        },
        /*
         * @param {Function}
         * @returns {Boolean} 
         * @description : check if inject module has injection 
         */
        hasInject: function (name) {
            return (containers[name].injects.length != 0)
        }

    }
    /*
     * @param {String} name is the module name
     * @param {Function} factory is a factory function 
     * @description : add a new module in ioc container
     */
    function define(name, factory) {
        if (!containers.hasOwnProperty(name)) {
            containers[name] = {
                factory: factory,
                injects: extractArgs(factory),
            }
        }
    }

    /*
     * @param {String}
     * @returns {Object} 
     * @description : get requested module
     */
    function getModule(name) {
        return injector.instanciate(name)
    }

    /*
     * @param {Function} 
     * @returns {Array} 
     * @description : extract arguments of function
     */
    function extractArgs(func) {
        var FN_ARGS_REG = /^function\s*[^\(]*\(\s*([^\)]*)\)/m,
            args = func.toString().match(FN_ARGS_REG)[1].split(',');
        if (args[0] == '') {
            args = []
        }
        return args;
    }

    /*
     * @param {String} 
     * @returns {Boolean} 
     * @description : check cache already hast module instance or not
     */
    function isCached(name) {
        if (cache.hasOwnProperty(name)) {
            return true;
        } else {
            return false;
        }
    }

    /*
     * @param {String}
     * @returns {Object} 
     * @description : get a module instance from cache
     */
    function getCache(name) {
        return cache[name];
    }

    /*
     * @param {String} 
     * @param {Object} 
     * @returns {Nothing} 
     * @description : set instance of a module in cache
     */
    function setCache(name, instance) {
        cache[name] = instance
    }

    //PUBLIC API
    return {
        define: define,
        service: define,
        getModule: getModule,
        getInjects : injector.getInjectList

    }
})();