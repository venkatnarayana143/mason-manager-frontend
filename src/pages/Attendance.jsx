import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import { Eye, Edit, CheckCircle, XCircle, Clock } from 'lucide-react';

const Attendance = () => {
    const { t } = useTranslation();
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal states
    const [showMarkModal, setShowMarkModal] = useState(false);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    // Mark Attendance Form State
    const [markForm, setMarkForm] = useState({
        date: new Date().toISOString().split('T')[0],
        status: 'PRESENT'
    });

    // History Data
    const [historyData, setHistoryData] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        setLoading(true);
        try {
            const response = await api.get('/employees');
            setEmployees(response.data);
        } catch (error) {
            console.error("Error fetching employees", error);
        } finally {
            setLoading(false);
        }
    };

    const openMarkModal = (employee) => {
        setSelectedEmployee(employee);
        setMarkForm({
            date: new Date().toISOString().split('T')[0],
            status: 'PRESENT'
        });
        setShowMarkModal(true);
    };

    const openHistoryModal = async (employee) => {
        setSelectedEmployee(employee);
        setShowHistoryModal(true);
        setHistoryLoading(true);
        try {
            const response = await api.get(`/attendance/employee/${employee.id}`);
            // Sort by date descending
            const sorted = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
            setHistoryData(sorted);
        } catch (error) {
            console.error("Error fetching history", error);
            setHistoryData([]);
        } finally {
            setHistoryLoading(false);
        }
    };

    const handleMarkSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/attendance', {
                employee: { id: selectedEmployee.id },
                date: markForm.date,
                status: markForm.status
            });
            setShowMarkModal(false);
            // Optional: Show success message
        } catch (error) {
            console.error("Error marking attendance", error);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'PRESENT': return <CheckCircle className="w-4 h-4 text-green-600" />;
            case 'HALF_DAY': return <Clock className="w-4 h-4 text-yellow-600" />;
            case 'ABSENT': return <XCircle className="w-4 h-4 text-red-600" />;
            default: return null;
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'PRESENT': return t('present');
            case 'HALF_DAY': return t('half_day');
            case 'ABSENT': return t('absent');
            default: return status;
        }
    };

    if (loading) return <div className="p-6">{t('loading')}</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">{t('attendance')}</h2>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('name')}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('role')}</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('actions')}</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {employees.map((employee) => (
                            <tr key={employee.id}>
                                <td className="px-6 py-4 whitespace-nowrap font-medium">{employee.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{t(employee.role.toLowerCase())}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex justify-end gap-3">
                                        <button
                                            onClick={() => openHistoryModal(employee)}
                                            className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                                            title={t('view_history')}
                                        >
                                            <Eye className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => openMarkModal(employee)}
                                            className="text-green-600 hover:text-green-900 flex items-center gap-1"
                                            title={t('mark_attendance')}
                                        >
                                            <Edit className="w-5 h-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mark Attendance Modal */}
            {showMarkModal && selectedEmployee && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                        <h3 className="text-lg font-bold mb-4">
                            {t('mark_attendance_for')} {selectedEmployee.name}
                        </h3>
                        <form onSubmit={handleMarkSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('date')}</label>
                                <input
                                    type="date"
                                    required
                                    className="w-full border rounded-lg p-2"
                                    value={markForm.date}
                                    onChange={(e) => setMarkForm({ ...markForm, date: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('status')}</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['PRESENT', 'HALF_DAY', 'ABSENT'].map((status) => (
                                        <button
                                            key={status}
                                            type="button"
                                            onClick={() => setMarkForm({ ...markForm, status })}
                                            className={`p-2 rounded-lg border flex flex-col items-center justify-center gap-1 transition-colors ${markForm.status === status
                                                    ? 'bg-blue-50 border-blue-500 text-blue-700 ring-1 ring-blue-500'
                                                    : 'hover:bg-gray-50'
                                                }`}
                                        >
                                            {getStatusIcon(status)}
                                            <span className="text-xs font-medium">{getStatusLabel(status)}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowMarkModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                >
                                    {t('cancel')}
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    {t('save')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* History Modal */}
            {showHistoryModal && selectedEmployee && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 max-h-[80vh] flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold">
                                {t('attendance_history_for')} {selectedEmployee.name}
                            </h3>
                            <button
                                onClick={() => setShowHistoryModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <XCircle className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-auto">
                            {historyLoading ? (
                                <div className="text-center py-8 text-gray-500">{t('loading')}</div>
                            ) : historyData.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">{t('no_records_found')}</div>
                            ) : (
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50 sticky top-0">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">{t('date')}</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">{t('status')}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {historyData.map((record) => (
                                            <tr key={record.id}>
                                                <td className="px-4 py-3 text-sm text-gray-900">{record.date}</td>
                                                <td className="px-4 py-3 text-sm">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${record.status === 'PRESENT' ? 'bg-green-100 text-green-800' :
                                                            record.status === 'HALF_DAY' ? 'bg-yellow-100 text-yellow-800' :
                                                                'bg-red-100 text-red-800'
                                                        }`}>
                                                        {getStatusIcon(record.status)}
                                                        <span className="ml-1">{getStatusLabel(record.status)}</span>
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Attendance;
