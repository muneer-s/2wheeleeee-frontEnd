import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getProfile } from "../../../Api/user";


export interface UserData {
    _id: string;
    name: string;
    email: string;
    isBlocked: boolean;
    aboutInfo: string;
    headLine: string;
    location: string;
    role: string;
    cover_image: string;
    profile_picture: string;
}


const UserProfile: React.FC = () => {
    const [profileImage, setProfileImage] = useState<File | null>(null);

    const [userProfile, setUserProfile] = useState<UserData | null>(null);


    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setProfileImage(file);
    };



    // const dispatch = useDispatch()

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const response = await getProfile();
    //             if (response) {
    //                 setUserProfile(response.data);
    //                 setPic(response.data?.profile_picture);
    //             }
    //             dispatch(changeAbout(userProfile?.aboutInfo));
    //         } catch (error) {
    //             console.error('Error:', error);
    //         }
    //     }
    //     fetchData();
    // }, [updateScreen])

    return (
        <div className="min-h-screen bg-gradient-to-b from-sky-200 to-white flex justify-center items-center">
            <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-8">
                {/* Sidebar */}
                <div className="flex flex-col md:flex-row">
                    <div className="w-full md:w-1/4 border-r border-gray-200 pr-4">
                        <ul className="space-y-4 text-gray-700">
                            <li className="font-semibold">Personal Details</li>
                            <li>Orders</li>
                            <li>Booking History</li>
                        </ul>
                    </div>

                    {/* Main Content */}
                    <div className="w-full md:w-3/4 pl-4">
                        {/* Profile Image */}
                        <div className="flex items-center justify-center mb-8">
                            <div className="relative">
                                <img
                                    src={profileImage ? URL.createObjectURL(profileImage) : "/default-avatar.png"}
                                    alt="Profile"
                                    className="w-24 h-24 rounded-full object-cover border border-gray-300"
                                />
                                <button
                                    onClick={() => document.getElementById("profileImageInput")?.click()}
                                    className="absolute bottom-0 right-0 bg-gray-800 text-white rounded-full p-2 hover:bg-gray-600"
                                >
                                    Edit
                                </button>
                                <input
                                    type="file"
                                    id="profileImageInput"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                />
                            </div>
                        </div>

                        {/* Basic Details Section */}
                        <div className="mb-8">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Basic Details</h2>
                            <form className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Name"
                                    className="w-full border border-gray-300 rounded p-2 focus:ring focus:ring-sky-200"
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="w-full border border-gray-300 rounded p-2 focus:ring focus:ring-sky-200"
                                />
                                <input
                                    type="text"
                                    placeholder="Phone Number"
                                    className="w-full border border-gray-300 rounded p-2 focus:ring focus:ring-sky-200"
                                />
                                <input
                                    type="date"
                                    placeholder="DOB"
                                    className="w-full border border-gray-300 rounded p-2 focus:ring focus:ring-sky-200"
                                />
                                <select className="w-full border border-gray-300 rounded p-2 focus:ring focus:ring-sky-200">
                                    <option value="">Select Address</option>
                                    <option value="address1">Address 1</option>
                                    <option value="address2">Address 2</option>
                                </select>
                                <input
                                    type="password"
                                    placeholder="Password"
                                    className="w-full border border-gray-300 rounded p-2 focus:ring focus:ring-sky-200"
                                />
                                <input
                                    type="password"
                                    placeholder="New Password"
                                    className="w-full border border-gray-300 rounded p-2 focus:ring focus:ring-sky-200"
                                />
                                <button
                                    type="submit"
                                    className="w-full bg-sky-500 text-white rounded p-2 hover:bg-sky-600"
                                >
                                    Save
                                </button>
                            </form>
                        </div>

                        {/* User Verify Section */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">User Verify Section</h2>
                            <form className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Driving Licence No."
                                    className="w-full border border-gray-300 rounded p-2 focus:ring focus:ring-sky-200"
                                />
                                <input
                                    type="date"
                                    placeholder="Exp Date"
                                    className="w-full border border-gray-300 rounded p-2 focus:ring focus:ring-sky-200"
                                />
                                <div className="flex justify-between">
                                    <label className="flex flex-col items-center bg-gray-100 border border-gray-300 rounded-lg p-4 cursor-pointer hover:bg-gray-200">
                                        <span className="text-gray-700">Front</span>
                                        <input type="file" className="hidden" />
                                    </label>
                                    <label className="flex flex-col items-center bg-gray-100 border border-gray-300 rounded-lg p-4 cursor-pointer hover:bg-gray-200">
                                        <span className="text-gray-700">Back</span>
                                        <input type="file" className="hidden" />
                                    </label>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-sky-500 text-white rounded p-2 hover:bg-sky-600"
                                >
                                    Save
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
