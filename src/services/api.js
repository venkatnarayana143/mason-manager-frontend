import axios from 'axios';

// Check if we are in demo mode (backend unavailable)
const DEMO_MODE = false;

const STORAGE_KEYS = {
    EMPLOYEES: 'mason_employees',
    ATTENDANCE: 'mason_attendance',
    PAYMENTS: 'mason_payments'
};

// Helper to get data from local storage
const getStorage = (key) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
};

// Helper to set data to local storage
const setStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
};

// Mock implementation
const mockApi = {
    get: async (url) => {
        await new Promise(r => setTimeout(r, 500)); // Simulate delay

        if (url === '/employees') {
            return { data: getStorage(STORAGE_KEYS.EMPLOYEES) };
        }
        if (url.startsWith('/attendance/date/')) {
            const date = url.split('/').pop();
            const allAttendance = getStorage(STORAGE_KEYS.ATTENDANCE);
            return { data: allAttendance.filter(a => a.date === date) };
        }
        if (url === '/payments') {
            return { data: getStorage(STORAGE_KEYS.PAYMENTS) };
        }
        return { data: [] };
    },
    post: async (url, data) => {
        await new Promise(r => setTimeout(r, 500));

        if (url === '/employees') {
            const employees = getStorage(STORAGE_KEYS.EMPLOYEES);
            const newEmployee = { ...data, id: Date.now() };
            employees.push(newEmployee);
            setStorage(STORAGE_KEYS.EMPLOYEES, employees);
            return { data: newEmployee };
        }
        if (url === '/attendance') {
            const attendance = getStorage(STORAGE_KEYS.ATTENDANCE);
            // Remove existing record for same employee and date if exists
            const filtered = attendance.filter(a => !(a.employee.id === data.employee.id && a.date === data.date));
            const newRecord = { ...data, id: Date.now() };
            filtered.push(newRecord);
            setStorage(STORAGE_KEYS.ATTENDANCE, filtered);
            return { data: newRecord };
        }
        if (url === '/payments') {
            const payments = getStorage(STORAGE_KEYS.PAYMENTS);
            const newPayment = { ...data, id: Date.now() };
            payments.push(newPayment);
            setStorage(STORAGE_KEYS.PAYMENTS, payments);
            return { data: newPayment };
        }
    },
    delete: async (url) => {
        await new Promise(r => setTimeout(r, 500));

        if (url.startsWith('/employees/')) {
            const id = parseInt(url.split('/').pop());
            const employees = getStorage(STORAGE_KEYS.EMPLOYEES);
            const filtered = employees.filter(e => e.id !== id);
            setStorage(STORAGE_KEYS.EMPLOYEES, filtered);
            return { data: {} };
        }
    }
};

// Real API
const realApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Export mock if demo mode, otherwise real api
export default DEMO_MODE ? mockApi : realApi;
