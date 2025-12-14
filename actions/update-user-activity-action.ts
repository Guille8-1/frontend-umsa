"use server";

import { verifySession } from "@/src/auth/dal";
import { ActionState } from "./create-activity-action";
import {
  UpdateActivityAssignees,
  SuccessSchema,
  ErrorResponseSchema,
} from "@/src/schemas";
import { numericIds } from "./action-helpers/numericIDs";

export async function updateActivityAssigned(
  prevState: ActionState,
  formData: FormData,
) {
  const { token } = await verifySession();

  const editActAssignees = {
    id: formData.get("idActivity"),
    editActAssignee: formData.getAll("userActEdit"),
    idEditUser: formData.getAll("userActEditId"),
    userId: formData.get("userActId"),
  };
  const actIds = numericIds(editActAssignees.idEditUser);

  const userActEditValid = UpdateActivityAssignees.safeParse(editActAssignees);

  if (!userActEditValid.success) {
    const errors = userActEditValid.error.errors.map((error) => error.message);
    return {
      errors,
      success: "",
    };
  }

  const updateActUserRequest = {
    activityId: editActAssignees.id,
    actAssId: actIds,
    userIds: editActAssignees.userId,
  };

  const url = `${process.env.BACK_URL}/actividades/update/users`;

  const request = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updateActUserRequest),
  });

  const json = await request.json();

  if (!request.ok) {
    const error = ErrorResponseSchema.parse(json);
    return {
      errors: [error],
      success: "",
    };
  } else {
    const success = SuccessSchema.parse(json);
    return {
      errors: [],
      success,
    };
  }
}
