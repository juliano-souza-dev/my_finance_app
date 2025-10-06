"use client";
import { useRequireAuth } from "@/hooks/useRequireAuth"; // 👈 Importa o hook de proteção

import { EntryFormData, EntryFormSchema } from "@/schemas/entrySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

const TYPE_OPTIONS = ["Entrada", "Saída"];
const STATUS_OPTIONS = ["Pago", "Pendente"];
const CATEGORY_OPTIONS = [
  "Alimentação",
  "Moradia",
  "Transporte",
  "Salário",
  "Outro",
];

export function EntryForm() {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EntryFormData>({
    resolver: zodResolver(EntryFormSchema),
    defaultValues: {
      type: "Saída",
      status: "Pendente",
    },
  });
  const onSubmit = async (data: EntryFormData) => {
    alert("ok");
    setMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/entries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        setMessage("✅ Registro enviado com sucesso para o Google Sheets!");
        reset();
      } else {
        const errorData = await response.json();
        setMessage(
          `❌ Erro ao enviar: ${errorData.message || "Falha na conexão."}`
        );
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      setMessage("❌ Ocorreu um erro inesperado. Verifique a conexão.");
    } finally {
      setIsSubmitting(false);
    }
  };
  const isAuthenticated = useRequireAuth();

  // 2. Se não estiver autenticado (e o redirecionamento ainda não aconteceu),
  // mostra um estado de carregamento ou nulo.
  if (!isAuthenticated) {
    return (
      <div className="text-center p-10">Carregando ou Redirecionando...</div>
    );
  }
  return (
    <div className="max-w-xl mx-auto my-10 p-6 bg-white shadow-xl rounded-lg border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
        Novo Lançamento Financeiro
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Campo DATA e VALOR em linha (Responsivo) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 1. Campo DATA */}
          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Data:
            </label>
            <input
              type="date"
              id="date"
              {...register("date")}
              className={`w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                errors.date ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.date && (
              <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
            )}
          </div>

          {/* 2. Campo VALOR */}
          <div>
            <label
              htmlFor="value"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Valor:
            </label>
            <input
              type="number"
              step="0.01"
              id="value"
              {...register("value", { valueAsNumber: true })}
              className={`w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                errors.value ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.value && (
              <p className="mt-1 text-sm text-red-600">
                {errors.value.message}
              </p>
            )}
          </div>
        </div>

        {/* 3. Campo DESCRIÇÃO */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Descrição:
          </label>
          <input
            type="text"
            id="description"
            {...register("description")}
            className={`w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
              errors.description ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* 4. Campo CATEGORIA */}
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Categoria:
          </label>
          <select
            id="category"
            {...register("category")}
            className={`w-full p-2 border rounded-md shadow-sm bg-white focus:ring-blue-500 focus:border-blue-500 ${
              errors.category ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Selecione a Categoria</option>
            {CATEGORY_OPTIONS.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">
              {errors.category.message}
            </p>
          )}
        </div>

        {/* 5 & 6. TIPO e STATUS (Em linha) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* TIPO */}
          <fieldset>
            <legend className="block text-sm font-medium text-gray-700 mb-2">
              Tipo:
            </legend>
            <div className="flex space-x-4">
              {TYPE_OPTIONS.map((opt) => (
                <label
                  key={opt}
                  className="inline-flex items-center text-gray-700"
                >
                  <input
                    type="radio"
                    value={opt}
                    {...register("type")}
                    className="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-2 capitalize">{opt}</span>
                </label>
              ))}
            </div>
            {errors.type && (
              <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
            )}
          </fieldset>

          {/* STATUS */}
          <fieldset>
            <legend className="block text-sm font-medium text-gray-700 mb-2">
              Status:
            </legend>
            <div className="flex space-x-4">
              {STATUS_OPTIONS.map((opt) => (
                <label
                  key={opt}
                  className="inline-flex items-center text-gray-700"
                >
                  <input
                    type="radio"
                    value={opt}
                    {...register("status")}
                    className="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-2 capitalize">{opt}</span>
                </label>
              ))}
            </div>
            {errors.status && (
              <p className="mt-1 text-sm text-red-600">
                {errors.status.message}
              </p>
            )}
          </fieldset>
        </div>

        {/* Botão de Envio */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 px-4 rounded-lg text-white font-semibold transition duration-150 ${
            isSubmitting
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
          }`}
        >
          {isSubmitting ? "Enviando Registro..." : "Registrar Lançamento"}
        </button>

        {/* Mensagem de Feedback */}
        {message && (
          <p
            className={`p-3 rounded-lg text-center font-medium ${
              message.startsWith("✅")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
