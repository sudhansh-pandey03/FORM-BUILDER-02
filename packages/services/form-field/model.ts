import { z } from 'zod'

const fieldTypeEnum = z.enum(['TEXT', 'NUMBER', 'EMAIL', 'YES_NO', 'PASSWORD'])

export const createFieldInput = z.object({
    label: z.string().max(100).describe('Display label for the field'),
    type: fieldTypeEnum.describe('Type of the field'),
    formId: z.string().uuid().describe('UUID of the form this field belongs to'),
    description: z.string().optional().describe('Helper text shown below the field'),
    placeholder: z.string().optional().describe('Placeholder text for the field'),
    isRequired: z.boolean().optional().default(false).describe('Whether the field is required'),
})

export type CreateFieldInputType = z.infer<typeof createFieldInput>

export const updateFieldInput = z.object({
    fieldId: z.string().uuid().describe('UUID of the field to update'),
    label: z.string().max(100).optional().describe('Updated display label'),
    type: fieldTypeEnum.optional().describe('Updated field type'),
    description: z.string().optional().nullable().describe('Updated helper text'),
    placeholder: z.string().optional().nullable().describe('Updated placeholder text'),
    isRequired: z.boolean().optional().describe('Updated required flag'),
})

export type UpdateFieldInputType = z.infer<typeof updateFieldInput>

export const getFieldsInput = z.object({
    formId: z.string().uuid().describe('UUID of the form to fetch fields for'),
})

export type GetFieldsInputType = z.infer<typeof getFieldsInput>

export const deleteFieldInput = z.object({
    fieldId: z.string().uuid().describe('UUID of the field to delete'),
})

export type DeleteFieldInputType = z.infer<typeof deleteFieldInput>
