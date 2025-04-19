import React, { useEffect, useState } from "react";
import { getAllBikeDetails, logout } from "../../../Api/admin";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { adminLogout } from "../../../Apps/slice/AuthSlice";
import { useDispatch } from "react-redux";
import { IAdminBikeData } from "../../../Interfaces/Admin/IAdmin";
import { 
  Box, 
  Button, 
  TextField, 
  Select, 
  MenuItem, 
  TableRow, 
  TableCell, 
  SelectChangeEvent,
  Paper,
  Typography,
  InputAdornment,
  Chip,
  Tooltip,
  CircularProgress
} from '@mui/material';
import CustomTable from "../../../ReusableComponents/CustomTable";
import Pagination from "../../../ReusableComponents/Pagination";
import { handleApiResponse } from "../../../Utils/apiUtils";
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VerifiedIcon from '@mui/icons-material/Verified';
import CancelIcon from '@mui/icons-material/Cancel';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';

const AdminHostComp = () => {
  const [bikeList, setBikeList] = useState<IAdminBikeData[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalBikes, setTotalBikes] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const limit = 10;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fetchBikeDetails = async () => {
    setIsLoading(true);
    try {
      const response = await getAllBikeDetails({ page: currentPage, limit, search, filter, sort });
      const data = handleApiResponse(response);
      if (response.success) {
        setBikeList(data.bikes);
        setTotalBikes(data.total);
      } else {
        toast.error('Failed to fetch bike details');
        await logout();
        dispatch(adminLogout());
      }
    } catch (error) {
      toast.error('Error fetching bike details');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBikeDetails();
  }, [currentPage, search, filter, sort]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

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
  };

  return (
    <Box className="bg-gradient-to-br from-blue-50 via-white to-blue-100" minHeight="100vh" p={4}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          mb: 4, 
          borderRadius: 2,
          background: 'linear-gradient(135deg, #f5f7fa 0%, #e4f1fe 100%)',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="center" mb={4}>
          <TwoWheelerIcon sx={{ fontSize: 36, color: '#3b82f6', mr: 2 }} />
          <Typography variant="h4" fontWeight="bold" color="text.primary">
            Bike Management Dashboard
          </Typography>
        </Box>

        <Box 
          display="flex" 
          justifyContent="space-between" 
          mb={4} 
          flexWrap="wrap" 
          gap={2}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            }
          }}
        >
          <TextField
            label="Search by Owner Name"
            variant="outlined"
            value={search}
            onChange={handleSearch}
            sx={{ minWidth: 250 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />
          
          <Select
            value={filter}
            onChange={handleFilter}
            displayEmpty
            variant="outlined"
            sx={{ minWidth: 180 }}
            startAdornment={<FilterListIcon color="primary" sx={{ mr: 1 }} />}
          >
            <MenuItem value="">All Verification Status</MenuItem>
            <MenuItem value="verified">Verified Only</MenuItem>
            <MenuItem value="notVerified">Not Verified Only</MenuItem>
          </Select>
          
          <Select
            value={sort}
            onChange={handleSort}
            displayEmpty
            variant="outlined"
            sx={{ minWidth: 180 }}
            startAdornment={<SortIcon color="primary" sx={{ mr: 1 }} />}
          >
            <MenuItem value="">Sort by Rent</MenuItem>
            <MenuItem value="asc">Lowest Price First</MenuItem>
            <MenuItem value="desc">Highest Price First</MenuItem>
          </Select>
        </Box>
      </Paper>

      <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" p={4}>
            <CircularProgress />
          </Box>
        ) : bikeList.length === 0 ? (
          <Box p={4} textAlign="center">
            <Typography color="text.secondary">No bikes found matching your criteria</Typography>
          </Box>
        ) : (
          <Box sx={{ overflowX: 'auto' }}>
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
                <TableRow 
                  key={bike._id} 
                  hover
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(59, 130, 246, 0.04)',
                    }
                  }}
                >
                  <TableCell>
                    <Box
                      sx={{
                        width: 70,
                        height: 70,
                        borderRadius: '12px',
                        border: '2px solid #e0e7ff',
                        overflow: 'hidden',
                        position: 'relative',
                      }}
                    >
                      <img
                        src={bike.images[0] || 'https://via.placeholder.com/150?text=No+Image'}
                        alt={bike.modelName}
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover',
                        }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" fontWeight="medium">
                      {bike.userDetails.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {bike.companyName}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {bike.modelName}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      fontWeight="bold"
                      sx={{ color: '#3b82f6' }}
                    >
                      ₹{bike.rentAmount}/day
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={bike.isHost ? <VerifiedIcon /> : <CancelIcon />}
                      label={bike.isHost ? 'Verified' : 'Not Verified'}
                      color={bike.isHost ? 'success' : 'error'}
                      variant="outlined"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(bike.polutionExpDate) < new Date() ? (
                      <Tooltip title="Pollution certificate expired!" arrow>
                        <Chip
                          icon={<ErrorOutlineIcon />}
                          label="Expired"
                          color="error"
                          size="small"
                        />
                      </Tooltip>
                    ) : (
                      <Tooltip title="Valid pollution certificate" arrow>
                        <Chip
                          icon={<CheckCircleOutlineIcon />}
                          label={bike.polutionExpDate.toString().split('T')[0]}
                          color="success"
                          size="small"
                          variant="outlined"
                        />
                      </Tooltip>
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(bike.insuranceExpDate) < new Date() ? (
                      <Tooltip title="Insurance expired!" arrow>
                        <Chip
                          icon={<ErrorOutlineIcon />}
                          label="Expired"
                          color="error"
                          size="small"
                        />
                      </Tooltip>
                    ) : (
                      <Tooltip title="Valid insurance" arrow>
                        <Chip
                          icon={<CheckCircleOutlineIcon />}
                          label={bike.insuranceExpDate.toString().split('T')[0]}
                          color="success"
                          size="small"
                          variant="outlined"
                        />
                      </Tooltip>
                    )}
                  </TableCell>
                  <TableCell>
                    <Tooltip title="View bike details" arrow>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => singlePageView(bike)}
                        startIcon={<VisibilityIcon />}
                        sx={{ 
                          borderRadius: 2,
                          boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.3)',
                          '&:hover': {
                            boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.4)'
                          }
                        }}
                      >
                        View
                      </Button>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              )}
            />
          </Box>
        )}
      </Paper>

      <Box mt={4} display="flex" justifyContent="center">
        <Pagination
          page={currentPage}
          totalPages={Math.ceil(totalBikes / limit)}
          onPageChange={setCurrentPage}
        />
      </Box>
    </Box>
  );
};

export default AdminHostComp;