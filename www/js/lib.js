L = {};

L.Funcs = {};

L.Funcs.bind = function (func, context /*, args*/) {
  var bindArgs = [].slice.call(arguments, 2);
  function wrapper() {
    var args = [].slice.call(arguments); 
    var unshiftArgs = bindArgs.concat(args);
    return func.apply(context, unshiftArgs);
  }
  return wrapper;
}

L.Funcs.bindFieldMethod = function (obj, fieldName, methodName) {
    
    function wrapper(){
        return this[fieldName][methodName].apply(this[fieldName], arguments);
    };
    
    return wrapper;
}

L.Funcs.extend = function (Child, Parent) {
	var F = function() { };
	F.prototype = Parent.prototype;
	Child.prototype = new F();
	Child.prototype.constructor = Child;
	Child.superclass = Parent.prototype;
};

L.Funcs.mixIn = function (Object, Mixin) {

    function wrapper(){
        var F = function() { };
        F.prototype = Object.prototype;
        var obj = new F();
        
        Mixin.apply(obj, arguments);
        Object.apply(obj, arguments);
        return obj;
    };
    
    //copy method from mixin prototype
    for(var method in Mixin.prototype){
        if( Mixin.prototype.hasOwnProperty(method) ){
            Object.prototype[method] = Mixin.prototype[method];
        }
    }
    
    return wrapper;
    
};





L.HandlerTool = function () {
    this.handlers = [];
    this.handlersArgs = [];
};

L.HandlerTool.prototype = {
    
    on: function (handler, data) {
            if( arguments.length == 1 ){
                this.handlersArgs.push([]);
            } else {
                this.handlersArgs.push([data]);
            }
        
            if( !this.handlerExist(handler) ){
                this.handlers.push(handler);
            }
        },
    
    handlerExist: function (handler) {
            for(var i=0; i<this.handlers.length; i++){
                if( this.handlers[i] == handler ){
                    return true;
                }
            }
            return false;
        },

    off: function (handler) {
            for(var i=0; i<this.handlers.length; i++){
                if( this.handlers[i] == handler ){
                    this.handlers.splice(i, 1);
                    this.handlersArgs.splice(i, 1);
                    i--;
                    return;
                }
            }
        },
    
    invoke: function () {
            var args = Array.prototype.slice.call(arguments);
            for(var i=0; i<this.handlers.length; i++){
                var hargs = args.concat(this.handlersArgs[i]);
                this.handlers[i].apply(this, hargs);
            }
        },
    
    count: function () {
            return this.handlers.length;
        }
    
};



L.HandlersTool = function () {
    this.handlerTools = {};
};

L.HandlersTool.prototype = {
    
    registerEvents: function (/* identifiers */) {
        
        var eventNames = Array.prototype.slice.call(arguments);

        for (var i = 0; i < eventNames.length; ++i) {
            this.getHandlerTool(eventNames[i]);
        }
        
    },
    
    getHandlerTool: function (eventName) {
        
        var handlerTool;
        
        if( this.hasOwnProperty(eventName) ){
            handlerTool = this.handlerTools[eventName];
        } else {
            
            handlerTool = new L.HandlerTool();
            
            this.handlerTools[eventName] = handlerTool;
            
            if( !this.hasOwnProperty(eventName) ){
                this[eventName] = function (handler, data) {
                    this.on(eventName, handler, data);
                };
            }
            
        }
        
        return handlerTool;
    },
    
    on: function (eventName, handler, data) {
        this.getHandlerTool(eventName).on(handler, data);
    },
    
    off: function (eventName, handler) {
        this.getHandlerTool(eventName).off(handler);
    },
    
    fire: function (eventName, event) {
        if( this.handlerTools.hasOwnProperty(eventName) ){
            var args = Array.prototype.slice.call(arguments, 1);
            this.handlerTools[eventName].invoke.apply(this.handlerTools[eventName], args);
        }
    },
    
    countHandlers: function (eventName) {
        return this.getHandlerTool(eventName).count();
    }
    
};
