import React from 'react';
import { Box, Button } from '@mui/material';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ page, totalPages, onPageChange }) => {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" marginTop={2}>
      <Button
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        variant="outlined"
        style={{ marginRight: 10 }}
      >
        Previous
      </Button>
      <span>
        Page {page} of {totalPages}
      </span>
      <Button
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        variant="outlined"
        style={{ marginLeft: 10 }}
      >
        Next
      </Button>
    </Box>
  );
};

export default Pagination;
