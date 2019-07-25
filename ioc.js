/*******************************************************************************************
 * @ Name : IOC Container
 * @ Author : Abbas Hosseini
 * @ Description : A simple library that support dependency injection with angular syntax
 * @ Version : 1.0.0
 * @ Last update : Thursday - 2018 08 February
 ******************************************************************************************/

var core = (() =>{

    /**
     * IoC container symbol
     * 
     * @type {Symbol}
     * @private
     * @description : Symbols is a good replacement for 
     * strings or integers as class/module constants
     */
    const _container = Symbol('container');

    /**
     * Cache symbol
     * @type {Symbol}
     * @private
     */
    const _cache = Symbol('cache');

    /**
     * IoC container class
     * 
     * @class {IOC}
     * @description : IoC container (or DI) is a design pattern that 
     * creates objects based on request and inject them when required
     */
    class IOC {
        constructor() {
            this[_container] = new Map();
            this[_cache] = new Map();
        }
        /**
         * Get the shared container
         * 
         * @returns {Map<string, object>}
         */
        get container() {
            return this[_container];
        }

        /**
         * Get the shared container
         * 
         * @returns {Map<string, object>}
         */
        get cache() {
            return this[_cache];
        }

        /**
         * Register a module to IoC container
         * 
         * @param {String} name is the module name
         * @param {Function} factory is a factory function 
         * @returns return true when defining a module that was not previously defined
         */
        register(name, factory) {

            if (this.container.has(name))
                throw new Error(`adding ${name} to container failed, because its already exists.`)

            this.container.set(name, {
                factory: factory,
                dependencies: this.extractArgs(factory) || [],
            });
        }

        /**
         * Resolve a injected module
         * 
         * @param {String} name is the name of requested module
         * @returns {Object} 
         */
        resolve(name) {

            if (this.cache.has(name))
                return this.cache.get(name);

            if (!this.container.has(name)) return undefined;

            let self = this,
                factory = this.container.get(name).factory,
                dependencies = this.container.get(name).dependencies;

            if (dependencies.length == 0) {
                var instance = factory();
                this.cache.set(name, instance);
            }

            var parameters = [];
            dependencies.forEach(dependency => parameters.push(self.resolve(dependency)));

            var instance = factory.apply(null, parameters);
            this.cache.set(name, instance);

            return instance;
        }

        /**
         * Extract arguments of function
         * 
         * @param {Function} fn is a factory function
         * @returns {Array} args is list of function arguments
         */
        extractArgs(fn) {
            let ARROW_ARG = /^\s*[^\(]*\(\s*([^\)=>]*)\)/,
                FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m,
                fnText = fn.toString(),
                regResult = fnText.match(FN_ARGS) || fnText.match(ARROW_ARG),
                args = regResult[1].split(',').map((item) => {
                    return item.trim();
                })
            //fix split string ''
            args = (args[0] == '') ? [] : args;
            return args;
        }
    }


    var ioc = new IOC();

    //Public Interface
    return {
        define : (moduleName, fn) =>{
            ioc.register(moduleName, fn)
        },
        require: (moduleName) => {
            return ioc.resolve(moduleName)
        },

    }
})()
