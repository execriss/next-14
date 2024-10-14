import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs"
import { getServerSession } from "next-auth";


// TODAS ESTAS ACCIONES SON DE TIPO SERVER ACTIONS
export const getUserServerSession = async () => {
    const session = await getServerSession(authOptions);

    return session?.user;
}

export const signInEmailPassword = async (email: string, password: string) => {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!email || !password) return null;

    // Si no hay user lo crea
    if (!user) {
        const dbUser = await createUser(email, password);
        return dbUser;
    }

    // Si no hace match return null
    if (!bcrypt.compareSync(password, user.password ?? '***')) {

    }

    return user;


}

const createUser = async (email: string, password: string) => {
    const user = await prisma.user.create({
        data: {
            email: email,
            password: bcrypt.hashSync(password),
            name: email.split('@')[0],
        }
    })

    return user;
}