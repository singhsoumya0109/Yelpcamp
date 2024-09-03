// const mongoose = require('mongoose');
// const cities = require('./cities');
// const { places, descriptors } = require('./seedHelpers');
// const Campground = require('../models/campground');
// const Review = require('../models/review');
// const User=require('../models/user');
// mongoose.connect('mongodb://127.0.0.1:27017/Campground')
//     .then(() => {
//         console.log("CONNECTION RUNNING");
//     })
//     .catch(err => {
//         console.log("ERROR BSDK!!!", err);
//     });

// const sample = array => array[Math.floor(Math.random() * array.length)];

// // List of random campground image URLs
// const imageUrls = [
//     'https://images.unsplash.com/photo-1534880606858-29b0e8a24e8d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2FtcGdyb3VuZHxlbnwwfHwwfHx8MA%3D%3D',
//     'https://images.unsplash.com/photo-1533575770077-052fa2c609fc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2FtcGdyb3VuZHxlbnwwfHwwfHx8MA%3D%3D',
//     'https://images.unsplash.com/photo-1503265192943-9d7eea6fc77a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Y2FtcGdyb3VuZHxlbnwwfHwwfHx8MA%3D%3D',
//     'https://images.unsplash.com/photo-1445308394109-4ec2920981b1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGNhbXBncm91bmR8ZW58MHx8MHx8fDA%3D',
//     'https://images.unsplash.com/photo-1564577160324-112d603f750f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGNhbXBncm91bmR8ZW58MHx8MHx8fDA%3D',
//     'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?w=500&auto=format&fit=crop&q=60'
//     // Add more URLs as needed
// ];

// // List of random descriptions
// const descriptions = [
//     'Nestled in lush woods, this serene campground offers spacious sites, modern amenities, and scenic trails. Perfect for families and adventurers, enjoy fishing, campfires, and stargazing under the pristine night sky. Relax and reconnect with nature.',
//     'Experience the great outdoors with breathtaking views, hiking trails, and plenty of wildlife. This campground is ideal for nature enthusiasts looking for a peaceful retreat.',
//     'Enjoy a rustic camping experience with basic facilities, close to lakes and rivers for kayaking and fishing. Perfect for a weekend getaway.',
//     'A well-maintained campground offering beautiful vistas, excellent facilities, and friendly staff. Ideal for both seasoned campers and first-timers.',
//     'Located in a picturesque setting, this campground provides a perfect escape from the hustle and bustle of city life. Enjoy outdoor activities or simply unwind in nature.',
//     'A family-friendly campground with playgrounds, picnic areas, and plenty of activities for children. A great spot for making lasting memories with loved ones.'
//     // Add more descriptions as needed
// ];

// const reviewBody = {
//     6: 'Good',
//     7: 'Pretty decent',
//     8: 'Very good',
//     9: 'Loved it',
//     10: 'Enjoyed it at the fullest',
//     2: 'Bad',
//     1: 'Very bad',
//     3: 'Good',
//     4: 'Very good',
//     5: 'Loved it'
// };


// function getWeightedRandom() {
//     // Define weights for numbers 1 to 5
//     const weights = [1, 1, 20, 30, 25]; // Weights: 1, 2, 3, 4, 5 respectively
//     const cumulativeWeights = [];
//     let sum = 0;
    
//     // Calculate cumulative weights
//     for (let weight of weights) {
//         sum += weight;
//         cumulativeWeights.push(sum);
//     }

//     // Generate a random number between 0 and the sum of weights
//     const random = Math.random() * sum;

//     // Find the corresponding number based on the cumulative weights
//     for (let i = 0; i < cumulativeWeights.length; i++) {
//         if (random < cumulativeWeights[i]) {
//             return i + 1;
//         }
//     }
// }




