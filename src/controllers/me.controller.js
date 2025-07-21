const userService = require('../services/user.service')

const getMe = async (req, res) => {
  try {
    const user = await userService.getMe(req.user)
    res.status(200).json(user)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

module.exports = {
  getMe,
}
