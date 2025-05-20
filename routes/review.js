const express=require('express');
const router=express.Router({mergeParams:true}); 
const wrapAsync = require("../Utils/wrapAsync");
const {validateReview,isloggedin,isReviewAuth}=require('../middleware');
const reviews=require('../controllers/review');

router.post("/",isloggedin,validateReview,wrapAsync(reviews.addReview));

router.delete("/:reviewId",isloggedin,isReviewAuth,wrapAsync(reviews.deleteReview));

module.exports=router;