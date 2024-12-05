import React, { useEffect, useState } from "react";
import { edituser, getProfile } from "../../../Api/user";
import { useAppSelector } from "../../../app/store";


export interface UserData {
    _id: string;
    name: string;
    email: string;
    password: string;
    phoneNumber: number;
    isBlocked: boolean;
    isVerified: boolean;
    profile_picture: string;
    dateOfBirth: Date;
    address: string | null;
    isUser: boolean;
    lisence_number: number;
    lisence_Exp_Date: Date;
    lisence_picture_front: string;
    lisence_picture_back: string;
}



const UserProfile: React.FC = () => {
    const [userProfile, setUserProfile] = useState<UserData | null>(null);
    const [pic, setPic] = useState<string>("");
    const [activeTab, setActiveTab] = useState<string>("Personal Details"); // New state for active tab
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [confirmPassword, setConfirmPassword] = useState<string>("");


    const authState = useAppSelector((state) => state.auth);
    const userEmail = authState.user.email


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getProfile(userEmail);
                setUserProfile(response?.data.userDetails);
                setPic(response?.data.userDetails?.profile_picture || "/default-avatar.png");
            } catch (error) {
                console.error('Error:', error);
            }
        }
        fetchData();
    }, [userEmail]);

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!userProfile?.name) newErrors.name = "Name is required.";

        if (!userProfile?.phoneNumber || !/^[0-9]{10}$/.test(userProfile.phoneNumber.toString())) {
            newErrors.phoneNumber = "Phone number must be 10 digits.";
        }

        if (!userProfile?.dateOfBirth || new Date(userProfile.dateOfBirth) >= new Date()) {
            newErrors.dateOfBirth = "Date of Birth must be a past date.";
        } else {
            const age = new Date().getFullYear() - new Date(userProfile.dateOfBirth).getFullYear();
            if (age < 18) newErrors.dateOfBirth = "User must be at least 18 years old.";
        }

        if (!userProfile?.address) newErrors.address = "Address is required.";

        if (!userProfile?.password) {
            newErrors.password = "Password is required.";
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}/.test(userProfile.password)) {
            newErrors.password = "Password must include uppercase, lowercase, number, and special character.";
        }

        if (confirmPassword !== userProfile?.password) {
            newErrors.confirmPassword = "Passwords do not match.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm() && userProfile ) {
            console.log("Form is valid, submitting data...", userProfile);
            const response = await edituser(userEmail, userProfile);
            console.log("Profile updated successfully", response);

            // Submit form logic here
        } else {
            console.log("Form is invalid, showing errors...");
        }
    };







    const renderContent = () => {
        switch (activeTab) {
            case "Personal Details":
                return (
                    <div className="mb-8">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Basic Details</h2>


                        <div className="w-full md:w-3/4 pl-4">
                            {/* Profile Image */}
                            <div className="flex items-center justify-center mb-8">
                                <div className="relative">
                                    <img
                                        src={"/default-avatar.png"}
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
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files[0]) {
                                                const file = e.target.files[0];
                                                setPic(URL.createObjectURL(file));
                                            }
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Basic Details Section */}
                            <div className="mb-8">
                                <form className="space-y-4" onSubmit={handleSubmit}>
                                    <input
                                        type="text"
                                        placeholder="Name"
                                        value={userProfile?.name || ''}
                                        onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value } as UserData)}
                                        className={`w-full border border-gray-300 rounded p-2 focus:ring focus:ring-sky-200 ${errors.name ? 'border-red-500' : ''}`}
                                    />
                                    {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}




                                    <input
                                        type="email"
                                        placeholder="Email"
                                        value={userProfile?.email || ""}
                                        className="w-full border border-gray-300 rounded p-2 focus:ring focus:ring-sky-200"
                                    />



                                    <input
                                        type="text"
                                        placeholder="Phone Number"
                                        value={userProfile?.phoneNumber?.toString() || ""}
                                        onChange={(e) => {
                                            const input = e.target.value;
                                            // Allow updating the field even if input is empty
                                            setUserProfile({
                                                ...userProfile,
                                                phoneNumber: input === "" ? undefined : parseInt(input, 10),
                                            } as UserData);
                                        }}
                                        className={`w-full border border-gray-300 rounded p-2 focus:ring focus:ring-sky-200 ${errors.phoneNumber ? 'border-red-500' : ''}`}
                                    />
                                    {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}





                                    <input
                                        type="date"
                                        placeholder="DOB"
                                        value={
                                            userProfile?.dateOfBirth
                                                ? new Date(userProfile.dateOfBirth).toISOString().split("T")[0]
                                                : ""
                                        }
                                        onChange={(e) => setUserProfile({ ...userProfile, dateOfBirth: new Date(e.target.value) } as UserData)}
                                        className={`w-full border border-gray-300 rounded p-2 focus:ring focus:ring-sky-200 ${errors.dateOfBirth ? 'border-red-500' : ''}`}
                                    />
                                    {errors.dateOfBirth && <p className="text-red-500 text-sm">{errors.dateOfBirth}</p>}




                                    <input
                                        type="text"
                                        placeholder="Address"
                                        value={userProfile?.address || ""}
                                        onChange={(e) => setUserProfile({ ...userProfile, address: e.target.value } as UserData)}
                                        className={`w-full border border-gray-300 rounded p-2 focus:ring focus:ring-sky-200 ${errors.address ? 'border-red-500' : ''}`}
                                    />
                                    {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}



                                    <input
                                        type="password"
                                        placeholder="Password"
                                        value={userProfile?.password || ""}
                                        onChange={(e) => setUserProfile({ ...userProfile, password: e.target.value } as UserData)}
                                        className={`w-full border border-gray-300 rounded p-2 focus:ring focus:ring-sky-200 ${errors.password ? 'border-red-500' : ''}`}
                                    />
                                    {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}




                                    <input
                                        type="password"
                                        placeholder="Confirm Password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className={`w-full border border-gray-300 rounded p-2 focus:ring focus:ring-sky-200 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                                    />
                                    {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}





                                    <button
                                        type="submit"
                                        className="w-full bg-sky-500 text-white rounded p-2 hover:bg-sky-600"
                                    >Save</button>
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
                );

            case "Orders":
                return (
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Orders</h2>
                        <p>No orders yet.</p>
                    </div>
                );

            case "Booking History":
                return (
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Booking History</h2>
                        <p>No booking history found.</p>
                    </div>
                );

            default:
                return null;
        }
    };



    return (
        <div className=" min-h-screen bg-gradient-to-b from-white to-sky-300 flex justify-center items-center" >
            <div className="h-auto w-full max-w-4xl bg-white rounded-lg shadow-lg p-8 bg-gradient-to-b from-white to-sky-200 " style={{ marginTop: '80px', marginBottom: '80px' }}>
                {/* Sidebar */}
                <div className="flex flex-col md:flex-row">
                    <div className="w-full md:w-1/4 border-r border-gray-200 pr-4">
                        <ul className="space-y-4 text-gray-700">
                            <li className={`font-semibold cursor-pointer ${activeTab === "Personal Details" ? "text-sky-500" : ""}`} onClick={() => setActiveTab("Personal Details")}>Personal Details</li>
                            <li className={`cursor-pointer ${activeTab === "Orders" ? "text-sky-500" : ""}`} onClick={() => setActiveTab("Orders")}>Orders</li>
                            <li className={`cursor-pointer ${activeTab === "Booking History" ? "text-sky-500" : ""}`} onClick={() => setActiveTab("Booking History")}>Booking History</li>
                        </ul>
                    </div>

                    {/* Main Content */}

                    <div className="w-full md:w-3/4 pl-4">{renderContent()}</div>


                </div>
            </div>
        </div>
    );
};

export default UserProfile;









