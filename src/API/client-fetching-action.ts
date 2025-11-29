"use server";

import {
  GetUsersSchema,
  UserArray,
  ProjectsFullArray,
  ActivityArray,
} from "@/src/schemas";
import "dotenv/config";
import { verifySession } from "@/src/auth/dal";

export async function getDataUser() {
  const { token } = await verifySession();

  const url: string = `${process.env.BACK_URL}/users/assigned`;
  const request = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const json = await request.json();
  return GetUsersSchema.parse(json);
}

export async function getAllUsers() {
  const { token } = await verifySession();
  const url: string = `${process.env.BACK_URL}/users/active/users`;
  const request = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const json = await request.json();
  return UserArray.parse(json);
}

export async function getUsersById(userIds: FormDataEntryValue[]) {
  const { token } = await verifySession();
  const url: string = `${process.env.BACK_URL}/users/ids`;

  const bodyRequest = {
    ids: userIds,
  };
  const request = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(bodyRequest),
  });

  return await request.json();
}

export async function getProjects(id: number) {
  const { token } = await verifySession();
  const url: string = `${process.env.BACK_URL}/projects/user/${id}`;
  const request = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const json = await request.json();
  return ProjectsFullArray.parse(json);
}


export async function getCommentById(id: number) {
  const { token } = await verifySession();
  const url: string = `${process.env.BACK_URL}/projects/comment/project/${id}`;
  const request = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await request.json();
}

export async function getActivityUsers(userId: number) {
  const { token } = await verifySession();
  const url: string = `${process.env.BACK_URL}/actividades/assigned/${userId}`;
  const request = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const json = await request.json();
  return ActivityArray.parse(json);
}
