"use client";

import { useRequireAuth } from "@/hooks/useRequireAuth";
import { EntryFormData, EntryFormSchema } from "@/schemas/entrySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import styles from './entryform.module.css';

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

  if (!isAuthenticated) {
    return (
      <div className={styles.loadingState}>Carregando ou Redirecionando...</div>
    );
  }
  return (
    <div className={styles.formPageContainer}>
      <h2 className={styles.formTitle}>
        Adicionar movimentação
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className={`${styles.formCard} ${styles.formLayout}`}>
       
        <div className={styles.formRowGroup}>
          
          <div className={styles.formGroup}>
            <label
              htmlFor="date"
              className={styles.inputLabel}
            >
              Data:
            </label>
            <input
              type="date"
              id="date"
              {...register("date")}
              className={`${styles.textInput} ${errors.date ? styles.inputError : ""}`}
            />
            {errors.date && (
              <p className={styles.errorMessage}>{errors.date.message}</p>
            )}
          </div>

        <div className={styles.formGroup}>
            <label
              htmlFor="description"
              className={styles.inputLabel}
            >
              descrição:
            </label>
            <input
              type="text"
              id="description"
              {...register("description")}
              className={`${styles.textInput} ${errors.date ? styles.inputError : ""}`}
            />
            {errors.date && (
              <p className={styles.errorMessage}>{errors.date.message}</p>
            )}
          </div>
          <div className={styles.formGroup}>
            <label
              htmlFor="value"
              className={styles.inputLabel}
            >
              Valor:
            </label>
            <input
              type="number"
              step="0.01"
              id="value"
              {...register("value", { valueAsNumber: true })}
              className={`${styles.textInput} ${errors.value ? styles.inputError : ""}`}
            />
            {errors.value && (
              <p className={styles.errorMessage}>
                {errors.value.message}
              </p>
            )}
          </div>
        </div>

        

        
        <div className={styles.formGroup}>
          <label
            htmlFor="category"
            className={styles.inputLabel}
          >
            Categoria:
          </label>
          <select
            id="category"
            {...register("category")}
            className={`${styles.textInput} ${errors.category ? styles.inputError : ""}`}
          >
            <option value="">Selecione a Categoria</option>
            {CATEGORY_OPTIONS.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className={styles.errorMessage}>
              {errors.category.message}
            </p>
          )}
        </div>

     
        <div className={`${styles.formRowGroup} ${styles.radioCheckGroup} ${styles.categoryRadio}`}>
          {/* TIPO */}
          <fieldset className={styles.radioFieldset}>
            <legend className={styles.inputLabel}>
              Tipo:
            </legend>
            <div className={styles.radioOptionsContainer}>
              {TYPE_OPTIONS.map((opt) => (
                <label
                  key={opt}
                  className={styles.radioLabel}
                >
                  <input
                    type="radio"
                    value={opt}
                    {...register("type")}
                    className={styles.customRadio}
                  />
                  <span className={styles.radioText}>{opt}</span>
                </label>
              ))}
            </div>
            {errors.type && (
              <p className={styles.errorMessage}>{errors.type.message}</p>
            )}
          </fieldset>

          {/* STATUS */}
          <fieldset className={styles.radioFieldset}>
            <legend className={styles.inputLabel}>
              Status:
            </legend>
            <div className={styles.radioOptionsContainer}>
              {STATUS_OPTIONS.map((opt) => (
                <label
                  key={opt}
                  className={styles.radioLabel}
                >
                  <input
                    type="radio"
                    value={opt}
                    {...register("status")}
                    className={styles.customRadio}
                  />
                  <span className={styles.radioText}>{opt}</span>
                </label>
              ))}
            </div>
            {errors.status && (
              <p className={styles.errorMessage}>
                {errors.status.message}
              </p>
            )}
          </fieldset>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={styles.submitButton}
        >
          {isSubmitting ? (
            <>
              <span className="spinner"></span> 
              Enviando Registro...
            </>
          ) : (
            "Registrar Lançamento"
          )}
        </button>

        {message && (
          <p
            className={`${styles.feedbackMessage} ${
              message.startsWith("✅")
                ? styles.successMessage
                : styles.errorFeedbackMessage
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}