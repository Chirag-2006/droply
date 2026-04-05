import * as z from "zod";

export const signInSchem = z.object({
  identifier: z
    .string()
    .min(1, { error: "email is required" })
    .email({ error: "Please enter a valid email address" }),

  possword: z
    .string()
    .min(1, { error: "Password is required" })
    .min(8, { error: "Password must be at least 8 characters" }),
});