// const seedDB = async () => {
//     const admin=await User.findById('668f640ebae87182931abfcb');
//     const like=await User.findById('668f6434bae87182931abfd4');
//     await Campground.deleteMany({});
//     await Review.deleteMany({}); // Make sure to clear existing reviews
//     const ratedReviews = Math.floor(Math.random() * 11) + 100;
//     for (let i = 0; i < ratedReviews; i++) {
//         const random1000 = Math.floor(Math.random() * 1000);
//         const random10001 = Math.floor(Math.random() * 1000);
//         const price1 = Math.floor(Math.random() * 20) + 10;

//         const camp = new Campground({
//             location: `${cities[random1000].city}, ${cities[random10001].state}`,
//             title: `${sample(descriptors)} ${sample(places)}`,
//             image: sample(imageUrls), // Use a random image URL
//             description: sample(descriptions), // Use a random description
//             price: price1,
//             author:'668dfe8bdc6f149f41f66514'
//         });

//         await camp.save();

        
//         const reviewCount = Math.floor(Math.random() * 1001) + 1000; // Random number between 100 and 200
//         for (let j = 0; j < reviewCount; j++) {
//             const rating1 = getWeightedRandom();
//             const review = new Review({
//                 body: reviewBody[rating1],
//                 rating: rating1,
//                 author:'668e1626bcbb89f71aed61af'
//             });
//             like.reviews.push(review);
//             await review.save();
//             camp.reviews.push(review); // Assuming you have a reviews array in Campground schema
//         }
//         admin.campgrounds.push(camp);
//         await camp.save(); // Save campground again with the reviews
//     }
//     const noReview = Math.floor(Math.random() * 11) + 10;
//     // Create campgrounds with no reviews
//     for (let i = 0; i <noReview; i++) {
//         const random1000 = Math.floor(Math.random() * 1000);
//         const random10001 = Math.floor(Math.random() * 1000);
//         const price1 = Math.floor(Math.random() * 20) + 10;

//         const camp = new Campground({
//             location: `${cities[random1000].city}, ${cities[random10001].state}`,
//             title: `${sample(descriptors)} ${sample(places)}`,
//             image: sample(imageUrls), // Use a random image URL
//             description: sample(descriptions), // Use a random description
//             price: price1,
//             author:'668dfe8bdc6f149f41f66514'
//         });
//         admin.campgrounds.push(camp);
//         await camp.save(); // Save campground without reviews
//     }
//     await admin.save();
//     await like.save();
// }

// seedDB().then(() => {
//     mongoose.connection.close();
// });




const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');
const Review = require('../models/review');
const User = require('../models/user');

mongoose.connect('mongodb://127.0.0.1:27017/Campground')
    .then(() => {
        console.log("CONNECTION RUNNING");
    })
    .catch(err => {
        console.log("ERROR BSDK!!!", err);
    });

const sample = array => array[Math.floor(Math.random() * array.length)];

// List of random campground image URLs
const imageUrls = [
    'https://images.unsplash.com/photo-1534880606858-29b0e8a24e8d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2FtcGdyb3VuZHxlbnwwfHwwfHx8MA%3D%3D',
    'https://images.unsplash.com/photo-1533575770077-052fa2c609fc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2FtcGdyb3VuZHxlbnwwfHwwfHx8MA%3D%3D',
    'https://images.unsplash.com/photo-1503265192943-9d7eea6fc77a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Y2FtcGdyb3VuZHxlbnwwfHwwfHx8MA%3D%3D',
    'https://images.unsplash.com/photo-1445308394109-4ec2920981b1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGNhbXBncm91bmR8ZW58MHx8MHx8fDA%3D',
    'https://images.unsplash.com/photo-1564577160324-112d603f750f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGNhbXBncm91bmR8ZW58MHx8MHx8fDA%3D',
    'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?w=500&auto=format&fit=crop&q=60'
    // Add more URLs as needed
];

