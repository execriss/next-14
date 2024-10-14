import { getUserServerSession } from "@/auth/actions/authActions";
import prisma from "@/lib/prisma";
import { Todo } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";
import * as yup from "yup";

interface Segments {
  params: {
    id: string;
  };
}

const getTodo = async (id: string): Promise<Todo | null> => {
  const user = await getUserServerSession();
  if (!user) {
    return null;
  }
  const todo = await prisma.todo.findFirst({ where: { id } });

  if (todo?.userId !== user.id) {
    return null;
  }

  return todo;
};

// GET
export async function GET(request: Request, segments: Segments) {
  // Usamos segment para encontrar el parametro ID de la query
  const { params } = segments;

  const todo = await getTodo(params.id);

  return NextResponse.json(todo);
}

// Validaciones del PUT
const putSchema = yup.object({
  complete: yup.boolean().optional(),
  description: yup.string().optional(),
});

// PUT
export async function PUT(request: Request, segments: Segments) {
  const { params } = segments;

  const todo = await getTodo(params.id);

  try {
    const body = await putSchema.validate(await request.json());
    const { description, complete } = body;

    const updateTodo = await prisma.todo.update({
      where: { id: params.id },
      data: { description, complete },
    });

    return NextResponse.json(updateTodo);
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 400 });
  }
}
