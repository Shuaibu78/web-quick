import EmailRegex from "./regex.utils";

export const Required = { required: true };

export const EmailRequired = {
  required: true,
  pattern: EmailRegex,
};
