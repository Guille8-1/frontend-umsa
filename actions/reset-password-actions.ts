"use server";

import {
  ChangedPwSchema,
  SuccessSchema,
  ErrorResponseSchema,
} from "@/src/schemas";
import { verifySession } from "@/src/auth/dal";

type ActionState = {
  errors: string[];
  success: string;
};

export async function resetPwAction(prevStat: ActionState, formData: FormData) {
  const { token, user } = await verifySession();
  const passwordForm = {
    password: formData.get("password"),
    repeat_password: formData.get("repeated_password"),
  };
  const { password } = passwordForm;

  const pwValidation = ChangedPwSchema.safeParse(passwordForm);

  if (!pwValidation.success) {
    const errors = pwValidation.error.errors.map((error) => error.message);
    return {
      errors,
      success: "",
    };
  }

  const url = `${process.env.BACK_URL}/admin/update-pw`;

  const request = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      password,
      id: user.id,
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
