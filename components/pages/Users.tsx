
import React, { useState, useEffect, useCallback } from 'react';
import { mockApi } from '../../services/api';
import { User, UserRole } from '../../types';
import { PencilIcon, TrashIcon, XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';

// Modal for adding/editing users
const UserModal: React.FC<{
  user: User | Partial<User> | null;
  onClose: () => void;
  onSave: (user: User | Partial<User>) => void;
}> = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState(user);

  useEffect(() => {
    setFormData(user);
  }, [user]);

  if (!user) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSave = (e: React.FormEvent) => {
      e.preventDefault();
      onSave(formData!);
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSave}>
            <div className="p-6">
                <div className="flex justify-between items-center border-b pb-4">
                    <h3 className="text-xl font-semibold text-gray-900">{formData?.id ? 'Editar' : 'Adicionar'} Usuário</h3>
                    <button type="button" onClick={onClose} className="p-2 rounded-full text-gray-500 hover:bg-gray-100">
                        <XMarkIcon className="h-6 w-6"/>
                    </button>
                </div>
                <div className="mt-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nome</label>
                        <input type="text" name="name" value={formData?.name || ''} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" name="email" value={formData?.email || ''} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm" />
                    </div>
                    {!formData?.id && (
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Senha</label>
                            <input type="password" name="password" onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm" />
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Função</label>
                        <select name="role" value={formData?.role || ''} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm rounded-md">
                            <option value={UserRole.Cadastrador}>Cadastrador</option>
                            <option value={UserRole.Admin}>Administrador</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-sky-600 text-base font-medium text-white hover:bg-sky-700 sm:ml-3 sm:w-auto sm:text-sm">
                    Salvar
                </button>
                <button type="button" onClick={onClose} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm">
                    Cancelar
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};


const Users: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState<User | Partial<User> | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        const data = await mockApi.getUsers();
        setUsers(data);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleOpenModal = (user: User | Partial<User> | null = null) => {
        setSelectedUser(user || { name: '', email: '', role: UserRole.Cadastrador });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedUser(null);
        setIsModalOpen(false);
    };

    const handleSaveUser = async (user: User | Partial<User>) => {
        if ('id' in user) {
            await mockApi.updateUser(user as User);
        } else {
            await mockApi.addUser(user as Omit<User, 'id'>);
        }
        fetchUsers();
        handleCloseModal();
    };
    
    const handleDeleteUser = async (userId: string) => {
        if(window.confirm('Tem certeza que deseja excluir este usuário?')) {
            await mockApi.deleteUser(userId);
            fetchUsers();
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Gerenciamento de Usuários</h2>
                <button onClick={() => handleOpenModal()} className="inline-flex items-center gap-x-2 rounded-md bg-sky-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-sky-500">
                    <PlusIcon className="-ml-0.5 h-5 w-5" />
                    Novo Usuário
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Função</th>
                            <th className="relative px-6 py-3"><span className="sr-only">Ações</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr><td colSpan={4} className="text-center py-4">Carregando...</td></tr>
                        ) : (
                            users.map(user => (
                                <tr key={user.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{user.role}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                                        <button onClick={() => handleOpenModal(user)} className="text-sky-600 hover:text-sky-900"><PencilIcon className="h-5 w-5"/></button>
                                        <button onClick={() => handleDeleteUser(user.id)} className="text-red-600 hover:text-red-900"><TrashIcon className="h-5 w-5"/></button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            {isModalOpen && <UserModal user={selectedUser} onClose={handleCloseModal} onSave={handleSaveUser} />}
        </div>
    );
};

export default Users;
