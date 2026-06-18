"use client";

import { useRef, useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  Briefcase,
  Camera,
  CircleCheck,
} from "lucide-react";
import {
  Card,
  CardContent,
  Input,
  Textarea,
  Label,
  DropdownSelect,
  Switch,
  Button,
} from "@/components/ui";
import { AvatarInitials } from "@/components/common/avatar-initials";
import { RoleBadge } from "@/components/tables/role-badge";
import { StatusBadge } from "@/components/tables/status-badge";
import { ACCOUNT_STATUSES } from "@/lib/users-data";
import type { AppUser } from "@/lib/users-data";

type UserEditFormProps = {
  user: AppUser;
  onChange: (user: AppUser) => void;
  onSave?: () => void;
  onCancel?: () => void;
  mode?: "create" | "edit";
  roleOptions?: string[];
};

const AVATAR_MAX_BYTES = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];

function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b border-border px-6 py-6 last:border-b-0">
      <div className="mb-5">
        <h3 className="text-sm font-extrabold tracking-tight">{title}</h3>
        {description && (
          <p className="mt-1 text-xs font-medium text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {children}
    </section>
  );
}

export function UserEditForm({
  user,
  onChange,
  onSave,
  onCancel,
  mode = "edit",
  roleOptions = [],
}: UserEditFormProps) {
  const isCreate = mode === "create";
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadError, setUploadError] = useState("");
  const update = <K extends keyof AppUser>(key: K, value: AppUser[K]) => {
    onChange({ ...user, [key]: value });
  };

  const openFilePicker = () => fileInputRef.current?.click();

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setUploadError("Use JPG, PNG, GIF, or WEBP.");
      return;
    }
    if (file.size > AVATAR_MAX_BYTES) {
      setUploadError("Image must be 5 MB or smaller.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setUploadError("");
        update("avatarUrl", reader.result);
      }
    };
    reader.onerror = () => setUploadError("Could not read the image.");
    reader.readAsDataURL(file);
  };

  const removeAvatar = () => {
    setUploadError("");
    update("avatarUrl", "");
  };

  return (
    <Card className="overflow-hidden shadow-sm">
      <div className="border-b bg-muted/30 px-6 py-6">
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_IMAGE_TYPES.join(",")}
          className="hidden"
          onChange={handleAvatarChange}
        />
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <div className="scale-125">
                <AvatarInitials
                  bg={user.avatarColor}
                  initials={user.initials}
                  src={user.avatarUrl}
                  className="h-[42px] w-[42px] rounded-xl"
                />
              </div>
              <Button
                type="button"
                size="icon-sm"
                className="absolute -bottom-1 -right-1 rounded-full border-2 border-background shadow-md"
                aria-label="Change photo"
                onClick={openFilePicker}
              >
                <Camera />
              </Button>
            </div>
            <div>
              <h2 className="text-lg font-extrabold tracking-tight">
                {isCreate && !user.firstName && !user.lastName
                  ? "New user"
                  : `${user.firstName} ${user.lastName}`.trim() || "New user"}
              </h2>
              <p className="text-sm font-medium text-muted-foreground">
                {user.email || "Enter contact details below"}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <RoleBadge role={user.role} />
                <StatusBadge status={user.status} />
                <span className="text-xs font-semibold text-muted-foreground">
                  {user.jobTitle}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={openFilePicker}>
              <Camera />
              Upload photo
            </Button>
            {user.avatarUrl && (
              <Button type="button" variant="ghost" size="sm" onClick={removeAvatar}>
                Remove
              </Button>
            )}
          </div>
        </div>
        {uploadError && (
          <p className="mt-3 text-sm font-semibold text-destructive">{uploadError}</p>
        )}
      </div>

      <CardContent className="p-0">
        <FormSection
          title="Personal information"
          description="Basic contact details for this user."
        >
          <div className="f2">
            <div className="fm">
              <Label>First name</Label>
              <div className="relative">
                <User
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  value={user.firstName}
                  onChange={(e) => update("firstName", e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="fm">
              <Label>Last name</Label>
              <Input
                value={user.lastName}
                onChange={(e) => update("lastName", e.target.value)}
              />
            </div>
          </div>
          <div className="f2">
            <div className="fm">
              <Label>Email address</Label>
              <div className="relative">
                <Mail
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  type="email"
                  value={user.email}
                  onChange={(e) => update("email", e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="fm">
              <Label>Phone number</Label>
              <div className="relative">
                <Phone
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  type="tel"
                  value={user.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </FormSection>

        <FormSection
          title="Work details"
          description="Organization and role information."
        >
          <div className="f2">
            <div className="fm">
              <Label>Company</Label>
              <div className="relative">
                <Building2
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  value={user.company}
                  onChange={(e) => update("company", e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="fm">
              <Label>Job title</Label>
              <div className="relative">
                <Briefcase
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  value={user.jobTitle}
                  onChange={(e) => update("jobTitle", e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
          <div className="fm">
            <Label>Location</Label>
            <div className="relative">
              <MapPin
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                value={user.location}
                onChange={(e) => update("location", e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="fm">
            <Label>Bio</Label>
            <Textarea
              value={user.bio}
              onChange={(e) => update("bio", e.target.value)}
              rows={3}
              placeholder="Short description about this user…"
            />
          </div>
        </FormSection>

        <FormSection
          title="Account settings"
          description="Role and account status."
        >
          <div className="f2">
            <div className="fm">
              <Label>Account status</Label>
              <DropdownSelect
                value={user.status}
                onChange={(status) => update("status", status)}
                options={ACCOUNT_STATUSES.map((s) => ({
                  value: s,
                  label: s,
                }))}
              />
            </div>
            {roleOptions.length > 0 && (
              <div className="fm">
                <Label>Role</Label>
                <DropdownSelect
                  value={user.role}
                  onChange={(role) => update("role", role)}
                  options={roleOptions.map((role) => ({
                    value: role,
                    label: role,
                  }))}
                />
              </div>
            )}
          </div>
        </FormSection>

        {/* <FormSection title="Notifications">
          <div className="divide-y divide-border rounded-lg border">
            {[
              {
                key: "emailNotifications" as const,
                label: "Email notifications",
                desc: "Account activity and security alerts",
              },
              {
                key: "pushNotifications" as const,
                label: "Push notifications",
                desc: "Real-time browser notifications",
              },
              {
                key: "marketingEmails" as const,
                label: "Marketing emails",
                desc: "Product updates and announcements",
              },
            ].map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between gap-4 px-4 py-3.5"
              >
                <div>
                  <div className="text-sm font-bold">{item.label}</div>
                  <div className="text-xs font-medium text-muted-foreground">
                    {item.desc}
                  </div>
                </div>
                <Switch
                  checked={user[item.key]}
                  onChange={() => update(item.key, !user[item.key])}
                />
              </div>
            ))}
          </div>
        </FormSection> */}
      </CardContent>

      <div className="flex flex-wrap items-center justify-end gap-3 border-t bg-muted/20 px-6 py-4">
        {onCancel && (
          <Button type="button" variant="outline" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="button" size="sm" onClick={onSave}>
          <CircleCheck />
          {isCreate ? "Create user" : "Save changes"}
        </Button>
      </div>
    </Card>
  );
}

/** @deprecated Use UserEditForm */
export { UserEditForm as ProfileForm };
