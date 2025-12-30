"use server";

import { ErrorResponseSchema, SuccessSchema } from "@/src/schemas";
import { ActionState } from "./create-activity-action";
import { verifySession } from '@/src/auth/dal'

export async function deleteUser(prevState: ActionState, formData: FormData) {
  const { token } = await verifySession();

  const idUser = formData.get("id");
  const url: string = `${process.env.BACK_URL}/users/delete/${idUser}`
  console.log(url);
  const request = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    },
  });
  const deletionRes = await request.json();


  if (!request.ok) {
    const error = ErrorResponseSchema.parse(deletionRes);

    return {
      errors: [error],
      success: "",
    };
  } else {
    const success = SuccessSchema.parse(deletionRes);
    return {
      errors: [],
      success,
    };
  }
}
