// "use client";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import prisma from "@/lib/prisma";
import { NewTodo, TodosGrid } from "@/todos/components";

// import { useEffect } from "react";

export const metadata = {
  title: "Listado de tareas",
  description: "SEO Title",
};

export default async function RestTodosPage() {
  //   useEffect(() => {
  //     fetch("/api/todos")
  //       .then((resp) => resp.json())
  //       .then(console.log);
  //   }, []);

  const todos = await prisma.todo.findMany({ orderBy: { description: "asc" } });

  return (
    <div>
      <span className="text-3xl">API Rest</span>

      <div className="w-full px-5 mx-5 my-5">
        <NewTodo />
      </div>
      {/* TODO - Formulario para agregar nuevos Todos */}
      <TodosGrid todos={todos} />
    </div>
  );
}
