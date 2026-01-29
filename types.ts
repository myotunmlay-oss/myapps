export interface Server {
  name: string;
  url: string;
}

export interface Match {
  match_id: string | number;
  home_team_name: string;
  away_team_logo: string;
  home_team_logo: string;
  away_team_name: string;
  homeTeamScore?: string | number;
  awayTeamScore?: string | number;
  match_time: number | string;
  league_name?: string; 
  servers: Server[];
  is_manual?: boolean;
}

export interface ChatMessage {
  id: string;
  text?: string;
  imageUrl?: string;
  sender: 'user' | 'admin';
  timestamp: number;
}

export interface ChatSession {
  userId: string;
  lastMessage: string;
  lastTimestamp: number;
  unreadAdmin: number;
  unreadUser: number;
  messages?: Record<string, ChatMessage>;
}

export interface AdBanner {
  image: string;
  link: string;
}

export interface UserAccount {
  code: string;
  name: string;
  deviceLimit: number;
  expiry: number; 
  activeDevices?: Record<string, number>; 
  createdAt: number;
}

export interface AppSettings {
  auto_sync_enabled?: boolean;
  sync_interval?: number; 
  free_mode?: boolean; 
  last_sync_time?: number;
  admin_password?: string;
  custom_ads?: AdBanner[];   
  ads_banner_width?: number; // % width
  ads_banner_offset_y?: number; // % from bottom
  branding_logo_text?: string;
  branding_logo_url?: string;
  branding_logo_size?: number; 
  branding_logo_position?: 'left' | 'right';
  branding_logo_offset_x?: number; 
  branding_logo_offset_y?: number; 
  show_branding_logo?: boolean;
  app_background_darkness?: 'default' | 'darker' | 'deep-dark';
  announcement_text?: string;
  show_announcement?: boolean;
  welcome_title_text?: string;
  auto_reply_enabled?: boolean;
  auto_reply_text?: string;
  pricing_info?: string;
  server_update_text?: string;
  apk_download_url?: string;
  apk_download_text?: string;
  total_code_limit?: number;
  app_version?: string;
  update_url?: string;
  update_message?: string;
  force_update?: boolean;
  app_language?: 'my' | 'en';
}