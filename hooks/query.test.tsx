import type { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { toast } from "sonner";
import { useAction } from "./query";
import { I18nProvider } from "@/providers/i18n-provider";

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

function setup() {
  const client = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
  const invalidate = vi.spyOn(client, "invalidateQueries");
  const wrapper = ({ children }: { children: ReactNode }) => (
    <I18nProvider initialLocale="en">
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    </I18nProvider>
  );
  return { client, invalidate, wrapper };
}

describe("useAction", () => {
  beforeEach(() => vi.clearAllMocks());

  it("invalidates server state and reports a successful mutation", async () => {
    const mutation = vi.fn(async (value: number) => value * 2);
    const { invalidate, wrapper } = setup();
    const { result } = renderHook(() => useAction(mutation, "Saved"), { wrapper });

    await act(async () => expect(await result.current.mutateAsync(4)).toBe(8));

    expect(mutation.mock.calls[0]?.[0]).toBe(4);
    expect(invalidate).toHaveBeenCalledOnce();
    expect(toast.success).toHaveBeenCalledWith("Saved");
  });

  it("surfaces mutation failures without invalidating cached data", async () => {
    const mutation = vi.fn(async () => { throw new Error("Rejected by backend"); });
    const { invalidate, wrapper } = setup();
    const { result } = renderHook(() => useAction(mutation), { wrapper });

    await act(async () => {
      await expect(result.current.mutateAsync()).rejects.toThrow("Rejected by backend");
    });

    expect(invalidate).not.toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledWith("Rejected by backend");
  });
});
