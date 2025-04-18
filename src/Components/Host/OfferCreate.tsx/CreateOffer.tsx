import React, { useState } from "react";
import toast from "react-hot-toast";
import { createOffer } from "../../../Api/host";
import { useAppSelector } from "../../../Apps/store";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Container,
  Grid,
  InputAdornment,
  Divider,
  Card,
  CardContent,
  FormHelperText,
  Fade,
  Stack
} from "@mui/material";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import PercentIcon from "@mui/icons-material/Percent";
import DateRangeIcon from "@mui/icons-material/DateRange";
import DescriptionIcon from "@mui/icons-material/Description";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LoyaltyIcon from "@mui/icons-material/Loyalty";

const CreateOffer: React.FC = () => {
  const [formData, setFormData] = useState({
    offerName: "",
    discount: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  const [errors, setErrors] = useState({
    offerName: "",
    discount: "",
    startDate: "",
    endDate: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const authState = useAppSelector((state) => state.auth);
  const userDetails = authState.user;
  const userId = userDetails.userId;

  const validateForm = () => {
    let valid = true;
    const newErrors = { offerName: "", discount: "", startDate: "", endDate: "" };
    const today = new Date().toISOString().split("T")[0];

    if (!formData.offerName.trim()) {
      newErrors.offerName = "Offer name is required";
      valid = false;
    }
    if (!formData.discount) {
      newErrors.discount = "Discount is required";
      valid = false;
    } else {
      const discountValue = parseFloat(formData.discount);
      if (isNaN(discountValue) || discountValue <= 0) {
        newErrors.discount = "Discount must be a number greater than 0";
        valid = false;
      }
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
      valid = false;
    } else if (formData.startDate < today) {
      newErrors.startDate = "Start date must be greater than today";
      valid = false;
    }

    if (!formData.endDate) {
      newErrors.endDate = "End date is required";
      valid = false;
    } else if (formData.endDate < today) {
      newErrors.endDate = "End date must be greater than today";
      valid = false;
    } else if (formData.startDate && formData.startDate >= formData.endDate) {
      newErrors.endDate = "End date must be after the start date";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formDataWithUser = { ...formData, createdBy: userId };
    setIsSubmitting(true);

    try {
      await createOffer(formDataWithUser);
      toast.success("Offer Created Successfully!");
      setFormData({ offerName: "", discount: "", startDate: "", endDate: "", description: "" });
    } catch (error) {
      console.error("Error creating offer:", error);
      toast.error("Failed to create offer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          borderRadius: 2,
          background: "linear-gradient(to right bottom, #ffffff, #fafafa)"
        }}
      >
        <Box sx={{ mb: 4, display: "flex", alignItems: "center" }}>
          <LoyaltyIcon sx={{ fontSize: 32, mr: 2, color: "primary.main" }} />
          <Typography variant="h4" component="h1" fontWeight="bold">
            Create New Offer
          </Typography>
        </Box>

        <Divider sx={{ mb: 4 }} />

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Offer Name */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Offer Name"
                name="offerName"
                value={formData.offerName}
                onChange={handleChange}
                error={!!errors.offerName}
                helperText={errors.offerName}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocalOfferIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Discount */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Discount"
                type="number"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                error={!!errors.discount}
                helperText={errors.discount}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PercentIcon color="primary" />
                    </InputAdornment>
                  ),
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }}
              />
            </Grid>

            {/* Date Range */}
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="subtitle2" sx={{ mb: 1, display: "flex", alignItems: "center" }}>
                    <DateRangeIcon fontSize="small" sx={{ mr: 1 }} />
                    Valid Period
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <TextField
                      fullWidth
                      label="Start Date"
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      error={!!errors.startDate}
                      helperText={errors.startDate}
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      size="small"
                    />
                    <ArrowForwardIcon sx={{ color: "text.secondary" }} />
                    <TextField
                      fullWidth
                      label="End Date"
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      error={!!errors.endDate}
                      helperText={errors.endDate}
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      size="small"
                    />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                variant="outlined"
                multiline
                rows={4}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ alignSelf: "flex-start", mt: 1.5 }}>
                      <DescriptionIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
              <FormHelperText>Provide additional details about this offer (optional)</FormHelperText>
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Box sx={{ mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={isSubmitting}
                  startIcon={<AddCircleIcon />}
                  sx={{
                    py: 1.5,
                    px: 4,
                    borderRadius: 2,
                    boxShadow: 2,
                    background: "linear-gradient(90deg, #1976d2, #42a5f5)",
                    "&:hover": {
                      background: "linear-gradient(90deg, #1565c0, #1976d2)",
                    },
                  }}
                  fullWidth
                >
                  {isSubmitting ? "Creating..." : "Create Offer"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>

        {/* Preview Card */}
        {formData.offerName && formData.discount && (
          <Fade in={!!(formData.offerName && formData.discount)}>
            <Card 
              sx={{ 
                mt: 4, 
                borderRadius: 2,
                border: "1px dashed",
                borderColor: "primary.main",
                bgcolor: "primary.lighter",
                position: "relative",
                overflow: "visible"
              }}
            >
              <Box 
                sx={{ 
                  position: "absolute", 
                  top: -12, 
                  left: 20,
                  bgcolor: "background.paper",
                  px: 1,
                  borderRadius: 1
                }}
              >
                <Typography variant="caption" color="primary" fontWeight="bold">
                  PREVIEW
                </Typography>
              </Box>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={8}>
                    <Typography variant="h6" fontWeight="bold">
                      {formData.offerName}
                    </Typography>
                    {formData.description && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {formData.description}
                      </Typography>
                    )}
                    {formData.startDate && formData.endDate && (
                      <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                        Valid from {new Date(formData.startDate).toLocaleDateString()} to{" "}
                        {new Date(formData.endDate).toLocaleDateString()}
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs={4} sx={{ textAlign: "center" }}>
                    <Typography 
                      variant="h4" 
                      color="error" 
                      fontWeight="bold"
                      sx={{ 
                        textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      {formData.discount}%
                      <Typography variant="body2" component="span" color="text.secondary" sx={{ ml: 1 }}>
                        OFF
                      </Typography>
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Fade>
        )}
      </Paper>
    </Container>
  );
};

export default CreateOffer;