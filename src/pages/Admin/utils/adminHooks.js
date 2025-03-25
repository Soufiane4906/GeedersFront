import { useState, useCallback, useEffect } from 'react';
import { toast } from 'react-toastify'; // Recommend adding react-toastify for notifications

// Custom hook for form management
export const useFormManagement = (initialState = {}, submitCallback) => {
    const [formData, setFormData] = useState(initialState);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }, []);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Basic validation example
        const validationErrors = {};
        Object.keys(initialState).forEach(key => {
            if (!formData[key] && initialState[key] !== undefined) {
                validationErrors[key] = `${key} is required`;
            }
        });

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setIsSubmitting(false);
            return;
        }

        try {
            await submitCallback(formData);
            setFormData(initialState);
            setErrors({});
        } catch (error) {
            handleApiError(error);
        } finally {
            setIsSubmitting(false);
        }
    }, [formData, initialState, submitCallback]);

    const resetForm = useCallback(() => {
        setFormData(initialState);
        setErrors({});
    }, [initialState]);

    return {
        formData,
        handleChange,
        handleSubmit,
        resetForm,
        isSubmitting,
        errors
    };
};

// API Error Handling Utility
export const handleApiError = (error) => {
    const errorMessage = error.response?.data?.message
        || error.message
        || 'An unexpected error occurred';

    // Log error for debugging
    console.error('API Error:', error);

    // User-friendly toast notification
    toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
    });
};

// Pagination Hook
export const usePagination = (fetchDataCallback, initialLimit = 10) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(initialLimit);
    const [totalItems, setTotalItems] = useState(0);

    const fetchPaginatedData = useCallback(async (filters = {}) => {
        try {
            const response = await fetchDataCallback({
                page: currentPage,
                limit: itemsPerPage,
                ...filters
            });

            setTotalItems(response.total);
            return response.data;
        } catch (error) {
            handleApiError(error);
            return [];
        }
    }, [currentPage, itemsPerPage, fetchDataCallback]);

    const handlePageChange = useCallback((newPage) => {
        setCurrentPage(newPage);
    }, []);

    const handleLimitChange = useCallback((newLimit) => {
        setItemsPerPage(newLimit);
        setCurrentPage(1); // Reset to first page
    }, []);

    return {
        currentPage,
        itemsPerPage,
        totalItems,
        fetchPaginatedData,
        handlePageChange,
        handleLimitChange
    };
};

// Confirmation Dialog Utility
export const useConfirmation = () => {
    const confirmAction = useCallback((message, onConfirm) => {
        const isConfirmed = window.confirm(message);
        if (isConfirmed) {
            onConfirm();
        }
    }, []);

    return confirmAction;
};