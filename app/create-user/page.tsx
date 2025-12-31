import CreateUserForm from "@/components/create-user/CreateUserForm";
import Link from 'next/link'
export default function CreateUser() {
  return (
    <>

      <h1 className="font-bold text-4xl text-cyan-600">Registro Usuarios</h1>
      <p className="text-3xl font-bold">Seguimiento Administrativo</p>

      <section className="flex flex-row gap-5 text-center mt-5">
        <section className="bg-sky-800 p-3 text-gray-200 rounded w-auto text-lg">
          <Link href='dashboard/projects'>
            Proyectos
          </Link>
        </section>
        <section className="bg-sky-800 p-3 text-gray-200 rounded w-auto text-lg">
          <Link href='dashboard/actividades'>
            Actividades
          </Link>
        </section>
        <section className="bg-sky-800 p-3 text-gray-200 rounded w-auto text-lg">
          <Link href='dashboard/users'>
            Usuarios
          </Link>
        </section>
      </section>
      <CreateUserForm />
    </>
  );
}
