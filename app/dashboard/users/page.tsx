import UsersComponent from "@/components/usuarios/UsuariosComponent"
import { verifySession } from "@/src/auth/dal"
import 'dotenv/config'

export default async function Users() {
    const { token } = await verifySession();
    const secret: string = process.env.BACK_URL ?? '';

    return (
        <>
            <UsersComponent
                secret={secret}
                token={token}
             />
        </>
    )
}