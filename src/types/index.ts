export type Campus = 'All' | 'Tashkent' | 'Samarkand';

export interface User {
  telegram_id: number | string;
  full_name: string;
  phone_number: string;
  telegram_username: string; // for t.me link upon mutual accept
  anon_nick: string; // unique, unchangeable (read-only e.g. "silent_coder_42")
  password_hash: string;
  skills: string[];
  interests: string;
  campus?: 'Tashkent' | 'Samarkand';
  level?: string; // e.g. "Common Core Lvl 8", "Pooler"
  avatar?: string;
}

export type ProjectStatus = 'open' | 'closed';

export interface Project {
  project_id: string;
  owner_nick: string;
  title: string;
  description: string;
  needed_roles: string[]; // e.g. ["Frontend (React)", "C Backend"]
  status: ProjectStatus;
  created_at?: string;
  campus?: 'Tashkent' | 'Samarkand' | 'Cross-Campus';
}

export type ApplicationStatus = 'pending' | 'accepted' | 'rejected';

export interface Application {
  application_id: string;
  project_id: string;
  applicant_nick: string;
  status: ApplicationStatus;
  reject_reason?: string; // mandatory if rejected
  created_at?: string;
}
