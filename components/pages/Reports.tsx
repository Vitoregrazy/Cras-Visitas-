
import React, { useState, useEffect, useMemo } from 'react';
import { mockApi } from '../../services/api';
import { Appointment, AppointmentReason } from '../../types';

const Reports: React.FC = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        reason: '',
        cadastrador: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const data = await mockApi.getAppointments();
            setAppointments(data);
            setLoading(false);
        };
        fetchData();
    }, []);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const filteredAppointments = useMemo(() => {
        return appointments.filter(appointment => {
            const appointmentDate = new Date(appointment.scheduledAt);
            const startDate = filters.startDate ? new Date(filters.startDate) : null;
            const endDate = filters.endDate ? new Date(filters.endDate) : null;

            if (startDate && appointmentDate < startDate) return false;
            if (endDate && appointmentDate > endDate) return false;
            if (filters.reason && appointment.reason !== filters.reason) return false;
            if (filters.cadastrador && !appointment.schedulerName.toLowerCase().includes(filters.cadastrador.toLowerCase())) return false;
            
            return true;
        });
    }, [appointments, filters]);

    const exportToCSV = () => {
        const headers = ['ID', 'Solicitante', 'CPF', 'Data Agendamento', 'Motivo', 'Status', 'Cadastrador da Visita', 'Data da Visita'];
        const rows = filteredAppointments.map(a => [
            a.id,
            `"${a.applicantName}"`,
            `"${a.cpf}"`,
            new Date(a.scheduledAt).toLocaleString(),
            a.reason,
            a.status,
            `"${a.visitorName || ''}"`,
            a.visitDate || '',
        ].join(','));

        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "relatorio_agendamentos.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    const handlePrint = () => {
        window.print();
    }


    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Filtros de Relatório</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} className="form-input" />
                    <input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} className="form-input" />
                    <select name="reason" value={filters.reason} onChange={handleFilterChange} className="form-select">
                        <option value="">Todos os Motivos</option>
                        {Object.values(AppointmentReason).map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                    <input type="text" name="cadastrador" placeholder="Nome do cadastrador" value={filters.cadastrador} onChange={handleFilterChange} className="form-input" />
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">Resultados</h2>
                     <div className="space-x-2">
                        <button onClick={exportToCSV} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">Exportar CSV</button>
                        <button onClick={handlePrint} className="bg-sky-600 text-white px-4 py-2 rounded-md hover:bg-sky-700">Imprimir / PDF</button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Solicitante</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Motivo</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr><td colSpan={4} className="text-center py-4">Carregando...</td></tr>
                            ) : (
                                filteredAppointments.map(appointment => (
                                    <tr key={appointment.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">{appointment.applicantName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{new Date(appointment.scheduledAt).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{appointment.reason}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{appointment.status}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                     {filteredAppointments.length === 0 && !loading && <p className="text-center py-4">Nenhum resultado encontrado para os filtros aplicados.</p>}
                </div>
            </div>
        </div>
    );
};

export default Reports;
