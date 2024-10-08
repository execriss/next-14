'use server';

import prisma from "@/lib/prisma";
import { Todo } from "@prisma/client";
import { revalidatePath } from "next/cache";


export const toggleTodo = async (id: string, complete: boolean): Promise<Todo> => {
    const todo = await prisma.todo.findFirst({ where: { id: id } })
    if (!todo) {
        throw `Todo con el ID: ${id} no encontrado.`
    }

    const updatedTodo = await prisma.todo.update({
        where: { id: id },
        data: {
            complete: complete
        }
    })
    revalidatePath('/dashboard/server-todos')
    return updatedTodo;
}

export const addTodo = async (description: string): Promise<Todo | { message: string }> => {
    try {
        const newTodo = await prisma.todo.create({
            data: { description: description },
        });
        revalidatePath('/dashboard/server-todos')

        return newTodo
    } catch (error) {
        return {
            message: "Error al crear un todo"
        };
    }
}

export const deletedCompleted = async (): Promise<void> => {
    try {
        await prisma.todo.deleteMany({ where: { complete: true } })
        revalidatePath('/dashboard/server-todos')
    } catch (error) {
        throw 'Error al eliminar todos completados'
    }
}