
export enum Page {
  Dashboard = 'Dashboard',
  Appointments = 'Agendamentos',
  NewAppointment = 'Novo Agendamento',
  Reports = 'Relatórios',
  Users = 'Usuários',
  Settings = 'Configurações',
}

export enum UserRole {
  Admin = 'Administrador',
  Cadastrador = 'Cadastrador',
}

export enum AppointmentReason {
  INCLUSAO_PBF = 'INCLUSÃO PBF',
  ATUALIZACAO_PBF = 'ATUALIZAÇÃO PBF',
  ATUALIZACAO_BPC_LOAS = 'ATUALIZAÇÃO BPC LOAS',
  INCLUSAO_LOAS = 'INCLUSÃO PARA O LOAS',
  APENAS_ATUALIZACAO = 'APENAS ATUALIZAÇÃO',
  MUDANCA_RESP_FAMILIAR = 'MUDANÇA DE RESP. FAMILIAR',
  CONTRADICAO_DISCURSO = 'CONTRADIÇÃO NO DISCURSO',
  DENUNCIA = 'DENÚNCIA',
}

export enum AppointmentStatus {
  Scheduled = 'Agendado',
  Completed = 'Concluído',
  Canceled = 'Cancelado',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password?: string;
}

export interface Appointment {
  id: string;
  applicantName: string;
  cpf: string;
  birthDate: string;
  phone: string;
  address: string;
  neighborhood: string;
  cep: string;
  referencePoint: string;
  observations: string;
  reason: AppointmentReason;
  schedulerName: string;
  schedulerCpf: string;
  equipmentName: string;
  scheduledAt: string;
  status: AppointmentStatus;
  visitorName?: string;
  visitDate?: string;
}
