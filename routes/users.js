const express=require('express');
const router=express.Router();
const wrapAsync=require('../Utils/wrapAsync');
const passport = require('passport');
const {storeUrl}=require('../middleware');
const user = require('../controllers/user');

router.route('/register')
.get(user.renderRegisterUser)
.post(wrapAsync(user.registerUser)); 

router.route('/login')
.get(user.renderLoginUser)
.post(storeUrl,passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),user.loginUser)

router.get("/logout",user.logout); 

module.exports=router;