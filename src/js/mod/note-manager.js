const Toast = require('./toast.js').Toast;
const Note = require('./note.js').Note;
const Event = require('./event.js');


let NoteManager = (function () {
    
    function load() {
        $.get('/api/notes')
            .done(function (ret) {
                if (ret.status === 0) {

                    console.log("GET /api/notes/ data",ret);

                    $.each(ret.data, function (id, article) {
                        
                        new Note({
                            id: article.id,
                            context: article.text,
                            username: article.username
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
