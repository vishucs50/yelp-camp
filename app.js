if(process.env.NODE_ENV!=="production"){
  require('dotenv').config();
}




const path=require('path');
const methodOverride=require('method-override');
const express=require('express');
const ejsMate=require('ejs-mate');
const ExpressError=require('./Utils/ExpressError');
const app=express();
const flash=require('connect-flash')
const mongoose=require('mongoose');
const session=require('express-session');
const passport=require('passport');
const LocalStrategy=require('passport-local');
const User=require('./models/user');
const mongoSanitize = require("express-mongo-sanitize");
const UserRoutes=require('./routes/users')
const campgroundsroutes=require('./routes/campgrounds')
const reviewsroutes=require('./routes/review');
const helmet=require('helmet');
const MongoStore=require('connect-mongo')
const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017/yelp-camp";;
const store = MongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 60 * 60,
  crypto: {
    secret: "thisshouldbeabettersecret!",
  },
});
store.on("error",function(e){
  console.log("SESSION STORE ERROR:",e)
})
sessionConfig = {
  store,
  name:"yelpcamp",
  secret: "this should be a better session key",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly:true,
    // secure:true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig))
app.use(flash())
app.use(helmet())

const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com/",
  "https://kit.fontawesome.com/",
  "https://cdnjs.cloudflare.com/",
  "https://cdn.jsdelivr.net",
  "https://cdn.maptiler.com/",
];
const styleSrcUrls = [
  "https://kit-free.fontawesome.com/",
  "https://stackpath.bootstrapcdn.com/",
  "https://fonts.googleapis.com/",
  "https://use.fontawesome.com/",
  "https://cdn.jsdelivr.net",
  "https://cdn.maptiler.com/", 
];
const connectSrcUrls = [
  "https://api.maptiler.com/"
];
const fontSrcUrls = [];
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", "blob:"],
      objectSrc: [],
      imgSrc: [
        "'self'",
        "blob:",
        "data:",
        "https://res.cloudinary.com/delj7yz6d/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
        "https://images.unsplash.com/",
        "https://api.maptiler.com/",
      ],
      fontSrc: ["'self'", ...fontSrcUrls],
    },
  })
);


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


mongoose.connect(dbUrl);
const db=mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once("open",()=>console.log("Database connected"));

app.set('view engine','ejs');
app.engine('ejs', ejsMate);
app.set('views',path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use((req,res,next)=>{
  res.locals.currentUser=req.user;    
  res.locals.error=req.flash('error');
  res.locals.success=req.flash('success');
  next();
})

app.get('/',(req,res)=>{
  res.render('home');
})
app.use('/',UserRoutes);
app.use('/campgrounds',campgroundsroutes);
app.use('/campgrounds/:id/reviews',reviewsroutes);

app.use(
  mongoSanitize({
    replaceWith: "_",
  })
);
app.all(/(.*)/,(req,res,next)=>{
  next(new ExpressError("Page not found",404));
})

app.use((err,req,res,next)=>{
    const{status=500}=err;
    if(!err.message) err.message="Something went wrong"
    res.status(status).render('campground/error',{err});
})

app.listen(3000,()=>{
    console.log('Serving on port 3000')
})