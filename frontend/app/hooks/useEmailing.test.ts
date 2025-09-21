import { describe, it, expect, beforeEach, vi, type Mock } from "vitest";
import { renderHook, act } from "@testing-library/react";

const toasts = {
  error: [] as string[],
  success: [] as string[],
  info: [] as string[],
};
const logs = {
  warn: [] as unknown[][],
  error: [] as unknown[][],
  info: [] as unknown[][],
};
type AddDocument = (
  collection: string,
  payload: Record<string, unknown>
) => Promise<{ id: string }>;
type FindDocumentByField = (
  collection: string,
  field: string,
  value: string
) => Promise<{ id: string } | null>;

const firestoreMock: {
  addDocument: AddDocument & Mock;
  findDocumentByField: FindDocumentByField & Mock;
} = {
  addDocument: vi.fn(),
  findDocumentByField: vi.fn(),
};

vi.mock("@shared/hooks", () => {
  return {
    useToast: () => ({
      showErrorToast: (m: string) => toasts.error.push(m),
      showSuccessToast: (m: string) => toasts.success.push(m),
      showInfoToast: (m: string) => toasts.info.push(m),
    }),
    useLog: () => ({
      warn: (...args: unknown[]) => logs.warn.push(args),
      error: (...args: unknown[]) => logs.error.push(args),
      info: (...args: unknown[]) => logs.info.push(args),
    }),
    useFirestore: () => ({
      addDocument: firestoreMock.addDocument,
      findDocumentByField: firestoreMock.findDocumentByField,
    }),
  } as const;
});

// Évite de charger firebase/firestore en tests (noop factory)
vi.mock("@shared/types/server-date", () => {
  return {
    serverDateFactory: () => ({
      createdAt: { _mock: true },
      updatedAt: { _mock: true },
    }),
  } as const;
});

// Import after mocks are set up
import { useEmailing } from "./useEmailing";

type SubscribeResult =
  | { ok: true; id: string; already: boolean }
  | { ok: false; reason: "invalid_email" }
  | { ok: false; reason: "exception"; error: unknown };

describe("useEmailing.subscribeEmailing", () => {
  beforeEach(() => {
    toasts.error.length = 0;
    toasts.success.length = 0;
    toasts.info.length = 0;
    logs.warn.length = 0;
    logs.error.length = 0;
    logs.info.length = 0;
    firestoreMock.addDocument.mockReset();
    firestoreMock.findDocumentByField.mockReset();
  });

  it("retourne invalid_email et affiche une erreur pour un email invalide", async () => {
    const { result } = renderHook(() => useEmailing());

    const res = await act(async () => {
      return await result.current.subscribeEmailing({ email: "not-an-email" });
    });

    expect(res).toEqual({ ok: false, reason: "invalid_email" });
    expect(toasts.error.at(-1)).toMatch(/Email invalide/i);
    expect(firestoreMock.findDocumentByField).not.toHaveBeenCalled();
    expect(firestoreMock.addDocument).not.toHaveBeenCalled();
    // un warning est loggé
    expect(logs.warn.length).toBeGreaterThan(0);
  });

  it("détecte un email déjà existant et évite l'ajout", async () => {
    firestoreMock.findDocumentByField.mockResolvedValueOnce({ id: "abc123" });

    const { result } = renderHook(() => useEmailing());

    const input = "User@Example.com";
    const lowered = "user@example.com";
    const res = await act(async () => {
      return await result.current.subscribeEmailing({ email: input });
    });

    expect(firestoreMock.findDocumentByField).toHaveBeenCalledWith(
      "emailing",
      "email",
      lowered
    );
    expect(firestoreMock.addDocument).not.toHaveBeenCalled();
    expect(toasts.info.at(-1)).toMatch(/Inscription enregistrée/i);
    expect(res).toEqual({ ok: true, id: "abc123", already: true });
  });

  it("ajoute une nouvelle entrée quand l'email n'existe pas", async () => {
    firestoreMock.findDocumentByField.mockResolvedValueOnce(null);
    firestoreMock.addDocument.mockResolvedValueOnce({ id: "newid-1" });

    const { result } = renderHook(() => useEmailing());

    const input = "NewUser@Example.com";
    const lowered = "newuser@example.com";
    const res = await act(async () => {
      return await result.current.subscribeEmailing({ email: input });
    });

    expect(firestoreMock.findDocumentByField).toHaveBeenCalledWith(
      "emailing",
      "email",
      lowered
    );
    expect(firestoreMock.addDocument).toHaveBeenCalledTimes(1);
    const [calledCollection, calledPayload] = (
      firestoreMock.addDocument as Mock
    ).mock.calls[0] as [string, Record<string, unknown>];
    expect(calledCollection).toBe("emailing");
    expect(calledPayload).toEqual(
      expect.objectContaining({ email: input, emailLower: lowered })
    );
    expect(toasts.success.at(-1)).toMatch(/Inscription enregistrée/i);
    expect(res).toEqual({ ok: true, id: "newid-1", already: false });
  });

  it("retourne exception et affiche une erreur si l'ajout échoue", async () => {
    firestoreMock.findDocumentByField.mockResolvedValueOnce(null);
    firestoreMock.addDocument.mockRejectedValueOnce(new Error("boom"));

    const { result } = renderHook(() => useEmailing());

    const res = await act(async () => {
      return await result.current.subscribeEmailing({ email: "a@b.com" });
    });

    expect(toasts.error.at(-1)).toMatch(/Une erreur est survenue/i);
    expect(logs.error.length).toBeGreaterThan(0);
    expect(res && typeof res === "object").toBe(true);
    const r = res as SubscribeResult;
    expect(r.ok).toBe(false);
    const rf = r as Extract<SubscribeResult, { ok: false }>; // affiner le type pour accéder à reason
    expect(rf.reason).toBe("exception");
  });
});
