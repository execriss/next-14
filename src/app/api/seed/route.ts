import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import bcrypt from 'bcryptjs';

export async function GET(request: Request) {
  // Blanquea toda la base de datos
  await prisma.todo.deleteMany();
  await prisma.user.deleteMany();

  // Crear usuario inicial
  const user = await prisma.user.create({
    data: {
      email: 'test1@gmail.com',
      name: 'test 1',
      password: bcrypt.hashSync('123456'),
      roles: ['admin', 'client', 'super-user'],
      todos: {
        create: [
          { description: "Priedra del alma", complete: true },
          { description: "Priedra del poder" },
          { description: "Priedra del tiempo" },
          { description: "Priedra del espacio" },
          { description: "Priedra del realidad" },
          { description: "Priedra del colores" },
          { description: "Priedra del viento" },
          { description: "Priedra del agua" },
        ]
      }
    }
  })

  return NextResponse.json(user);

  // Crear muchos todos
  // await prisma.todo.createMany({
  //   data: [
  //     { description: "Priedra del alma", complete: true },
  //     { description: "Priedra del poder" },
  //     { description: "Priedra del tiempo" },
  //     { description: "Priedra del espacio" },
  //     { description: "Priedra del realidad" },
  //     { description: "Priedra del colores" },
  //     { description: "Priedra del viento" },
  //     { description: "Priedra del agua" },
  //   ],
  // });




  // Crear un nuevo todo (individual)
  //   const todo = await prisma.todo.create({
  //     data: {
  //       description: "Piedra del alma",
  //       complete: true,
  //     },
  //   });

  return NextResponse.json({ message: "Seed Executed" });
}
