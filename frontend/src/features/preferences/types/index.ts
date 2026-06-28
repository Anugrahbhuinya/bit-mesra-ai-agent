export interface NotificationPreferences {
  email_notifications: boolean;
  push_notifications: boolean;
  notice_updates: boolean;
  event_reminders: boolean;
  academic_alerts: boolean;
  [key: string]: boolean; // Dynamic notifications compatibility
}

export interface StudentPreferences {
  preferred_language: "English" | "Hindi";
  theme: "Light" | "Dark" | "System";
  notifications: NotificationPreferences;
  ai_response_style: "Brief" | "Detailed";
  default_home_page: "Dashboard" | "Chat" | "Notices" | "Calendar" | "Profile";
}

export interface UpdatePreferencesPayload extends StudentPreferences {}

export interface PartialUpdatePreferencesPayload {
  preferred_language?: "English" | "Hindi";
  theme?: "Light" | "Dark" | "System";
  notifications?: Partial<NotificationPreferences>;
  ai_response_style?: "Brief" | "Detailed";
  default_home_page?: "Dashboard" | "Chat" | "Notices" | "Calendar" | "Profile";
  [key: string]: any; // Personalization extensions compatibility
}
