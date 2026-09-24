import {describe,it,expect} from "vitest";
import {registerSchema,resetSchema} from "./auth";
import {bookSchema} from "./book";
import {reviewSchema} from "./review";
describe("critical forms",()=>{it("rejects short passwords",()=>expect(registerSchema.safeParse({fullName:"Reader",email:"reader@example.com",password:"short"}).success).toBe(false));it("requires reset tokens",()=>expect(resetSchema.safeParse({token:"",password:"long-enough"}).success).toBe(false));it("rejects impossible copy counts",()=>expect(bookSchema.safeParse({isbn:"1",title:"Book",author:"Author",genreId:1,totalCopies:1,availableCopies:2,active:true,featured:false}).success).toBe(false));it("enforces review limits",()=>expect(reviewSchema.safeParse({title:"",rating:6,reviewText:"too short"}).success).toBe(false))});
