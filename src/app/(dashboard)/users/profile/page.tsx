import { redirect } from "next/navigation";

/** Edit profile is only available for a specific user from the user list. */
export default function UserProfilePage() {
  redirect("/users");
}
