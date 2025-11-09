
import React, { useState, useContext } from 'react';
import { Appointment, AppointmentReason, Page } from '../../types';
import { AuthContext } from '../../App';
import { mockApi } from '../../services/api';
import { extractInfoFromImage } from '../../services/geminiService';
import { PhotoIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

type FormData = Omit<Appointment, 'id' | 'scheduledAt' | 'status'>;

const initialFormData: FormData = {
    applicantName: '', cpf: '', birthDate: '', phone: '',
    address: '', neighborhood: '', cep: '', referencePoint: '',
    observations: '', reason: AppointmentReason.INCLUSAO_PBF,
    schedulerName: '', schedulerCpf: '', equipmentName: '',
};

interface NewAppointmentProps {
  setCurrentPage: (page: Page) => void;
}

const NewAppointment: React.FC<NewAppointmentProps> = ({ setCurrentPage }) => {
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [ocrLoading, setOcrLoading] = useState(false);
    const [ocrError, setOcrError] = useState('');
    const [formLoading, setFormLoading] = useState(false);
    const authContext = useContext(AuthContext);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setOcrLoading(true);
            setOcrError('');
            try {
                const extractedData = await extractInfoFromImage(file);
                setFormData(prev => ({
                    ...prev,
                    applicantName: extractedData.fullName || prev.applicantName,
                    cpf: extractedData.cpf || prev.cpf,
                    birthDate: extractedData.dateOfBirth || prev.birthDate,
                }));
            } catch (error: any) {
                setOcrError(error.message || 'Falha ao processar a imagem.');
            } finally {
                setOcrLoading(false);
            }
        }
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setFormLoading(true);
      const schedulerName = authContext?.user?.name || 'N/A';
      // For this mock, we'll use a placeholder CPF for the scheduler
      const schedulerCpf = '000.000.000-00';
      
      try {
        await mockApi.addAppointment({ ...formData, schedulerName, schedulerCpf });
        alert('Agendamento criado com sucesso!');
        setFormData(initialFormData);
        setCurrentPage(Page.Appointments);
      } catch (error) {
        alert('Falha ao criar agendamento.');
        console.error(error);
      } finally {
        setFormLoading(false);
      }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="space-y-12">
                {/* OCR Section */}
                <div className="border-b border-gray-900/10 pb-12">
                    <h2 className="text-base font-semibold leading-7 text-gray-900">Reconhecimento de Imagem (OCR)</h2>
                    <p className="mt-1 text-sm leading-6 text-gray-600">Envie uma foto de um documento para preencher os dados automaticamente.</p>
                    <div className="mt-4 flex items-center gap-x-3">
                        <PhotoIcon className="h-12 w-12 text-gray-300" aria-hidden="true" />
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                        <label htmlFor="file-upload" className="cursor-pointer rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                            Enviar imagem
                        </label>
                        {ocrLoading && <ArrowPathIcon className="h-5 w-5 text-gray-500 animate-spin" />}
                    </div>
                    {ocrError && <p className="mt-2 text-sm text-red-600">{ocrError}</p>}
                </div>

                {/* Applicant Info Section */}
                <div className="border-b border-gray-900/10 pb-12">
                    <h2 className="text-base font-semibold leading-7 text-gray-900">Informações do Solicitante</h2>
                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                            <label htmlFor="applicantName" className="block text-sm font-medium leading-6 text-gray-900">Nome Completo</label>
                            <input type="text" name="applicantName" id="applicantName" value={formData.applicantName} onChange={handleInputChange} required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"/>
                        </div>
                        <div className="sm:col-span-3">
                            <label htmlFor="cpf" className="block text-sm font-medium leading-6 text-gray-900">CPF</label>
                            <input type="text" name="cpf" id="cpf" value={formData.cpf} onChange={handleInputChange} required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"/>
                        </div>
                        <div className="sm:col-span-3">
                            <label htmlFor="birthDate" className="block text-sm font-medium leading-6 text-gray-900">Data de Nascimento</label>
                            <input type="date" name="birthDate" id="birthDate" value={formData.birthDate} onChange={handleInputChange} required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"/>
                        </div>
                        <div className="sm:col-span-3">
                            <label htmlFor="phone" className="block text-sm font-medium leading-6 text-gray-900">Telefone para Contato</label>
                            <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleInputChange} required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"/>
                        </div>
                        <div className="col-span-full">
                            <label htmlFor="address" className="block text-sm font-medium leading-6 text-gray-900">Endereço</label>
                            <input type="text" name="address" id="address" value={formData.address} onChange={handleInputChange} required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"/>
                        </div>
                        <div className="sm:col-span-2">
                            <label htmlFor="neighborhood" className="block text-sm font-medium leading-6 text-gray-900">Bairro</label>
                            <input type="text" name="neighborhood" id="neighborhood" value={formData.neighborhood} onChange={handleInputChange} required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"/>
                        </div>
                        <div className="sm:col-span-2">
                            <label htmlFor="cep" className="block text-sm font-medium leading-6 text-gray-900">CEP</label>
                            <input type="text" name="cep" id="cep" value={formData.cep} onChange={handleInputChange} required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"/>
                        </div>
                         <div className="sm:col-span-2">
                            <label htmlFor="referencePoint" className="block text-sm font-medium leading-6 text-gray-900">Ponto de Referência</label>
                            <input type="text" name="referencePoint" id="referencePoint" value={formData.referencePoint} onChange={handleInputChange} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"/>
                        </div>
                    </div>
                </div>

                {/* Appointment Info Section */}
                 <div className="border-b border-gray-900/10 pb-12">
                    <h2 className="text-base font-semibold leading-7 text-gray-900">Informações do Agendamento</h2>
                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                            <label htmlFor="reason" className="block text-sm font-medium leading-6 text-gray-900">Motivo do Agendamento</label>
                            <select id="reason" name="reason" value={formData.reason} onChange={handleInputChange} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6">
                                {Object.values(AppointmentReason).map(reason => <option key={reason} value={reason}>{reason}</option>)}
                            </select>
                        </div>
                        <div className="sm:col-span-3">
                            <label htmlFor="equipmentName" className="block text-sm font-medium leading-6 text-gray-900">Nome do Equipamento</label>
                            <input type="text" name="equipmentName" id="equipmentName" value={formData.equipmentName} onChange={handleInputChange} required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"/>
                        </div>
                        <div className="col-span-full">
                            <label htmlFor="observations" className="block text-sm font-medium leading-6 text-gray-900">Observações</label>
                            <textarea id="observations" name="observations" rows={3} value={formData.observations} onChange={handleInputChange} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"></textarea>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-x-6">
                <button type="button" className="text-sm font-semibold leading-6 text-gray-900" onClick={() => setFormData(initialFormData)}>Limpar</button>
                <button type="submit" disabled={formLoading} className="rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 disabled:bg-sky-300">
                  {formLoading ? 'Salvando...' : 'Salvar Agendamento'}
                </button>
            </div>
        </form>
    );
};

export default NewAppointment;
