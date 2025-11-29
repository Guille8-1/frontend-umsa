"use server";

import {
  ErrorResponseSchema,
  SuccessSchema,
  CreateActivitySchema,
} from "@/src/schemas";
import { verifySession } from "@/src/auth/dal";
import { getUsersById } from "@/src/API/client-fetching-action";

type ActionState = {
  errors: string[];
  success: string;
};
type userIds = {
  id: number;
};

export async function createActivity(
  prevState: ActionState,
  formData: FormData,
) {
  const { user, token } = await verifySession();
  const userFullName: string = `${user.name} ${user.lastName}`;

  const newActivity = {
    tituloActividad: formData.get("tituloAct"),
    categoriaActividad: formData.get("categoriaActividad"),
    asignadosActividadId: formData.getAll("asignadosAct"),
    estadoActividad: formData.get("estadoAct"),
    tipoActividad: formData.get("tipoAct"),
    oficinaOrigenActividad: formData.get("oficinaOrigenAct"),
    prioridadActividad: formData.get("proprodadActividad"),
  };

  const activityValidation = CreateActivitySchema.safeParse(newActivity);

  if (!activityValidation.success) {
    const errors = activityValidation.error.errors.map(
      (error) => error.message,
    );

    return {
      errors,
      success: "",
    };
  }
  
  const userIds: FormDataEntryValue[] = newActivity.asignadosActividadId;
  const callingForIds: userIds[] = await getUsersById(userIds);

  const gettingUserIds = callingForIds.map((forid) => {
    const { id } = forid;
    return id;
  });


  const bodyRequest = {
    user: user.id,
    tituloActividad: activityValidation.data.tituloActividad,
    categoriaActividad: activityValidation.data.categoriaActividad,
    asignadosActividadId: gettingUserIds,
    gestorActividad: userFullName,
    estadoActividad: activityValidation.data.estadoActividad,
    tipoActividad: activityValidation.data.tipoActividad,
    oficinaOrigenActividad: activityValidation.data.oficinaOrigenActividad,
    prioridadActividad: activityValidation.data.prioridadActividad,
  };
  console.log(bodyRequest);
  const url = `${process.env.BACK_URL}/actividades/createactividad`;

  const request = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(bodyRequest),
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
