const router = require('express').Router()
const {Club, Meeting, User, UserClub} = require('../db/models')
module.exports = router

//GET api/meetings - to find all meetings in one club
router.get('/', async (req, res, next) => {
  try {
    if (!req.body.userId) res.status(403).send('Not authorized')
    if (!req.body.clubId) res.status(403).send('Not authorized')
    else {
      const user = await User.findById(req.body.userId)
      const club = await Club.findById(req.body.clubId)
      const check = await club.hasUser(user.id)
      if (!check)
        res
          .status(403)
          .send('You are not authorized to see the meetings for this club')
      else {
        const meetings = await Meeting.findAll({where: {clubId: club.id}})
        res.json(meetings)
      }
    }
  } catch (err) {
    next(err)
  }
})

//POST api/meetings/create - to create a meeting
router.post('/create', async (req, res, next) => {
  try {
    if (!req.body.userId) res.status(403).send('Not authorized')
    if (!req.body.clubId) res.status(403).send('Not authorized')
    const user = await User.findById(req.body.userId)
    const club = await Club.findById(req.body.clubId)
    const check = await club.hasUser(user.id)
    if (!check)
      res.status(403).send('Not authorized to create a meeting for this club')
    else {
      const newMeeting = await Meeting.create(req.body)
      res.json(newMeeting)
    }
  } catch (err) {
    next(err)
  }
})