"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { useGetFields, useGetFormSubmissions } from "~/hooks/api/form";

export default function SubmissionsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: formId } = use(params);

  const { fields, isLoading: fieldsLoading } = useGetFields(formId);
  const { submissions, isLoading: submissionsLoading } = useGetFormSubmissions(formId);

  const isLoading = fieldsLoading || submissionsLoading;

  const sortedFields = [...(fields ?? [])].sort(
    (a, b) => parseFloat(a.index) - parseFloat(b.index)
  );

  return (
    <div className="p-6 flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon-sm" asChild>
          <Link href={`/dashboard/forms/${formId}`}>
            <ArrowLeftIcon className="size-4" />
            <span className="sr-only">Back to form builder</span>
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Submissions</h1>
      </div>

      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead className="w-40">Submitted At</TableHead>
              {isLoading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <TableHead key={i}>
                      <Skeleton className="h-4 w-24" />
                    </TableHead>
                  ))
                : sortedFields.map((field) => (
                    <TableHead key={field.id}>
                      {field.label}
                      {field.isRequired && (
                        <span className="text-destructive ml-0.5">*</span>
                      )}
                    </TableHead>
                  ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                  {Array.from({ length: 3 }).map((_, j) => (
                    <TableCell key={j}><Skeleton className="h-4 w-32" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : !submissions || submissions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={sortedFields.length + 1}
                  className="h-24 text-center text-muted-foreground"
                >
                  No submissions yet.
                </TableCell>
              </TableRow>
            ) : (
              submissions.map((submission) => {
                const valueMap = new Map(
                  (submission.values ?? []).map((v) => [v.formFieldId, v.value])
                );

                return (
                  <TableRow key={submission.id}>
                    <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                      {submission.createdAt
                        ? new Date(submission.createdAt).toLocaleString()
                        : "—"}
                    </TableCell>
                    {sortedFields.map((field) => {
                      const val = valueMap.get(field.id);
                      return (
                        <TableCell key={field.id}>
                          {val !== undefined && val !== "" ? val : (
                            <span className="text-muted-foreground/50">—</span>
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
