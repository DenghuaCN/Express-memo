let Event = (function () {

    let events = {};

    function on(id, handler) {
        events[id] = events[id] || [];

        events[id].push({
            handler: handler
        })
    }
    function fire(id, args) {
        if (!events[id]) return;

        for (let i = 0; i < events[id].length; i++) {
            events[id][i].handler(args);
        }
    }

    return {
        on: on,
        fire: fire
    }
})();

module.exports = Event;
