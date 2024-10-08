import { Todo } from "@prisma/client";

export const updateTodo = async (id: string, complete: boolean): Promise<Todo> => {
    const body = { complete: complete };
    const dbTodo = await fetch(`/api/todos/${id}`, {
        method: "PUT",
        body: JSON.stringify(body),
        headers: {
            "content-type": "application/json",
        },
    }).then((res) => res.json());

    return dbTodo;
};

export const createTodo = async (description: string): Promise<Todo> => {
    const body = { description: description };
    const dbNewTodo = await fetch(`/api/todos`, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            "content-type": "application/json",
        },
    }).then((res) => res.json());

    return dbNewTodo;
};

export const deletedTodosComplete = async (): Promise<void> => {
    await fetch(`/api/todos`, {
        method: "DELETE",
        headers: {
            "content-type": "application/json",
        },
    }).then((res) => res.json());
};
