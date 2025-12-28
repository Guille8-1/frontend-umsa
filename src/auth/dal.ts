import 'server-only'
import { cache } from "react"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { UserSchema } from "../schemas"
import 'dotenv/config'

export const verifySession = cache(async () => {
  const token = (await cookies()).get('SERVICES_TOKEN')?.value;
  if (!token) {
    redirect('/auth/login');
  }
  const url = `${process.env.BACK_URL}/auth/user-token`;

  const request = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const isAuth: boolean = request.ok ? false : true;

  const session = await request.json();
  const result = UserSchema.safeParse(session);
  if (!result.success) {
    redirect('/auth/login');
  };

  return {
    user: result.data,
    isAuth,
    token: token
  };
})
