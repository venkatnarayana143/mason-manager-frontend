import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Users, UserCheck, DollarSign } from 'lucide-react';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalEmployees: 0,
        presentToday: 0,
        totalPaid: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [employeesRes, attendanceRes, paymentsRes] = await Promise.all([
                    api.get('/employees'),
                    api.get(`/attendance/date/${new Date().toISOString().split('T')[0]}`),
                    api.get('/payments')
                ]);

                const totalEmployees = employeesRes.data.length;
                const presentToday = attendanceRes.data.filter(a => a.status === 'PRESENT').length;
                const totalPaid = paymentsRes.data.reduce((sum, p) => sum + p.amount, 0);

                setStats({ totalEmployees, presentToday, totalPaid });
            } catch (error) {
                console.error("Error fetching dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div className="p-6">Loading...</div>;

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
                    <div className="p-3 bg-blue-100 rounded-full mr-4">
                        <Users className="w-8 h-8 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-gray-500">Total Employees</p>
                        <p className="text-2xl font-bold">{stats.totalEmployees}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
                    <div className="p-3 bg-green-100 rounded-full mr-4">
                        <UserCheck className="w-8 h-8 text-green-600" />
                    </div>
                    <div>
                        <p className="text-gray-500">Present Today</p>
                        <p className="text-2xl font-bold">{stats.presentToday}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
                    <div className="p-3 bg-yellow-100 rounded-full mr-4">
                        <DollarSign className="w-8 h-8 text-yellow-600" />
                    </div>
                    <div>
                        <p className="text-gray-500">Total Paid</p>
                        <p className="text-2xl font-bold">₹{stats.totalPaid.toLocaleString()}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
