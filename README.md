# Tiny Router

Intentionally basic client-side routing library. Does not have URL variable matching (e.g. `/user/paul` would not match `/user/:name`).

## Usage

```javascript
var router = new Router();

var homeRoute = router.add(
    // route name/path, required
    "#/home",
    // code to execute when route is matched, optional
    function onEnter() {
        var homeWrapper = document.querySelector("#home");
        homeWrapper.style.display = "";
    },
    // code to execute when route is changed, optional
    function onExit() {
        var homeWrapper = document.querySelector("#home");
        homeWrapper.style.display = "none";
    }
);

// to remove a route
//router.remove(homeRoute);

// to set new route
//router.set("#/home");

// to get current route
//router.get();

// to remove event listener and clean up
//router.dispose();
```

## License

[MIT](LICENSE)

## Development

Clone repository and run `npm install`.

- `npm test` to execute tests in browsers using Karma and Jasmine.
- `npm build` to uglify and copy files to the dist folder.
