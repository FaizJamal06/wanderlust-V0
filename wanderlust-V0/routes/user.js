const express = require('express');
const router = express.Router();
const passport = require('passport');
const { saveredirecturl } = require('../utils/middleware');
const userController = require('../controllers/users');

router.get('/signup', userController.renderSignup);
router.post('/signup', userController.signup);

router.get('/login', userController.renderLogin);
router.post(
  '/login',
  saveredirecturl,
  passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true,
  }),
  userController.login
);

// Logout route
router.post('/logout', userController.logout);

// router.get("/logout", (req, res, next) => {
//     req.logout((err)=>{
//         if(err){
//             next(err);
//         }
//     });
//     req.flash("success", "Goodbye!");
//     res.redirect("/listings");
// });

module.exports = router;