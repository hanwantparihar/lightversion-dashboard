"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui";
import { PageStack } from "@/components";
import { UserEditForm } from "@/components/users/user-edit-form";
import { useUsers } from "@/contexts/users-context";
import { useRoles } from "@/contexts/roles-context";
import { createEmptyUser, nextUserId } from "@/lib/users-data";
import type { AppUser } from "@/lib/users-data";

export default function CreateUserPage() {
  const router = useRouter();
  const { users, addUser } = useUsers();
  const { roleNames } = useRoles();
  const defaultRole = roleNames[0] ?? "Viewer";

  const initialDraft = useMemo(
    () => createEmptyUser(nextUserId(users), defaultRole),
    [users, defaultRole]
  );

  const [draft, setDraft] = useState<AppUser>(initialDraft);
  const [error, setError] = useState("");

  const handleSave = () => {
    const trimmedEmail = draft.email.trim();
    if (!draft.firstName.trim() || !draft.lastName.trim() || !trimmedEmail) {
      setError("First name, last name, and email are required.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError("Enter a valid email address.");
      return;
    }
    if (
      users.some(
        (u) => u.email.toLowerCase() === trimmedEmail.toLowerCase()
      )
    ) {
      setError("A user with this email already exists.");
      return;
    }

    const { id: _id, ...data } = draft;
    const newId = addUser({ ...data, email: trimmedEmail });
    router.push(`/users/profile/${newId}`);
  };

  const handleCancel = () => router.push("/users");

  return (
    <PageStack>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="ghost" size="sm" asChild className="-ml-2">
          <Link href="/users">
            <ArrowLeft />
            Back to users
          </Link>
        </Button>
      </div>

      {error && (
        <p className="rounded-lg bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive">
          {error}
        </p>
      )}

      <UserEditForm
        user={draft}
        onChange={(user) => {
          setError("");
          setDraft(user);
        }}
        onSave={handleSave}
        onCancel={handleCancel}
        mode="create"
        roleOptions={roleNames}
      />
    </PageStack>
  );
}
