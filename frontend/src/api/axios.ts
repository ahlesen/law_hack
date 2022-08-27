import axios from 'axios';
import { ResultsResponse } from './types';

export const sendText = async (text: string) => {
    try {
        const { data } = await axios.post<ResultsResponse, any>(
            '/results',
            { text },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                }
            }
        );
        return data;
    } catch (e) {
        return e;
    }
};
