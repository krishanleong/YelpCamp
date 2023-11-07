const Campground = require('../models/campground')
const mongoose = require ('mongoose');
const cities= require('./cities');
const seedHelper= require('./seedHelpers');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp', {useNewUrlParser:true, useCreateIndex:true, useUnifiedTopology: true}) 
    .then (()=> {
        console.log ("Mongo Connection Open!")
    })
    .catch (err => {
        console.log ("Mongo Error");
        console.log (err);
    });


const seedDB = async () => {
    await Campground.deleteMany ({});
    console.log (seedHelper);
    for (let i = 0; i < 100; i++)
    {
        let x = Math.floor(Math.random () * 1000);
        let descrip = Math.floor(Math.random () * 18);
        let place = Math.floor(Math.random () * 21);
        let rPrice = Math.floor (Math.random()*50 + 70);
        let newCampground = new Campground ({
            location: `${cities[x].city}, ${cities[x].state}`,
            title: `${seedHelper.descriptors[descrip]} ${seedHelper.places[place]}`,
            price: rPrice,
            image: "https://source.unsplash.com/collection/483251",
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit blanditiis maiores, ratione nostrum beatae totam, asperiores iste explicabo perspiciatis numquam laborum saepe quo itaque ipsa atque debitis? Eos, repellendus exercitationem.            Perspiciatis facilis ut reiciendis nobis omnis dolorem saepe praesentium veniam impedit explicabo unde iusto mollitia ratione dolores vel consequatur quis ullam odio pariatur, minus in. Magnam distinctio obcaecati amet rerum?'
        });
        
        await newCampground.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});