// List of random descriptions
const descriptions = [
    'Nestled in lush woods, this serene campground offers spacious sites, modern amenities, and scenic trails. Perfect for families and adventurers, enjoy fishing, campfires, and stargazing under the pristine night sky. Relax and reconnect with nature.',
    'Experience the great outdoors with breathtaking views, hiking trails, and plenty of wildlife. This campground is ideal for nature enthusiasts looking for a peaceful retreat.',
    'Enjoy a rustic camping experience with basic facilities, close to lakes and rivers for kayaking and fishing. Perfect for a weekend getaway.',
    'A well-maintained campground offering beautiful vistas, excellent facilities, and friendly staff. Ideal for both seasoned campers and first-timers.',
    'Located in a picturesque setting, this campground provides a perfect escape from the hustle and bustle of city life. Enjoy outdoor activities or simply unwind in nature.',
    'A family-friendly campground with playgrounds, picnic areas, and plenty of activities for children. A great spot for making lasting memories with loved ones.'
    // Add more descriptions as needed
];

const reviewBody = {
    1: 'Very bad. The experience was disappointing from start to finish. There were numerous issues that overshadowed any positives.',
    2: 'Bad. There were several problems that negatively affected my experience, making it hard to enjoy.',
    3: 'Good. Overall, the experience was satisfactory. There were some minor issues, but nothing that ruined it.',
    4: 'Very good. I enjoyed my experience quite a bit. There were a few things that could be improved, but they were minor.',
    5: 'Loved it. Everything was fantastic! I had an amazing experience and would highly recommend it to others.'
};


function getWeightedRandom() {
    // Define weights for numbers 1 to 5
    const weights = [1, 1, 20, 30, 25]; // Weights: 1, 2, 3, 4, 5 respectively
    const cumulativeWeights = [];
    let sum = 0;
    
    // Calculate cumulative weights
    for (let weight of weights) {
        sum += weight;
        cumulativeWeights.push(sum);
    }

    // Generate a random number between 0 and the sum of weights
    const random = Math.random() * sum;

    // Find the corresponding number based on the cumulative weights
    for (let i = 0; i < cumulativeWeights.length; i++) {
        if (random < cumulativeWeights[i]) {
            return i + 1;
        }
    }
}

const seedDB = async () => {
    const admin = await User.findById('6690d74efdf312fd8ed6c0b5');
    const like = await User.findById('6690d761fdf312fd8ed6c0be');

    // Clear existing reviews and campgrounds for admin and like
    admin.reviews = [];
    admin.campgrounds = [];
    like.reviews = [];
    like.campgrounds = [];
    await admin.save();
    await like.save();

    await Campground.deleteMany({});
    await Review.deleteMany({});

    const ratedReviews = Math.floor(Math.random() * 31) + 70;
    for (let i = 0; i < ratedReviews; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const random10001 = Math.floor(Math.random() * 1000);
        const price1 = Math.floor(Math.random() * 20) + 10;

        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random10001].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: sample(imageUrls), // Use a random image URL
            description: sample(descriptions), // Use a random description
            price: price1,
            author: '6690d74efdf312fd8ed6c0b5'
        });

        await camp.save();

        const reviewCount = Math.floor(Math.random() * 1001) + 1000; // Random number between 1000 and 2000
        for (let j = 0; j <reviewCount; j++) {
            const rating1 = getWeightedRandom();
            const review = new Review({
                body: reviewBody[rating1],
                rating: rating1,
                author: '6690d761fdf312fd8ed6c0be',
                camp: camp._id
            });
            like.reviews.push(review);
            await review.save();
            camp.reviews.push(review); // Assuming you have a reviews array in Campground schema
        }
        admin.campgrounds.push(camp);
        await camp.save(); // Save campground again with the reviews
    }

    const noReview = Math.floor(Math.random() * 11) + 10;
    // Create campgrounds with no reviews
    for (let i = 0; i < noReview; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const random10001 = Math.floor(Math.random() * 1000);
        const price1 = Math.floor(Math.random() * 20) + 10;

        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random10001].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: sample(imageUrls), // Use a random image URL
            description: sample(descriptions), // Use a random description
            price: price1,
            author: '6690d74efdf312fd8ed6c0b5'
        });
        admin.campgrounds.push(camp);
        await camp.save(); // Save campground without reviews
    }
    await admin.save();
    await like.save();
}

seedDB().then(() => {
    mongoose.connection.close();
});




