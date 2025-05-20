const Review = require("../models/review");
const CampGround = require("../models/campground");

module.exports.addReview = async (req, res) => {
  const campground = await CampGround.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  req.flash("success", "new review added successfully");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await CampGround.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(req.params.reviewId);
  req.flash("success", "successfully deleted a review");
  res.redirect(`/campgrounds/${id}`);
};