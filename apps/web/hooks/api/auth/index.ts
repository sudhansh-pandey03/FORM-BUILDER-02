import { trpc } from "~/trpc/client";

export const useSignup = () => {
    const utils = trpc.useUtils()

    const {
        mutateAsync: createUserWithEmailAndPasswordAsync,
        mutate: createUserWithEmailAndPassword,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        status
    } =
        trpc.auth.createUserWithEmailAndPassword.useMutation({
            onSuccess: async () => {
                await utils.auth.getLoggedInUserInfo.invalidate()
            }
        });

    return {
        createUserWithEmailAndPasswordAsync,
        createUserWithEmailAndPassword,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        status
    }
}

export const useSignIn = () => {
    const utils = trpc.useUtils()

    const {
        mutateAsync: signInUserWithEmailAndPasswordAsync,
        mutate: signInUserWithEmailAndPassword,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        status
    } =
        trpc.auth.signInUserWithEmailAndPassword.useMutation({
            onSuccess: async () => {
                await utils.auth.getLoggedInUserInfo.invalidate()
            }
        });

    return {
        signInUserWithEmailAndPasswordAsync,
        signInUserWithEmailAndPassword,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        status
    }
}

export const useLoginWithGoogle = () => {
    const utils = trpc.useUtils()

    const {
        mutateAsync: loginWithGoogleAsync,
        mutate: loginWithGoogle,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        status
    } =
        trpc.auth.loginWithGoogle.useMutation({
            onSuccess: async () => {
                await utils.auth.getLoggedInUserInfo.invalidate()
            }
        });

    return {
        loginWithGoogleAsync,
        loginWithGoogle,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        status
    }
}

export const useUser = () => {
    const { data: user, error, isFetched, isFetching, isLoading, status } = trpc.auth.getLoggedInUserInfo.useQuery()

    return {
        user,
        error,
        isFetched,
        isFetching,
        isLoading,
        status
    }
}
