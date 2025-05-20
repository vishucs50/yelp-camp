const { cloudinary } = require("../cloudinary");
const CampGround = require("../models/campground");
const ExpressError = require("../Utils/ExpressError");
const maptilerClient=require("@maptiler/client");
const maptilerApiKey = process.env.MAPTILER_API_KEY;
maptilerClient.config.apiKey=maptilerApiKey;

module.exports.index = async (req, res) => {
  const campgrounds = await CampGround.find({});
  res.render("campground/index", { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
  res.render("campground/new");
};

module.exports.createCampground = async (req, res) => {
  if (!req.body.campground) {
    throw new ExpressError("Invalid Campground Data", 400);
  }
  const geoData = await maptilerClient.geocoding.forward(
    req.body.campground.location,
    { limit: 1 }
  );
  const camp = new CampGround(req.body.campground);
  camp.geometry = geoData.features[0].geometry;
  camp.images=req.files.map(f=>({url:f.path,filename:f.filename}))
  camp.author = req.user._id;
  console.log(camp);
  await camp.save();
  req.flash("success", "You have successfully created a new campground");
  res.redirect(`/campgrounds/${camp._id}`);
};

module.exports.showCampground = async (req, res) => {
  const { id } = req.params;
  const foundCampground = await CampGround.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  if (!foundCampground) {
    req.flash("error", "Cannot find that particular campground");
    return res.redirect("/campgrounds");
  }
  res.render("campground/show", { foundCampground });
};

module.exports.renderEditForm = async (req, res) => {
  const foundcamp = await CampGround.findById(req.params.id);
  if (!foundcamp) {
    req.flash("error", "Cannot find that particular campground");
    return res.redirect("/campgrounds");
  }
  res.render("campground/edit", { foundcamp });
};

module.exports.updateCampground = async (req, res) => {
  const { id } = req.params;
  const campground = await CampGround.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));;
  campground.images.push(...imgs);
  await campground.save();
  if(req.body.deleteImages){
    for(let filename of req.body.deleteImages)
    {
      await cloudinary.uploader.destroy(filename);
    }
    await campground.updateOne({$pull :{images:{filename:{$in:req.body.deleteImages}}}})
  }
  req.flash("success", "You have successfully updated a campground");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;
  await CampGround.findByIdAndDelete(id);
  req.flash('success',"Deleted a campground successfully")
  res.redirect("/campgrounds");
};