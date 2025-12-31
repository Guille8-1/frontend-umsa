"use server";

import { ErrorResponseSchema, SuccessSchema, UserEditSchema } from "@/src/schemas";
import { ActionState } from "./create-activity-action";
import { verifySession } from '@/src/auth/dal'

export async function editUser(prevState: ActionState, formData: FormData) {
  const { token } = await verifySession();
  const editDataUser = {
    id: formData.get("id"),
    nivel: formData.get("nivel"),
  }
  const userEditValidation = UserEditSchema.safeParse(editDataUser);

  if (!userEditValidation.success) {
    const errors = userEditValidation.error.errors.map(error => error.message)
    return {
      errors,
      success: ''
    }
  }
  const { id, nivel } = userEditValidation.data
  const url: string = `${process.env.BACK_URL}/users/edit/${id}/${nivel}`
  const request = await fetch(url, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`
    },
  });

  const userEditRes = await request.json();

  if (!request.ok) {
    const error = ErrorResponseSchema.parse(userEditRes);
    return {
      errors: [error],
      success: "",
    };
  } else {
    const success = SuccessSchema.parse(userEditRes);
    return {
      errors: [],
      success,
    };
  }
}
