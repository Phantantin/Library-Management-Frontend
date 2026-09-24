"use client";

import Link from "next/link";
import { BookCard } from "@/components/books/book-card";
import { ErrorState, Loading } from "@/components/ui/states";
import { useResource } from "@/hooks/query";
import type { BookDTO } from "@/types/domain";
import { booksApi } from "./api";
import {useI18n} from "@/providers/i18n-provider";

export function HomeShelves() {
  const{t}=useI18n();
  const featured = useResource(["featured-books"], booksApi.featured);
  const popular = useResource(["popular-books"], booksApi.popular);
  const genres = useResource(["popular-genres"], booksApi.popularGenres);
  const pending = featured.isPending || popular.isPending || genres.isPending;
  const error = featured.error ?? popular.error ?? genres.error;

  if (pending) return <Loading />;
  if (error) {
    return (
      <ErrorState
        error={error}
        retry={() => {
          void Promise.all([featured.refetch(), popular.refetch(), genres.refetch()]);
        }}
      />
    );
  }

  return (
    <>
      {featured.data?.length ? (
        <Shelf title="Featured by the library" eyebrow="Worth a closer look" books={featured.data} />
      ) : null}
      {popular.data?.length ? (
        <Shelf title="Popular with readers" eyebrow="Community favorites" books={popular.data} />
      ) : null}
      {genres.data?.length ? (
        <section className="mt-14">
          <p className="eyebrow mb-2">{t("Browse by interest")}</p>
          <div className="mb-5 flex items-end justify-between gap-4">
            <h2 className="text-2xl font-semibold">{t("Popular genres")}</h2>
            <Link className="text-sm text-primary" href="/genres">{t("All genres")} &rarr;</Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {genres.data.map((genre) => (
              <Link className="panel hover:border-primary" href={`/books?genre=${genre.id}`} key={genre.id}>
                <h3 className="text-lg font-semibold">{genre.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{t("{count} active titles",{count:genre.bookCount??0})}</p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}

function Shelf({ title, eyebrow, books }: { title: string; eyebrow: string; books: BookDTO[] }) {
  const{t}=useI18n();
  return (
    <section className="mt-14">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow mb-2">{t(eyebrow)}</p>
          <h2 className="text-2xl font-semibold">{t(title)}</h2>
        </div>
        <Link className="text-sm text-primary" href="/books">{t("View catalog")} &rarr;</Link>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        {books.map((book) => <BookCard key={book.id} book={book} />)}
      </div>
    </section>
  );
}
