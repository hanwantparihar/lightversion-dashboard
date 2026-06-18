"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui";
import { PageStack } from "@/components";
import { UserEditForm } from "@/components/users/user-edit-form";
import { useUsers } from "@/contexts/users-context";
import type { AppUser } from "@/lib/users-data";

export default function EditUserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { getUser, updateUser } = useUsers();
  const userId = Number(params.id);
  const sourceUser = getUser(userId);

  const [draft, setDraft] = useState<AppUser | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (sourceUser) setDraft({ ...sourceUser });
  }, [sourceUser]);

  if (!sourceUser || !draft) {
    return (
      <PageStack>
        <div className="rounded-xl border bg-card p-10 text-center">
          <h2 className="mb-2 text-xl font-extrabold">User not found</h2>
          <p className="mb-4 font-semibold text-muted-foreground">
            Open a user from the list to edit their profile.
          </p>
          <Button asChild>
            <Link href="/users">Go to user list</Link>
          </Button>
        </div>
      </PageStack>
    );
  }

  const handleSave = () => {
    updateUser(userId, draft);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
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
        {saved && (
          <span className="text-sm font-semibold text-emerald-600">
            Changes saved
          </span>
        )}
      </div>

      <UserEditForm
        user={draft}
        onChange={setDraft}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </PageStack>
  );
}
