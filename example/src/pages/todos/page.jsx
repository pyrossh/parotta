import React, { Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery, useMutation } from "edge-city";
import { useForm } from 'react-hook-form';
import Layout from '@/components/Layout/Layout';
import Todo from "@/components/Todo/Todo";
import { TextField, Label, Input } from 'react-aria-components';
import { Button } from 'react-aria-components';
import { getTodos, createTodo } from "@/services/todos.service";
import "./page.css";

const Page = () => {
  return (
    <Layout>
      <h1>Todos</h1>
      <Helmet>
        <title>Todos Page</title>
      </Helmet>
      <div>
        <Suspense fallback="Loading...">
          <TodoList />
        </Suspense>
      </div>
    </Layout>
  )
}

export default Page;

const TodoList = () => {
  const { data, refetch } = useQuery("todos", () => getTodos());
  const { mutate, isMutating, err } = useMutation(async ({ text }) => {
    await createTodo({
      text,
      completed: false,
    })
    await refetch();
  });
  const { register, handleSubmit, formState: { errors } } = useForm();
  // useEffect(() => {
  //   setTimeout(() => {
  //     refetch();
  //   }, 3000)
  // }, [])
  return (
    <div>
      <ul>
        {data.map((item) => (
          <Todo key={item.id} todo={item} />
        ))}
      </ul>
      <form onSubmit={handleSubmit(mutate)}>
        <TextField isRequired isReadOnly={isMutating}>
          <Label>Text (required)</Label>
          <Input {...register('text')} />
          {err?.text && <p>{err.text._errors[0]}</p>}
        </TextField>
        <Button type="submit" isDisabled={isMutating}>Add Todo</Button>
        {isMutating && <div>
          <p>Creating...</p>
        </div>}
      </form>
    </div>
  )
}