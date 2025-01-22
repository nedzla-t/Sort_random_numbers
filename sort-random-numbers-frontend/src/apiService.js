import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const sortNumbers = async (numbers) => {
    try {
        const response = await axios.post(`${API_URL}/sort-numbers`, { numbers });
        return response.data;
    } catch (error) {
        console.error('Error sorting numbers: ', error);
        throw error;
    }
};
