import { useEffect, useState } from 'react';
import { getAllUsers, logout } from '../../../Api/admin';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { adminLogout } from '../../../Apps/slice/AuthSlice';
import { useDispatch } from 'react-redux';
import { IAdminUser } from '../../../Interfaces/Admin/IAdmin';
import CustomTable from '../../../ReusableComponents/CustomTable';
import Pagination from '../../../ReusableComponents/Pagination';
import { Box, Select, MenuItem, TextField, Typography, TableRow, Button, TableCell } from '@mui/material';
import { handleApiResponse } from '../../../Utils/apiUtils';


const AdminAllusers = () => {
  const [userList, setUserList] = useState<IAdminUser[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [search, setSearch] = useState<string>('');
  const [filter, setFilter] = useState<{ isBlocked?: boolean; isUser?: boolean }>({});

  const navigate = useNavigate()
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

        const data = handleApiResponse(response)

        if (response && response.success) {
          setUserList(data.usersList);
          setTotalPages(data.totalPages);
        }
      } catch (error: any) {
        toast.error(error.response.data.message)
        console.error('Error fetching users:', error);
        await logout()
        dispatch(adminLogout());

      }
    };

    fetchUsers();
  }, [page, search, filter]);

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
    navigate(`/usersinglepage/${id}`)
  }


  return (
    <Box padding={3} bgcolor="skyblue" minHeight="100vh">
      <Typography variant="h4" align="center" gutterBottom>
        All Users
      </Typography>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <TextField
          label="Search by name"
          variant="outlined"
          value={search}
          onChange={handleSearch}
          fullWidth
          style={{ marginRight: 20 }}
        />
        <Typography>Check Block :</Typography>
        <Select
          value={filter.isBlocked === undefined ? '' : filter.isBlocked.toString()}
          onChange={(e) => handleFilterChange('isBlocked', e.target.value)}
          displayEmpty
          style={{ marginRight: 20 }}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="true">Blocked</MenuItem>
          <MenuItem value="false">Not Blocked</MenuItem>
        </Select>
        <Typography>Verification: </Typography>
        <Select
          value={filter.isUser === undefined ? '' : filter.isUser.toString()}
          onChange={(e) => handleFilterChange('isUser', e.target.value)}
          displayEmpty
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="true">Verified</MenuItem>
          <MenuItem value="false">Not Verified</MenuItem>
        </Select>
      </Box>

      <CustomTable
        headers={['Profile Picture', 'Name', 'Email', 'Date of Birth', 'Blocked', 'Verified', 'Actions']}
        data={userList}
        renderRow={(user) => (
          <TableRow key={user._id}>
            <TableCell>
              <img
                src={user.profile_picture || 'No DP'}
                alt={user.name}
                style={{ width: '50px', height: '50px', borderRadius: '50%' }}
              />
            </TableCell>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{new Date(user.dateOfBirth).toLocaleDateString()}</TableCell>
            <TableCell>{user.isBlocked ? 'Blocked' : 'Not Blocked'}</TableCell>
            <TableCell>{user.isUser ? 'Verified' : 'Not Verified'}</TableCell>
            <TableCell>
              <Button variant="contained" color="primary" onClick={() => handleViewUser(user._id)}>
                View
              </Button>
            </TableCell>
          </TableRow>
        )}
      />

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </Box>
  );

};

export default AdminAllusers;
