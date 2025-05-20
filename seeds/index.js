const CampGround=require('../models/campground');
const mongoose=require('mongoose')
const cities=require('./cities')
const {places,descriptors}=require('./seedHelpers')
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
const db=mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once("open",()=>console.log("Database connected"));
const sample=array=>array[Math.floor(Math.random()*array.length)];
const seedDB=async()=>{
    await CampGround.deleteMany();
    for(let i=0; i<200; i++)
    {
        let random1000=Math.floor(Math.random()*1000);
        const price=Math.floor(Math.random()*20)+10;
        const camp = new CampGround({
          author: "6828624f24bf6340c37912bc",
          location: `${cities[random1000].city},${cities[random1000].state}`,
          title: `${sample(descriptors)} ${sample(places)}`,
          images: [
            {
              url: "https://res.cloudinary.com/delj7yz6d/image/upload/v1747569455/YelpCamp/dyh5qvzbejhln7ixfbz8.jpg",
              filename: "YelpCamp/dyh5qvzbejhln7ixfbz8",
            },
            {
              url: "https://res.cloudinary.com/delj7yz6d/image/upload/v1747569902/YelpCamp/hpdrlpbakgykkjllno5n.png",
              filename: "YelpCamp/hpdrlpbakgykkjllno5n",
            },
          ],
          geometry: {
            type: 'Point',
            coordinates: [ cities[random1000].longitude, cities[random1000].latitude ]
          },
          description:
            "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Temporibus sit harum quisquam veniam, excepturi minus reprehenderit placeat dignissimos fugiat atque quis maxime repudiandae! Quisquam incidunt debitis animi ipsa, magni optio.",
          price: price,
        });
        await camp.save();
    }

}
seedDB().then(()=>{
    mongoose.connection.close();
});