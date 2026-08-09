import { z } from 'zod'


export const createUserWithEmailAndPasswordInput = z.object({
    fullName: z.string().describe('Full name of the user'),
    email: z.email().describe('email address of the user'),
    password: z.string().describe('password of the user')
})

export type CreateUserWithEmailAndPasswordInputType = z.infer<typeof createUserWithEmailAndPasswordInput>

export const generateUserTokenPayload = z.object({
    id: z.string().describe('uuid of the user'),
})

export type GenerateUserTokenPayloadType = z.infer<typeof generateUserTokenPayload>

export const signInUserWithEmailAndPasswordInput = z.object({
    email: z.email().describe('email of the user'),
    password: z.string().describe('password of the user')
})

export type SignInUserWithEmailAndPasswordInputType = z.infer<typeof signInUserWithEmailAndPasswordInput>

export const loginWithGoogleInput = z.object({
    credential: z.string().describe('Google ID token (JWT) returned by Google Identity Services'),
})

export type LoginWithGoogleInputType = z.infer<typeof loginWithGoogleInput>
