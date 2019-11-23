module.exports = options => {
    const jwt = require('jsonwebtoken')
    const adminUser = require('../models/AdminUser');
    const assert = require('http-assert')

    return async (req, res, next) => {
        const token = String(req.headers.authorization || '').split(' ').pop()
        assert(token, 401, '請先登入')
        const { id } = jwt.verify(token, req.app.get('secret'))
        assert(id, 401, '請先登入')
        req.user = await adminUser.findById(id)
        assert((req.user), 401, '請先登入')
        await next()
    }
}