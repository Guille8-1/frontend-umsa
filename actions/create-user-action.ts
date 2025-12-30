"use server";

import {
  CreateUserSchema,
  ErrorResponseSchema,
  SuccessSchema,
} from "@/src/schemas";
import { verifySession } from "@/src/auth/dal";

export type ActionState = {
  errors: string[];
  success: string;
};
export async function createUser(prevState: ActionState, formData: FormData) {
  const { token } = await verifySession();
  const newUser = {
    nombre: formData.get("nombre"),
    apellido: formData.get("apellido"),
    email: formData.get("email"),
    password: formData.get("password"),
    nivel: formData.get("nivelUsuario"),
  };


  const userValidation = CreateUserSchema.safeParse(newUser);
  if (!userValidation.success) {
    const errors = userValidation.error.errors.map((error) => error.message);
    return {
      errors,
      success: "",
    };
  }
  const url = `${process.env.BACK_URL}/users/create-user`;

  const request = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      nombre: userValidation.data.nombre,
      apellido: userValidation.data.apellido,
      email: userValidation.data.email,
      password: userValidation.data.password,
      nivel: userValidation.data.nivel,
    }),
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
