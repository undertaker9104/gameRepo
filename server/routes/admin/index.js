module.exports = app => {
    const express = require('express')
    const router = express.Router({
        mergeParams: true
    })
    const adminUser = require('../../models/AdminUser');
    const jwt = require('jsonwebtoken')
    const assert = require('http-assert')


    router.post('/', async (req, res) => {
        const model = await req.Model.create(req.body)
        res.send(model)
    })
    router.put('/:id', async (req, res) => {
        const model = await req.Model.findByIdAndUpdate(req.params.id, req.body)
        res.send(model)
    })
    router.get('/', async (req, res) => {
        const queryOptions = {}
        if (req.Model.modelName === 'Category') {
            queryOptions.populate = 'parent'
        }
        const items = await req.Model.find().setOptions(queryOptions).limit(10)
        res.send(items)
    })
    router.get('/:id', async (req, res) => {
        const model = await req.Model.findById(req.params.id)
        res.send(model)
    })
    router.delete('/:id', async (req, res) => {
        await req.Model.findByIdAndDelete(req.params.id, req.body)
        res.send({
            success: true
        })
    })

    //登入中間件
    const authMiddleware = require('../../middleware/auth')

    //資源中間件
    const resourceMiddleWare = require('../../middleware/resource')

    app.use('/admin/api/rest/:resource', authMiddleware(), resourceMiddleWare(), router)

    const multer = require('multer');
    const upload = multer({ dest: __dirname + '/../../uploads' });

    app.use('/admin/api/upload', authMiddleware(), upload.single('file'), async (req, res) => {
        const file = req.file;
        file.url = `http://localhost:3000/uploads/${file.filename}`;
        res.send(file);
    })

    app.use('/admin/api/login', async (req, res) => {
        const { username, password } = req.body;
        // 1.找出用戶
        const user = await adminUser.findOne({ username }).select('+password')
        assert(user, 422, '用戶不存在')
        const isVaild = require('bcryptjs').compareSync(password, user.password)
        assert(isVaild, 422, '密碼錯誤')
        const token = jwt.sign({ id: user._id }, app.get('secret'))
        res.send({ token })
    })

    app.use(async (err, req, res, next) => {
        res.status(err.statusCode || 500).send({
            message: err.message
        })
    })
}