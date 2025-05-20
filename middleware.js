const campground = require("./models/campground");
const Review = require("./models/review");
const ExpressError = require("./Utils/ExpressError");
const { campgroundSchema } = require("./Validation/schemas");
const { reviewSchema } = require("./Validation/schemas");

const validateReview = (req, res, next) => {
  const result = reviewSchema.validate(req.body);
  if (result.error) {
    const err = result.error.details.map((el) => el.message).join(",");
    throw new ExpressError(err, 400);
  } else {
    next();
  }
};
const isloggedin=(req,res,next)=>{
    // console.log("Req.User:",req.user); is used to get current logged in user details
    if(!req.isAuthenticated())
    {
        console.log(req.originalUrl);
        req.session.returnTo=req.originalUrl;
        req.flash('error','you must be signed in');
        res.redirect('/login');
    }
    else
    {
        next()
    }
}
const storeUrl=(req,res,next)=>{
    if(req.session.returnTo)
    {
        res.locals.returnTo=req.session.returnTo;
    }
    next();
}
const isAuth=async (req,res,next)=>{
    const id=req.params.id;
    const camp=await campground.findById(id);
    if(!camp)
    {
        req.flash('error','Unable to find campground');
        res.redirect('/campgrounds');
        return;
    }
    else if(!camp.author.equals(req.user._id))
    {
        req.flash('error','You do not have permission to do that');
        res.redirect(`/campgrounds/${id}`)
    }
    else 
    {
        next();
    }

}
const isReviewAuth=async (req,res,next)=>{
    const {id,reviewId}=req.params;
    const review=await Review.findById(reviewId);
    if(!review)
    {
        req.flash('error','Unable to find campground');
        res.redirect(`/campgrounds/${id}`);
    }
    else if(!review.author.equals(req.user._id))
    {
        req.flash('error','You do not have permission to do that');
        res.redirect(`/campgrounds/${id}`)
    }
    else 
    {
        next();
    }

}
const ValidateCampground=(req,res,next)=>{
    const result=campgroundSchema.validate(req.body);
    if(result.error)
    {
        const err=result.error.details.map(el=>el.message).join(',');
        throw new ExpressError(err,400);
    }
    else
    {
        next();
    }
}
module.exports.isloggedin = isloggedin;
module.exports.storeUrl = storeUrl;
module.exports.isAuth=isAuth;
module.exports.isReviewAuth=isReviewAuth;
module.exports.ValidateCampground=ValidateCampground;
module.exports.validateReview=validateReview;