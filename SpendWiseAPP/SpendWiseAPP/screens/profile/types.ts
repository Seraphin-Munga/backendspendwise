export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  joinDate: Date;
}

export interface ProfileStat {
  label: string;
  value: string | number;
  icon: string;
  color: string;
}



