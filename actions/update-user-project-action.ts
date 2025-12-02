"use server"

import { verifySession } from "@/src/auth/dal";
import { ActionState, userIds } from "./create-project-action";
import { ErrorResponseSchema, SuccessSchema, UpdateProjectAssigness } from "@/src/schemas";

export async function updateAssigned(prevState: ActionState, formData: FormData) {
  const { token } = await verifySession();

  const editAssignees = {
    id: formData.get('idProject'),
    editAssing: formData.getAll('usersEdit'),
    idEditUser: formData.getAll('editUserId'),
    userId: formData.get('userId')
  }
  const userFormId = editAssignees.idEditUser[0].toString()

  const idSplitted = userFormId.split(",")
  const prjIds: number[] = []
  for (const id of idSplitted) {
    prjIds.push(+id)
  }
  const usersEditValid = UpdateProjectAssigness.safeParse(editAssignees)

  if (!usersEditValid.success) {
    const errors = usersEditValid.error.errors.map(error => error.message)
    return {
      errors,
      success: ''
    }
  }

  const assigneeRequest = {
    projectId: editAssignees.id,
    asignadosId: prjIds,
    userId: editAssignees.userId
  }

  console.log(assigneeRequest)

  const url = `${process.env.BACK_URL}/projects/updateusers/`


  const request = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(assigneeRequest)
  })

  const json = await request.json()

  if (!request.ok) {
    const error = ErrorResponseSchema.parse(json)
    return {
      errors: [error],
      success: ''
    }
  } else {
    const success = SuccessSchema.parse(json)
    return {
      errors: [],
      success
    }
  }

}
