import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { Navbar } from "../Navbar";
import { renderWithRouter } from "../../test/testUtils";

describe("Navbar", () => {
  it('does not render on home route "/"', () => {
    const { container } = renderWithRouter(<Navbar />, { route: "/" });
    expect(container.firstChild).toBeNull();
  });

  it("renders links and highlights active section", () => {
    renderWithRouter(<Navbar />, { route: "/materias-primas" });

    const materiais = screen.getByRole("link", { name: /materiais/i });
    const produtos = screen.getByRole("link", { name: /produtos/i });

    expect(materiais).toHaveAttribute("href", "/materias-primas");
    expect(produtos).toHaveAttribute("href", "/produtos");
    
    expect(materiais.className).toMatch(/(^|\s)text-amber-800(\s|$)/);
    expect(materiais.className).toMatch(/(^|\s)border-amber-800(\s|$)/);
    expect(produtos.className).not.toMatch(/(^|\s)text-amber-800(\s|$)/);
    expect(produtos.className).not.toMatch(/(^|\s)border-amber-800(\s|$)/);
  });
});
