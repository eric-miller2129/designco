const { default: Homepage } = require("./components/homepage");

;(() => {
    const route = window.location.pathname.slice(0, -1);

    switch (route) {
        case '':
            console.log(`Loading js for ${route || 'homepage'}`);
            new Homepage();
            break;
        case '/about':
            console.log(`Loading js for ${route || 'homepage'}`);
            break;
    }
})();