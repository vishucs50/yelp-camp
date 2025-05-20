const express=require('express');
const wrapAsync = require("../Utils/wrapAsync");
const {isloggedin,isAuth,ValidateCampground}=require('../middleware')
const router=express.Router();
const campgrounds = require("../controllers/campground");
const multer=require('multer');
const {storage}=require('../cloudinary/index');
const upload=multer({storage});
router.route("/")
.get(wrapAsync(campgrounds.index))
.post(isloggedin,upload.array('image'),ValidateCampground,wrapAsync(campgrounds.createCampground));
router.get("/new",isloggedin,campgrounds.renderNewForm);

router.route("/:id")
.get(wrapAsync(campgrounds.showCampground))
.patch(isloggedin,isAuth,upload.array('image'),ValidateCampground,wrapAsync(campgrounds.updateCampground))
.delete(isloggedin,isAuth,wrapAsync(campgrounds.deleteCampground));


router.get("/:id/edit",isloggedin,wrapAsync(campgrounds.renderEditForm));


module.exports=router;