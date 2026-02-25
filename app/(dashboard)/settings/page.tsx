"use client";

import { FormEvent, useEffect, useState } from "react";
import { Edit, Save } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  UserProfile,
  changePasswordApi,
  getApiErrorMessage,
  getProfileApi,
  updateProfileApi,
} from "@/lib/api";
import { formatUserRole } from "@/lib/utils";
import { toast } from "sonner";

type SettingsTab = "personal" | "password";

interface ProfileFormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
}

interface PasswordFormState {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

const splitName = (fullName: string) => {
  const parts = fullName.trim().split(/\s+/);
  return {
    firstName: parts[0] || "",
    lastName: parts.slice(1).join(" "),
  };
};

const getInitials = (value: string) =>
  value
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((chunk) => chunk[0]?.toUpperCase())
    .join("") || "DN";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("personal");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileEditing, setIsProfileEditing] = useState(false);
  const [isPasswordEditing, setIsPasswordEditing] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [profileForm, setProfileForm] = useState<ProfileFormState>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bio: "",
  });
  const [passwordForm, setPasswordForm] = useState<PasswordFormState>({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      try {
        setIsLoading(true);
        const response = await getProfileApi();
        if (!isMounted) return;

        const nextProfile = response.data;
        const { firstName, lastName } = splitName(nextProfile?.fullName || "");

        setProfile(nextProfile);
        setProfileForm({
          firstName,
          lastName,
          email: nextProfile?.email || "",
          phone: nextProfile?.phone || "",
          bio: nextProfile?.bio || "",
        });
      } catch (error) {
        if (!isMounted) return;
        toast.error(getApiErrorMessage(error));
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    void loadProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  const profileName = profile?.fullName || "Demo Name";
  const profileRole = (profile?.role ? formatUserRole(profile.role) : "Admin")
    .toLowerCase()
    .replace(/\s+/g, "");

  const toggleActiveEdit = () => {
    if (activeTab === "personal") {
      setIsProfileEditing((prev) => !prev);
      return;
    }
    setIsPasswordEditing((prev) => !prev);
  };

  const handleProfileSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isProfileEditing || !profile) return;

    const fullName = [profileForm.firstName, profileForm.lastName].filter(Boolean).join(" ").trim();
    if (!fullName) {
      toast.error("First name is required.");
      return;
    }

    try {
      setIsSavingProfile(true);
      const response = await updateProfileApi({
        fullName,
        phone: profileForm.phone,
        bio: profileForm.bio,
        avatar: null,
      });
      setProfile(response.data || profile);
      setIsProfileEditing(false);
      toast.success("Profile updated successfully.");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isPasswordEditing) return;

    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmNewPassword) {
      toast.error("All password fields are required.");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    try {
      setIsSavingPassword(true);
      await changePasswordApi({
        oldPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
      setIsPasswordEditing(false);
      toast.success("Password changed successfully.");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsSavingPassword(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" breadcrumb={["Dashboard", "Settings"]} />

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as SettingsTab)}>
        <TabsList className="grid h-auto w-full grid-cols-1 gap-4 md:grid-cols-2">
          <TabsTrigger value="personal" className="h-12 text-lg">
            Personal Information
          </TabsTrigger>
          <TabsTrigger value="password" className="h-12 text-lg">
            Change Password
          </TabsTrigger>
        </TabsList>

        <Card className="mt-6">
          <CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-[92px] w-[92px] border border-[#b8cadc]">
                <AvatarImage src={profile?.avatar?.url} alt={profileName} />
                <AvatarFallback>{getInitials(profileName)}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-[32px] text-3xl font-bold text-[#1f2f43]">{profileName}</h2>
                <p className="text-2xl text-lg text-[#3b4f66]">@{profileRole}</p>
              </div>
            </div>
            <Button type="button" className="h-11 px-6 text-base" onClick={toggleActiveEdit} disabled={isLoading}>
              <Edit className="h-4 w-4" />
              {activeTab === "personal" ? (isProfileEditing ? "Cancel" : "Edit") : isPasswordEditing ? "Cancel" : "Edit"}
            </Button>
          </CardContent>
        </Card>

        <TabsContent value="personal">
          <Card>
            <CardContent className="space-y-5 p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-[32px] text-2xl font-semibold text-[#1f2f43]">Personal Information</h3>
                <Button
                  type="button"
                  className="h-10 px-5"
                  onClick={() => setIsProfileEditing((prev) => !prev)}
                  disabled={isLoading}
                >
                  <Edit className="h-4 w-4" />
                  {isProfileEditing ? "Cancel" : "Edit"}
                </Button>
              </div>

              <form className="space-y-4" onSubmit={handleProfileSubmit}>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[#1f2f43]">First Name</label>
                    <Input
                      value={profileForm.firstName}
                      onChange={(event) => setProfileForm((prev) => ({ ...prev, firstName: event.target.value }))}
                      placeholder="First name"
                      disabled={!isProfileEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[#1f2f43]">Last Name</label>
                    <Input
                      value={profileForm.lastName}
                      onChange={(event) => setProfileForm((prev) => ({ ...prev, lastName: event.target.value }))}
                      placeholder="Last name"
                      disabled={!isProfileEditing}
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[#1f2f43]">Email Address</label>
                    <Input value={profileForm.email} placeholder="Email" disabled />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[#1f2f43]">Phone</label>
                    <Input
                      value={profileForm.phone}
                      onChange={(event) => setProfileForm((prev) => ({ ...prev, phone: event.target.value }))}
                      placeholder="Phone number"
                      disabled={!isProfileEditing}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#1f2f43]">Bio</label>
                  <Textarea
                    value={profileForm.bio}
                    onChange={(event) => setProfileForm((prev) => ({ ...prev, bio: event.target.value }))}
                    placeholder="Write your bio..."
                    rows={5}
                    disabled={!isProfileEditing}
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="submit" className="h-11 px-6" disabled={!isProfileEditing || isSavingProfile || isLoading}>
                    <Save className="h-4 w-4" />
                    {isSavingProfile ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="password">
          <Card>
            <CardContent className="space-y-5 p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-[32px] text-2xl font-semibold text-[#1f2f43]">Change password</h3>
                <Button
                  type="button"
                  className="h-10 px-5"
                  onClick={() => setIsPasswordEditing((prev) => !prev)}
                  disabled={isLoading}
                >
                  <Edit className="h-4 w-4" />
                  {isPasswordEditing ? "Cancel" : "Edit"}
                </Button>
              </div>

              <form className="space-y-4" onSubmit={handlePasswordSubmit}>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[#1f2f43]">Current Password</label>
                    <Input
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(event) =>
                        setPasswordForm((prev) => ({ ...prev, currentPassword: event.target.value }))
                      }
                      placeholder="Enter current password"
                      disabled={!isPasswordEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[#1f2f43]">New Password</label>
                    <Input
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(event) => setPasswordForm((prev) => ({ ...prev, newPassword: event.target.value }))}
                      placeholder="Enter new password"
                      disabled={!isPasswordEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[#1f2f43]">Confirm New Password</label>
                    <Input
                      type="password"
                      value={passwordForm.confirmNewPassword}
                      onChange={(event) =>
                        setPasswordForm((prev) => ({ ...prev, confirmNewPassword: event.target.value }))
                      }
                      placeholder="Confirm new password"
                      disabled={!isPasswordEditing}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" className="h-11 px-6" disabled={!isPasswordEditing || isSavingPassword || isLoading}>
                    <Save className="h-4 w-4" />
                    {isSavingPassword ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
