import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import preferencesService from "../services/preferencesService";
import type { 
  StudentPreferences, 
  UpdatePreferencesPayload, 
  PartialUpdatePreferencesPayload 
} from "../types";
import { useAuth } from "../../auth/hooks/useAuth";

interface PreferencesContextType {
  preferences: StudentPreferences | null;
  loading: boolean;
  updatePreferences: (payload: UpdatePreferencesPayload) => Promise<void>;
  partialUpdatePreferences: (payload: PartialUpdatePreferencesPayload) => Promise<void>;
  resetPreferences: () => Promise<void>;
  refreshPreferences: () => Promise<void>;
}

export const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export const PreferencesProvider = ({ children }: { children: ReactNode }) => {
  const { currentUser } = useAuth(); // Monitor login state to fetch student settings dynamically
  const [preferences, setPreferences] = useState<StudentPreferences | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPreferences = async () => {
    if (!currentUser || currentUser.role !== "student") {
      setPreferences(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await preferencesService.getPreferences();
      setPreferences(data);
    } catch (e) {
      console.error("Failed to load student preferences", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPreferences();
  }, [currentUser]);

  // Handle Theme application directly on root document
  useEffect(() => {
    if (!preferences) {
      // Default to System preference if not logged in
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (systemPrefersDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      return;
    }

    const applyTheme = (currentTheme: string) => {
      const root = document.documentElement;
      if (currentTheme === "Dark") {
        root.classList.add("dark");
      } else if (currentTheme === "Light") {
        root.classList.remove("dark");
      } else {
        // System preference
        const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (systemPrefersDark) {
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
        }
      }
    };

    applyTheme(preferences.theme);

    // Register event listener for system dark mode changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      if (preferences.theme === "System") {
        const root = document.documentElement;
        if (e.matches) {
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
        }
      }
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);
    return () => mediaQuery.removeEventListener("change", handleSystemThemeChange);
  }, [preferences]);

  const updatePreferences = async (payload: UpdatePreferencesPayload) => {
    const data = await preferencesService.updatePreferences(payload);
    setPreferences(data);
  };

  const partialUpdatePreferences = async (payload: PartialUpdatePreferencesPayload) => {
    const data = await preferencesService.partialUpdatePreferences(payload);
    setPreferences(data);
  };

  const resetPreferences = async () => {
    const data = await preferencesService.resetPreferences();
    setPreferences(data);
  };

  return (
    <PreferencesContext.Provider
      value={{
        preferences,
        loading,
        updatePreferences,
        partialUpdatePreferences,
        resetPreferences,
        refreshPreferences: fetchPreferences,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
};
