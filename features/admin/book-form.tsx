"use client";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useResource, useAction } from "@/hooks/query";
import { adminApi } from "./api";
import { bookSchema, type BookFormInput, type BookFormValues } from "@/schemas/book";
import { Button } from "@/components/ui/button";
import { Loading, ErrorState } from "@/components/ui/states";
import {useI18n} from "@/providers/i18n-provider";
import { CoverImageUpload } from "@/components/books/cover-image-upload";
export function BookForm({ id }: { id?: number }) {
  const{t}=useI18n();
  const [coverUploading, setCoverUploading] = useState(false);
  const router = useRouter();
  const genres = useResource(["genres"], adminApi.genres);
  const detail = useResource(["admin-book", id], () => id ? adminApi.book(id) : Promise.resolve(null));
  const { register, handleSubmit, reset, setValue, control, formState: { errors } } = useForm<BookFormInput, unknown, BookFormValues>({ resolver: zodResolver(bookSchema), defaultValues: { active: true, featured: false, totalCopies: 1, availableCopies: 1, coverImageUrl: "" } });
  const coverImageUrl = useWatch({ control, name: "coverImageUrl" });
  useEffect(() => { if (detail.data) reset({ ...detail.data, publisher: detail.data.publisher ?? "", publicationDate: detail.data.publicationDate ?? "", language: detail.data.language ?? "", pages: detail.data.pages ?? undefined, description: detail.data.description ?? "", price: detail.data.price ?? undefined, coverImageUrl: detail.data.coverImageUrl ?? "" }); }, [detail.data, reset]);
  const save = useAction((value: BookFormValues) => id ? adminApi.updateBook(id, value) : adminApi.createBook(value), t(id ? "Book updated" : "Book created"));
  const setCover = useCallback((url: string) => setValue("coverImageUrl", url, { shouldDirty: true, shouldValidate: true }), [setValue]);
  if (genres.isPending || (detail.isPending && id)) return <Loading />;
  if (genres.error) return <ErrorState error={genres.error} retry={() => void genres.refetch()} />;
  const fields: [keyof BookFormValues, string][] = [["isbn", "ISBN"], ["title", "Title"], ["author", "Author"], ["publisher", "Publisher"], ["publicationDate", "Publication date"], ["language", "Language"], ["pages", "Pages"], ["totalCopies", "Total copies"], ["availableCopies", "Available copies"], ["price", "Price"]];
  return <form className="panel grid md:grid-cols-2 gap-5" onSubmit={handleSubmit(value => save.mutate(value, { onSuccess: result => router.push(`/admin/books/${result.id}`) }))}>{fields.map(([name, fieldLabel]) => <label key={name}>{t(fieldLabel)}<input type={["pages", "totalCopies", "availableCopies", "price"].includes(name) ? "number" : name === "publicationDate" ? "date" : "text"} {...register(name)} aria-invalid={!!errors[name]} />{errors[name] && <span className="text-sm text-destructive">{t(String(errors[name]?.message))}</span>}</label>)}<label>{t("Genre")}<select {...register("genreId")}><option value="">{t("Select genre")}</option>{genres.data?.filter(g => g.active).map(g => <option key={g.id} value={g.id}>{g.name}</option>)}</select>{errors.genreId && <span className="text-sm text-destructive">{t(String(errors.genreId.message))}</span>}</label><label className="md:col-span-2">{t("Description")}<textarea {...register("description")} /></label><CoverImageUpload value={coverImageUrl} onChange={setCover} onUploadingChange={setCoverUploading} error={errors.coverImageUrl?.message ? String(errors.coverImageUrl.message) : undefined}/><label className="flex gap-2 items-center"><input type="checkbox" {...register("active")} />{t("Active catalog record")}</label><label className="flex gap-2 items-center"><input type="checkbox" {...register("featured")} />{t("Featured on homepage")}</label><div className="md:col-span-2 flex justify-end gap-3"><Button type="button" variant="ghost" onClick={() => router.back()}>{t("Cancel")}</Button><Button disabled={save.isPending || coverUploading}>{t(coverUploading ? "Uploading cover..." : save.isPending ? "Saving…" : "Save book")}</Button></div>{save.error && <p className="md:col-span-2 text-destructive" role="alert">{t(save.error.message)}</p>}</form>;
}
