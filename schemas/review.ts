import {z} from "zod";
export const reviewSchema=z.object({title:z.string().max(200),rating:z.number().int().min(1).max(5),reviewText:z.string().min(10,"Write at least 10 characters").max(2000)});
export type ReviewValues=z.infer<typeof reviewSchema>;
