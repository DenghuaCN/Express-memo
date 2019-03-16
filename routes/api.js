const express = require('express');
const router = express.Router();
const Note = require("../model/note").Note;


/* GET home page. */
router.get('/notes', function (req, res, next) {
    console.log(req.session);
    
    let query = {raw: true};
    if (req.session.user) {
        query.where = {
            uid: req.session.user.id
        }
    }

    Note.findAll(query).then(function (notes) {
        res.send({ status: 0, data: notes })
    }).catch(function () {
        res.send({ status: 1, errorMsg: "数据库出错" })
    })
});

/* POST add notes. */
router.post('/notes/add', function (req, res, next) {
    if (!req.session.user) {
        return res.send({ status: 1, errorMsg: "请先登录" })
    }

    let uid = req.session.user.id;
    
    let note = req.body.note;

    Note.create({ text: note, uid: uid }).then(function () {
        res.send({ status: 0 })
    }).catch(function () {
        res.send({ status: 1, errorMsg: "数据库错误!" })
    });

});
/* POST edit notes. */
router.post('/notes/edit', function (req, res, next) {
    if (!req.session.user) {
        return res.send({ status: 1, errorMsg: "请先登录" })
    }
    let uid = req.session.user.id;

    Note.update({ text: req.body.note }, { where: { id: req.body.id, uid: uid } }).then(function () {
        res.send({status: 0})
    });
});
/* POST delete notes. */
router.post('/notes/delete', function (req, res, next) {
    if (!req.session.user) {
        return res.send({ status: 1, errorMsg: "请先登录" })
    }
    
    let uid = req.session.user.id;
    Note.destroy({ where: { id: req.body.id, uid: uid } }).then(function () {
        res.send({status: 0})
    })
});


module.exports = router;
