import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import { Calendar as CalendarIcon, CheckCircle, XCircle, Clock } from 'lucide-react';

const Attendance = () => {
    const { t } = useTranslation();
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [employees, setEmployees] = useState([]);
    const [attendanceMap, setAttendanceMap] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [date]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [empRes, attRes] = await Promise.all([
                api.get('/employees'),
                api.get(`/attendance/date/${date}`)
            ]);

            setEmployees(empRes.data);

            // Map attendance by employee ID
            const attMap = {};
            attRes.data.forEach(record => {
                attMap[record.employee.id] = record;
            });
            setAttendanceMap(attMap);
        } catch (error) {
            console.error("Error fetching data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (employeeId, status) => {
        try {
            const existingRecord = attendanceMap[employeeId];
            const payload = {
                employee: { id: employeeId },
                date: date,
                status: status,
                id: existingRecord ? existingRecord.id : null
            };

            const response = await api.post('/attendance', payload);
            setAttendanceMap(prev => ({
                ...prev,
                [employeeId]: response.data
            }));
        } catch (error) {
            console.error("Error marking attendance", error);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">{t('attendance')}</h2>
                <div className="flex items-center bg-white p-2 rounded shadow">
                    <CalendarIcon className="w-5 h-5 text-gray-500 mr-2" />
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="outline-none"
                    />
                </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('name')}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('role')}</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">{t('status')}</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {employees.map((employee) => {
                            const record = attendanceMap[employee.id];
                            const status = record ? record.status : null;

                            return (
                                <tr key={employee.id}>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium">{employee.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{t(employee.role.toLowerCase())}</td>
                                    <td className="px-6 py-4 whitespace-nowrap flex justify-center gap-4">
                                        <button
                                            onClick={() => handleStatusChange(employee.id, 'PRESENT')}
                                            className={`flex items-center px-3 py-1 rounded-full text-sm ${status === 'PRESENT' ? 'bg-green-100 text-green-800 ring-2 ring-green-500' : 'bg-gray-100 text-gray-500 hover:bg-green-50'
                                                }`}
                                        >
                                            <CheckCircle className="w-4 h-4 mr-1" /> {t('present')}
                                        </button>
                                        <button
                                            onClick={() => handleStatusChange(employee.id, 'HALF_DAY')}
                                            className={`flex items-center px-3 py-1 rounded-full text-sm ${status === 'HALF_DAY' ? 'bg-yellow-100 text-yellow-800 ring-2 ring-yellow-500' : 'bg-gray-100 text-gray-500 hover:bg-yellow-50'
                                                }`}
                                        >
                                            <Clock className="w-4 h-4 mr-1" /> {t('half_day')}
                                        </button>
                                        <button
                                            onClick={() => handleStatusChange(employee.id, 'ABSENT')}
                                            className={`flex items-center px-3 py-1 rounded-full text-sm ${status === 'ABSENT' ? 'bg-red-100 text-red-800 ring-2 ring-red-500' : 'bg-gray-100 text-gray-500 hover:bg-red-50'
                                                }`}
                                        >
                                            <XCircle className="w-4 h-4 mr-1" /> {t('absent')}
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Attendance;
