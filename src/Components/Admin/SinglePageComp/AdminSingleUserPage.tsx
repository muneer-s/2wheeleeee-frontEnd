import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getSingleUser, toggleIsUser, userBlockUnBlock } from '../../../Api/admin';
import { IUser } from '../../../Interfaces/Admin/IAdmin';
import { handleApiResponse } from '../../../Utils/apiUtils';
import toast from 'react-hot-toast';
import { 
  Box, Card, CardContent, Typography, Avatar, Grid, 
  Divider, Button, Chip, Paper, Container, Skeleton
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import BlockIcon from '@mui/icons-material/Block';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import CakeIcon from '@mui/icons-material/Cake';
import BadgeIcon from '@mui/icons-material/Badge';

const AdminSingleUserPage = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      console.error('User ID is missing');
      return;
    }

    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await getSingleUser(id!);
        const data = handleApiResponse(response);

        if (data) {
          setUser(data);
        } else {
          console.error('Unexpected response structure:', response.message);
          toast.error(response.message);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        toast.error('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleToggleIsUser = async () => {
    if (!user) return;
    const originalIsUser = user.isUser;
    
    // Optimistic update
    setUser((prevUser) =>
      prevUser ? { ...prevUser, isUser: !prevUser.isUser } : null
    );
    
    try {
      const response = await toggleIsUser(user._id);
      const data = handleApiResponse(response);

      if (data.isUser) {
        toast.success("User approved successfully");
      } else {
        toast.error("User approval revoked");
      }
    } catch (error) {
      console.error('Error toggling isUser field:', error);
      // Revert the state in case of an error
      setUser((prevUser) =>
        prevUser ? { ...prevUser, isUser: originalIsUser } : null
      );
      toast.error("Failed to update user status");
    }
  };

  const handleToggleIsBlocked = async () => {
    if (!user) return;
    const originalIsBlocked = user.isBlocked;
    
    // Optimistic update
    setUser((prevUser) =>
      prevUser ? { ...prevUser, isBlocked: !prevUser.isBlocked } : null
    );
    
    try {
      const response = await userBlockUnBlock(user?._id);
      const data = handleApiResponse(response);

      if (!response || !data) {
        throw new Error('Unexpected response structure');
      }
      
      toast.success(user.isBlocked ? "User unblocked successfully" : "User blocked successfully");
    } catch (error) {
      console.error('Error toggling block/unblock:', error);
      // Revert the state in case of an error
      setUser((prevUser) =>
        prevUser ? { ...prevUser, isBlocked: originalIsBlocked } : null
      );
      toast.error("Failed to update user block status");
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Card elevation={3} sx={{ borderRadius: 3 }}>
          <CardContent>
            <Box display="flex" justifyContent="center" mb={3}>
              <Skeleton variant="circular" width={150} height={150} />
            </Box>
            <Skeleton variant="text" height={60} width="60%" sx={{ mx: 'auto' }} />
            <Skeleton variant="text" height={30} width="40%" sx={{ mx: 'auto', mb: 2 }} />
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Skeleton variant="text" height={30} />
                <Skeleton variant="text" height={30} />
                <Skeleton variant="text" height={30} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Skeleton variant="text" height={30} />
                <Skeleton variant="rectangular" height={40} width="80%" sx={{ mb: 2 }} />
                <Skeleton variant="text" height={30} />
                <Skeleton variant="rectangular" height={40} width="80%" />
              </Grid>
            </Grid>
            <Divider sx={{ my: 3 }} />
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2, textAlign: 'center' }}>
          <Typography variant="h6" color="error">User data not found</Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Box sx={{
      padding: { xs: 2, sm: 4 },
      backgroundColor: '#f8f9fa',
      minHeight: '100vh'
    }}>
      <Container maxWidth="md">
        <Card
          elevation={4}
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
            backgroundColor: 'white',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
            }
          }}
        >
          {/* Header with background color */}
          <Box 
            sx={{ 
              backgroundColor: '#3f51b5',
              padding: 3,
              color: 'white',
              position: 'relative'
            }}
          >
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              position="relative"
              sx={{ mb: 2 }}
            >
              <Avatar
                src={user.profile_picture || 'https://via.placeholder.com/200'}
                alt={user.name}
                sx={{
                  width: 150,
                  height: 150,
                  border: '4px solid #fff',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                  backgroundColor: '#e0e0e0'
                }}
              />
              {user.isUser && (
                <Chip
                  icon={<VerifiedUserIcon />}
                  label="Verified"
                  color="success"
                  sx={{
                    position: 'absolute',
                    bottom: -10,
                    backgroundColor: '#4caf50',
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                />
              )}
            </Box>

            <Typography 
              variant="h4" 
              align="center" 
              sx={{ 
                fontWeight: 'bold', 
                fontSize: { xs: '1.5rem', sm: '2rem' },
                mt: 2
              }}
            >
              {user.name}
            </Typography>
            
            <Typography 
              variant="subtitle1" 
              align="center" 
              sx={{ 
                opacity: 0.9,
                fontSize: { xs: '0.9rem', sm: '1rem' }
              }}
            >
              {user.email}
            </Typography>

            <Chip
              icon={user.isBlocked ? <BlockIcon /> : <CheckCircleIcon />}
              label={user.isBlocked ? 'Blocked' : 'Active'}
              color={user.isBlocked ? 'error' : 'success'}
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                fontWeight: 'bold'
              }}
            />
          </Box>

          <CardContent sx={{ p: 3 }}>
            <Grid container spacing={4}>
              {/* Personal Information */}
              <Grid item xs={12} md={6}>
                <Paper elevation={2} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                  <Typography variant="h6" gutterBottom sx={{ 
                    borderBottom: '2px solid #3f51b5', 
                    paddingBottom: 1,
                    marginBottom: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    <BadgeIcon color="primary" /> Personal Information
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PhoneIcon sx={{ color: '#666', mr: 2 }} />
                    <Box>
                      <Typography variant="caption" color="textSecondary">Phone Number</Typography>
                      <Typography variant="body1" fontWeight="500">{user.phoneNumber}</Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <HomeIcon sx={{ color: '#666', mr: 2 }} />
                    <Box>
                      <Typography variant="caption" color="textSecondary">Address</Typography>
                      <Typography variant="body1" fontWeight="500">{user.address}</Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CakeIcon sx={{ color: '#666', mr: 2 }} />
                    <Box>
                      <Typography variant="caption" color="textSecondary">Date of Birth</Typography>
                      <Typography variant="body1" fontWeight="500">
                        {new Date(user.dateOfBirth).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>

              {/* User Status & Actions */}
              <Grid item xs={12} md={6}>
                <Paper elevation={2} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                  <Typography variant="h6" gutterBottom sx={{ 
                    borderBottom: '2px solid #3f51b5', 
                    paddingBottom: 1,
                    marginBottom: 2
                  }}>
                    Account Status
                  </Typography>

                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    mb: 3,
                    p: 2,
                    backgroundColor: user.isUser ? '#e8f5e9' : '#fff3e0',
                    borderRadius: 2
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {user.isUser ? 
                        <VerifiedUserIcon sx={{ color: '#2e7d32', mr: 1 }} /> : 
                        <CancelIcon sx={{ color: '#ed6c02', mr: 1 }} />
                      }
                      <Box>
                        <Typography variant="body2" color="textSecondary">Verification Status</Typography>
                        <Typography variant="body1" fontWeight="bold" color={user.isUser ? 'success.dark' : 'warning.dark'}>
                          {user.isUser ? 'Approved' : 'Pending Approval'}
                        </Typography>
                      </Box>
                    </Box>
                    <Button
                      variant="contained"
                      color={user.isUser ? 'error' : 'success'}
                      size="small"
                      startIcon={user.isUser ? <CancelIcon /> : <CheckCircleIcon />}
                      onClick={handleToggleIsUser}
                      sx={{ 
                        borderRadius: 2,
                        boxShadow: 2,
                        fontWeight: 'bold',
                        textTransform: 'none'
                      }}
                    >
                      {user.isUser ? 'Revoke' : 'Approve'}
                    </Button>
                  </Box>

                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    p: 2,
                    backgroundColor: user.isBlocked ? '#ffebee' : '#f1f8e9',
                    borderRadius: 2
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {user.isBlocked ? 
                        <PersonOffIcon sx={{ color: '#c62828', mr: 1 }} /> : 
                        <CheckCircleIcon sx={{ color: '#388e3c', mr: 1 }} />
                      }
                      <Box>
                        <Typography variant="body2" color="textSecondary">Access Status</Typography>
                        <Typography variant="body1" fontWeight="bold" color={user.isBlocked ? 'error.dark' : 'success.dark'}>
                          {user.isBlocked ? 'Blocked' : 'Active'}
                        </Typography>
                      </Box>
                    </Box>
                    <Button
                      variant="contained"
                      color={user.isBlocked ? 'primary' : 'error'}
                      size="small"
                      startIcon={user.isBlocked ? <CheckCircleIcon /> : <BlockIcon />}
                      onClick={handleToggleIsBlocked}
                      sx={{ 
                        borderRadius: 2,
                        boxShadow: 2,
                        fontWeight: 'bold',
                        textTransform: 'none'
                      }}
                    >
                      {user.isBlocked ? 'Unblock' : 'Block'}
                    </Button>
                  </Box>
                </Paper>
              </Grid>

              {/* License Documents */}
              <Grid item xs={12}>
                <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                  <Typography variant="h6" gutterBottom sx={{ 
                    borderBottom: '2px solid #3f51b5', 
                    paddingBottom: 1,
                    marginBottom: 3
                  }}>
                    License Documents
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ 
                        position: 'relative', 
                        borderRadius: 3,
                        overflow: 'hidden',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                      }}>
                        <Typography 
                          variant="subtitle2" 
                          sx={{ 
                            position: 'absolute', 
                            top: 0, 
                            left: 0, 
                            right: 0, 
                            backgroundColor: 'rgba(0,0,0,0.7)',
                            color: 'white',
                            padding: 1,
                            textAlign: 'center'
                          }}
                        >
                          License Front
                        </Typography>
                        <img
                          src={user.license_picture_front || 'https://via.placeholder.com/400x250?text=No+License+Front'}
                          alt="License Front"
                          style={{
                            width: '100%',
                            display: 'block',
                            height: 250,
                            objectFit: 'cover'
                          }}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ 
                        position: 'relative', 
                        borderRadius: 3,
                        overflow: 'hidden',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                      }}>
                        <Typography 
                          variant="subtitle2" 
                          sx={{ 
                            position: 'absolute', 
                            top: 0, 
                            left: 0, 
                            right: 0, 
                            backgroundColor: 'rgba(0,0,0,0.7)',
                            color: 'white',
                            padding: 1,
                            textAlign: 'center'
                          }}
                        >
                          License Back
                        </Typography>
                        <img
                          src={user.license_picture_back || 'https://via.placeholder.com/400x250?text=No+License+Back'}
                          alt="License Back"
                          style={{
                            width: '100%',
                            display: 'block',
                            height: 250,
                            objectFit: 'cover'
                          }}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default AdminSingleUserPage;