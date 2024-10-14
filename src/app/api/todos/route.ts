import { getUserServerSession } from "@/auth/actions/authActions";
import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import * as yup from "yup";

export async function GET(request: Request) {
  // Obtener los parametros de busqueda
  const { searchParams } = new URL(request.url);
  const take = Number(searchParams.get("take") ?? "10");
  const skip = Number(searchParams.get("skip") ?? "0");

  // verifica que sea numero
  if (isNaN(take)) {
    return NextResponse.json(
      {
        message: "Take tiene que ser un numero",
      },
      { status: 400 }
    );
  }
  if (isNaN(skip)) {
    return NextResponse.json(
      {
        message: "Skip tiene que ser un numero",
      },
      { status: 400 }
    );
  }

  const todos = await prisma.todo.findMany({
    take: take,
    skip: skip,
  });

  return NextResponse.json(todos);
}

// Crear el esquema de validación
const postSchema = yup.object({
  description: yup.string().required("La descripción es requerida"),
  complete: yup.boolean().optional().default(false),
});

export async function POST(request: Request) {
  const user = await getUserServerSession();
  if (!user) {
    return NextResponse.json('No autorizado', { status: 401 })
  }

  try {
    // Usar el esquema de validacion
    const { description, complete } = await postSchema.validate(
      await request.json()
    );
    const newTodo = await prisma.todo.create({
      data: {
        complete,
        description,
        userId: user.id
      },
    });

    return NextResponse.json(newTodo);
  } catch (error) {
    return NextResponse.json(error, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const user = await getUserServerSession();
  if (!user) {
    return NextResponse.json('No autorizado', { status: 401 })
  }

  try {
    const deletedTodos = await prisma.todo.deleteMany({ where: { complete: true, userId: user.id } });

    return NextResponse.json({ message: 'Tareas completadas eliminadas', deletedTodos });
  } catch (error) {
    return NextResponse.json(error, { status: 400 });
  }
}
