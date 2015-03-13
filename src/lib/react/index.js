/**
 * XadillaX created at 2015-01-28 14:45:31
 *
 * Copyright (c) 2015 Huaban.com, all rights
 * reserved
 */
var _components = {};

/**
 * add a react component object into pool
 * @param {String} name the component name
 * @param {ReactComponent} component the component object
 */
exports.addComponent = function(name, component) {
    console.debug(name + " is added into pool.");
    _components[name] = component;
};

/**
 * get a react component object from pool
 * @param {String} name the component name
 * @return {ReactComponent} the component object
 */
exports.getComponent = function(name) {
    return _components[name];
};

/**
 * delete a react component object from pool
 * @param {String} name the component name
 */
exports.delComponent = function(name) {
    delete _components[name];
};
