const express = require ('express');
const app = express();
const path = require('path');
const Campground = require('./models/campground')
const mongoose = require ('mongoose');
const methodOverride = require('method-override');
const morgan = require ('morgan');
const ejsMate = require ('ejs-mate');

app.use (morgan('tiny'));
app.use(express.urlencoded());
app.use(methodOverride('_method'));
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp', {useNewUrlParser:true, useCreateIndex:true, useUnifiedTopology: true}) 
    .then (()=> {
        console.log ("Mongo Connection Open!")
    })
    .catch (err => {
        console.log ("Mongo Error");
        console.log (err);
    });

const db = mongoose.connection;

app.engine ('ejs', ejsMate);
app.set ('view engine', 'ejs');
app.set ('views', path.join(__dirname, 'views') );

app.get ('/', (req, res) => {
    res.render('home');
});

app.get ('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find ({});
    res.render('campgrounds/index', {campgrounds});
});

//new product
app.get ('/campgrounds/new', (req, res) => {
    res.render ('campgrounds/new');
});

app.post ('/campgrounds', async (req, res) => {

    // res.send (req.body)
    // const {title, city, state, price} = {req.body};
    const c = new Campground ( req.body);
    await c.save();
    res.redirect(`campgrounds/${c._id}`);
});

app.get ('/campgrounds/:id', async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById (id);
    console.log (campground);
    res.render('campgrounds/show', {campground});
});
    
app.get ('/campgrounds/:id/edit', async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', {campground});    
});

app.put ('/campgrounds/:id', async (req, res) => {
    const {id} = req.params;    
    const campground = await Campground.findByIdAndUpdate(id, req.body, {runValidators: true, new: true});
    res.redirect (`/campgrounds/${campground._id}`);
});

app.delete ('/campgrounds/:id', async (req, res) => {
    const {id} = req.params;
    const done = await Campground.findByIdAndDelete (id);
    res.redirect ('/campgrounds')
});

app.listen (3000, () => {
    console.log ('serving on port 3000');
});
