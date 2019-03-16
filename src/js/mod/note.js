require('less/note.less');
require('less/toast.less');

const Toast = require('./toast.js').Toast;
const Event = require('mod/event.js');

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
    let tpl =  '<div class="note">'
              + '<div class="note-head"><span class="username"></span><span class="delete">&times;</span></div>'
              + '<div class="note-ct" contenteditable="true"></div>'
              +'</div>';

    this.$note = $(tpl);

    // 使用.html()保存文本，也应使用.html()渲染文本
    this.$note.find('.note-ct').html(this.opts.context);
    this.$note.find('.username').html(this.opts.username);    // ???
    
    this.opts.$ct.append(this.$note);
    // if(!this.id)  this.$note.css('bottom', '10px');  //新增放到右边

    if(!this.id)  this.$note.css({
      "left": '48%',
      "top": '48%',
    });     // BUG!!!! 


  },

  setStyle: function () {
    let color = this.colors[Math.floor(Math.random() * 6)];
    this.$note.find('.note-head').css('background-color', color[0]);
    this.$note.find('.note-ct').css('background-color', color[1]);
  },

  setLayout: function () {
    let self = this;
    if (self.clk) {
      clearTimeout(self.clk);
    }
    // Event.fire('waterfall');
    self.clk = setTimeout(function () {
      Event.fire('waterfall');
    }, 100);
  },

  bindEvent: function () {
    let self = this,
        $note = this.$note,
        $noteHead = $note.find('.note-head'),
        $noteCt = $note.find('.note-ct'),
        $delete = $note.find('.delete');

    $delete.on('click', function(){
      self.delete();
    })

    //contenteditable没有 change 事件，所有这里做了模拟通过判断元素内容变动，执行 save
    $noteCt.on('focus', function () {
      if ($noteCt.html() == 'input here') $noteCt.html('');
      // 获得焦点后，清空伪placeholder以便输入
      $noteCt.data('before', $noteCt.html());
      // 对$noteCt写入data，{ before: $noteCt.html() }，保存之前写入的值
    }).on('blur paste', function () {
      // 监听粘贴和失去焦点事件
      if ($noteCt.data('before') != $noteCt.html()) {
        // 当修改了值后
        $noteCt.data('before', $noteCt.html());
        // 更新保存的值
        self.setLayout();

        
        if (self.id) {
          self.edit($noteCt.html())
        } else {
          self.add($noteCt.html())
        }
      }
    });
    //设置笔记的移动
    $noteHead.on('mousedown', function (e) {
      let evtX = e.pageX - $note.offset().left,   //evtX 计算事件的触发点在 dialog内部到 dialog 的左边缘的距离
        evtY = e.pageY - $note.offset().top;
      $note.addClass('draggable').data('evtPos', { x: evtX, y: evtY }); //把事件到 dialog 边缘的距离保存下来
    }).on('mouseup', function () {
      $note.removeClass('draggable').removeData('pos');
    });

    $('body').on('mousemove', function (e) {
      $('.draggable').length && $('.draggable').offset({
        top: e.pageY - $('.draggable').data('evtPos').y,    // 当用户鼠标移动时，根据鼠标的位置和前面保存的距离，计算 dialog 的绝对位置
        left: e.pageX - $('.draggable').data('evtPos').x
      });
    });
  },

  edit: function (msg) {
    let self = this;
    $.post('/api/notes/edit', {
      id: this.id,
      note: msg
    }).done(function (ret) {
      if (ret.status === 0) {
        Toast('更改成功');
      } else {
        Toast(ret.errorMsg);
      }
    })
  },

  add: function (msg) {
    let self = this;
    $.post('/api/notes/add', { note: msg })
      .done(function (ret) {

        if (ret.status === 0) {
          Toast('添加成功');
        } else {
          self.$note.remove();
          Event.fire('waterfall')
          Toast("添加失败: " + ret.errorMsg);
          // Toast(ret.errorMsg);
        }
      });
    //todo
  },

  delete: function () {
    let self = this;
    $.post('/api/notes/delete', { id: this.id })
      .done(function (ret) {
        if (ret.status === 0) {
          Toast('删除成功');
          self.$note.remove();
          Event.fire('waterfall')
        } else {
          Toast(ret.errorMsg);
        }
      });
  }

};

module.exports.Note = Note;