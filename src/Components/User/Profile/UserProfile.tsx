import React, { ChangeEvent, useEffect, useState } from "react";
import { edituser, edituserDocuments, getProfile } from "../../../Api/user";
import { useAppSelector } from "../../../app/store";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { authSlice, saveUser } from "../../../app/slice/AuthSlice";
type SetImageFunction = React.Dispatch<React.SetStateAction<string | null>>;


import { UserData } from "../../../Interfaces/Interfaces";


const UserProfile: React.FC = () => {
    const [userProfile, setUserProfile] = useState<UserData | null>(null);
    const [pic, setPic] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<string>("Personal Details");
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);


    const [frontImage, setFrontImage] = useState<File | null>(null);
    const [backImage, setBackImage] = useState<File | null>(null);

    const authState = useAppSelector((state) => state.auth);
    const userEmail = authState.user.email
    const userId = authState.user.userId


    let dispatch = useDispatch()


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getProfile(userEmail);
                console.log(1, response);

                setUserProfile(response?.data.userDetails);
                setPic(response?.data.userDetails?.profile_picture || "");

                if (response?.data.message == false) {
                    toast.error(response.data.message)
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
        fetchData();
    }, [userEmail]);


    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!userProfile) {
            setErrors({ userProfile: "User profile is required." });
            return false;
        }

        if (!userProfile?.name) newErrors.name = "Name is required.";

        if (!userProfile?.email) {
            newErrors.email = "Email is required."
        }

        if (!userProfile?.phoneNumber || !/^[0-9]{10}$/.test(userProfile.phoneNumber.toString())) {
            newErrors.phoneNumber = "Phone number must be 10 digits.";
        }

        if (!userProfile?.dateOfBirth || new Date(userProfile.dateOfBirth) >= new Date()) {
            newErrors.dateOfBirth = "Date of Birth must be a past date.";
        } else {
            const age = new Date().getFullYear() - new Date(userProfile.dateOfBirth).getFullYear();
            if (age < 18) newErrors.dateOfBirth = "User must be at least 18 years old.";
        }

        if (!userProfile?.address?.trim()) newErrors.address = "Address is required.";

        if (!userProfile?.profile_picture) newErrors.profile_picture = "Profile Picture is required"


        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            console.log("Form is invalid, showing errors...");
            return;
        }

        if (!userProfile) {
            console.error("User profile data is missing.");
            return;
        }

        setIsSubmitting(true); // Disable the button


        try {
            const result = await edituser(userEmail, userProfile);
            const user = {
                email: result?.data.user.email,
                name: result?.data.user.name,
                profile_picture: result?.data.user.profile_picture,
                userId: result?.data.user.userId
            };

            dispatch(saveUser(user))
            toast.success("Profile updated successfully!");
        } catch (error: any) {
            console.error("An error occurred while updating the profile:", error);
            alert(
                error?.response?.data?.message ||
                "An error occurred while updating the profile. Please try again later."
            );
        } finally {
            setIsSubmitting(false); // Re-enable the button
        }

    };


    const setNewProfile = (profileFile: File) => {
        const fileURL = URL.createObjectURL(profileFile);
        setUserProfile({ ...userProfile, profile_picture: profileFile } as UserData)
        setPic(fileURL)
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setImage: React.Dispatch<React.SetStateAction<File | null>>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file); // Save the File object
        }
    };

    const validateFormDocuments = () => {
        const newErrors: { [key: string]: string } = {};

        if (!userProfile) {
            setErrors({ userProfile: "User profile is required." });
            return false;
        }

        if (!userProfile?.license_number) newErrors.license_number = "License Number is required.";

        if (!userProfile?.license_Exp_Date) {
            newErrors.license_Exp_Date = "License Expiration Date is required.";
        } else {
            const today = new Date();
            const expirationDate = new Date(userProfile.license_Exp_Date);

            if (expirationDate < today) {
                newErrors.license_Exp_Date = "License Expiration Date is expired.";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }





    const handleSubmitDocuments = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateFormDocuments()) {
            console.log("Form is invalid, showing errors...");
            return;
        }

        if (
            !userProfile?.dateOfBirth ||
            !userProfile?.phoneNumber ||
            !userProfile?.address ||
            !userProfile?.profile_picture
        ) {
            toast.error("User profile is not complete. Please fill in the basic details first.");
            console.error("User profile data is missing.");
            return;
        }
        setIsSubmitting(true); // Disable the button


        try {
            const formData = new FormData();

            const licenseExpDate =
                typeof userProfile.license_Exp_Date === "string"
                    ? new Date(userProfile.license_Exp_Date)
                    : userProfile.license_Exp_Date;

            formData.append("userId", userId);
            formData.append("license_number", userProfile.license_number || "");
            formData.append("license_Exp_Date", licenseExpDate?.toISOString() || "");

            // Append files if available
            if (frontImage) {
                formData.append("frontImage", frontImage);
            }
            if (backImage) {
                formData.append("backImage", backImage);
            }

            //console.log([...formData.entries()]); 


            const result = await edituserDocuments(formData);
            
            if (result?.statusText == "OK") {
                toast.success("Documents updated successfully!");
            } else {
                toast.error("Documents updation Failed!")
            }

        } catch (error: any) {
            console.error("An error occurred while updating the profile:", error);
            alert(
                error?.response?.data?.message ||
                "An error occurred while updating the profile. Please try again later."
            );
        } finally {
            setIsSubmitting(false); // Re-enable the button
        }
    }


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
                                        src={pic ? pic : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4n9vUNCLmnEJ5pKIl0VUwTPofdPGIXPf2pA&s'}
                                        alt="Profile"
                                        className="w-24 h-24 rounded-full object-cover border border-gray-300"
                                    />

                                </div>
                            </div>

                            {/* Basic Details Section */}
                            <div className="mb-8">
                                <form className="space-y-4" onSubmit={handleSubmit}>

                                    <div className="mb-4">
                                        <label className="block text-gray-500 mb-0.5">Name</label>
                                        <input
                                            type="text"
                                            placeholder="Name"
                                            value={userProfile?.name || ''}
                                            onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value } as UserData)}
                                            className={`w-full border border-gray-300 rounded p-2 focus:ring focus:ring-sky-200 ${errors.name ? 'border-red-500' : ''}`}
                                        />
                                    </div>
                                    {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}


                                    <div className="mb-4">
                                        <label className="block text-gray-500 mb-0.5">Email</label>
                                        <input
                                            type="email"
                                            placeholder="Email"
                                            value={userProfile?.email || ""}
                                            onChange={(e) => setUserProfile({ ...userProfile, email: e.target.value } as UserData)}
                                            className={`w-full border border-gray-300 rounded p-2 focus:ring focus:ring-sky-200 ${errors.email ? 'border-red-500' : ''}`}
                                        />
                                    </div>
                                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}



                                    <div className="mb-4">
                                        <label className="block text-gray-500 mb-0.5">Phone Number</label>
                                        <input
                                            type="text"
                                            placeholder="Phone Number"
                                            value={userProfile?.phoneNumber?.toString() || ""}
                                            onChange={(e) => {
                                                const input = e.target.value;
                                                setUserProfile({
                                                    ...userProfile,
                                                    phoneNumber: input === "" ? undefined : parseInt(input, 10),
                                                } as UserData);
                                            }}
                                            className={`w-full border border-gray-300 rounded p-2 focus:ring focus:ring-sky-200 ${errors.phoneNumber ? 'border-red-500' : ''}`}
                                        />
                                    </div>
                                    {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}



                                    <div className="mb-4">
                                        <label className="block text-gray-500 mb-0.5">DOB</label>
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
                                    </div>
                                    {errors.dateOfBirth && <p className="text-red-500 text-sm">{errors.dateOfBirth}</p>}



                                    <div className="mb-4">
                                        <label className="block text-gray-500 mb-0.5">Address</label>
                                        <input
                                            type="text"
                                            placeholder="Address"
                                            value={userProfile?.address || ""}
                                            onChange={(e) => setUserProfile({ ...userProfile, address: e.target.value } as UserData)}
                                            className={`w-full border border-gray-300 rounded p-2 focus:ring focus:ring-sky-200 ${errors.address ? 'border-red-500' : ''}`}
                                        />
                                        {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
                                    </div>


                                    <div className="mb-4">
                                        <label className="block text-gray-500 mb-0.5">Profile Image</label>
                                        <input
                                            type="file"
                                            placeholder="profile image"
                                            onChange={(e) => {
                                                if (e.target.files && e.target.files[0]) {
                                                    setNewProfile(e.target.files[0]); // Pass the File object to your state
                                                }
                                            }}
                                        />
                                        {errors.profile_picture && <p className="text-red-500 text-sm">{errors.profile_picture}</p>}
                                    </div>



                                    <button
                                        type="submit"
                                        className={`w-full bg-sky-500 text-white rounded p-2 hover:bg-sky-600${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                                        disabled={isSubmitting}
                                    >{isSubmitting ? "Saving..." : "Save"}</button>
                                </form>
                            </div>

                            {/*---------------------------------------------------- User Verify Section ----------------------------------------------------*/}
                            <div>
                                <h2 className="text-lg font-semibold text-gray-800 mb-4">User Verify Section</h2>
                                <form className="space-y-4" onSubmit={handleSubmitDocuments}>

                                    <div className="mb-4">
                                        <label className="block text-gray-500 mb-0.5">Driving Licence No</label>
                                        <input
                                            type="text"
                                            placeholder="Driving Licence No."
                                            value={userProfile?.license_number || ""}
                                            onChange={(e) => setUserProfile({ ...userProfile, license_number: e.target.value } as UserData)}
                                            className="w-full border border-gray-300 rounded p-2 focus:ring focus:ring-sky-200"
                                        />
                                        {errors.license_number && <p className="text-red-500 text-sm">{errors.license_number}</p>}
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-gray-500 mb-0.5">Driving Licence Exp Date</label>
                                        <input
                                            type="date"
                                            placeholder="Exp Date"
                                            value={
                                                userProfile?.license_Exp_Date
                                                    ? new Date(userProfile.license_Exp_Date).toISOString().split("T")[0]
                                                    : ""
                                            }
                                            onChange={(e) => setUserProfile({ ...userProfile, license_Exp_Date: new Date(e.target.value) } as UserData)}
                                            className="w-full border border-gray-300 rounded p-2 focus:ring focus:ring-sky-200"
                                        />
                                        {errors.license_Exp_Date && <p className="text-red-500 text-sm">{errors.license_Exp_Date}</p>}
                                    </div>

                                    {/* ----------------------------------------------------------------------------------------------------------------------------------------- */}

                                    <div className="space-y-4">
                                        <div className="flex justify-between space-x-4">
                                            {/* Front Image Upload */}
                                            <div className="flex-1">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Front Image
                                                </label>
                                                <div className="flex items-center space-x-4">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => handleImageUpload(e, setFrontImage)}
                                                        className="block w-full text-sm text-gray-500 
                                                        file:mr-4 file:py-2 file:px-4
                                                        file:rounded-full file:border-0
                                                        file:text-sm file:font-semibold
                                                         file:bg-violet-50 file:text-violet-700
                                                        hover:file:bg-violet-100"
                                                    />
                                                </div>
                                                {frontImage ? (
                                                    <div className="mt-2 border rounded-lg overflow-hidden">
                                                        <img
                                                            src={frontImage instanceof File ? URL.createObjectURL(frontImage) : ""}
                                                            alt="Front"
                                                            className="w-full h-40 object-cover"
                                                        />
                                                    </div>
                                                ) : userProfile?.license_picture_front ? (
                                                    <div className="mt-2 border rounded-lg overflow-hidden">
                                                        <img
                                                            src={
                                                                typeof userProfile.license_picture_front === "string"
                                                                    ? userProfile.license_picture_front
                                                                    : ""
                                                            } alt="Front License"
                                                            className="w-full h-40 object-cover"
                                                        />
                                                    </div>
                                                ) : null}

                                            </div>

                                            {/* Back Image Upload */}
                                            <div className="flex-1">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Back Image
                                                </label>
                                                <div className="flex items-center space-x-4">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => handleImageUpload(e, setBackImage)}
                                                        className="block w-full text-sm text-gray-500 
                                                        file:mr-4 file:py-2 file:px-4
                                                        file:rounded-full file:border-0
                                                        file:text-sm file:font-semibold
                                                        file:bg-violet-50 file:text-violet-700
                                                        hover:file:bg-violet-100"
                                                    />
                                                </div>
                                                {backImage ? (
                                                    <div className="mt-2 border rounded-lg overflow-hidden">
                                                        <img
                                                            src={backImage instanceof File ? URL.createObjectURL(backImage) : ""}
                                                            alt="Back"
                                                            className="w-full h-40 object-cover"
                                                        />
                                                    </div>
                                                ) : userProfile?.license_picture_back ? (
                                                    <div className="mt-2 border rounded-lg overflow-hidden">
                                                        <img
                                                            src={
                                                                typeof userProfile.license_picture_back === "string"
                                                                    ? userProfile.license_picture_back
                                                                    : ""
                                                            } alt="Back License"
                                                            className="w-full h-40 object-cover"
                                                        />
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>


                                    <button type="submit"
                                        className={`w-full bg-sky-500 text-white rounded p-2 hover:bg-sky-600 ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? "Saving..." : "Save"}

                                    </button>

                                    <div className="items-center flex justify-center my-4">
                                        {userProfile?.isUser ? (
                                            <span style={{ color: 'green', fontWeight: 'bold' }}>Admin Approved</span>
                                        ) : (
                                            <span style={{ color: 'red', fontWeight: 'bold' }}>Please wait for admin approval</span>
                                        )}
                                    </div>


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









