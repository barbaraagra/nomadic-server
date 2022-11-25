const router = require('express').Router();
const axios = require('axios');
const { isAuthenticated } = require('../middleware/jwt.middleware');
const City = require('../models/City.model')
const Comment = require('../models/Comment.model')
const User = require('../models/User.model')

//Esta rota é  só mesmo para criar cidades na base de dados

router.post("/cityfromapi/:name", async (req, res, next) => {

    const { name } = req.params
    try {

        const nameResponse = await axios.get(`https://api.teleport.org/api/urban_areas/slug:${name}/`)
        const imgResponse = await axios.get(`https://api.teleport.org/api/urban_areas/slug:${name}/images`)
        const response = await axios.get(`https://api.teleport.org/api/urban_areas/slug:${name}/details/`)
        const fullName = nameResponse.data.full_name
        const continent = nameResponse.data.continent
        const image = imgResponse.data.photos[0].image.web
        const cityDetails = response.data
        console.log(cityDetails.categories[5])

        const createdCity = await City.create({
            cityName: fullName,
            continent,
            currency: cityDetails.categories[5].data[0].string_value,
            language: cityDetails.categories[11].data[2].string_value,
            englishSkills: cityDetails.categories[11].data[0].int_value,
            lifeExpectancy: cityDetails.categories[7].data[1].float_value,
            coworkingSpaces: cityDetails.categories[17].data[14].int_value,
            cityImage: image
        })

        console.log(createdCity);

        res.json(createdCity)
    } catch (error) {
        next(error);
    }
});



router.get('/cities/:id', async (req, res, next) => {
    try {

        const { id } = req.params;
        const cityDetail = await City.findById(id)
            .populate('comments')
            .populate({
                path: "comments",
                populate: {
                    path: "author",
                    model: "User",
                },
            })

        res.status(201).json(cityDetail);
    } catch (error) {
        res.json(error);
        next(error);
    }
});


router.get('/favourite-city/:id', isAuthenticated, async (req, res, next) => {
    /*  try {
         const { id } = req.params;
         const userId = req.payload._id;
 
         await User.findByIdAndUpdate(userId, { $push: { nextCities: id } })
         await City.findByIdAndUpdate(id, { $push: { favorite: userId } })
 
         res.status(201).json({ message: `yay!` });
     } catch (error) {
         console.log(error);
         res.status(500).json(error);
     } */

    try {
        const { id } = req.params;
        const userId = req.payload._id;

        const thisCity = await City.findById(id);

        if (thisCity.favorite.includes(id)) {
            await City.findByIdAndUpdate(id, { $pull: { favorite: userId } });
            res.status(200).json({ message: `City Disfavourited` });
        } else {
            await City.findByIdAndUpdate(id, { $push: { favorite: userId } });
            res.status(200).json({ message: `City Favourited` });
        }

        const thisUser = await User.findById(userId);

        if (thisUser.nextCities.includes(userId)) {
            await User.findByIdAndUpdate(userId, { $pull: { nextCities: id } });
            res.status(200).json({ message: `User Unfavourite` });
        } else {
            await User.findByIdAndUpdate(userId, { $push: { nextCities: id } });
            res.status(200).json({ message: `User Favourited` });
        }
    } catch (error) {
        console.log(error);
    }
});

router.post('/comments/create', isAuthenticated, async (req, res, next) => {
    const user = req.payload;
    const { content } = req.body;
    try {

        const createdComment = await Comment.create({ content: content, author: user._id });
        await User.findByIdAndUpdate(user._id, { $push: { comments: createdComment._id, } }, { new: true })

        res.status(201).json(createdComment);
    } catch (error) {
        console.log(error);
        next(error);
    }
});

router.put('/comments/create/:id', async (req, res, next) => {
    const { id } = req.params;
    try {


        res.status(201).json(commentUpdate);
    } catch (error) {
        console.log(error);
        next(error);
    }
});

router.post("/comment-delete/:id/:cityId", async (req, res, next) => {
    try {
        const { id, cityId } = req.params;
        const commentToDelete = await Comment.findById(id)


        res.status(201).json(commentToDelete);

    } catch (error) {
        console.log(error)
        next(error)
    }
});


module.exports = router;