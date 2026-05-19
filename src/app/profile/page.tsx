import type { Metadata } from "next";

import { ProfilePage } from "@/views/Profile/ProfilePage";

export const metadata: Metadata = {
  title: "My profile",
  description:
    "Your Pearl Dental Care profile—appointment history, contact information, and account actions.",
};

export default function Profile() {
  return <ProfilePage />;
}
