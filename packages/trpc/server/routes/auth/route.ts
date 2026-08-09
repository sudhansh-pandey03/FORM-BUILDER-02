import { userService } from "../../services";
import { authenticatedProcedure, publicProcedure, router } from "../../trpc";
import { getAuthenticationCookie, setAuthenticationCookie } from "../../utils/cookie";
import { generatePath } from "../../utils/path-generator";
import { createUserWithEmailAndPasswordInputModel, createUserWithEmailAndPasswordOutputModel, getLoggedInUserInfoInputModel, getLoggedInUserInfoOutputModel, signInUserWithEmailAndPasswordInputModel, signInUserWithEmailAndPasswordOutputModel, loginWithGoogleInputModel, loginWithGoogleOutputModel } from "./model";

const TAGS = ["Authentication"];
const getPath = generatePath("/authentication");

export const authRouter = router({
  createUserWithEmailAndPassword: publicProcedure.meta({
    openapi: {
      method: 'POST',
      path: getPath('/createUserWithEmailAndPassword'),
      tags: TAGS
    }
  })
    .input(createUserWithEmailAndPasswordInputModel)
    .output(createUserWithEmailAndPasswordOutputModel)
    .mutation(async ({ input, ctx }) => {
      const { fullName, email, password } = input

      const { id, token } = await userService.createUserWithEmailAndPassword({
        fullName, email, password
      })

      setAuthenticationCookie(ctx, token)

      return {
        id
      }
    }),

  signInUserWithEmailAndPassword: publicProcedure.meta({
    openapi: {
      method: 'POST',
      path: getPath('/signInUserWithEmailAndPassword'),
      tags: TAGS
    }
  })
    .input(signInUserWithEmailAndPasswordInputModel)
    .output(signInUserWithEmailAndPasswordOutputModel)
    .mutation(async ({ input, ctx }) => {
      const { email, password } = input

      const { id, token } = await userService.signInUserWithEmailAndPassword({
        email, password
      })

      setAuthenticationCookie(ctx, token)

      return {
        id
      }
    }),

  loginWithGoogle: publicProcedure.meta({
    openapi: {
      method: 'POST',
      path: getPath('/loginWithGoogle'),
      tags: TAGS
    }
  })
    .input(loginWithGoogleInputModel)
    .output(loginWithGoogleOutputModel)
    .mutation(async ({ input, ctx }) => {
      const { credential } = input

      const { id, token } = await userService.loginWithGoogle({ credential })

      setAuthenticationCookie(ctx, token)

      return { id }
    }),

  getLoggedInUserInfo: authenticatedProcedure
    .meta({
      openapi: {
        method: 'POST',
        path: getPath('/getLoggedInUserInfo'),
        tags: TAGS,
        protect: true
      }
    })
    .input(getLoggedInUserInfoInputModel)
    .output(getLoggedInUserInfoOutputModel)
    .query(async ({ ctx }) => {

      const { id, email, fullName, profileImageUrl } = await userService.getUserInfoById(ctx.user.id)

      return {
        id,
        email,
        fullName,
        profileImageUrl
      }
    })
});
