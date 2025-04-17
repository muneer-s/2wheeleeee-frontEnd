import React, { useEffect, useState } from "react";
import { edituser, edituserDocuments, getProfile, logout } from "../../../Api/user";
import { useAppSelector } from "../../../Apps/store";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { saveUser, userLogout } from "../../../Apps/slice/AuthSlice";
import { UserData } from "../../../Interfaces/Interfaces";
import { handleApiResponse } from "../../../Utils/apiUtils";
import MyWallet from "../Wallet/MyWallet";
import UserOrderList from "../OrderList/UserOrderList";
import FeedbackForm from "../Feedback/FeedbackForm";

interface ProfilePageProps {
    socket: any;
}

const UserProfile: React.FC<ProfilePageProps> = ({ socket }) => {
    const [userProfile, setUserProfile] = useState<UserData | null>(null);
    const [pic, setPic] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<string>("Personal Details");
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [frontImage, setFrontImage] = useState<File | null>(null);
    const [backImage, setBackImage] = useState<File | null>(null);

    const authState = useAppSelector((state) => state.auth);
    const userEmail = authState.user.email;
    const userId = authState.user.userId;

    let dispatch = useDispatch();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getProfile(userEmail);
                const userDetails = handleApiResponse(response);

                if (response.success) {
                    setUserProfile(userDetails);
                    setPic(userDetails?.profile_picture || "");
                }
            } catch (error: any) {
                console.error('catch Error get profile:', error);
                if (error.response.status == 401 || error.response.status == 403) {
                    toast.error(error.response.data.message);
                    await logout({ email: userEmail });
                    dispatch(userLogout());
                } else {
                    toast.error(error.response.data.message);
                }
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

        if (!userProfile?.profile_picture) newErrors.profile_picture = "Profile Picture is required";

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

        setIsSubmitting(true);
        try {
            const result = await edituser(userEmail, userProfile);

            const data = handleApiResponse(result)

            const user = {
                email: data.user.email,
                name: data.user.name,
                profile_picture: data.user.profile_picture,
                userId: data.user.userId
            };

            dispatch(saveUser(user))
            toast.success("Profile updated successfully!");
        } catch (error: any) {
            console.error("An error occurred while updating the profile:", error);
            toast.error(error?.response?.data?.message || "An error occurred while updating the profile. Please try again later.");
        } finally {
            setIsSubmitting(false);
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
            setImage(file);
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

            const sixMonthsFromToday = new Date();
            sixMonthsFromToday.setMonth(today.getMonth() + 6);

            if (expirationDate < sixMonthsFromToday) {
                newErrors.license_Exp_Date = "License Expiration Date must be at least 6 months from today.";
            }
        }

        if (!frontImage || !backImage) {
            newErrors.license_picture = "License Images are required";
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

        if (!userProfile?.dateOfBirth || !userProfile?.phoneNumber || !userProfile?.address || !userProfile?.profile_picture) {
            toast.error("User profile is not complete. Please fill in the basic details first.");
            console.error("User profile data is missing.");
            return;
        }
        setIsSubmitting(true);
        try {
            const formData = new FormData();

            const licenseExpDate = typeof userProfile.license_Exp_Date === "string" ? new Date(userProfile.license_Exp_Date) : userProfile.license_Exp_Date;

            formData.append("userId", userId);
            formData.append("license_number", userProfile.license_number || "");
            formData.append("license_Exp_Date", licenseExpDate?.toISOString() || "");

            if (frontImage) {
                formData.append("frontImage", frontImage);
            }
            if (backImage) {
                formData.append("backImage", backImage);
            }

            const result = await edituserDocuments(formData);

            if (result?.success) {
                toast.success(result.message);
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
            setIsSubmitting(false);
        }
    }

    const renderContent = () => {
        switch (activeTab) {
            case "Personal Details":
                return (
                    <div className="mb-8 w-full">
                        {/* Profile Image */}
                        <div className="flex items-center justify-center mb-8">
                            <div className="relative group">
                                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-sky-200 shadow-lg">
                                    <img
                                        src={pic ? pic : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4n9vUNCLmnEJ5pKIl0VUwTPofdPGIXPf2pA&s'}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <label htmlFor="profilePic" className="absolute bottom-0 right-0 bg-sky-500 text-white p-2 rounded-full shadow-md cursor-pointer hover:bg-sky-600 transition-all">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                    </svg>
                                </label>
                                <input
                                    id="profilePic"
                                    type="file"
                                    className="hidden"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            setNewProfile(e.target.files[0]);
                                        }
                                    }}
                                />
                            </div>
                        </div>
                        {errors.profile_picture && <p className="text-red-500 text-sm text-center mb-4">{errors.profile_picture}</p>}

                        {/* Sections Container */}
                        <div className="space-y-8">
                            {/* Basic Details Section */}
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <h2 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">Personal Information</h2>
                                <form className="space-y-5" onSubmit={handleSubmit}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-gray-600 text-sm font-medium mb-1">Full Name</label>
                                            <input
                                                type="text"
                                                placeholder="Enter your name"
                                                value={userProfile?.name || ''}
                                                onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value } as UserData)}
                                                className={`w-full border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:ring-2 focus:ring-sky-300 focus:border-sky-500 transition-all`}
                                            />
                                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-gray-600 text-sm font-medium mb-1">Email Address</label>
                                            <input
                                                type="email"
                                                placeholder="Enter your email"
                                                value={userProfile?.email || ""}
                                                onChange={(e) => setUserProfile({ ...userProfile, email: e.target.value } as UserData)}
                                                className={`w-full border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:ring-2 focus:ring-sky-300 focus:border-sky-500 transition-all`}
                                            />
                                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-gray-600 text-sm font-medium mb-1">Phone Number</label>
                                            <input
                                                type="text"
                                                placeholder="Enter 10-digit phone number"
                                                value={userProfile?.phoneNumber?.toString() || ""}
                                                onChange={(e) => {
                                                    const input = e.target.value;
                                                    setUserProfile({
                                                        ...userProfile,
                                                        phoneNumber: input === "" ? undefined : parseInt(input, 10),
                                                    } as UserData);
                                                }}
                                                className={`w-full border ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:ring-2 focus:ring-sky-300 focus:border-sky-500 transition-all`}
                                            />
                                            {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-gray-600 text-sm font-medium mb-1">Date of Birth</label>
                                            <input
                                                type="date"
                                                placeholder="Select date of birth"
                                                value={
                                                    userProfile?.dateOfBirth
                                                        ? new Date(userProfile.dateOfBirth).toISOString().split("T")[0]
                                                        : ""
                                                }
                                                onChange={(e) => setUserProfile({ ...userProfile, dateOfBirth: new Date(e.target.value) } as UserData)}
                                                className={`w-full border ${errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:ring-2 focus:ring-sky-300 focus:border-sky-500 transition-all`}
                                            />
                                            {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-gray-600 text-sm font-medium mb-1">Address</label>
                                        <textarea
                                            placeholder="Enter your full address"
                                            value={userProfile?.address || ""}
                                            onChange={(e) => setUserProfile({ ...userProfile, address: e.target.value } as UserData)}
                                            className={`w-full border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:ring-2 focus:ring-sky-300 focus:border-sky-500 transition-all`}
                                            rows={3}
                                        />
                                        {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                                    </div>

                                    <button
                                        type="submit"
                                        className={`w-full bg-sky-600 text-white rounded-lg py-3 font-medium hover:bg-sky-700 transition-all transform hover:scale-[1.02] ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <span className="flex items-center justify-center">
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Saving Changes...
                                            </span>
                                        ) : "Save Changes"}
                                    </button>
                                </form>
                            </div>

                            {/* User Verification Section */}
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <div className="flex justify-between items-center mb-6 pb-2 border-b border-gray-200">
                                    <h2 className="text-xl font-bold text-gray-800">License Verification</h2>
                                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${userProfile?.isUser ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>
                                        {userProfile?.isUser ? "Verified" : "Pending Approval"}
                                    </div>
                                </div>

                                <form className="space-y-5" onSubmit={handleSubmitDocuments}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-gray-600 text-sm font-medium mb-1">Driving License Number</label>
                                            <input
                                                type="text"
                                                placeholder="Enter license number"
                                                value={userProfile?.license_number || ""}
                                                onChange={(e) => setUserProfile({ ...userProfile, license_number: e.target.value } as UserData)}
                                                className={`w-full border ${errors.license_number ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:ring-2 focus:ring-sky-300 focus:border-sky-500 transition-all`}
                                            />
                                            {errors.license_number && <p className="text-red-500 text-xs mt-1">{errors.license_number}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-gray-600 text-sm font-medium mb-1">License Expiration Date</label>
                                            <input
                                                type="date"
                                                placeholder="Select expiration date"
                                                value={
                                                    userProfile?.license_Exp_Date
                                                        ? new Date(userProfile.license_Exp_Date).toISOString().split("T")[0]
                                                        : ""
                                                }
                                                onChange={(e) => setUserProfile({ ...userProfile, license_Exp_Date: new Date(e.target.value) } as UserData)}
                                                className={`w-full border ${errors.license_Exp_Date ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:ring-2 focus:ring-sky-300 focus:border-sky-500 transition-all`}
                                            />
                                            {errors.license_Exp_Date && <p className="text-red-500 text-xs mt-1">{errors.license_Exp_Date}</p>}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium text-gray-700">License Images</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Front Image Upload */}
                                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                                <label className="block text-gray-600 text-sm font-medium mb-2">
                                                    Front Side
                                                </label>
                                                <div className="mb-3">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => handleImageUpload(e, setFrontImage)}
                                                        className="block w-full text-sm text-gray-500 
                                                        file:mr-4 file:py-2 file:px-4
                                                        file:rounded-full file:border-0
                                                        file:text-sm file:font-semibold
                                                        file:bg-sky-50 file:text-sky-700
                                                        hover:file:bg-sky-100 cursor-pointer"
                                                    />
                                                </div>
                                                {frontImage ? (
                                                    <div className="mt-2 border rounded-lg overflow-hidden shadow-sm">
                                                        <img
                                                            src={frontImage instanceof File ? URL.createObjectURL(frontImage) : ""}
                                                            alt="Front"
                                                            className="w-full h-48 object-cover"
                                                        />
                                                    </div>
                                                ) : userProfile?.license_picture_front ? (
                                                    <div className="mt-2 border rounded-lg overflow-hidden shadow-sm">
                                                        <img
                                                            src={
                                                                typeof userProfile.license_picture_front === "string"
                                                                    ? userProfile.license_picture_front
                                                                    : ""
                                                            } alt="Front License"
                                                            className="w-full h-48 object-cover"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="mt-2 border rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center h-48 text-gray-400">
                                                        <div className="text-center">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                            <p className="mt-2">Upload front image</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Back Image Upload */}
                                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                                <label className="block text-gray-600 text-sm font-medium mb-2">
                                                    Back Side
                                                </label>
                                                <div className="mb-3">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => handleImageUpload(e, setBackImage)}
                                                        className="block w-full text-sm text-gray-500 
                                                        file:mr-4 file:py-2 file:px-4
                                                        file:rounded-full file:border-0
                                                        file:text-sm file:font-semibold
                                                        file:bg-sky-50 file:text-sky-700
                                                        hover:file:bg-sky-100 cursor-pointer"
                                                    />
                                                </div>
                                                {backImage ? (
                                                    <div className="mt-2 border rounded-lg overflow-hidden shadow-sm">
                                                        <img
                                                            src={backImage instanceof File ? URL.createObjectURL(backImage) : ""}
                                                            alt="Back"
                                                            className="w-full h-48 object-cover"
                                                        />
                                                    </div>
                                                ) : userProfile?.license_picture_back ? (
                                                    <div className="mt-2 border rounded-lg overflow-hidden shadow-sm">
                                                        <img
                                                            src={
                                                                typeof userProfile.license_picture_back === "string"
                                                                    ? userProfile.license_picture_back
                                                                    : ""
                                                            } alt="Back License"
                                                            className="w-full h-48 object-cover"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="mt-2 border rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center h-48 text-gray-400">
                                                        <div className="text-center">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                            <p className="mt-2">Upload back image</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {errors.license_picture && <p className="text-red-500 text-xs mt-1">{errors.license_picture}</p>}
                                    </div>

                                    <button type="submit"
                                        className={`w-full bg-sky-600 text-white rounded-lg py-3 font-medium hover:bg-sky-700 transition-all transform hover:scale-[1.02] ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <span className="flex items-center justify-center">
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Submitting...
                                            </span>
                                        ) : "Submit for Verification"}
                                    </button>

                                    {userProfile && (
                                        <div className="mt-4 p-4 rounded-lg border bg-gray-50">
                                            <div className="flex items-center">
                                                <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${userProfile.isUser ? "bg-green-100 text-green-600" : "bg-amber-100 text-amber-600"}`}>
                                                    {userProfile.isUser ? (
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    ) : (
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                                        </svg>
                                                    )}
                                                </div>
                                                <div className="ml-3">
                                                    <h3 className={`text-sm font-medium ${userProfile.isUser ? "text-green-800" : "text-amber-800"}`}>
                                                        {userProfile.isUser ? "Verification Approved" : "Verification Pending"}
                                                    </h3>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        {userProfile.isUser
                                                            ? "Your account has been successfully verified. You now have full access to all features."
                                                            : "Your verification is being reviewed by our admin team. This typically takes 1-2 business days."}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </form>
                            </div>
                        </div>
                    </div>
                );

            case "My Wallet": return <MyWallet />;

            case "Booking History":
                return <UserOrderList socket={socket} />;

            case "Feedback":
                return <FeedbackForm />;

            default:
                return null;
        }
    };

    // Navigation menu items with icons
    const menuItems = [
        {
            id: "Personal Details",
            label: "Personal Details",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
            )
        },
        {
            id: "My Wallet",
            label: "My Wallet",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
            )
        },
        {
            id: "Booking History",
            label: "Booking History",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
            )
        },
        {
            id: "Feedback",
            label: "Feedback",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                </svg>
            )
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-sky-100 py-10 mt-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                        {/* Sidebar - Responsive */}
                        <div className="md:w-64 bg-sky-50 p-6">
                            <div className="flex justify-center md:justify-start mb-8">
                                <h1 className="text-2xl font-bold text-sky-800">My Profile</h1>
                            </div>

                            {/* Mobile tabs */}
                            <div className="flex md:hidden overflow-x-auto pb-3 mb-4 space-x-2">
                                {menuItems.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveTab(item.id)}
                                        className={`px-4 py-2 rounded-full whitespace-nowrap ${activeTab === item.id
                                                ? "bg-sky-600 text-white"
                                                : "bg-white text-gray-600 border border-gray-200"
                                            }`}
                                    >
                                        {item.label}
                                    </button>
                                ))}
                            </div>

                            {/* Desktop menu */}
                            <nav className="hidden md:block">
                                <ul className="space-y-1">
                                    {menuItems.map((item) => (
                                        <li key={item.id}>
                                            <button
                                                onClick={() => setActiveTab(item.id)}
                                                className={`flex items-center w-full px-4 py-3 rounded-lg transition-all ${activeTab === item.id
                                                        ? "bg-sky-600 text-white shadow-md"
                                                        : "text-gray-600 hover:bg-sky-100"
                                                    }`}
                                            >
                                                <span className="mr-3">{item.icon}</span>
                                                <span className="font-medium">{item.label}</span>
                                                {activeTab === item.id && (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-auto" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                )}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </nav>

                            {/* User Status Card (only for desktop) */}
                            <div className="hidden md:block mt-8 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                                <div className="flex flex-col items-center">
                                    <div className={`h-3 w-3 rounded-full mb-3 ${userProfile?.isUser ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                                    <p className="text-sm font-medium text-gray-800">Account Status</p>
                                    <p className={`text-sm ${userProfile?.isUser ? 'text-green-600' : 'text-amber-600'}`}>
                                        {userProfile?.isUser ? 'Verified Account' : 'Awaiting Verification'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="flex-1 p-6 md:p-8">
                            {renderContent()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;