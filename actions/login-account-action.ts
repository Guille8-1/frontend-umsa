"use server"

import 'dotenv/config'
import { ErrorResponseSchema, LoginSchema } from "@/src/schemas"
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
type ActionState = {
  errors: string[],
  success: string
}

export async function login(prevState: ActionState, formData: FormData) {
  const loginData = {
    email: formData.get('email'),
    password: formData.get('password')
  }

  const login = LoginSchema.safeParse(loginData)

  if (!login.success) {
    const errors = login.error.errors.map(error => error.message)
    return {
      errors,
      success: ''
    }
  }

  const url = `${process.env.BACK_URL}/auth/login-user`

  const request = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: login.data.email,
      password: login.data.password
    })
  })
  const json = await request.json()


  if (!request.ok) {
    const error = ErrorResponseSchema.parse(json)
    return {
      errors: [error],
      success: ''
    }
  } else {
    (await cookies()).set({
      name: 'SERVICES_TOKEN',
      value: json,
      httpOnly: true,
      path: '/'
    });
    return {
      errors: [],
      success: 'success'
    }
  }


  //redirect('/dashboard')
}
