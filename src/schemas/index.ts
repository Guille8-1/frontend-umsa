import { z } from "zod";

export const SuccessSchema = z.string();
export const ErrorResponseSchema = z.string();
export const CreateUserSchema = z.object({
  nombre: z.string().min(3, { message: "El Nombre no es Valido" }),
  apellido: z.string().min(3, { message: "El apellido no es Valido" }),
  email: z
    .string()
    .min(1, { message: "Email Vacio" })
    .email({ message: "Email no Valido" }),
  password: z
    .string()
    .min(5, { message: "Email Debe Tener almenos 5 caracteres" }),
  nivel: z.string(),
});
export const LoginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "E-mail Vacio" })
    .email({ message: "E-mail No Valido" }),
  password: z.string().min(5, { message: "Password No Valido" }),
});
export const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  lastName: z.string(),
  nivel: z.number(),
  admin: z.boolean(),
  accountOwner: z.boolean(),
  changedPw: z.boolean(),
});

export const UserEditSchema = z.object({
  id: z.string(),
  nivel: z.string().min(1, { message: "Nivel no valido" }),
})

export const UserTokenSchema = z.object({
  id: z.number(),
  name: z.string(),
  lastName: z.string(),
  nivel: z.number(),
  admin: z.boolean(),
  accountOwner: z.boolean(),
  changedPw: z.boolean(),
  userToken: z.string(),
});

export const UserSchemaTable = z.object({
  id: z.number(),
  name: z.string(),
  lastName: z.string(),
  admin: z.boolean(),
  nivel: z.number(),
});
export const CreateProjectSchema = z.object({
  titulo: z.string().min(5, { message: "Titulo No Valido" }),
  tipoDocumento: z
    .string()
    .min(1, { message: "Tipo de Documento Obligatorio" }),
  asignadosId: z
    .array(z.string().min(1, { message: "Al menos 1 Asignado es Obligatorio" }))
    .max(4, { message: "Numero de Asignados no Permitido" }),
  estado: z.string().min(1, { message: "Estado no Valido" }),
  tipo: z.string().min(1, { message: "Tipo no Valido" }),
  prioridad: z.string().min(1, { message: "Prioridad no Valida" }),
  citeNumero: z.string().min(1, { message: "El Numero Cite es obligatorio" }),
  rutaCv: z.string().min(1, { message: "El Numero de ruta es obligatorio" }),
  oficinaOrigen: z
    .string()
    .min(6, { message: "Oficina de Origen Obligatorio" }),
});

export const UpdateProjectAssigness = z.object({
  id: z.string(),
  editAssing: z
    .array(z.string().min(1, { message: "Al menos 1 Asignado es Obligatorio" }))
    .max(4, { message: "Numero de Asignados no Permitido" }),
  userId: z.string(),
});

export const UpdateProjectsSchema = z.object({
  id: z.string(),
  estado: z.string().min(1, { message: "Estado no Valido" }),
  avance: z.string().min(1, { message: "Avance requerido" }),
  documento: z.string(),
  prioridad: z.string().min(3, { message: "Prioridad no Valida" }),
  idUser: z.string(),
});

export const UpdateActivityAssignees = z.object({
  id: z.string(),
  editActAssignee: z
    .array(z.string().min(1, { message: "Al menos 1 asignado es Obligatorio" }))
    .max(4, { message: "Numero de Asignados no Permitido" }),
  idEditUser: z
    .array(z.string()),
  userId: z.string(),
});

export const UpdateActivitySchema = z.object({
  id: z.string(),
  estado: z.string().min(1, { message: "Estado no Valido" }),
  avance: z.string().min(1, { message: "Avance Requerido" }),
  prioridad: z.string().min(3, { message: "Prioridad no Valida" }),
  idUser: z.string(),
});

export const ProjectSchemaResponse = z.object({
  id: z.number(),
  titulo: z.string(),
  asignados: z.array(z.string()),
  asignadosId: z.nullable(z.array(z.number())),
  tipoDocumento: z.string(),
  prioridad: z.string(),
  tipoActividad: z.nullable(z.string()),
  citeNumero: z.string(),
  rutaCv: z.string(),
  avance: z.number(),
  diasActivo: z.number(),
  estado: z.string(),
  oficinaOrigen: z.string(),
  fechaAtencion: z.nullable(z.string()),
  actualUsuario: z.nullable(z.string()),
  gestor: z.string(),
  isActive: z.boolean(),
  comentarios: z.array(
    z.object({
      id: z.number(),
      comentario: z.string(),
      author: z.string(),
      createdDate: z.string(),
      updatedDate: z.string(),
    }),
  ),
  user: z.object({
    id: z.number(),
    nombre: z.string(),
    apellido: z.string(),
    email: z.string(),
    nivel: z.number(),
  }),
  createdDate: z.string(),
  updatedDate: z.string(),
});

