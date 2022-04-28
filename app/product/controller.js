const path = require('path')
const fs = require('fs')
const config = require('../config')
const Product = require('./model')
const Category = require('../category/model')
const Tag = require('../tag/model')

const store = async (req, res, next) => {
  try {
    let payload = req.body

    if (payload.category) {
      let category = await Category.findOne({
        name: { $regex: payload.category, $options: 'i' }
      })
      if (category) {
        payload = { ...payload, category: category_id }
      } else {
        delete payload.category
      }
    }

    if (payload.tags && payload.length > 0) {
      let tags = await Tag.find({
        name: { $in: payload.tags }
      })
      if (tags.length) {
        payload = { ...payload, tags: tags.map(tag => tag._id) }
      } else {
        delete payload.category
      }
    }

    if (req.file) {
      let tmp_path = req.file.path
      let originalExt = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1]
      let filename = req.file.filename + '.' + originalExt
      let target_path = path.resolve(config.rootPath, `public/images/products/${filename}`)

      const src = fs.createReadStream(tmp_path)
      const dest = fs.createWriteStream(target_path)

      src.pipe(dest)
      src.on('end', async () => {
        try {
          let product = new Product({ ...payload, image_url: filename })
          await product.save()

          return res.json(product)
        } catch (error) {
          fs.unlinkSync(target_path)
          if (error && error.name === 'ValidationError') {
            return res.json({
              error: 1,
              message: error.message,
              fields: error.errors
            })
          }
          next(error)
        }
      })

      src.on('error', async () => {
        next(error)
      })
    } else {
      let product = new Product(payload)
      await product.save()

      return res.json(product)
    }
  } catch (error) {
    if (error && error.name === 'ValidationError') {
      return res.json({
        error: 1,
        message: error.message,
        fields: error.errors
      })
    }
    next(error)
  }
}

const update = async (req, res, next) => {
  const { id } = req.params
  try {
    let payload = req.body

    if (payload.category) {
      let category = await Category.findOne({
        name: { $regex: payload.category, $options: 'i' }
      })
      if (category) {
        payload = { ...payload, category: category_id }
      } else {
        delete payload.category
      }
    }

    if (payload.tags && payload.length > 0) {
      let tags = await Tag.find({
        name: { $in: payload.tags }
      })
      if (tags.length) {
        payload = { ...payload, tags: tags.map(tag => tag._id) }
      } else {
        delete payload.category
      }
    }

    if (req.file) {
      let tmp_path = req.file.path
      let originalExt = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1]
      let filename = req.file.filename + '.' + originalExt
      let target_path = path.resolve(config.rootPath, `public/images/products/${filename}`)

      const src = fs.createReadStream(tmp_path)
      const dest = fs.createWriteStream(target_path)

      src.pipe(dest)
      src.on('end', async () => {
        try {
          let product = await Product.findById(id)
          let currentImage = `${config.rootPath}/public/images/products/${product.image_url}`

          if (fs.existsSync(currentImage)) {
            fs.unlinkSync(currentImage)
          }

          product = await Product.findByIdAndUpdate(id, payload, {
            new: true,
            runValidators: true
          })

          return res.json(product)
        } catch (error) {
          fs.unlinkSync(target_path)
          if (error && error.name === 'ValidationError') {
            return res.json({
              error: 1,
              message: error.message,
              fields: error.errors
            })
          }
          next(error)
        }
      })

      src.on('error', async () => {
        next(error)
      })
    } else {
      let product = await Product.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true
      })

      return res.json(product)
    }
  } catch (error) {
    if (error && error.name === 'ValidationError') {
      return res.json({
        error: 1,
        message: error.message,
        fields: error.errors
      })
    }
    next(error)
  }
}

const index = async (req, res, next) => {
  let { skip = 0, limit = 10 } = req.query
  try {
    let product = await Product
      .find()
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .populate('category')
      .populate('tags')

    return res.json({ "Status": true, "Action": "updated", ...product })
  } catch (error) {
    next(error)
  }
}

const destroy = async (req, res, next) => {
  try {
    let product = await Product.findByIdAndDelete(req.params.id)
    let currentImage = `${config.rootPath}/public/images/products/${product.image_url}`

    if (fs.existsSync(currentImage)) {
      fs.unlinkSync(currentImage)
    }

    return res.json({ "Status": true, "id": product.id, "Action": "deleted" })
  } catch (error) {
    next(error)
  }
}

module.exports = { store, update, index, destroy }