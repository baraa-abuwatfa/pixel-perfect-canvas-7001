import { createContext, useContext, useState, type ReactNode } from "react";
import { EMPTY_PROFILE, SAMPLE_PROFILE, type Profile } from "./data";

type Ctx = {
  profile: Profile;
  isSample: boolean;
  saveProfile: (p: Profile) => void;
};

const ProfileContext = createContext<Ctx | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const isSample = userProfile === null;
  return (
    <ProfileContext.Provider
      value={{
        profile: userProfile ?? SAMPLE_PROFILE,
        isSample,
        saveProfile: (p) => setUserProfile(p),
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used inside ProfileProvider");
  return ctx;
}

export { EMPTY_PROFILE };
