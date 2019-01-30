const Sequelize = require('sequelize')
const db = require('../../db')
const Message = db.define('message', {
  text: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  main: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  }
})

module.exports = Message
