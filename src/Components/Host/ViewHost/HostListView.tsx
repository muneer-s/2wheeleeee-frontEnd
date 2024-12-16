import { useState } from "react";

const HostListView = () => {

    const [activeTab, setActiveTab] = useState<string>("Bike Details");


    const renderContent = () => {
        switch (activeTab) {
            case "Bike Details":
                return (
                    <div className="mb-8">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Bike Details</h2>
                        <div className="w-full md:w-3/4 pl-4">
                        lvfsmjnmrojw
                        </div>
                    </div>
                );

            case "Add":
                return (
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Add</h2>
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
                            <li className={`font-semibold cursor-pointer ${activeTab === "Bike Details" ? "text-sky-500" : ""}`} onClick={() => setActiveTab("Bike Details")}>Bike Details</li>
                            <li className={`cursor-pointer ${activeTab === "Add" ? "text-sky-500" : ""}`} onClick={() => setActiveTab("Add")}>Add</li>
                        </ul>
                    </div>

                    {/* Main Content */}

                    <div className="w-full md:w-3/4 pl-4">{renderContent()}</div>


                </div>
            </div>
        </div>
    )
}

export default HostListView