"use server";

import {
  ErrorResponseSchema,
  SuccessSchema,
  CreateProjectSchema,
} from "@/src/schemas";
import { verifySession } from "@/src/auth/dal";

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
    userId: formData.getAll('ids'),
    estado: formData.get("estado"),
    tipo: formData.get("tipo"),
    prioridad: formData.get("prioridad"),
    citeNumero: formData.get("citeNumero"),
    rutaCv: formData.get("rutaCv"),
    oficinaOrigen: formData.get("oficinaOrigen"),
  };
  const userFormId = newProject.userId[0].toString()

  const idSplitted = userFormId.split(",")
  const prjIds: number[] = []
  for(const id of idSplitted) {
    prjIds.push(+id)
  }
  const projectValidation = CreateProjectSchema.safeParse(newProject);

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
    asignadosId: prjIds,
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
