const express = require('express');
const methodOverride = require('method-override');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const Review = require('./models/review');
const Campground = require('./models/campground');

const app = express();
app.engine('ejs', ejsMate);

mongoose.connect('mongodb://127.0.0.1:27017/Campground', {})
    .then(() => {
        console.log("MongoDB connection established successfully.");
    })
    .catch(err => {
        console.error("MongoDB connection error:", err);
    });

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'yourSecretKey', // Change this to a secret key for production
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Use true if using HTTPS
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

// Utility function to catch and handle async errors
const catchAsync = fn => (req, res, next) => {
    fn(req, res, next).catch(next);
};

// Custom Error Class
class AppError extends Error {
    constructor(message, statusCode) {
        super();
        this.message = message;
        this.statusCode = statusCode;
    }
}

// Function to modify returnTo path
const modifyReturnToPath = (path) => {
    if (path.includes('/reviews')) {
        const segments = path.split('/');
        if (segments.length >= 4) {
            return `/${segments[1]}/${segments[2]}`;
        }
    }
    return path;
}

const isLogin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must login first');
        return res.redirect('/login');
    }
    next();
}


const isAuthor= async (req,res,next)=>{
    const {id}=req.params;
    const camp=await Campground.findById(id);
    if(!camp.author.equals(req.user._id))
    {
        req.flash('error','You do not have permission to do that');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}



const isAuthorReview = async (req, res, next) => {
    const { campId, reviewId } = req.params;
    const review = await Review.findById(reviewId).populate('author');
    if (!review) {
        req.flash('error', 'No such review found');
        return res.redirect(`/campgrounds/${campId}`);
    }
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that');
        return res.redirect(`/campgrounds/${campId}`);
    }
    next();
};


const storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = modifyReturnToPath(req.session.returnTo);
    }
    next();
};

// Route to render registration form
app.get('/register', (req, res) => {
    res.render('users/register');
});

// Route to handle registration
app.post('/register', catchAsync(async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Yelp Camp!');
            res.redirect('/campgrounds');
        });
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}));

app.get('/login', (req, res) => {
    res.render('users/login');
});

app.post('/login', storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'Welcome back to YelpCamp');
    const returnTo = res.locals.returnTo || '/campgrounds';
    delete req.session.returnTo; // Remove the returnTo after using it
    res.redirect(returnTo);
});

app.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye! You have successfully logged out');
        res.redirect('/campgrounds');
    });
});

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/campgrounds', catchAsync(async (req, res) => {
    const camps = await Campground.find({}).populate('reviews');
    res.render('campgrounds/index', { camps });
}));

app.get('/campgrounds/new', isLogin, (req, res) => {
    res.render('campgrounds/new');
});

// app.post('/campgrounds', isLogin, catchAsync(async (req, res) => {
//     const camp1 = new Campground(req.body.camp);
//     camp1.author=req.user._id;
//     await camp1.save();
//     req.flash('success', 'Successfully made a new Campground');
//     res.redirect(`/campgrounds/${camp1._id}`);
// }));




app.post('/campgrounds', isLogin, catchAsync(async (req, res) => {
    const camp1 = new Campground(req.body.camp);
    camp1.author = req.user._id;
    await camp1.save();

    // Find the user and update their campgrounds array
    const user = await User.findById(req.user._id);
    user.campgrounds.push(camp1._id);
    await user.save();

    req.flash('success', 'Successfully made a new Campground');
    res.redirect(`/campgrounds/${camp1._id}`);
}));



// app.get('/campgrounds/:id', catchAsync(async (req, res, next) => {
//     const camp = await Campground.findById(req.params.id).populate({
//         path:'reviews',
//         populate:{
//             path:'author'
//         }
//     }).populate('author');
//     if (!camp) {
//         req.flash('error', 'No campgrounds found');
//         return res.redirect('/campgrounds');
//     }
//     //console.log(camp);
//     res.render('campgrounds/show', { camp });


// }));

app.get('/campgrounds/:id', catchAsync(async (req, res, next) => {
    const camp = await Campground.findById(req.params.id);
    //console.log("Raw Campground Data:", camp);
    const populatedCamp = await Campground.findById(req.params.id)
    .populate('author')
    .populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    });
    //console.log("Populated Campground Data:", populatedCamp);
    if (!populatedCamp) {
        req.flash('error', 'No campgrounds found');
        return res.redirect('/campgrounds');
    }
    if (!populatedCamp.author) {
        req.flash('error', 'Author not found');
        return res.redirect('/campgrounds');
    }
    //console.log(populatedCamp);
    res.render('campgrounds/show', { camp: populatedCamp });
}));



app.get('/campgrounds/:id/edit', isLogin, isAuthor,catchAsync(async (req, res, next) => {
    const camp = await Campground.findById(req.params.id);
    if (!camp) {
        req.flash('error', 'No campgrounds found');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { camp });
}));

app.put('/campgrounds/:id', isLogin,isAuthor, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const camp1 = await Campground.findByIdAndUpdate(id, { ...req.body.camp }, { new: true, runValidators: true });
    if (!camp1) {
        req.flash('error', 'No campgrounds found');
        return res.redirect('/campgrounds');
    }
    req.flash('success', 'Successfully updated the Campground');
    res.redirect(`/campgrounds/${camp1._id}`);
}));

