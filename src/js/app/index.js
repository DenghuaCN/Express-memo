require('less/index.less');
require("less/toast.less");

const NoteManager = require('mod/note-manager.js').NoteManager;
const Event = require("mod/event.js");
const WaterFall = require('mod/waterfall.js');


NoteManager.load();

$('.add-note').on('click', function () {
    NoteManager.add();
})

Event.on('waterfall', function () {
    WaterFall.init($('#content'));
})