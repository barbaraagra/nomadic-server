const express = require("express");
const router = express.Router();
//const fileUploader = require('../config/cloudinary.config');
const User = require('../models/User.model');
const City = require('../models/City.model');
const Comment = require('../models/Comment.model');
const { isAuthenticated } = require('../middleware/jwt.middleware')


router.get('/', async (req, res, next) => {
  try {
    const allPlaces = await City.find();
    res.render('index', allPlaces);

    if (isLoggedIn === true) {
      res.render('index')
    } else {
      res.render('start')
    }

  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get('/search', async (req, res, next) => {
  try {
    const { cityName } = req.query;
    const foundCity = await City.find({ title: { $regex: new RegExp(cityName, "i") } })
    console.log(foundCity)
    res.render('searchResult', { foundCity });
  } catch (error) {
    console.log(error)
  }

});


module.exports = router;