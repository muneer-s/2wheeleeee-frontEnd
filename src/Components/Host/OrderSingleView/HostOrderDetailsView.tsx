import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Header from "../../User/Header/Header";
import { hostCompleteOrder, hostGetOrderDetails } from "../../../Api/host";
import ChatWidget from "../../User/Chat/MainChatUI";
import Api from "../../../service/axios";
import { useAppSelector } from "../../../Apps/store";
import io from 'socket.io-client';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Grid, 
  Chip, 
  Button, 
  Divider, 
  Card, 
  CardMedia, 
  Table, 
  TableBody, 
  TableRow, 
  TableCell,
  Avatar,
  Skeleton,
  Stack,
  IconButton
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import PaymentsIcon from '@mui/icons-material/Payments';
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PersonIcon from '@mui/icons-material/Person';
import ChatIcon from '@mui/icons-material/Chat';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const socket = io(import.meta.env.VITE_BACKEND_URL, {
    transports: ['polling', 'websocket'],
});

interface IOrder {
    startDate: string;
    endDate: string;
    amount: number;
    method: string;
    status: string;
}

interface IBike {
    images: string[];
    modelName: string;
}

interface IUser {
    _id: string
    name: string;
    phoneNumber: number;
    address: string;
}

interface IOrderResponse {
    order: IOrder;
    bike: IBike;
    owner: IUser;
    user: IUser;
}

