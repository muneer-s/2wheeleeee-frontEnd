import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getSingleUser, toggleIsUser, userBlockUnBlock } from '../../../Api/admin';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { IUser } from '../../../Interfaces/Admin/IAdmin';
import { handleApiResponse } from '../../../Utils/apiUtils';
import toast from 'react-hot-toast';
import { Card, CardContent, Typography, Avatar, Grid, Box, Divider, Button, } from '@mui/material';


const AdminSingleUserPage = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<IUser | null>(null);


  useEffect(() => {
    if (!id) {
      console.error('User ID is missing');
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await getSingleUser(id!);

        const data = handleApiResponse(response)

        if (data) {
          setUser(data);
        } else {
          console.error('Unexpected response structure:', response.message);
          toast.error(response.message)
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, [id]);


  const handleToggleIsUser = async () => {
    if (!user) return;
    const originalIsUser = user.isUser;
    setUser((prevUser) =>
      prevUser ? { ...prevUser, isUser: !prevUser.isUser } : null
    );
    try {
      const response = await toggleIsUser(user._id);
      const data = handleApiResponse(response)

      if (data.isUser) {
        toast.success("Approved")
      } else {
        toast.error("Rovoked")
      }

    } catch (error) {
      console.error('Error toggling isUser field:', error);
      setUser((prevUser) =>
        prevUser ? { ...prevUser, isUser: originalIsUser } : null
      );
    }
  };


  const handleToggleIsBlocked = async () => {
    if (!user) return;
    const originalIsBlocked = user.isBlocked;
    setUser((prevUser) =>
      prevUser ? { ...prevUser, isBlocked: !prevUser.isBlocked } : null
    );
    try {

      const response = await userBlockUnBlock(user?._id)
      const data = handleApiResponse(response)

      if (!response || !data) {
        throw new Error('Unexpected response structure');
      }
    } catch (error) {
      console.error('Error toggling block/unblock:', error);
      // Revert the state in case of an error
      setUser((prevUser) =>
        prevUser ? { ...prevUser, isBlocked: originalIsBlocked } : null
      );
    }
  }

  if (!user) {
    return <p>Loading user data...</p>;
  }

  return (
    <Box sx={{
      padding: { xs: '10px', sm: '20px' },
      backgroundColor: '#f5f5f5', minHeight: '100vh'
    }}>
      <Card sx={{ maxWidth: { xs: '100%', sm: 800 }, margin: 'auto', boxShadow: 3, borderRadius: 2 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} display="flex" justifyContent="center">
              <Avatar
                src={user.profile_picture || 'https://via.placeholder.com/200'}
                alt={user.name}
                sx={{
                  width: 120,
                  height: 120,
                  boxShadow: 2,
                  marginBottom: 2,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h4" align="center" sx={{ fontWeight: 'bold', fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                {user.name}
              </Typography>
              <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                {user.email}
              </Typography>
            </Grid>
            <Divider sx={{ width: '100%', marginY: 2 }} />

            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>Phone Number:</strong> {user.phoneNumber}
              </Typography>
              <Typography variant="body1">
                <strong>Address:</strong> {user.address}
              </Typography>
              <Typography variant="body1">
                <strong>Date of Birth:</strong>{' '}
                {new Date(user.dateOfBirth).toLocaleDateString()}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="body1" display="flex" alignItems="center">
                <strong>Blocked:</strong>{' '}
                {user.isBlocked ? (
                  <CheckCircleOutlineIcon color="success" sx={{ marginLeft: 1 }} />
                ) : (
                  <CancelOutlinedIcon color="error" sx={{ marginLeft: 1 }} />
                )}
              </Typography>

              {/* <Divider sx={{ width: '100%', marginY: 2 }} /> */}


              <Typography variant="body1" display="flex" alignItems="center" sx={{ marginBottom: 2 }} >
                <strong>Is User Verify :</strong> {user.isUser ? 'Approved' : 'Pending'}
                <Button
                  variant="contained"
                  color={user.isUser ? 'error' : 'primary'}
                  size="small"
                  sx={{ marginLeft: 2 }}
                  onClick={handleToggleIsUser}
                >
                  {user.isUser ? 'Revoke' : 'Approve'}
                </Button>
              </Typography>


              <Typography variant="body1" display="flex" alignItems="center">
                <strong>Is User Blocked :</strong> {user.isBlocked ? 'Blocked' : 'Not Blocked'}
                <Button
                  variant="contained"
                  color={user.isBlocked ? 'primary' : 'error'}
                  size="small"
                  sx={{ marginLeft: 2 }}
                  onClick={handleToggleIsBlocked}
                >
                  {user.isBlocked ? 'UnBlock' : 'Block'}
                </Button>
              </Typography>
            </Grid>

            <Divider sx={{ width: '100%', marginY: 2 }} />

            {/* License Pictures */}
            <Grid item xs={12} sm={6}>
              <img
                src={user.license_picture_front || 'https://via.placeholder.com/300x200'}
                alt="License Front"
                style={{
                  width: '100%',
                  borderRadius: '10px',
                  boxShadow: '2px 2px 5px rgba(0,0,0,0.3)',
                }}
              />
              <Typography align="center" variant="caption" color="text.secondary">
                License Front
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <img
                src={user.license_picture_back || 'https://via.placeholder.com/300x200'}
                alt="License Back"
                style={{
                  width: '100%',
                  borderRadius: '10px',
                  boxShadow: '2px 2px 5px rgba(0,0,0,0.3)',
                }}
              />
              <Typography align="center" variant="caption" color="text.secondary">
                License Back
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AdminSingleUserPage;