export const ProjectsFullArray = z.array(ProjectSchemaResponse);

export const UserArray = z.array(UserSchemaTable);

export const GetUsersSchema = z.array(
  z.object({
    id: z.number(),
    nombre: z.string(),
    apellido: z.string(),
    nivel: z.number(),
    admin: z.boolean(),
  }),
);

export const CreateComment = z.object({
  comentario: z
    .string()
    .max(700, { message: "Comentario Demasiado Largo" })
    .min(10, { message: "Comentario Demasiado Corto" }),
  projectId: z.string(),
});

export const Comments = z.array(
  z.object({
    id: z.number(),
    comentario: z.string(),
    author: z.string(),
    createdDate: z.string(),
    updatedDate: z.string(),
  }),
);
export const CommentsActivity = z.array(
  z.object({
    id: z.number(),
    comentario: z.string(),
    author: z.string(),
    createdDate: z.string(),
    updatedDate: z.string(),
  }),
);
export const CreateActivitySchema = z.object({
  tituloActividad: z.string().min(5, { message: "Titulo Demsadio Corto" }),
  categoriaActividad: z.string().min(1, { message: "Categoria Necesaria" }),
  asignadosActividadId: z
    .array(z.string())
    .max(4, { message: "Numero de Asignados no Permitido" }),
  estadoActividad: z.string().min(1, { message: "Estado No Valido" }),
  tipoActividad: z.string().min(1, { message: "Tipo de Actividad No Valida" }),
  oficinaOrigenActividad: z.string().min(1, { message: "Oficina No Valida" }),
  prioridadActividad: z.string().min(1, { message: "Prioridad No Valida" }),
});

export const ActivitySchemaResponse = z.object({
  id: z.number(),
  tituloActividad: z.string(),
  asignadosActividad: z.array(z.string()),
  categoriaActividad: z.string(),
  asignadosActividadId: z.array(z.number()),
  gestorActividad: z.string(),
  estadoActividad: z.string(),
  diasActivoActividad: z.number(),
  avanceActividad: z.number(),
  oficinaOrigenActividad: z.string(),
  prioridadActividad: z.string(),
  isActive: z.boolean(),
  createdDate: z.string(),
  updatedDate: z.string(),
  user: z.object({
    id: z.number(),
    nombre: z.string(),
    apellido: z.string(),
    email: z.string(),
    nivel: z.number(),
  }),
  comentariosActivity: z.array(
    z.object({
      id: z.number(),
      comentario: z.nullable(z.string()),
      author: z.nullable(z.string()),
      createdDate: z.string(),
      updatedDate: z.string(),
    }),
  ),
});

export const ActivityArray = z.array(ActivitySchemaResponse);

export const ReportsSchema = z.object({
  start: z.string(),
  end: z.string(),
  userId: z.string(),
});

export const ChangedPwSchema = z
  .object({
    password: z.string().min(8, { message: "El password es demasiado corto" }),
    repeat_password: z.string(),
  })
  .refine((data) => data.password === data.repeat_password, {
    message: "Los passwords ingresados no coinciden",
    path: ["repeat_password"],
  });

//exported types
export type ActivityArrayType = z.infer<typeof ActivityArray>;
export type ProjectArrayType = z.infer<typeof ProjectsFullArray>;

//project type response
export type ProjectTypes = z.infer<typeof ProjectSchemaResponse>;

//activity type response
export type ActivityTypes = z.infer<typeof ActivitySchemaResponse>;

export type GetUserType = z.infer<typeof GetUsersSchema>;

export type User = z.infer<typeof UserSchema>;

export type UserTable = z.infer<typeof UserSchemaTable>;

export type Comments = z.infer<typeof Comments>;

export type CommentsActivity = z.infer<typeof CommentsActivity>;

export type UserTokenType = z.infer<typeof UserTokenSchema>;
