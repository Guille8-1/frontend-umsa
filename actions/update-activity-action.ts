"use server";

import {
  ErrorResponseSchema,
  SuccessSchema,
  UpdateActivitySchema,
} from "@/src/schemas";
import { verifySession } from "@/src/auth/dal";
import { type ActionState } from "@/actions/create-activity-action";

export async function updateActivity(
  prevState: ActionState,
  formData: FormData,
) {
  const { token } = await verifySession();

  const editActivity = {
    id: formData.get("idActivity"),
    estado: formData.get("estadoActEdit"),
    avance: formData.get("avanceActEdit"),
    prioridad: formData.get("prioridadAct"),
    idUser: formData.get("idUser"),
  };

  const editActivityValidation = UpdateActivitySchema.safeParse(editActivity);

  if (!editActivityValidation.success) {
    const errors = editActivityValidation.error.errors.map(
      (error) => error.message,
    );
    return {
      errors,
      success: "",
    };
  }
  const activityEditRequest = {
    activityId: editActivityValidation.data.id,
    estadoAct: editActivityValidation.data.estado,
    avanceAct: editActivityValidation.data.avance,
    prioridadAct: editActivityValidation.data.prioridad,
    idUser: editActivityValidation.data.idUser,
  };

  console.log(activityEditRequest);

  const url = `${process.env.BACK_URL}/actividades/update`;

  const request = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(activityEditRequest),
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
