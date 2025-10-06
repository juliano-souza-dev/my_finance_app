import { z } from "zod";

export const EntryFormSchema = z.object({
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Data inválida (use formato ISO ou algo parseável pelo Date)",
  }),
  description: z.string().min(1, "Descrição não pode ser vazia"),
  category: z.string().min(1, "Categoria é obrigatória"),
  value: z.number().positive("Valor deve ser positivo"),
  type: z.enum(["Entrada", "Saída"], {
    message: "Tipo deve ser 'Entrada' ou 'Saída'",
  }),
  status: z.enum(["Pago", "Pendente"], {
    message: "Tipo deve ser 'Pago' ou 'Pendente'",
  }),
});
export type EntryFormData = z.infer<typeof EntryFormSchema>;
