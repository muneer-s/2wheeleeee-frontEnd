import React, { useState, useEffect } from "react";
import { getReviews } from "../../../../Api/user";
import { FaStar } from "react-icons/fa";

// export interface IReview {
//     reviewerName: string;
//     rating: number;
//     feedback: string;
//     createdAt: string;
// }

export interface IReview {
    _id: string;
    bikeId: string;
    reviewerId: string;
    rating: number;
    feedback: string;
    createdAt: string;
}


const Review: React.FC<{ bikeId?: string }> = ({ bikeId }) => {
    const [reviews, setReviews] = useState<IReview[]>([]);

    const fetchReviews = async (bikeId: string) => {
        try {
            const response = await getReviews(bikeId);
            console.log(98,response);
            
            if (response?.success) {
                // setReviews(response.data);
                setReviews(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching reviews:", error);
        }
    };

    // 🔄 Fetch reviews when component mounts or bikeId changes
    useEffect(() => {
        if (bikeId) {
            fetchReviews(bikeId);
        }
    }, [bikeId]);

    return (
        <div>
            <h2 className="text-xl font-semibold text-gray-700">User Reviews</h2>

            {reviews.length > 0 ? (
                <div className="bg-gray-100 p-4 rounded-lg">
                    {reviews.map((review, index) => (
                        <div key={index} className="border-b pb-4 mb-4">
                            <p className="font-semibold">{review.reviewerId}</p>
                            <div className="flex">
                                {[...Array(5)].map((_, starIndex) => (
                                    <FaStar
                                        key={starIndex}
                                        size={20}
                                        className={starIndex < review.rating ? "text-yellow-500" : "text-gray-300"}
                                    />
                                ))}
                            </div>
                            <p className="text-gray-700">{review.feedback}</p>
                            <p className="text-gray-500 text-sm">{new Date(review.createdAt).toLocaleDateString()}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500">No reviews available.</p>
            )}
        </div>
    );
};

export default Review;
