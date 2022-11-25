const router = require('express').Router();
const User = require('../models/User.model');
const { isAuthenticated } = require('../middleware/jwt.middleware');


/* Get all profile */

router.get('/profile/:id', async (req, res) => {
    const { id } = req.params;
/*     const user = req.payload;
 */    try {
        const profile = await User.findById(id)
            .populate("nextCities");
        res.status(200).json(profile);
    } catch (error) {
    }
});


/* Edit profile */

router.put('/profile-edit/:id', async (req, res, next) => {
    const { id } = req.params
    const { username, email } = req.body;
    try {
        const updatedUser = await User.findByIdAndUpdate(id, { username, email }, { new: true });
        res.status(200).json(updatedUser);
    } catch (error) {
        console.log(error);
        next(error);
    }
});

/* Delete specific things on profile */

router.delete('/profile/:id', isAuthenticated, async (req, res, next) => {
    const { id } = req.params;
    try {

        await User.findByIdAndRemove(id)
        res.status(200).json({ message: `User with id:${id} was deleted!` })

    } catch (error) {
        next(error);
    }
})

module.exports = router;