"use client";

import { use, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Field, FieldGroup, FieldLabel, FieldDescription, FieldError } from "~/components/ui/field";
import { useGetForm, useSubmitForm } from "~/hooks/api/form";

type FieldType = "TEXT" | "NUMBER" | "EMAIL" | "YES_NO" | "PASSWORD";

type FormField = {
  id: string;
  label: string;
  labelKey: string;
  type: FieldType;
  description?: string | null;
  placeholder?: string | null;
  isRequired: boolean;
  index: string;
};

function FormFieldInput({
  field,
  register,
  control,
  errors,
}: {
  field: FormField;
  register: ReturnType<typeof useForm>["register"];
  control: ReturnType<typeof useForm>["control"];
  errors: Record<string, { message?: string }>;
}) {
  const rules = field.isRequired ? { required: `${field.label} is required` } : {};
  const error = errors[field.labelKey];

  if (field.type === "YES_NO") {
    return (
      <Field data-invalid={!!error}>
        <FieldLabel htmlFor={field.labelKey}>
          {field.label}
          {field.isRequired && <span className="text-destructive ml-0.5">*</span>}
        </FieldLabel>
        {field.description && <FieldDescription>{field.description}</FieldDescription>}
        <Controller
          name={field.labelKey}
          control={control}
          rules={rules}
          render={({ field: { value, onChange, onBlur, ref } }) => (
            <RadioGroup
              ref={ref}
              value={(value as string | undefined) ?? ""}
              onValueChange={onChange}
              onBlur={onBlur}
              aria-invalid={!!error}
              className="flex gap-6 mt-1"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="yes" id={`${field.labelKey}_yes`} />
                <Label htmlFor={`${field.labelKey}_yes`}>Yes</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="no" id={`${field.labelKey}_no`} />
                <Label htmlFor={`${field.labelKey}_no`}>No</Label>
              </div>
            </RadioGroup>
          )}
        />
        {error && <FieldError>{error.message}</FieldError>}
      </Field>
    );
  }

  const inputType: Record<Exclude<FieldType, "YES_NO">, string> = {
    TEXT: "text",
    NUMBER: "number",
    EMAIL: "email",
    PASSWORD: "password",
  };

  return (
    <Field data-invalid={!!error}>
      <FieldLabel htmlFor={field.labelKey}>
        {field.label}
        {field.isRequired && <span className="text-destructive ml-0.5">*</span>}
      </FieldLabel>
      {field.description && <FieldDescription>{field.description}</FieldDescription>}
      <Input
        id={field.labelKey}
        type={inputType[field.type as Exclude<FieldType, "YES_NO">]}
        placeholder={field.placeholder ?? undefined}
        aria-invalid={!!error}
        {...register(field.labelKey, rules)}
      />
      {error && <FieldError>{error.message}</FieldError>}
    </Field>
  );
}

export default function PublicFormPage({ params }: { params: Promise<{ form_id: string }> }) {
  const { form_id: formId } = use(params);
  const { form, isLoading } = useGetForm(formId);
  const { submitFormAsync } = useSubmitForm();
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data: Record<string, unknown>) => {
    if (!form) return;
    const values = form.fields
      .filter((field) => data[field.labelKey] !== undefined && data[field.labelKey] !== "")
      .map((field) => ({
        formFieldId: field.id,
        value: String(data[field.labelKey]),
      }));
    setSubmitError(null);
    try {
      await submitFormAsync({ formId, values });
      setSubmitted(true);
    } catch (err) {
      setSubmitError(
        err instanceof Error && err.message
          ? err.message
          : "Something went wrong while submitting. Please try again."
      );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading form...</p>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-2">
          <h1 className="text-xl font-semibold">Form not found</h1>
          <p className="text-sm text-muted-foreground">This form doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-2">
          <h1 className="text-xl font-semibold">Thanks for submitting!</h1>
          <p className="text-sm text-muted-foreground">Your response has been recorded.</p>
        </div>
      </div>
    );
  }

  const sortedFields = [...(form.fields ?? [])].sort(
    (a, b) => parseFloat(a.index) - parseFloat(b.index)
  );

  return (
    <div className="min-h-screen bg-background flex items-start justify-center py-16 px-4">
      <div className="w-full max-w-lg">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight">{form.title}</h1>
          {form.description && (
            <p className="mt-2 text-sm text-muted-foreground">{form.description}</p>
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit as Parameters<typeof handleSubmit>[0])}>
          <FieldGroup>
            {sortedFields.length === 0 ? (
              <p className="text-sm text-muted-foreground">This form has no fields yet.</p>
            ) : (
              sortedFields.map((field) => (
                <FormFieldInput
                  key={field.id}
                  field={field as FormField}
                  register={register}
                  control={control}
                  errors={errors as Record<string, { message?: string }>}
                />
              ))
            )}
          </FieldGroup>

          {submitError && (
            <p role="alert" className="mt-6 text-sm text-destructive">
              {submitError}
            </p>
          )}

          {sortedFields.length > 0 && (
            <Button type="submit" className="mt-8 w-full" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          )}
        </form>
      </div>
    </div>
  );
}
