import React, { useState, useEffect } from "react";
import { getReviews } from "../../../../Api/user";
import { FaStar, FaUserCircle } from "react-icons/fa";
import toast from "react-hot-toast";

export interface IReviewer {
    _id: string;
    name: string;
}

export interface IReview {
    _id: string;
    bikeId: string;
    reviewerId: IReviewer;
    rating: number;
    feedback: string;
    createdAt: string;
}

const Review: React.FC<{ bikeId?: string }> = ({ bikeId }) => {
    const [reviews, setReviews] = useState<IReview[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchReviews = async (bikeId: string) => {
        setLoading(true);
        try {
            const response = await getReviews(bikeId);
            if (response?.success) {
                setReviews(response.data.data);
            }
        } catch (error: any) {
            console.error("Error fetching reviews:", error);
            toast.error(error.response?.data?.message || "Error Fetching Reviews");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (bikeId) {
            fetchReviews(bikeId);
        }
    }, [bikeId]);

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const RatingStars = ({ rating }: { rating: number }) => (
        <div className="flex items-center">
            {[...Array(5)].map((_, starIndex) => (
                <FaStar
                    key={starIndex}
                    size={16}
                    className={`${starIndex < rating ? "text-yellow-500" : "text-gray-300"} mr-1`}
                />
            ))}
            <span className="ml-2 text-sm font-medium text-gray-700">{rating}/5</span>
        </div>
    );

    if (loading) {
        return (
            <div className="p-6 rounded-lg bg-white shadow-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Reviews</h2>
                <div className="flex justify-center items-center h-32">
                    <div className="animate-pulse flex space-x-4 w-full">
                        <div className="rounded-full bg-gray-200 h-12 w-12"></div>
                        <div className="flex-1 space-y-4 py-1">
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-200 rounded"></div>
                                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 rounded-lg bg-white shadow-md">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Reviews</h2>
                {reviews.length > 0 && (
                    <div className="bg-gray-100 px-3 py-1 rounded-full">
                        <span className="text-sm font-medium text-gray-700">{reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}</span>
                    </div>
                )}
            </div>

            {reviews.length > 0 ? (
                <div className="space-y-6">
                    {reviews.map((review, index) => (
                        <div 
                            key={review._id || index} 
                            className={`${index !== reviews.length - 1 ? "border-b border-gray-200" : ""} pb-6`}
                        >
                            <div className="flex items-start">
                                <div className="flex-shrink-0 mr-4">
                                    <FaUserCircle className="w-10 h-10 text-gray-400" />
                                </div>
                                <div className="flex-grow">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                        <h3 className="text-lg font-semibold text-gray-800">
                                            {(review.reviewerId as IReviewer).name}
                                        </h3>
                                        <span className="text-sm text-gray-500 mt-1 sm:mt-0">
                                            {formatDate(review.createdAt)}
                                        </span>
                                    </div>
                                    <div className="mt-2">
                                        <RatingStars rating={review.rating} />
                                    </div>
                                    <p className="mt-3 text-gray-700 leading-relaxed">{review.feedback}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <p className="text-gray-500 mb-2">No reviews available yet.</p>
                    <p className="text-sm text-gray-400">Be the first to leave a review for this bike!</p>
                </div>
            )}
        </div>
    );
};

export default Review;