const HostOrderDetailsView = () => {
    const { orderId } = useParams();
    const [orderDetails, setOrderDetails] = useState<IOrderResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [userId, setUserId] = useState("");
    const [chatId, setChatId] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const authState = useAppSelector((state) => state.auth);
    const userDetails = authState.user;
    const ownerId = userDetails.userId;

    useEffect(() => {
        const fetchOrderDetails = async () => {
            if (!orderId) {
                toast.error("Invalid order ID");
                return;
            }
            
            setIsLoading(true);
            
            try {
                const response = await hostGetOrderDetails(orderId);
                if (response?.success) {
                    setOrderDetails(response.data);
                } else {
                    toast.error("Failed to load order details");
                }
            } catch (error: any) {
                toast.error("Error fetching order details...");
                console.error("Error:", error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrderDetails();
    }, [orderId]);

    const buttonTrigger = (userId: string) => {
        setUserId(userId);
        Api
            .post("/chat/accesschat", { receiverId: userId, senderId: ownerId })
            .then((res) => {
                if (res.data) {
                    setChatId(res.data.data._id);
                    setIsOpen(true);
                }
            });
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    const handleCompleteOrder = async () => {
        if (!orderId) return;
        setLoading(true);
        try {
            const response = await hostCompleteOrder(orderId);
            if (response?.success) {
                toast.success("Order marked as completed!");
                setOrderDetails((prev) => prev ? { ...prev, order: { ...prev.order, status: "Completed" } } : prev);
            } else {
                toast.error("Failed to update order status.");
            }
        } catch (error: any) {
            toast.error("Error updating order status.");
            console.error("Error:", error.message);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch(status) {
            case "Pending": return "warning";
            case "Early Return": return "info";
            case "Return": return "secondary";
            case "Completed": return "success";
            default: return "default";
        }
    };

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    if (isLoading) {
        return (
            <div>
                <Header />
                <Container maxWidth="lg" sx={{ mt: 10, mb: 8 }}>
                    <Box mb={3} display="flex" alignItems="center">
                        <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
                            <ArrowBackIcon />
                        </IconButton>
                        <Skeleton variant="text" width={300} height={60} />
                    </Box>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Paper sx={{ p: 3, borderRadius: 2 }}>
                                <Skeleton variant="text" width="60%" height={40} />
                                <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                                    <Skeleton variant="rounded" width="50%" height={30} />
                                    <Skeleton variant="rounded" width="50%" height={30} />
                                </Stack>
                                <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                                    <Skeleton variant="rounded" width="30%" height={30} />
                                    <Skeleton variant="rounded" width="30%" height={30} />
                                </Stack>
                            </Paper>
                        </Grid>
                        <Grid item xs={12}>
                            <Paper sx={{ p: 3, borderRadius: 2 }}>
                                <Skeleton variant="text" width="40%" height={40} />
                                <Stack direction="row" spacing={2} sx={{ mt: 2, overflow: 'hidden' }}>
                                    <Skeleton variant="rectangular" width={100} height={100} sx={{ borderRadius: 2 }} />
                                    <Skeleton variant="rectangular" width={100} height={100} sx={{ borderRadius: 2 }} />
                                </Stack>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                                <Skeleton variant="text" width="50%" height={40} />
                                <Stack spacing={2} sx={{ mt: 2 }}>
                                    <Skeleton variant="text" width="80%" height={30} />
                                    <Skeleton variant="text" width="60%" height={30} />
                                    <Skeleton variant="text" width="70%" height={30} />
                                </Stack>
                                <Skeleton variant="rounded" width={150} height={40} sx={{ mt: 2 }} />
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </div>
        );
    }

    if (!orderDetails) {
        return (
            <div>
                <Header />
                <Container maxWidth="lg" sx={{ mt: 10, textAlign: 'center' }}>
                    <Typography variant="h5" color="text.secondary">
                        No order details found
                    </Typography>
                    <Button 
                        variant="contained" 
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate(-1)}
                        sx={{ mt: 3 }}
                    >
                        Go Back
                    </Button>
                </Container>
            </div>
        );
    }

    const { order, bike, user } = orderDetails;

    return (
        <div>
            <Header />
            <Container maxWidth="lg" sx={{ mt: 10, mb: 8 }}>
                <Box mb={3} display="flex" alignItems="center">
                    <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h4" component="h1" fontWeight="bold" color="text.primary">
                        Order Details
                    </Typography>
                    <Chip 
                        label={order.status}
                        color={getStatusColor(order.status)}
                        sx={{ ml: 2, fontWeight: 500 }}
                    />
                </Box>

                <Grid container spacing={3}>
                    {/* Order Information Card */}
                    <Grid item xs={12}>
                        <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                            <Box display="flex" alignItems="center" mb={2}>
                                <TwoWheelerIcon sx={{ mr: 1, color: 'primary.main' }} />
                                <Typography variant="h6" fontWeight="medium" color="primary">
                                    Order Information
                                </Typography>
                            </Box>
                            <Divider sx={{ mb: 3 }} />

                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Table>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell sx={{ borderBottom: 'none', pl: 0, py: 1 }}>
                                                    <Box display="flex" alignItems="center">
                                                        <CalendarMonthIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                                                        <Typography variant="body2" color="text.secondary">Start Date</Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell sx={{ borderBottom: 'none', py: 1 }}>
                                                    <Typography variant="body1" fontWeight="medium">{formatDate(order.startDate)}</Typography>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell sx={{ borderBottom: 'none', pl: 0, py: 1 }}>
                                                    <Box display="flex" alignItems="center">
                                                        <CalendarMonthIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                                                        <Typography variant="body2" color="text.secondary">End Date</Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell sx={{ borderBottom: 'none', py: 1 }}>
                                                    <Typography variant="body1" fontWeight="medium">{formatDate(order.endDate)}</Typography>
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Table>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell sx={{ borderBottom: 'none', pl: 0, py: 1 }}>
                                                    <Box display="flex" alignItems="center">
                                                        <CurrencyRupeeIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                                                        <Typography variant="body2" color="text.secondary">Amount</Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell sx={{ borderBottom: 'none', py: 1 }}>
                                                    <Typography variant="body1" fontWeight="medium">₹{order.amount}</Typography>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell sx={{ borderBottom: 'none', pl: 0, py: 1 }}>
                                                    <Box display="flex" alignItems="center">
                                                        <PaymentsIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                                                        <Typography variant="body2" color="text.secondary">Payment Method</Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell sx={{ borderBottom: 'none', py: 1 }}>
                                                    <Typography variant="body1" fontWeight="medium">{order.method}</Typography>
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </Grid>
                            </Grid>

                            {["Early Return", "Return"].includes(order.status) && (
                                <Box mt={3}>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        startIcon={<CheckCircleIcon />}
                                        onClick={handleCompleteOrder}
                                        disabled={loading}
                                        sx={{ px: 3, py: 1, borderRadius: 1.5 }}
                                    >
                                        {loading ? "Processing..." : "Mark as Completed"}
                                    </Button>
                                </Box>
                            )}
                        </Paper>
                    </Grid>

                    {/* Bike Information Card */}
                    <Grid item xs={12}>
                        <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                            <Box display="flex" alignItems="center" mb={2}>
                                <TwoWheelerIcon sx={{ mr: 1, color: 'primary.main' }} />
                                <Typography variant="h6" fontWeight="medium" color="primary">
                                    Bike Information
                                </Typography>
                            </Box>
                            <Divider sx={{ mb: 3 }} />

                            <Typography variant="h6" fontWeight="medium" mb={2}>{bike.modelName}</Typography>
                            
                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'nowrap', overflowX: 'auto', pb: 1 }}>
                                {bike.images.map((img, index) => (
                                    <Card key={index} sx={{ minWidth: 160, borderRadius: 2, overflow: 'hidden', flexShrink: 0 }}>
                                        <CardMedia
                                            component="img"
                                            height="160"
                                            image={img}
                                            alt={`${bike.modelName} - Image ${index + 1}`}
                                            sx={{ objectFit: 'cover' }}
                                        />
                                    </Card>
                                ))}
                            </Box>
                        </Paper>
                    </Grid>

                    {/* User Details Card */}
                    <Grid item xs={12} md={6}>
                        <Paper elevation={2} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                            <Box display="flex" alignItems="center" mb={2}>
                                <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                                <Typography variant="h6" fontWeight="medium" color="primary">
                                    User Information
                                </Typography>
                            </Box>
                            <Divider sx={{ mb: 3 }} />

                            <Box mb={3} display="flex" alignItems="center">
                                <Avatar 
                                    sx={{ 
                                        bgcolor: 'primary.light', 
                                        width: 60, 
                                        height: 60,
                                        mr: 2
                                    }}
                                >
                                    {user.name.charAt(0)}
                                </Avatar>
                                <Box>
                                    <Typography variant="h6" fontWeight="medium">{user.name}</Typography>
                                    <Typography variant="body2" color="text.secondary">Customer</Typography>
                                </Box>
                            </Box>

                            <Table sx={{ mb: 2 }}>
                                <TableBody>
                                    <TableRow>
                                        <TableCell sx={{ borderBottom: 'none', pl: 0, py: 1, width: '40%' }}>
                                            <Typography variant="body2" color="text.secondary">Phone Number</Typography>
                                        </TableCell>
                                        <TableCell sx={{ borderBottom: 'none', py: 1 }}>
                                            <Typography variant="body1">{user.phoneNumber}</Typography>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell sx={{ borderBottom: 'none', pl: 0, py: 1, verticalAlign: 'top' }}>
                                            <Typography variant="body2" color="text.secondary">Address</Typography>
                                        </TableCell>
                                        <TableCell sx={{ borderBottom: 'none', py: 1 }}>
                                            <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
                                                {user.address}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>

                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<ChatIcon />}
                                onClick={() => buttonTrigger(user._id)}
                                fullWidth
                                sx={{ mt: 2, py: 1.2, borderRadius: 1.5 }}
                            >
                                Chat with User
                            </Button>
                        </Paper>
                    </Grid>
                </Grid>

                {isOpen && (
                    <ChatWidget
                        isChatOpen={isOpen}
                        onClose={handleClose}
                        hostId={userId}
                        chatId={chatId}
                        socket={socket}
                    />
                )}
            </Container>
        </div>
    );
};

export default HostOrderDetailsView;