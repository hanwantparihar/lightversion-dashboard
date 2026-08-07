"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Formik } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui";
import { PageStack } from "@/components";
import { UserEditForm } from "@/components/users/user-edit-form";
import { useUsers } from "@/contexts/users-context";
import { useRoles } from "@/contexts/roles-context";
import { createEmptyUser, nextUserId } from "@/lib/users-data";
import type { AppUser } from "@/lib/users-data";

const createUserValidationSchema = (users: AppUser[]) => Yup.object().shape({
  firstName: Yup.string()
    .trim()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters"),
  lastName: Yup.string()
    .trim()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters"),
  email: Yup.string()
    .trim()
    .required("Email is required")
    .email("Enter a valid email address")
    .test("unique-email", "A user with this email already exists", function (value) {
      if (!value) return true;
      return !users.some(
        (u) => u.email.toLowerCase() === value.toLowerCase()
      );
    }),
  phone: Yup.string()
    .trim()
    .matches(
      /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/,
      "Enter a valid phone number"
    )
    .optional(),
  company: Yup.string().trim().optional(),
  jobTitle: Yup.string().trim().optional(),
  location: Yup.string().trim().optional(),
  bio: Yup.string().trim().max(500, "Bio must be less than 500 characters").optional(),
});

export default function CreateUserPage() {
  const router = useRouter();
  const { users, addUser } = useUsers();
  const { roleNames } = useRoles();
  const defaultRole = roleNames[0] ?? "Viewer";

  const initialDraft = useMemo(
    () => createEmptyUser(nextUserId(users), defaultRole),
    [users, defaultRole]
  );

  const validationSchema = useMemo(
    () => createUserValidationSchema(users),
    [users]
  );

  const handleCancel = () => router.push("/users");

  return (
    <Formik
      initialValues={initialDraft}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        const { id: _id, ...data } = values;
        addUser({
          ...data,
          email: values.email.trim(),
          firstName: values.firstName.trim(),
          lastName: values.lastName.trim(),
        });
        router.push("/users");
      }}
    >
      {({ values, errors, touched, setFieldValue, setFieldTouched, handleSubmit, validateForm }) => {
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

            <UserEditForm
              user={values}
              onChange={(user) => {
                Object.keys(user).forEach((key) => {
                  const typedKey = key as keyof AppUser;
                  setFieldValue(typedKey, user[typedKey]);
                  setFieldTouched(typedKey, true, false);
                });
              }}
              onSave={async () => {
                // Mark all fields as touched to show validation errors
                const fieldKeys = Object.keys(values) as Array<keyof AppUser>;
                fieldKeys.forEach((key) => {
                  setFieldTouched(key, true, false);
                });

                const validationErrors = await validateForm();
                if (Object.keys(validationErrors).length === 0) {
                  handleSubmit();
                }
              }}
              onCancel={handleCancel}
              mode="create"
              roleOptions={roleNames}
              errors={errors}
              touched={touched}
            />
          </PageStack>
        );
      }}
    </Formik>
  );
}
