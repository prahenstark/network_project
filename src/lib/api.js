import axios from 'axios';

// Bearer token variable
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjZjYTEzODQ0NDA1YTM2YjIyMTY1MjE3Iiwicm9sZSI6InN1cGVyLWFkbWluIn0sImlhdCI6MTczMDcwMzE3NiwiZXhwIjoxNzMwNzA2Nzc2fQ.oiq6yQ-_omaoIBL4vZCDjftDY-YAi60OiOMYoeg_16M';

// Axios instance for API calls
const apiInstance = axios.create({
  baseURL: 'http://13.233.36.198:5000/api/',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});


export const fetchDashboardInfo = async () => {
  try {
    const response = await apiInstance.get('cloudnet/portal/dashboard/info');
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
};
