import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getSingleUser } from '../../../Api/admin';
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Grid,
  Box,
  Divider,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

interface User {
  _id: string;
  name: string;
  email: string;
  dateOfBirth: string;
  profile_picture: string | null;
  address: string;
  phoneNumber: number;
  isBlocked: boolean;
  isUser: boolean;
  isVerified: boolean;
  lisence_picture_front: string;
  lisence_picture_back: string;
}

const AdminSingleUserPage = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!id) {
      console.error('User ID is missing');
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await getSingleUser(id!);
        if (response && response.data) {
          console.log('User Data:', response.data.user);
          setUser(response.data.user);
        } else {
          console.error('Unexpected response structure:', response);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, [id]);

  if (!user) {
    return <p>Loading user data...</p>;
  }

  return (
    <Box sx={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Card sx={{ maxWidth: 800, margin: 'auto', boxShadow: 3, borderRadius: 2 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} display="flex" justifyContent="center">
              <Avatar
                src={user.profile_picture || 'https://via.placeholder.com/200'}
                alt={user.name}
                sx={{
                  width: 150,
                  height: 150,
                  boxShadow: 2,
                  marginBottom: 2,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h4" align="center" sx={{ fontWeight: 'bold' }}>
                {user.name}
              </Typography>
              <Typography variant="subtitle1" align="center" color="text.secondary">
                {user.email}
              </Typography>
            </Grid>
            <Divider sx={{ width: '100%', marginY: 2 }} />
            <Grid item xs={6}>
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
            <Grid item xs={6}>

              <Typography variant="body1" display="flex" alignItems="center">
                <strong>Verified:</strong>{' '}
                {user.isVerified ? (
                  <CheckCircleOutlineIcon color="success" sx={{ marginLeft: 1 }} />
                ) : (
                  <CancelOutlinedIcon color="error" sx={{ marginLeft: 1 }} />
                )}
              </Typography>

              <Typography variant="body1" display="flex" alignItems="center">
                <strong>Blocked:</strong>{' '}
                {user.isBlocked ? (
                  <CheckCircleOutlineIcon color="success" sx={{ marginLeft: 1 }} />
                ) : (
                  <CancelOutlinedIcon color="error" sx={{ marginLeft: 1 }} />
                )}
              </Typography>

              <Typography variant="body1">
                <strong>Is User :</strong> {user.isUser ? 'Approved' : 'Pending'}
              </Typography>


            </Grid>
            <Divider sx={{ width: '100%', marginY: 2 }} />
            <Grid item xs={6}>
              <img
                src={user.lisence_picture_front || 'https://via.placeholder.com/300x200'}
                alt="License Front"
                style={{ width: '100%', borderRadius: '10px', boxShadow: '2px 2px 5px rgba(0,0,0,0.3)' }}
              />
              <Typography align="center" variant="caption" color="text.secondary">
                License Front
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <img
                src={user.lisence_picture_back || 'https://via.placeholder.com/300x200'}
                alt="License Back"
                style={{ width: '100%', borderRadius: '10px', boxShadow: '2px 2px 5px rgba(0,0,0,0.3)' }}
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