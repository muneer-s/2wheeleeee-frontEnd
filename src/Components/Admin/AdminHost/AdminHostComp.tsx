import React, { useEffect, useState } from "react";
import { getAllBikeDetails, logout } from "../../../Api/admin";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { adminLogout } from "../../../Apps/slice/AuthSlice";
import { useDispatch } from "react-redux";
import { IAdminBikeData } from "../../../Interfaces/Admin/IAdmin";
import { Box, Button, TextField, Select, MenuItem, TableRow, TableCell, SelectChangeEvent } from '@mui/material';
import CustomTable from "../../../ReusableComponents/CustomTable";
import Pagination from "../../../ReusableComponents/Pagination";
import { handleApiResponse } from "../../../Utils/apiUtils";



const AdminHostComp = () => {
    const [bikeList, setBikeList] = useState<IAdminBikeData[]>([]);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('');
    const [sort, setSort] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalBikes, setTotalBikes] = useState(0);
    const limit = 10;

    const navigate = useNavigate()
    const dispatch = useDispatch();



    const fetchBikeDetails = async () => {
        try {
            const response = await getAllBikeDetails({ page: currentPage, limit, search, filter, sort });
            const data = handleApiResponse(response)
            if (response.success) {
                setBikeList(data.bikes);
                setTotalBikes(data.total);
            } else {
                toast.error('Failed to fetch bike details');
                await logout()
                dispatch(adminLogout());
            }
        } catch (error) {
            toast.error('Error fetching bike details');
        }
    };

    useEffect(() => {
        fetchBikeDetails();
    }, [currentPage, search, filter, sort]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setCurrentPage(1);
    };

    // const handleFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    //     setFilter(e.target.value);
    //     setCurrentPage(1);
    // };

    // const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    //     setSort(e.target.value);
    //     setCurrentPage(1);
    // };

    const handleFilter = (event: SelectChangeEvent<string>) => {
        setFilter(event.target.value as string);
        setCurrentPage(1);
    };

    const handleSort = (event: SelectChangeEvent<string>) => {
        setSort(event.target.value as string);
        setCurrentPage(1);
    };


    const singlePageView = (bike: IAdminBikeData) => {
        navigate('/singleBikeViewPage', { state: { bike } });
    }

    return (
        <Box className="bg-gradient-to-b from-white to-sky-200" minHeight="100vh" p={4}>
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Bike Details</h1>
    
          <Box display="flex" justifyContent="space-between " mb={4} flexWrap="wrap" gap={2}>
            <TextField
              label="Search by User Name"
              variant="outlined"
              value={search}
              onChange={handleSearch}
            />
            <Select value={filter} onChange={handleFilter} displayEmpty variant="outlined">
              <MenuItem value="">All</MenuItem>
              <MenuItem value="verified">Verified</MenuItem>
              <MenuItem value="notVerified">Not Verified</MenuItem>
            </Select>
            <Select value={sort} onChange={handleSort} displayEmpty variant="outlined">
              <MenuItem value="">Sort by Rent</MenuItem>
              <MenuItem value="asc">Ascending</MenuItem>
              <MenuItem value="desc">Descending</MenuItem>
            </Select>
          </Box>
    
          <CustomTable
            headers={[
              'Bike Image',
              'User Name',
              'Company Name',
              'Model Name',
              'Rent Amount',
              'Verification Status',
              'Pollution Expiry',
              'Insurance Expiry',
              'Actions',
            ]}
            data={bikeList}
            renderRow={(bike) => (
              <TableRow key={bike._id} hover>
                <TableCell>
                  <img
                    src={bike.images[0] || 'https://via.placeholder.com/150'}
                    alt={bike.userDetails.name}
                    style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                </TableCell>
                <TableCell>{bike.userDetails.name}</TableCell>
                <TableCell>{bike.companyName}</TableCell>
                <TableCell>{bike.modelName}</TableCell>
                <TableCell>₹{bike.rentAmount}</TableCell>
                <TableCell style={{ color: bike.isHost ? 'green' : 'red' }}>
                  {bike.isHost ? 'Verified' : 'Not Verified'}
                </TableCell>
                <TableCell style={{ color: new Date(bike.polutionExpDate) < new Date() ? 'red' : 'green' }}>
                  {new Date(bike.polutionExpDate) < new Date()
                    ? 'Expired'
                    : bike.polutionExpDate.toString().split('T')[0]}
                </TableCell>
                <TableCell style={{ color: new Date(bike.insuranceExpDate) < new Date() ? 'red' : 'green' }}>
                  {new Date(bike.insuranceExpDate) < new Date()
                    ? 'Expired'
                    : bike.insuranceExpDate.toString().split('T')[0]}
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => singlePageView(bike)}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            )}
          />
    
          <Pagination
            page={currentPage}
            totalPages={Math.ceil(totalBikes / limit)}
            onPageChange={setCurrentPage}
          />
        </Box>
      );

    // return (
    //     <div className="bg-gradient-to-b from-white to-sky-200 " style={{ minHeight: '100vh' }}>
    //         <div className="overflow-x-auto p-6 ">
    //             <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Bike Details</h1>

    //             <div className="mb-4 flex justify-start ">
    //                 <div className="ml-5">
    //                     <input
    //                         type="text"
    //                         placeholder="Search by user name"
    //                         value={search}
    //                         onChange={handleSearch}
    //                         className="border px-4 py-2 rounded-lg"
    //                     />
    //                 </div>
    //                 <div className="ml-10 flex">
    //                     <p className="mt-2 mr-3"> Verification : </p>
    //                     <select value={filter} onChange={handleFilter} className="border px-4 py-2 rounded-lg">
    //                         <option value="">All</option>
    //                         <option value="verified">Verified</option>
    //                         <option value="notVerified">Not Verified</option>
    //                     </select>
    //                 </div >
    //                 <div className="ml-11">
    //                     <select value={sort} onChange={handleSort} className="border px-4 py-2 rounded-lg">
    //                         <option value="">Sort by Rent</option>
    //                         <option value="asc">Ascending</option>
    //                         <option value="desc">Descending</option>
    //                     </select>
    //                 </div>

    //             </div>




    //             <table className="table-auto w-full border-collapse rounded-lg shadow-lg bg-gradient-to-b from-white to-sky-200 " >
    //                 <thead className="bg-gray-100 text-gray-600">
    //                     <tr>
    //                         <th className="border border-gray-300 p-3 text-left">Bike Image</th>
    //                         <th className="border border-gray-300 p-3 text-left">User Name</th>
    //                         <th className="border border-gray-300 p-3 text-left">Company Name</th>
    //                         <th className="border border-gray-300 p-3 text-left">Model Name</th>
    //                         <th className="border border-gray-300 p-3 text-left">Rent Amount</th>
    //                         <th className="border border-gray-300 p-3 text-left">Verify or Not</th>
    //                         <th className="border border-gray-300 p-3 text-left">Polution Exp Date</th>
    //                         <th className="border border-gray-300 p-3 text-left">Insurance Exp Date</th>
    //                         <th className="border border-gray-300 p-3 text-center">Actions</th>
    //                     </tr>
    //                 </thead>
    //                 <tbody>
    //                     {bikeList.length > 0 ? (
    //                         bikeList.map((bike) => (
    //                             <tr key={bike._id} className="border-b hover:bg-gray-50 transition duration-300 ease-in-out">
    //                                 {/* User Profile Picture */}
    //                                 <td className=" p-4 flex justify-center items-center">
    //                                     <img
    //                                         src={bike.images[0] || 'https://via.placeholder.com/150'}
    //                                         alt={bike.userDetails.name}
    //                                         className="w-16 h-16 rounded-full object-cover border-2 border-gray-300 hover:scale-105 transition transform"
    //                                     />
    //                                 </td>
    //                                 {/* User Name */}
    //                                 <td className="border border-gray-300 p-4">{bike.userDetails.name}</td>
    //                                 {/* Bike Details */}
    //                                 <td className="border border-gray-300 p-4">{bike.companyName}</td>
    //                                 <td className="border border-gray-300 p-4">{bike.modelName}</td>
    //                                 <td className="border border-gray-300 p-4">₹{bike.rentAmount}</td>


    //                                 <td className={`border border-gray-300 p-4 font-semibold ${bike.isHost ? 'text-green-500' : 'text-red-500'}`}>
    //                                     {bike.isHost ? 'Verified' : 'Not Verified'}
    //                                 </td>
    //                                 <td
    //                                     className={`border border-gray-300 p-4 font-semibold ${new Date(bike.polutionExpDate) < new Date() ? 'text-red-500' : 'text-green-500'
    //                                         }`}
    //                                 >
    //                                     {new Date(bike.polutionExpDate) < new Date()
    //                                         ? 'Expired'
    //                                         : bike.polutionExpDate.toString().split("T")[0]}
    //                                 </td>
    //                                 <td
    //                                     className={`border border-gray-300 p-4 font-semibold ${new Date(bike.insuranceExpDate) < new Date() ? 'text-red-500' : 'text-green-500'
    //                                         }`}
    //                                 >
    //                                     {new Date(bike.insuranceExpDate) < new Date()
    //                                         ? 'Expired'
    //                                         : bike.insuranceExpDate.toString().split("T")[0]}
    //                                 </td>




    //                                 <td className=" p-4 flex justify-center items-center">
    //                                     <button
    //                                         onClick={() => singlePageView(bike)}
    //                                         className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
    //                                     >
    //                                         View
    //                                     </button>
    //                                 </td>
    //                             </tr>
    //                         ))
    //                     ) : (
    //                         <tr>
    //                             <td colSpan={6} className="text-center p-4 text-gray-500">No bikes found.</td>
    //                         </tr>
    //                     )}
    //                 </tbody>
    //             </table>

    //             <div className="mt-4 flex justify-center">
    //                 {[...Array(Math.ceil(totalBikes / limit))].map((_, index) => (
    //                     <button
    //                         key={index}
    //                         onClick={() => setCurrentPage(index + 1)}
    //                         className={`px-4 py-2 mx-1 rounded-lg ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
    //                     >
    //                         {index + 1}
    //                     </button>
    //                 ))}
    //             </div>




    //         </div>
    //     </div>

    // );




};

export default AdminHostComp;
