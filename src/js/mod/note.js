// require('less/note.less');

// let Toast = require('./toast.js').Toast;
// let Event = require('./event.js');

// class Note {
//     constructor(opts) {
//         this.initOpts(opts);
//         this.createNote();
//         this.setStyle();
//         this.bindEvent();
        
//         this.colors = [
//             ['#ea9b35', '#efb04e'],     // headColor, ContainerColor
//             ['#dd598b', '#e672a2'],
//             ['#eee34b', '#d15a39'],
//             ['#c24226', '#d0d25c'],
//             ['#3f78c3', '#5591d2']
//         ],
//         this.defaultOpts = {
//             id: '',                     // Note ID
//             $ct: $('#container').length > 0 ? $('#content') : $('body'),
//             context: 'input here'       // Note内容
//         }
//     }


//     initOpts(opts) {
//         this.opts = $.extend({}, this.defaultOpts, opts || {});
//         if (this.opts.id) this.id = this.opts.id;
//     }
//     createNote() {
//         let tpl = '<div class="note">'
//             + '<div class="note-head"><span class="username"></span><span class="delete">&times;</span></div>'
//             + '<div class="note-ct" contenteditable="true"></div>'
//             + '</div>';
//         this.$note = $(tpl);
//         this.$note.find('.note-ct').text(this.opts.context);
//         this.$note.find('.username').text(this.opts.username);
//         this.opts.$ct.append(this.$note);
//         if (!this.id) this.$note.css('bottom', '10px');  //新增放到右边
//         // let tpl = '<div class="note">'
//         //         + '<div class="note-head"><span class="delete">&times;</span></div>'
//         //         + '<div class="note-ct" contenteditable="true"></div>'
//         //         + '</div>';

//         // this.$note = $(tpl);
//         // this.$note.find('.note-ct').html(this.opts.context);

//         // console.log(this.$note);
//         // this.opts.$ct.append(this.$note);

//         // if (!this.id) this.$note.css('bottom', '10px');     // 添加放到右边
//     }
//     setStyle() {
//         let color = this.colors[Math.floor(Math.random() * 6)];
//         this.$note.find('.note-head').css('background-color',color[0]);
//         this.$note.find('.note-ct').css('background-color',color[1]);
//     }
//     setLayout() {
//         let self = this;
//         if (self.clk) {
//             clearTimeout(self.clk);
//         } 
//         self.clk = setTimeout(() => {
//             Event.fire('waterfall');
//         }, 100);
//     }
//     bindEvent() {
//         let self = this,
//             $note = this.$note,
//             $noteHead = $note.find('.note-head'),
//             $noeCt = $note.find('.note-ct'),
//             $delete = $note.find('.delete');

//         $delete.on('click', function () {
//             self.delete();
//         })

//         $noeCt.on('focus', function () {
//             if ($noteCt.html() === 'input here') $noteCt.html('');
//             $noteCt.data('before', $noteCt.html());
//         }).on('blur paste', function () {
//             if ($noteCt.data('before') != $noteCt.html()) {
//                 $noteCt.data('before', $noteCt.html());
//                 self.setLayout();
//                 if (self.id) {
//                     self.edit($noeCt.html())
//                 } else {
//                     self.add($noteCt.html());
//                 }
//             }
//         });

//         $noteHead.on('mousedown', function (e) {
//             let evtX = e.pageX - $note.offset().left,
//                 evtY = e.pageY - $note.offset().top;

//             $note.addClass('draggable').data('evtPos', { x: evtX, y: evtY });
//         }).on('mouseup', function () {
//             $note.removeClass('draggable').removeData('pos');
//         });

//         $('body').on('mouosemove', function (e) {
//             $('.draggable').length && $('.draggable').offset({
//                 top: e.pageY - $('.draggable').data('evtPos').y,
//                 left: e.pageY - $('.draggable').data('evtPos').x
//             });
//         });
//     }

//     edit(msg) {
//         let self = this;

//         $.post('/api/notes/edit', {
//             id: this.id,
//             note: msg
//         }).done(function (ret) {
//             if (ret.status === 0) {
//                 Toast('编辑成功');
//                 console.log('update success');
//             } else {
//                 console.log(ret.errorMsg);
//             }
//         })
//     }

//     add(msg) {
//         console.log('add...');

//         let self = this;
//         $.post('/api/notes/add', { note: msg })
//             .done(function (ret) {
//                 if (ret.status === 0) {
//                     self.id = ret.data.id;
//                     Toast('add success');
//                 } else {
//                     Toast(ret.errorMsg);
//                 }
//         });
//     }

//     delete() {
//         let self = this;

//         $.post('/api/notes/delete', { id: this.id })
//             .done(function (ret) {
//                 if (ret.status === 0) {
//                     Toast('delete success');
//                     self.$note.remove();
//                     Event.dire('waterfall');
//                 } else {
//                     Toast(ret.errorMsg);
//                 }
//         });
//     }
// }

