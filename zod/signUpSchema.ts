import * as z from "zod";

/**
 * Sign Up Schema for Clerk Authentication
 * This schema validates user input before sending data to Clerk
 */
export const signUpSchema = z
  .object({
    email: z
      .string()
      .min(1, { error: "Email is required" })
      .email({ error: "Please enter a valid email address" }),

    password: z
      .string()
      .min(1, { error: "Password is required" })
      .min(8, { error: "Password must be at least 8 characters" })
      .max(100, { error: "Password is too long" }),

    confirmPassword: z
      .string()
      .min(1, { error: "Please confirm your password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

/**
 * Type for Sign Up Form
 * This will be used in forms and server actions
 */
export type SignUpSchemaType = z.infer<typeof signUpSchema>;
