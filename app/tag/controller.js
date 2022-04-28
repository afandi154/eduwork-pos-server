const Tag = require('./model')

const store = async (req, res, next) => {
  try {
    let payload = req.body
    let tag = new Tag(payload)

    await tag.save()
    return res.json(tag)
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
  try {
    let payload = req.body
    let tag = await Tag.findByIdAndUpdate(req.params.id, payload,
      { name: true, runValidators: true }
    )

    return res.json(tag)
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

const destroy = async (req, res, next) => {
  try {
    let tag = await Tag.findByIdAndDelete(req.params.id)

    return res.json(tag)
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
  try {
    let tag = await Tag.find()

    return res.json(tag)
  } catch (error) {
    if (error && error.name === 'ValidationError') {
      return res.json({
        error: 1,
        message: error.message,
        field: error.errors
      })
    }
    next(error)
  }
}

module.exports = {
  store, update, destroy, index
}