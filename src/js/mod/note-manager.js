const Toast = require('./toast.js').Toast;
const Note = require('./note.js').Note;
const Event = require('./event.js');


let NoteManager = (function () {
    
    function load() {
        $.get('/api/notes')
            .done(function (ret) {
                if (ret.status === 0) {
                    $.each(ret.data, function (id, article) {
                        new Note({
                            id: id,
                            context: article
                        });
                    });

                    Event.fire('waterfall');
                } else {
                    Toast(ret.errorMsg);
                }
            })
            .fail(function () {
                Toast("网络异常");
            });
    }

    function add() {
        new Note();
    }

    return {
        load: load,
        add: add
    }

})();


module.exports.NoteManager = NoteManager;
