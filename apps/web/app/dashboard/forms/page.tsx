"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import Link from "next/link";
import { PencilIcon, Link2Icon, CheckIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "~/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { useCreateForm, useListForms } from "~/hooks/api/form";
import { toast } from "sonner";

type CreateFormValues = {
  title: string;
  description: string;
};

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.87 9.87 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 1.67c2.2 0 4.26.86 5.82 2.42a8.2 8.2 0 0 1 2.41 5.82c0 4.54-3.7 8.24-8.24 8.24a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.18 8.18 0 0 1-1.25-4.38c0-4.54 3.7-8.24 8.24-8.24Zm-4.56 4.7c-.16 0-.43.06-.65.31-.22.25-.86.84-.86 2.04 0 1.2.88 2.36 1 2.52.13.16 1.72 2.7 4.24 3.68 2.09.82 2.52.65 2.97.61.45-.04 1.44-.59 1.65-1.16.2-.57.2-1.06.14-1.16-.06-.1-.23-.16-.48-.28-.25-.13-1.44-.71-1.67-.79-.22-.08-.38-.13-.55.13-.16.25-.63.79-.77.95-.14.16-.28.18-.53.06-.25-.13-1.06-.39-2.02-1.24-.75-.66-1.25-1.48-1.4-1.73-.14-.25-.02-.38.11-.51.11-.11.25-.28.38-.42.13-.14.17-.25.25-.41.08-.16.04-.31-.02-.44-.06-.13-.55-1.36-.76-1.85-.2-.48-.4-.42-.55-.42h-.47Z" />
    </svg>
  );
}

export default function FormsPage() {
  const [open, setOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { createFormAsync, isError, error } = useCreateForm();
  const { forms, isLoading } = useListForms();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<CreateFormValues>({
    defaultValues: { title: "", description: "" },
  });

  const onSubmit: SubmitHandler<CreateFormValues> = async (values) => {
    await createFormAsync({
      title: values.title,
      description: values.description || undefined,
    });
    reset();
    setOpen(false);
  };

  const getFormLink = (formId: string) => {
    return `${window.location.origin}/form/${formId}`;
  };

  const handleCopyLink = async (formId: string) => {
    const link = getFormLink(formId);
    await navigator.clipboard.writeText(link);
    setCopiedId(formId);
    toast.success("Link copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleShareOnWhatsApp = (formId: string, title: string) => {
    const link = getFormLink(formId);
    const message = `Please fill out this form: ${title}\n${link}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <div className="p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Forms</h1>
        <Button onClick={() => setOpen(true)}>Create Form</Button>
      </div>

      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-36">Share</TableHead>
              <TableHead className="w-16" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  Loading...
                </TableCell>
              </TableRow>
            ) : !forms || forms.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No forms yet. Create your first one.
                </TableCell>
              </TableRow>
            ) : (
              forms.map((form) => (
                <TableRow key={form.id}>
                  <TableCell className="font-medium">{form.title}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {form.description ?? "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {form.createdAt ? new Date(form.createdAt).toLocaleDateString() : "—"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Copy link"
                        onClick={() => handleCopyLink(form.id)}
                      >
                        {copiedId === form.id ? (
                          <CheckIcon className="size-4 text-green-600" />
                        ) : (
                          <Link2Icon className="size-4" />
                        )}
                        <span className="sr-only">Copy link for {form.title}</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Share on WhatsApp"
                        onClick={() => handleShareOnWhatsApp(form.id, form.title)}
                      >
                        <WhatsAppIcon className="size-4 text-[#25D366]" />
                        <span className="sr-only">Share {form.title} on WhatsApp</span>
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/dashboard/forms/${form.id}`}>
                        <PencilIcon className="size-4" />
                        <span className="sr-only">Edit {form.title}</span>
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a new form</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="title">Title</FieldLabel>
                <Input
                  id="title"
                  placeholder="e.g. Customer Feedback"
                  {...register("title", { required: true, maxLength: 55 })}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="description">Description</FieldLabel>
                <Textarea
                  id="description"
                  placeholder="What is this form for? (optional)"
                  {...register("description", { maxLength: 300 })}
                />
              </Field>
              {isError && (
                <p className="text-sm text-destructive">{error?.message}</p>
              )}
            </FieldGroup>

            <DialogFooter className="mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => { reset(); setOpen(false); }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Form"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
