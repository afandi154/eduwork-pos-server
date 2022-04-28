const mongoose = require('mongoose')
const { model, Schema } = mongoose

let productSchema = Schema({
  name: {
    type: String,
    minlength: [3, 'Panjang nama kategori minimal 3 karakter'],
    required: [true, 'Nama kategori harus diisi']
  },
  description: {
    type: String,
    maxlength: [1000, 'Panjang nama kategori maksimal 1000 karakter']
  },
  price: {
    type: Number,
    default: 0
  },
  image_url: String,
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category'
  },
  tags: {
    type: Schema.Types.ObjectId,
    ref: 'Tag'
  }

}, { timestamps: true })

module.exports = model('Product', productSchema)