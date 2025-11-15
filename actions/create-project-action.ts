"use server";

import {
  ErrorResponseSchema,
  SuccessSchema,
  CreateProjectSchema,
} from "@/src/schemas";
import { verifySession } from "@/src/auth/dal";
import { getUsersById } from "@/src/API/client-fetching-action";

export type ActionState = {
  errors: string[];
  success: string;
};
export type userIds = {
  id: number;
};

export async function createProject(
  prevState: ActionState,
  formData: FormData,
) {
  const { user, token } = await verifySession();

  const userFullName: string = `${user.name} ${user.lastName}`;

  const newProject = {
    titulo: formData.get("titulo"),
    tipoDocumento: formData.get("tipoDocumento"),
    asignadosId: formData.getAll("asignados"),
    estado: formData.get("estado"),
    tipo: formData.get("tipo"),
    prioridad: formData.get("prioridad"),
    citeNumero: formData.get("citeNumero"),
    rutaCv: formData.get("rutaCv"),
    oficinaOrigen: formData.get("oficinaOrigen"),
  };

  const projectValidation = CreateProjectSchema.safeParse(newProject);

  const userIds: FormDataEntryValue[] = newProject.asignadosId;
  const callingForIds: userIds[] = await getUsersById(userIds);
  console.log(callingForIds);
  const gettingUserIds = callingForIds.map((forid) => {
    const { id } = forid;
    return id;
  });

  if (!projectValidation.success) {
    const errors = projectValidation.error.errors.map((error) => error.message);

    return {
      errors,
      success: "",
    };
  }
  const bodyRequest = {
    user: user.id,
    titulo: projectValidation.data.titulo,
    tipoDocumento: projectValidation.data.tipoDocumento,
    asignadosId: gettingUserIds,
    gestor: userFullName,
    estado: projectValidation.data.estado,
    tipo: projectValidation.data.tipo,
    prioridad: projectValidation.data.prioridad,
    citeNumero: projectValidation.data.citeNumero,
    rutaCv: projectValidation.data.rutaCv,
    avance: "10",
    diasActivo: "0",
    oficinaOrigen: projectValidation.data.oficinaOrigen,
  };

  const url = `${process.env.BACK_URL}/projects/create`;
  console.log(bodyRequest);

  const request = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
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