// app.delete('/campgrounds/:id', isLogin,isAuthor, catchAsync(async (req, res, next) => {
//     const { id } = req.params;
//     const camp = await Campground.findByIdAndDelete(id);
//     for (let review of camp.reviews) {
//         await Review.findByIdAndDelete(review);
//     }
//     if (!camp) {
//         req.flash('error', 'No campgrounds found');
//         return res.redirect('/campgrounds');
//     }
//     req.flash('success', 'Successfully deleted the Campground');
//     res.redirect('/campgrounds');
// }));



app.delete('/campgrounds/:id', isLogin, isAuthor, async (req, res) => {
    const { id } = req.params;

    try {
        // Find the campground to delete
        const camp = await Campground.findByIdAndDelete(id);

        if (!camp) {
            req.flash('error', 'Campground not found');
            return res.redirect('/campgrounds');
        }

        // Remove campground ID from user's campgrounds array
        const user = await User.findById(req.user._id);
        user.campgrounds.pull(id);
        await user.save();

        // Get the list of review IDs
        const reviewIds = camp.reviews;

        // Remove each review ID from the corresponding author's reviews array
        for (let reviewId of reviewIds) {
            const review = await Review.findById(reviewId);

            if (review) {
                const reviewAuthor = await User.findById(review.author);
                if (reviewAuthor) {
                    reviewAuthor.reviews.pull(reviewId);
                    await reviewAuthor.save();
                }
            }
        }

        // Delete associated reviews
        await Review.deleteMany({ _id: { $in: reviewIds } });

        req.flash('success', 'Successfully deleted campground');
        res.redirect('/campgrounds');
    } catch (err) {
        console.error('Error deleting campground:', err);
        req.flash('error', 'Failed to delete campground');
        res.redirect('/campgrounds');
    }
});




// app.post('/campgrounds/:id/reviews', isLogin, catchAsync(async (req, res) => {
//     const camp = await Campground.findById(req.params.id);
//     const review = new Review(req.body.review);
//     review.author=req.user._id;
//     camp.reviews.push(review);
//     await review.save();
//     await camp.save();
//     req.flash('success', 'Successfully added the review');
//     res.redirect(`/campgrounds/${camp._id}`);
// }));

app.post('/campgrounds/:id/reviews', isLogin, catchAsync(async (req, res) => {
    // Find the campground by ID
    const camp = await Campground.findById(req.params.id);

    // Create a new review
    const review = new Review(req.body.review);

    // Assign the current user as the author of the review
    review.author = req.user._id;
    review.camp=req.params.id;
    // Push the new review into the campground's reviews array
    camp.reviews.push(review);

    // Save the review and the campground
    await review.save();
    await camp.save();

    // Push the review into the user's reviews array
    const user = await User.findById(req.user._id);
    user.reviews.push(review);
    await user.save();

    // Flash message for success
    req.flash('success', 'Successfully added the review');

    // Redirect back to the campground's page
    res.redirect(`/campgrounds/${camp._id}`);
}));


// app.delete('/campgrounds/:campId/:reviewId/reviews', isLogin,isAuthorReview, catchAsync(async (req, res, next) => {
//     const { campId, reviewId } = req.params;
//     const camp = await Campground.findById(campId);
    
//     if (!camp) {
//         req.flash('error', 'No such campground found');
//         return res.redirect('/campgrounds');
//     }

//     camp.reviews = camp.reviews.filter(review => review != reviewId);
//     await camp.save();

//     const review = await Review.findByIdAndDelete(reviewId);
    
//     if (!review) {
//         req.flash('error', 'No such review found');
//         return res.redirect(`/campgrounds/${campId}`);
//     }

//     req.flash('success', 'Successfully deleted the review');
//     res.redirect(`/campgrounds/${campId}`);
// }));



app.delete('/campgrounds/:campId/:reviewId/reviews', isLogin, isAuthorReview, catchAsync(async (req, res, next) => {
    const { campId, reviewId } = req.params;

    // Find the campground by ID
    const camp = await Campground.findById(campId);
    
    if (!camp) {
        req.flash('error', 'No such campground found');
        return res.redirect('/campgrounds');
    }

    // Remove the review ID from the campground's reviews array
    camp.reviews = camp.reviews.filter(review => review != reviewId);
    await camp.save();

    // Find the review by ID and delete it
    const review = await Review.findByIdAndDelete(reviewId);
    
    if (!review) {
        req.flash('error', 'No such review found');
        return res.redirect(`/campgrounds/${campId}`);
    }

    // Remove the review ID from the user's reviews array
    const user = await User.findById(req.user._id);
    user.reviews = user.reviews.filter(userReview => userReview != reviewId);
    await user.save();

    // Flash message for success
    req.flash('success', 'Successfully deleted the review');

    // Redirect back to the campground's page
    res.redirect(`/campgrounds/${campId}`);
}));



app.get('/user/:id',async (req,res)=>{
    const {id}=req.params;
    const user=await User.findById(id)
    .populate({
        path: 'reviews',
        populate: {
            path: 'camp'
        }
    })
    .populate({
        path: 'campgrounds',
        populate: {
            path: 'reviews'
        }
    });
    //console.log(user.reviews);
    res.render('user/show',{user});
})
app.all('*', (req, res, next) => {
    next(new AppError('Page not found', 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'Something went wrong!' } = err;
    res.status(statusCode).render('error', { err });
});

app.listen(3000, () => {
    console.log('Serving on port 3000');
});