// module.exports.Note = Note;

// ---------------------------------------------------------------------


require('less/note.less');

var Toast = require('./toast.js').Toast;
var Event = require('mod/event.js');

function Note(opts){
  this.initOpts(opts);
  this.createNote();
  this.setStyle();
  this.bindEvent();
}
Note.prototype = {
  colors: [
    ['#ea9b35','#efb04e'], // headColor, containerColor
    ['#dd598b','#e672a2'],
    ['#eee34b','#f2eb67'],
    ['#c24226','#d15a39'],
    ['#c1c341','#d0d25c'],
    ['#3f78c3','#5591d2']
  ],

  defaultOpts: {
    id: '',   //Note的 id
    $ct: $('#content').length > 0 ? $('#content') : $('body'),  //默认存放 Note 的容器
    context: 'input here'  //Note 的内容
  },

  initOpts: function (opts) {
    this.opts = $.extend({}, this.defaultOpts, opts||{});
    if(this.opts.id){
       this.id = this.opts.id;
    }
  },

  createNote: function () {
    var tpl =  '<div class="note">'
              + '<div class="note-head"><span class="username"></span><span class="delete">&times;</span></div>'
              + '<div class="note-ct" contenteditable="true"></div>'
              +'</div>';
    this.$note = $(tpl);
    this.$note.find('.note-ct').text(this.opts.context);
    this.$note.find('.username').text(this.opts.username);
    
    this.opts.$ct.append(this.$note);
    // if(!this.id)  this.$note.css('bottom', '10px');  //新增放到右边
    if(!this.id)  this.$note.css({
      "left": '50%',
      "top": '50%',
      'transform': "transitionX(-50%)",
      'transform': "transitionY(-50%)"
    });     // BUG!!!! 
  },

  setStyle: function () {
    var color = this.colors[Math.floor(Math.random()*6)];
    this.$note.find('.note-head').css('background-color', color[0]);
    this.$note.find('.note-ct').css('background-color', color[1]);

  },

  setLayout: function(){
    var self = this;
    if(self.clk){
      clearTimeout(self.clk);
    }
    // Event.fire('waterfall');
    self.clk = setTimeout(function(){
      Event.fire('waterfall');
    },100);
  },

  bindEvent: function () {
    var self = this,
        $note = this.$note,
        $noteHead = $note.find('.note-head'),
        $noteCt = $note.find('.note-ct'),
        $delete = $note.find('.delete');

    $delete.on('click', function(){
      self.delete();
    })

    //contenteditable没有 change 事件，所有这里做了模拟通过判断元素内容变动，执行 save
    $noteCt.on('focus', function() {
      if($noteCt.html()=='input here') $noteCt.html('');
      $noteCt.data('before', $noteCt.html());
    }).on('blur paste', function() {
      if( $noteCt.data('before') != $noteCt.html() ) {
        $noteCt.data('before',$noteCt.html());
        self.setLayout();
        if(self.id){
          self.edit($noteCt.html())
        }else{
          self.add($noteCt.html())
        }
      }
    });

    //设置笔记的移动
    $noteHead.on('mousedown', function(e){
      var evtX = e.pageX - $note.offset().left,   //evtX 计算事件的触发点在 dialog内部到 dialog 的左边缘的距离
          evtY = e.pageY - $note.offset().top;
      $note.addClass('draggable').data('evtPos', {x:evtX, y:evtY}); //把事件到 dialog 边缘的距离保存下来
    }).on('mouseup', function(){
       $note.removeClass('draggable').removeData('pos');
    });

    $('body').on('mousemove', function(e){
      $('.draggable').length && $('.draggable').offset({
        top: e.pageY-$('.draggable').data('evtPos').y,    // 当用户鼠标移动时，根据鼠标的位置和前面保存的距离，计算 dialog 的绝对位置
        left: e.pageX-$('.draggable').data('evtPos').x
      });
    });

  },

  edit: function (msg) {
    var self = this;
    $.post('/api/notes/edit',{
        id: this.id,
        note: msg
      }).done(function(ret){
      if(ret.status === 0){
        Toast('update success');
      }else{
        Toast(ret.errorMsg);
      }
    })
  },

  add: function (msg){
    var self = this;
    $.post('/api/notes/add', {note: msg})
      .done(function(ret){
        if(ret.status === 0){
          Toast('add success');
        }else{
          self.$note.remove();
          Event.fire('waterfall')
          Toast(ret.errorMsg);
        }
      });
    //todo
  },

  delete: function(){
    var self = this;
    $.post('/api/notes/delete', {id: this.id})
      .done(function(ret){
        if(ret.status === 0){
          Toast('delete success');
          self.$note.remove();
          Event.fire('waterfall')
        }else{
          Toast(ret.errorMsg);
        }
    });

  }

};

module.exports.Note = Note;

