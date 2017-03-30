var Router = (function(document, window) {
    var hashChangeEvent = "hashchange";
    var onPrefix = "on";
    var notFoundIndex = -1;

    function _noOp() { }

    var _requestAnimationFrame = (function(){
        var fps = 1000 / 60;
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) { window.setTimeout(callback, fps); };
    })();

    function _addEvent(dom, name, func) {
        if (dom.addEventListener) {
            dom.addEventListener(name, func);
        } else {
            dom.attachEvent(onPrefix + name, func);
        }
    }

    function _removeEvent(dom, name, func) {
        if (dom.removeEventListener) {
            dom.removeEventListener(name, func);
        } else {
            dom.detachEvent(onPrefix + name, func);
        }
    }

    function _normalize(path) {
        var parser = document.createElement("a");
        parser.href = path;
        path = parser.hash;
        return path;
    }

    function _indexOf(array, item) {
        var length = array.length;
        var i;

        for (i = 0; i < length; i += 1) {
            if (array[i] === item) {
                return i;
            }
        }

        return notFoundIndex;
    }

    function _forEach(array, func) {
        var length = array.length;
        var i;

        for (i = 0; i < length; i += 1) {
            func(array[i], i);
        }
    }

    function _filter(array, predicate) {
        var filtered = [];

        _forEach(array, function (item, i) {
            if (predicate(item, i)) {
                filtered.push(item);
            }
        });

        return filtered;
    }

    function _bind(context, func) {
        return function () {
            return func.apply(context, arguments);
        };
    }

    function Route(path, onEnter, onExit) {
        this.path = _normalize(path);
        this.enter = onEnter || _noOp;
        this.exit = onExit || _noOp;
    }

    Route.prototype.isMatch = function (path) {
        path = _normalize(path);
        return path === this.path;
    };

    function Router() {
        this.routes = [];
        this.lastURL = document.URL;
        this._dispatch = _bind(this, this._dispatch);
        _addEvent(window, hashChangeEvent, this._dispatch);
    }

    Router.prototype.dispose = function () {
        this.routes = [];
        _removeEvent(window, hashChangeEvent, this._dispatch);
    };

    Router.prototype._dispatch = function () {
        var newURL = document.URL;
        var oldURL = this.lastURL;
        var oldRoutes = _filter(this.routes, function (route) { return route.isMatch(oldURL); });
        var newRoutes = _filter(this.routes, function (route) { return route.isMatch(newURL); });

        _forEach(oldRoutes, function(route) {
            _requestAnimationFrame(route.exit);
        });

        _forEach(newRoutes, function(route) {
            _requestAnimationFrame(route.enter);
        });

        this.lastURL = newURL;
    };

    Router.prototype.add = function (path, onMatch, onExit) {
        var route = new Route(path, onMatch, onExit);
        this.routes.push(route);
        return route;
    };

    Router.prototype.remove = function (route) {
        var index = _indexOf(this.routes, route);
        if (index > notFoundIndex) {
            this.routes.splice(index, 1);
        }
    };

    Router.prototype.get = function () {
        return _normalize(window.location.hash);
    };

    Router.prototype.set = function (path) {
        _requestAnimationFrame(function () {
            window.location.hash = _normalize(path);
        });
    };

    if (typeof window.onhashchange === "undefined") {
        throw new Error("HashChange event not supported by this browser.");
    }

    return Router;
})(document, window);
