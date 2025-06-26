const express = require('express');
const User = require('../models/userModel');
const router = express.Router();

//auth login
// router.get('/login/check', async(req, res) => {
//     const data = await User.findOne({_id:req.user.userId}).select('-blogs -password')

//     const baseUrl = `${req.protocol}://${req.get('host')}`;

//     const user = {...data._doc, avatar: `${baseUrl}/uploads/userAvatar/${data.avatar}`}

//     res.json({ authenticated: true, user});
// });

router.get('/login/check', checkLogin, async (req, res) => {
    try {
        const data = await User.findById(req.user.userId).select('-blogs -password');
        if (!data) {
            return res.status(404).json({ authenticated: false, message: "User not found" });
        }

        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const user = { ...data._doc, avatar: `${baseUrl}/uploads/userAvatar/${data.avatar}` };

        res.json({ authenticated: true, user });
    } catch (err) {
        console.error('Error in /login/check:', err.message);
        res.status(500).json({ authenticated: false, message: "Internal server error" });
    }
});

//auth logout
router.post('/logout', (req, res)=>{
    if (process.env.COOKIE_NAME) {
      res.clearCookie(process.env.COOKIE_NAME, {
        httpOnly: true,
        secure: true,  // Ensure it matches the original cookie settings
        signed: true,  // Ensure it matches the original cookie settings
      });
      res.status(200).json({message: 'Logged out'});
    }else{
      res.status(500).json({error: "there is server side error while logout the removing cookie!"})
    }
  })

module.exports = router;