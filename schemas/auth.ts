import {z} from "zod";
export const loginSchema=z.object({email:z.email("Enter a valid email"),password:z.string().min(1,"Password is required")});
export const registerSchema=loginSchema.extend({fullName:z.string().trim().min(1,"Name is required").max(100),phone:z.string().trim().min(1,"Phone is required").max(30),password:z.string().min(8,"Use at least 8 characters").max(72)});
export const forgotSchema=z.object({email:z.email("Enter a valid email")});
export const resetSchema=z.object({token:z.string().min(1,"Reset token is missing"),password:z.string().min(8,"Use at least 8 characters").max(72)});
