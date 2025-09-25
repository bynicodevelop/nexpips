import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { describe, it, expect, vi } from "vitest";
import { Button } from "./ButtonComponent";

describe("ButtonComponent", () => {
  it("rend le texte fourni", () => {
    render(<Button>Envoyer</Button>);
    expect(screen.getByRole("button", { name: /envoyer/i })).toBeInTheDocument();
  });

  it("applique la variante secondaire", () => {
    render(<Button variant="secondary">Action</Button>);
    const btn = screen.getByRole("button", { name: /action/i });
    expect(btn.className).toContain("btn-secondary");
  });

  it("applique la taille sm", () => {
    render(<Button size="sm">Small</Button>);
    const btn = screen.getByRole("button", { name: /small/i });
    expect(btn.className).toContain("btn-sm");
  });

  it("affiche le spinner en mode loading et désactive le bouton", () => {
    render(<Button loading>Chargement</Button>);
    const btn = screen.getByRole("button", { name: /chargement/i });
    expect(btn).toBeDisabled();
    expect(btn.querySelector(".loading-spinner")).toBeInTheDocument();
  });

  it("déclenche onClick quand cliqué", async () => {
    const user = userEvent.setup();
    const handle = vi.fn();
    render(<Button onClick={handle}>Clique</Button>);
    await user.click(screen.getByRole("button", { name: /clique/i }));
    expect(handle).toHaveBeenCalledTimes(1);
  });

  it("n'appelle pas onClick en loading", async () => {
    const user = userEvent.setup();
    const handle = vi.fn();
    render(
      <Button loading onClick={handle}>
        Busy
      </Button>
    );
    await user.click(screen.getByRole("button", { name: /busy/i }));
    expect(handle).not.toHaveBeenCalled();
  });

  it("supporte fullWidth", () => {
    render(
      <Button fullWidth data-testid="btn-fw">
        Large
      </Button>
    );
    const btn = screen.getByTestId("btn-fw");
    expect(btn.className).toContain("btn-block");
  });

  it("rend une icône gauche et droite", () => {
    render(
      <Button leftIcon={<span data-testid="L">L</span>} rightIcon={<span data-testid="R">R</span>}>
        Core
      </Button>
    );
    expect(screen.getByTestId("L")).toBeInTheDocument();
    expect(screen.getByTestId("R")).toBeInTheDocument();
  });

  it("ajoute dash style quand dash=true", () => {
    render(
      <Button dash data-testid="dash">
        Dash
      </Button>
    );
    const btn = screen.getByTestId("dash");
    expect(btn.className).toContain("btn-dash");
  });

  it("ajoute soft style quand soft=true", () => {
    render(
      <Button soft data-testid="soft">
        Soft
      </Button>
    );
    const btn = screen.getByTestId("soft");
    expect(btn.className).toContain("btn-soft");
  });
});
