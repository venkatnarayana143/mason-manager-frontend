import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import { Plus, Trash2, Edit } from 'lucide-react';

const Employees = () => {
    const { t } = useTranslation();
    const [employees, setEmployees] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        role: 'MASON',
        dailyWage: '',
        phoneNumber: ''
    });

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await api.get('/employees');
            setEmployees(response.data);
        } catch (error) {
            console.error("Error fetching employees", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/employees', formData);
            setShowForm(false);
            setFormData({ name: '', role: 'MASON', dailyWage: '', phoneNumber: '' });
            fetchEmployees();
        } catch (error) {
            console.error("Error creating employee", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm(t('confirm_delete'))) {
            try {
                await api.delete(`/employees/${id}`);
                fetchEmployees();
            } catch (error) {
                console.error("Error deleting employee", error);
            }
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">{t('employees')}</h2>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    {t('add_employee')}
                </button>
            </div>

            {showForm && (
                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                    <h3 className="text-lg font-semibold mb-4">{t('add_employee')}</h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder={t('enter_name')}
                            className="border p-2 rounded"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                        <select
                            className="border p-2 rounded"
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        >
                            <option value="MASON">{t('mason')}</option>
                            <option value="HELPER">{t('helper')}</option>
                            <option value="COOLIE">{t('coolie')}</option>
                        </select>
                        <input
                            type="number"
                            placeholder={t('enter_wage')}
                            className="border p-2 rounded"
                            value={formData.dailyWage}
                            onChange={(e) => setFormData({ ...formData, dailyWage: e.target.value })}
                            required
                        />
                        <input
                            type="text"
                            placeholder={t('enter_phone')}
                            className="border p-2 rounded"
                            value={formData.phoneNumber}
                            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                        />
                        <div className="md:col-span-2 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                            >
                                {t('cancel')}
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                {t('save')}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('name')}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('role')}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('daily_wage')}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('phone')}</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('actions')}</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {employees.map((employee) => (
                            <tr key={employee.id}>
                                <td className="px-6 py-4 whitespace-nowrap font-medium">{employee.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${employee.role === 'MASON' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                                        }`}>
                                        {t(employee.role.toLowerCase())}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">₹{employee.dailyWage}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{employee.phoneNumber}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => handleDelete(employee.id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Employees;
