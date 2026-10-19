import { apiRequest } from './client';

export function fetchCategories() {
    return apiRequest('/api/categories');
    }