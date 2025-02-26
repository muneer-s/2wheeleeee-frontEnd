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
          label="Search by Owner Name"
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
          'Owner Name',
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

};

export default AdminHostComp;
