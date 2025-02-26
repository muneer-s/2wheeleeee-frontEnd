export const handleApiResponse = (response: any) => {
  if (response?.success) {
    return response.data;
  } else {
    throw new Error(response?.message || 'Something went wrong');
  }
};
