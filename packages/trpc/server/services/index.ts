import UserService from "@repo/services/user";
import FormService from "@repo/services/form";
import FormFieldService from "@repo/services/form-field";
import FormSubmissionService from "@repo/services/form-submission";

export const userService = new UserService();
export const formService = new FormService();
export const formFieldService = new FormFieldService();
export const formSubmissionService = new FormSubmissionService();
