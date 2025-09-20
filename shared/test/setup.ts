import "@testing-library/jest-dom";
import { vi } from "vitest";
import React from "react";

// Ajout de React comme global pour les tests
global.React = React;

// Mock de Next.js router
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

// Mock des variables d'environnement
Object.defineProperty(window, "process", {
  value: {
    env: {
      NEXT_PUBLIC_API_URL: "http://localhost:3333",
    },
  },
});
