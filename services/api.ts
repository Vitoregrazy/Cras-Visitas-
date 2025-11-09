
import { Appointment, User, UserRole, AppointmentReason, AppointmentStatus } from '../types';

const USERS_KEY = 'cras_users';
const APPOINTMENTS_KEY = 'cras_appointments';
const CURRENT_USER_KEY = 'cras_current_user';

const getInitialUsers = (): User[] => [
    { id: '1', name: 'Admin', email: 'admin@cras.com', password: 'admin', role: UserRole.Admin },
    { id: '2', name: 'Maria Souza', email: 'maria@cras.com', password: '123', role: UserRole.Cadastrador },
];

const getInitialAppointments = (): Appointment[] => [
  {
    id: '1',
    applicantName: 'João da Silva',
    cpf: '111.111.111-11',
    birthDate: '1980-05-15',
    phone: '11987654321',
    address: 'Rua das Flores, 123',
    neighborhood: 'Centro',
    cep: '01001-000',
    referencePoint: 'Próximo à padaria',
    observations: 'Primeiro contato.',
    reason: AppointmentReason.INCLUSAO_PBF,
    schedulerName: 'Maria Souza',
    schedulerCpf: '222.222.222-22',
    equipmentName: 'CRAS Central',
    scheduledAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: AppointmentStatus.Completed,
    visitorName: 'Carlos Andrade',
    visitDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  },
  {
    id: '2',
    applicantName: 'Ana Pereira',
    cpf: '333.333.333-33',
    birthDate: '1992-11-20',
    phone: '21912345678',
    address: 'Avenida Principal, 456',
    neighborhood: 'Zona Sul',
    cep: '22000-000',
    referencePoint: 'Em frente ao mercado',
    observations: 'Urgente.',
    reason: AppointmentReason.ATUALIZACAO_BPC_LOAS,
    schedulerName: 'Maria Souza',
    schedulerCpf: '222.222.222-22',
    equipmentName: 'CRAS Sul',
    scheduledAt: new Date().toISOString(),
    status: AppointmentStatus.Scheduled,
  }
];

export const mockApi = {
  initializeData: () => {
    if (!localStorage.getItem(USERS_KEY)) {
      localStorage.setItem(USERS_KEY, JSON.stringify(getInitialUsers()));
    }
    if (!localStorage.getItem(APPOINTMENTS_KEY)) {
      localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(getInitialAppointments()));
    }
  },

  // Auth
  login: async (email: string, pass: string): Promise<User | null> => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]') as User[];
    const user = users.find(u => u.email === email && u.password === pass);
    if (user) {
      const userToStore = { ...user };
      delete userToStore.password;
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userToStore));
      return userToStore;
    }
    return null;
  },

  logout: () => {
    localStorage.removeItem(CURRENT_USER_KEY);
  },
  
  getCurrentUser: (): User | null => {
    const user = localStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  // Users
  getUsers: async (): Promise<User[]> => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]') as User[];
    return users.map(({ password, ...user }) => user);
  },
  
  addUser: async (user: Omit<User, 'id'>): Promise<User> => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]') as User[];
    const newUser = { ...user, id: new Date().getTime().toString() };
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    const { password, ...userToReturn } = newUser;
    return userToReturn;
  },
  
  updateUser: async (updatedUser: User): Promise<User> => {
    let users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]') as User[];
    users = users.map(u => u.id === updatedUser.id ? { ...u, ...updatedUser } : u);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    const { password, ...userToReturn } = updatedUser;
    return userToReturn;
  },

  deleteUser: async (userId: string): Promise<void> => {
    let users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]') as User[];
    users = users.filter(u => u.id !== userId);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  // Appointments
  getAppointments: async (): Promise<Appointment[]> => {
    return JSON.parse(localStorage.getItem(APPOINTMENTS_KEY) || '[]');
  },

  addAppointment: async (appointment: Omit<Appointment, 'id' | 'scheduledAt' | 'status'>): Promise<Appointment> => {
    const appointments = JSON.parse(localStorage.getItem(APPOINTMENTS_KEY) || '[]') as Appointment[];
    const newAppointment: Appointment = {
      ...appointment,
      id: new Date().getTime().toString(),
      scheduledAt: new Date().toISOString(),
      status: AppointmentStatus.Scheduled,
    };
    appointments.unshift(newAppointment);
    localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments));
    return newAppointment;
  },
  
  updateAppointment: async (updatedAppointment: Appointment): Promise<Appointment> => {
    let appointments = JSON.parse(localStorage.getItem(APPOINTMENTS_KEY) || '[]') as Appointment[];
    appointments = appointments.map(a => a.id === updatedAppointment.id ? updatedAppointment : a);
    localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments));
    return updatedAppointment;
  },
};
