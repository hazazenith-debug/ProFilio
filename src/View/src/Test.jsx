import { zodResolver } from "@hookform/resolvers/zod"
import { FormProvider, useForm } from "react-hook-form"
import z from "zod"

export const Form = () => {



    const schema = z.object({
        name: z.string().min(2, "Name must be at least 2 characters long"),
        email: z.string().email("Invalid email address"),
        password: z.string().min(6, "Password must be at least 6 characters long"),
    })


    const form = useForm({
        resolver: zodResolver(schema),
        mode: "all",
        defaultValues: {
            name: "a",
            email: "a",
            password: "a"
        }
    })


    return <form onSubmit={form.handleSubmit((data) => console.log(data))}>
        <input {...form.register("name")} type="text" placeholder="Name" />
        {form.formState.errors.name && <p style={{ color: "red" }}>{form.formState.errors.name.message}</p>}
        <input {...form.register("email")} type="text" placeholder="Email" />
        {form.formState.errors.email && <p style={{ color: "red" }}>{form.formState.errors.email.message}</p>}
        <input {...form.register("password")} type="text" placeholder="Password" />
        {form.formState.errors.password && <p style={{ color: "red" }}>{form.formState.errors.password.message}</p>}
        <button>Submit</button>

        {form.getFieldState("name").isBlured && <p>name is blured</p>}
    </form>

    return <FormProvider {...form}>
        <Component />
    </FormProvider>





}

const Component = () => {


    const form = useForm()

    return <form onSubmit={form.handleSubmit((data) => console.log(data))}>
        <input {...form.register("name")} type="text" placeholder="Name" />
        {form.formState.errors.name && form.getFieldState("name").isTouched && <p style={{ color: "red" }}>{form.formState.errors.name.message}</p>}
        <input {...form.register("email")} type="text" placeholder="Email" />
        {form.formState.errors.email && <p style={{ color: "red" }}>{form.formState.errors.email.message}</p>}
        <input {...form.register("password")} type="text" placeholder="Password" />
        {form.formState.errors.password && <p style={{ color: "red" }}>{form.formState.errors.password.message}</p>}
        <button>Submit</button>
    </form>
}
