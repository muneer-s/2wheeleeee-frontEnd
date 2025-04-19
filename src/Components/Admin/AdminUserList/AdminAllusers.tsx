import { useEffect, useState } from 'react';
import { getAllUsers, logout } from '../../../Api/admin';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { adminLogout } from '../../../Apps/slice/AuthSlice';
import { useDispatch } from 'react-redux';
import { IAdminUser } from '../../../Interfaces/Admin/IAdmin';
import CustomTable from '../../../ReusableComponents/CustomTable';
import Pagination from '../../../ReusableComponents/Pagination';
import { 
  Box, 
  Select, 
  MenuItem, 
  TextField, 
  Typography, 
  TableRow,  
  TableCell, 
  InputAdornment,
  Chip,
  Avatar,
  Paper,
  IconButton
} from '@mui/material';
import { handleApiResponse } from '../../../Utils/apiUtils';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';

const AdminAllUsers = () => {
  const [userList, setUserList] = useState<IAdminUser[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [search, setSearch] = useState<string>('');
  const [filter, setFilter] = useState<{ isBlocked?: boolean; isUser?: boolean }>({});

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const queryParams = new URLSearchParams({
          page: page.toString(),
          limit: '10',
          search,
          ...(filter.isBlocked !== undefined ? { isBlocked: filter.isBlocked.toString() } : {}),
          ...(filter.isUser !== undefined ? { isUser: filter.isUser.toString() } : {}),
        });

        const response = await getAllUsers(`?${queryParams.toString()}`);
        const data = handleApiResponse(response);

        if (response && response.success) {
          setUserList(data.usersList);
          setTotalPages(data.totalPages);
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'An error occurred');
        console.error('Error fetching users:', error);
        await logout();
        dispatch(adminLogout());
      }
    };

    fetchUsers();
  }, [page, search, filter, dispatch]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleFilterChange = (key: 'isBlocked' | 'isUser', value: string) => {
    setFilter((prev) => {
      const newFilter = { ...prev };
      if (value === 'all') {
        delete newFilter[key];
      } else {
        newFilter[key] = value === 'true';
      }
      return newFilter;
    });
    setPage(1);
  };

  const handleViewUser = (id: string) => {
    navigate(`/usersinglepage/${id}`);
  };

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        bgcolor: '#F9FAFB', 
        minHeight: '100vh', 
        p: 3,
        borderRadius: 0
      }}
    >
      <Box maxWidth="1400px" mx="auto">
        {/* Header Section */}
        <Box 
          display="flex" 
          alignItems="center" 
          justifyContent="space-between" 
          mb={4}
        >
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700, 
              color: '#111827',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            User Management
            <Chip 
              label={`${userList.length} users`} 
              size="small" 
              sx={{ 
                ml: 2, 
                bgcolor: '#EEF2FF', 
                color: '#4F46E5',
                fontWeight: 500
              }} 
            />
          </Typography>
        </Box>

        {/* Filters Section */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            mb: 3, 
            borderRadius: 2,
            border: '1px solid #E5E7EB',
            bgcolor: 'white'
          }}
        >
          <Box 
            display="flex" 
            flexDirection={{ xs: 'column', md: 'row' }} 
            gap={2} 
            alignItems={{ xs: 'stretch', md: 'center' }}
          >
            <TextField
              placeholder="Search users by name..."
              variant="outlined"
              fullWidth
              value={search}
              onChange={handleSearch}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#9CA3AF' }} />
                  </InputAdornment>
                ),
                sx: { 
                  borderRadius: 1,
                  bgcolor: '#F9FAFB',
                  '& fieldset': { borderColor: '#E5E7EB' },
                  '&:hover fieldset': { borderColor: '#D1D5DB' }
                }
              }}
            />
            
            <Box 
              display="flex" 
              flexDirection={{ xs: 'column', sm: 'row' }} 
              gap={2} 
              alignItems="center"
              sx={{ flexShrink: 0 }}
            >
              <Box display="flex" alignItems="center" gap={1}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#4B5563', 
                    fontWeight: 500,
                    whiteSpace: 'nowrap'
                  }}
                >
                  Account Status:
                </Typography>
                <Select
                  value={filter.isBlocked === undefined ? 'all' : filter.isBlocked.toString()}
                  onChange={(e) => handleFilterChange('isBlocked', e.target.value)}
                  size="small"
                  sx={{ 
                    minWidth: 130,
                    borderRadius: 1,
                    bgcolor: '#F9FAFB',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E5E7EB' }
                  }}
                >
                  <MenuItem value="all">All Users</MenuItem>
                  <MenuItem value="true">Blocked</MenuItem>
                  <MenuItem value="false">Active</MenuItem>
                </Select>
              </Box>

              <Box display="flex" alignItems="center" gap={1}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#4B5563', 
                    fontWeight: 500,
                    whiteSpace: 'nowrap'
                  }}
                >
                  Verification:
                </Typography>
                <Select
                  value={filter.isUser === undefined ? 'all' : filter.isUser.toString()}
                  onChange={(e) => handleFilterChange('isUser', e.target.value)}
                  size="small"
                  sx={{ 
                    minWidth: 130,
                    borderRadius: 1,
                    bgcolor: '#F9FAFB',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E5E7EB' }
                  }}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="true">Verified</MenuItem>
                  <MenuItem value="false">Unverified</MenuItem>
                </Select>
              </Box>
            </Box>
          </Box>
        </Paper>

        {/* Users Table */}
        <Paper 
          elevation={0} 
          sx={{ 
            borderRadius: 2,
            overflow: 'hidden',
            border: '1px solid #E5E7EB',
            mb: 3
          }}
        >
          <CustomTable
            headers={['User', 'Email', 'Date of Birth', 'Status', 'Verification', 'Actions']}
            data={userList}
            renderRow={(user) => (
              <TableRow 
                key={user._id}
                sx={{ 
                  '&:hover': { bgcolor: '#F9FAFB' },
                  transition: 'background-color 0.2s'
                }}
              >
                <TableCell>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar 
                      src={user.profile_picture || undefined} 
                      alt={user.name}
                      sx={{ 
                        width: 40, 
                        height: 40,
                        border: '2px solid #E5E7EB'
                      }}
                    >
                      {user.name.charAt(0)}
                    </Avatar>
                    <Typography sx={{ fontWeight: 500, color: '#111827' }}>
                      {user.name}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{ color: '#4B5563' }}>{user.email}</TableCell>
                <TableCell sx={{ color: '#4B5563' }}>
                  {new Date(user.dateOfBirth).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Chip 
                    label={user.isBlocked ? 'Blocked' : 'Active'} 
                    size="small"
                    sx={{ 
                      bgcolor: user.isBlocked ? '#FEE2E2' : '#ECFDF5',
                      color: user.isBlocked ? '#B91C1C' : '#065F46',
                      fontWeight: 500
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={user.isUser ? 'Verified' : 'Unverified'} 
                    size="small"
                    sx={{ 
                      bgcolor: user.isUser ? '#EFF6FF' : '#F3F4F6',
                      color: user.isUser ? '#1E40AF' : '#4B5563',
                      fontWeight: 500
                    }}
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleViewUser(user._id)}
                    size="small"
                    sx={{ 
                      color: '#4F46E5',
                      bgcolor: '#EEF2FF',
                      '&:hover': {
                        bgcolor: '#E0E7FF'
                      }
                    }}
                  >
                    <VisibilityIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            )}
          />
        </Paper>

        {/* Pagination */}
        <Box display="flex" justifyContent="center">
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </Box>
      </Box>
    </Paper>
  );
};

export default AdminAllUsers;