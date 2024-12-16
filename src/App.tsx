import {
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
} from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  test: z.array(
    z.object({
      id: z.string(),
      name: z.string().nonempty("Name is required"),
      age: z.number().min(10, "Age must be at least 10"),
      checked: z.boolean(),
      description: z.string(),
    })
  ),
});

type FormValues = z.infer<typeof schema>;

function App() {
  const mockArr = [
    { id: "abc", name: "test", age: 12, checked: false, description: "" },
    { id: "def", name: "test2", age: 13, checked: false, description: "" },
    { id: "ghi", name: "test3", age: 14, checked: false, description: "" },
    { id: "jkl", name: "test4", age: 15, checked: false, description: "" },
  ];

  const form = useForm<FormValues>({
    defaultValues: {
      test: mockArr,
    },
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "test",
    keyName: "id",
  });

  return (
    <FormProvider {...form}>
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
        onSubmit={form.handleSubmit((data) => {
          console.log(data);
        })}
      >
        <h1>Is this hard? Bro?</h1>
        <div
          style={{
            display: "flex",
            width: "100%",
            gap: "1rem",
            justifyContent: "center",
          }}
        >
          <ol style={{ margin: 0, padding: 0 }}>
            {fields.map((field, index) => (
              <li
                key={field.id}
                style={{
                  marginTop: "1rem",
                  gap: ".25rem",
                  flexDirection: "column",
                  display: "flex",
                }}
              >
                <label>
                  <Checkbox index={index} /> Enable Description
                </label>
                <Name index={index} />
                <Age index={index} />
                <Description index={index} />
              </li>
            ))}
          </ol>
          <code
            style={{
              marginTop: "1rem",
              marginBottom: "1rem",
              width: "100%",
              maxWidth: "400px",
              display: "flex",
              justifyContent: "space-between",
              border: "1px solid black",
              padding: "1rem",
              borderRadius: "5px",
              textWrap: "wrap",
              wordBreak: "break-all",
              whiteSpace: "pre-wrap",
            }}
          >
            {JSON.stringify(form.watch("test"), null, 2)}
          </code>
        </div>
        <button type="submit">Submit</button>
      </form>
    </FormProvider>
  );
}

function Name({ index }: { index: number }) {
  const {
    register,
    formState: { errors },
  } = useFormContext<FormValues>();

  const error = errors?.test?.[index]?.name;

  return (
    <div>
      <input {...register(`test.${index}.name`)} />
      {error && <p style={{ color: "red" }}>{error.message}</p>}
    </div>
  );
}

function Age({ index }: { index: number }) {
  const {
    register,
    formState: { errors },
  } = useFormContext<FormValues>();
  const error = errors?.test?.[index]?.age;

  return (
    <div>
      <input {...register(`test.${index}.age`, { valueAsNumber: true })} />
      {error && <p style={{ color: "red" }}>{error.message}</p>}
    </div>
  );
}

function Description({ index }: { index: number }) {
  const { register, watch } = useFormContext<FormValues>();
  const isEnabled = watch(`test.${index}.checked`);
  return isEnabled ? (
    <textarea {...register(`test.${index}.description`)} />
  ) : null;
}

function Checkbox({ index }: { index: number }) {
  const { register } = useFormContext<FormValues>();
  return <input type="checkbox" {...register(`test.${index}.checked`)} />;
}

export default App;
