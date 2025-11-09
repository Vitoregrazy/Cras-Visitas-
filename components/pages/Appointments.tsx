
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { mockApi } from '../../services/api';
import { Appointment, AppointmentStatus, AppointmentReason } from '../../types';
import { PencilIcon, EyeIcon, PrinterIcon, XMarkIcon } from '@heroicons/react/24/outline';

const statusColors: { [key in AppointmentStatus]: string } = {
  [AppointmentStatus.Scheduled]: 'bg-yellow-100 text-yellow-800',
  [AppointmentStatus.Completed]: 'bg-green-100 text-green-800',
  [AppointmentStatus.Canceled]: 'bg-red-100 text-red-800',
};

// Modal Component defined in the same file to avoid state management complexities
const AppointmentModal: React.FC<{
  appointment: Appointment | null;
  onClose: () => void;
  onSave: (updatedAppointment: Appointment) => void;
}> = ({ appointment, onClose, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Appointment | null>(appointment);

  useEffect(() => {
    setFormData(appointment);
    setIsEditing(false);
  }, [appointment]);

  if (!appointment) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (formData) {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };
  
  const handleSave = () => {
    if (formData) {
      onSave(formData);
      setIsEditing(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const renderField = (label: string, value: string | undefined, name: keyof Appointment, type: string = 'text', options?: string[]) => {
      if (isEditing) {
          if (type === 'select' && options) {
              return (
                  <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">{label}</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                          <select name={name} value={value} onChange={handleInputChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm rounded-md">
                              {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                          </select>
                      </dd>
                  </div>
              );
          }
          if (type === 'textarea') {
             return (
                 <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">{label}</dt>
                     <dd className="mt-1 text-sm text-gray-900">
                         <textarea name={name} value={value} onChange={handleInputChange} rows={3} className="shadow-sm focus:ring-sky-500 focus:border-sky-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md p-2"></textarea>
                     </dd>
                 </div>
             );
          }
          return (
              <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">{label}</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                      <input type={type} name={name} value={value} onChange={handleInputChange} className="shadow-sm focus:ring-sky-500 focus:border-sky-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md p-2"/>
                  </dd>
              </div>
          );
      }
      return (
          <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">{label}</dt>
              <dd className="mt-1 text-sm text-gray-900">{value}</dd>
          </div>
      );
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" onClick={onClose}>
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6">
                <div className="flex justify-between items-center border-b pb-4">
                    <h3 className="text-xl font-semibold text-gray-900">Detalhes do Agendamento</h3>
                    <div className="flex items-center space-x-2">
                        <button onClick={() => setIsEditing(!isEditing)} className="p-2 rounded-full text-gray-500 hover:bg-gray-100">
                            <PencilIcon className="h-5 w-5"/>
                        </button>
                        <button onClick={handlePrint} className="p-2 rounded-full text-gray-500 hover:bg-gray-100">
                            <PrinterIcon className="h-5 w-5"/>
                        </button>
                        <button onClick={onClose} className="p-2 rounded-full text-gray-500 hover:bg-gray-100">
                            <XMarkIcon className="h-6 w-6"/>
                        </button>
                    </div>
                </div>
                 <div className="mt-5 border-t border-gray-200">
                    <dl className="sm:divide-y sm:divide-gray-200">
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-2 sm:gap-4">
                            {renderField("Nome do Solicitante", formData?.applicantName, "applicantName")}
                            {renderField("CPF", formData?.cpf, "cpf")}
                            {renderField("Data de Nascimento", formData?.birthDate, "birthDate", "date")}
                            {renderField("Telefone", formData?.phone, "phone")}
                            {renderField("Endereço", formData?.address, "address")}
                            {renderField("Bairro", formData?.neighborhood, "neighborhood")}
                            {renderField("CEP", formData?.cep, "cep")}
                            {renderField("Ponto de Referência", formData?.referencePoint, "referencePoint")}
                            {renderField("Motivo", formData?.reason, "reason", "select", Object.values(AppointmentReason))}
                            {renderField("Status", formData?.status, "status", "select", Object.values(AppointmentStatus))}
                            <div className="sm:col-span-2">
                                {renderField("Observações", formData?.observations, "observations", "textarea")}
                            </div>
                        </div>
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-2 sm:gap-4 bg-gray-50 -mx-6 px-6">
                           <h4 className="text-md font-semibold text-gray-700 sm:col-span-2">Informações da Visita</h4>
                           {renderField("Nome do Cadastrador", formData?.visitorName, "visitorName")}
                           {renderField("Data da Visita", formData?.visitDate, "visitDate", "date")}
                        </div>
                    </dl>
                </div>
                {isEditing && (
                    <div className="pt-5 flex justify-end space-x-3">
                        <button onClick={() => { setIsEditing(false); setFormData(appointment); }} type="button" className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">Cancelar</button>
                        <button onClick={handleSave} type="button" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700">Salvar</button>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

const Appointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    const data = await mockApi.getAppointments();
    setAppointments(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleSaveAppointment = async (updatedAppointment: Appointment) => {
    await mockApi.updateAppointment(updatedAppointment);
    setSelectedAppointment(null);
    fetchAppointments(); // Refresh data
  };

  const filteredAppointments = useMemo(() => {
    return appointments.filter(
      (appointment) =>
        appointment.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.cpf.includes(searchTerm)
    );
  }, [appointments, searchTerm]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Agendamentos</h2>
        <input
          type="text"
          placeholder="Buscar por nome ou CPF..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Solicitante</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CPF</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Agendamento</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Motivo</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="relative px-6 py-3"><span className="sr-only">Ações</span></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan={6} className="text-center py-4">Carregando...</td></tr>
            ) : (
              filteredAppointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{appointment.applicantName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appointment.cpf}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(appointment.scheduledAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appointment.reason}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[appointment.status]}`}>
                      {appointment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => setSelectedAppointment(appointment)} className="text-sky-600 hover:text-sky-900">
                        <EyeIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {filteredAppointments.length === 0 && !loading && <p className="text-center py-4">Nenhum agendamento encontrado.</p>}
      </div>
      <AppointmentModal appointment={selectedAppointment} onClose={() => setSelectedAppointment(null)} onSave={handleSaveAppointment} />
    </div>
  );
};

export default Appointments;
