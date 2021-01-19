const Review = require('../models/reviewModel');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAllReviews = catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Review.find(), req.query);
    const reviews = await features.query;

    if (!reviews) {
        return next(new AppError('Any reviews', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            reviews,
        },
    });
});

exports.createReview = catchAsync(async (req, res, next) => {
    const newReview = await Review.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            review: newReview,
        },
    });
});
