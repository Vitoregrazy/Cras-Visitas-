
import React, { useEffect, useState } from 'react';
import { mockApi } from '../../services/api';
import { Appointment, AppointmentStatus } from '../../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CalendarIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface ChartData {
    name: string;
    agendamentos: number;
}

const Dashboard: React.FC = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const data = await mockApi.getAppointments();
            setAppointments(data);
            setLoading(false);
        };
        fetchData();
    }, []);

    const totalAppointments = appointments.length;
    const scheduledAppointments = appointments.filter(a => a.status === AppointmentStatus.Scheduled).length;
    const completedAppointments = appointments.filter(a => a.status === AppointmentStatus.Completed).length;

    const chartData: ChartData[] = appointments.reduce((acc, curr) => {
        const month = new Date(curr.scheduledAt).toLocaleString('default', { month: 'short' });
        const existingMonth = acc.find(item => item.name === month);
        if (existingMonth) {
            existingMonth.agendamentos += 1;
        } else {
            acc.push({ name: month, agendamentos: 1 });
        }
        return acc;
    }, [] as ChartData[]).reverse();

    if (loading) {
        return <div className="text-center p-8">Carregando...</div>;
    }

    return (
        <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
                    <div className="bg-sky-100 text-sky-600 p-3 rounded-full">
                        <CalendarIcon className="h-8 w-8" />
                    </div>
                    <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Total de Agendamentos</p>
                        <p className="text-3xl font-bold text-gray-900">{totalAppointments}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
                    <div className="bg-yellow-100 text-yellow-600 p-3 rounded-full">
                        <ClockIcon className="h-8 w-8" />
                    </div>
                    <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Visitas Pendentes</p>
                        <p className="text-3xl font-bold text-gray-900">{scheduledAppointments}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
                    <div className="bg-green-100 text-green-600 p-3 rounded-full">
                        <CheckCircleIcon className="h-8 w-8" />
                    </div>
                    <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Visitas Concluídas</p>
                        <p className="text-3xl font-bold text-gray-900">{completedAppointments}</p>
                    </div>
                </div>
            </div>

            {/* Chart */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Agendamentos por Mês</h3>
                <div style={{ width: '100%', height: 400 }}>
                    <ResponsiveContainer>
                        <BarChart
                            data={chartData}
                            margin={{
                                top: 5, right: 20, left: -10, bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="agendamentos" fill="#0ea5e9" name="Agendamentos" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
