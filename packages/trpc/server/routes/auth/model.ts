import { z } from 'zod'

export const createUserWithEmailAndPasswordInputModel = z.object({
    fullName: z.string().describe('name of the user'),
    email: z.email().describe('email of the user'),
    password: z.string().describe('password of the user'),
})

export const createUserWithEmailAndPasswordOutputModel = z.object({
    id: z.string().describe('id of the user created')
})


export const signInUserWithEmailAndPasswordInputModel = z.object({
    email: z.email().describe('email of the user'),
    password: z.string().describe('password of the user'),
})

export const signInUserWithEmailAndPasswordOutputModel = z.object({
    id: z.string().describe('id of the user created')
})

export const getLoggedInUserInfoInputModel = z.undefined()

export const getLoggedInUserInfoOutputModel = z.object({
    id: z.string().describe('id of the user created'),
    email: z.email().describe('email of the user'),
    fullName: z.string().describe('name of the user'),
    profileImageUrl: z.string().describe('image of the user').optional().nullable(),
})

export const loginWithGoogleInputModel = z.object({
    credential: z.string().describe('Google ID token from Google Identity Services'),
})

export const loginWithGoogleOutputModel = z.object({
    id: z.string().describe('id of the user'),
})
