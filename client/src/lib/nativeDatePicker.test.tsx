import { describe, expect, it, vi } from "vitest";
import { openNativeDatePicker } from "./nativeDatePicker";

function createDateInput(overrides: Partial<HTMLInputElement> = {}) {
  return {
    disabled: false,
    readOnly: false,
    focus: vi.fn(),
    showPicker: vi.fn(),
    ...overrides,
  } as unknown as HTMLInputElement;
}

describe("openNativeDatePicker", () => {
  it("foca o campo e abre o calendário nativo quando showPicker está disponível", () => {
    const input = createDateInput();

    expect(openNativeDatePicker(input)).toBe(true);
    expect(input.focus).toHaveBeenCalledWith({ preventScroll: true });
    expect(input.showPicker).toHaveBeenCalledOnce();
  });

  it("mantém o foco como fallback quando o navegador não oferece showPicker", () => {
    const input = createDateInput({ showPicker: undefined });

    expect(openNativeDatePicker(input)).toBe(false);
    expect(input.focus).toHaveBeenCalledWith({ preventScroll: true });
  });

  it("não interrompe a interação quando o navegador rejeita a abertura", () => {
    const input = createDateInput({ showPicker: vi.fn(() => { throw new Error("picker unavailable"); }) });

    expect(openNativeDatePicker(input)).toBe(false);
    expect(input.focus).toHaveBeenCalledWith({ preventScroll: true });
  });

  it("não tenta abrir campos desabilitados, somente leitura ou ausentes", () => {
    const disabled = createDateInput({ disabled: true });
    const readOnly = createDateInput({ readOnly: true });

    expect(openNativeDatePicker(disabled)).toBe(false);
    expect(openNativeDatePicker(readOnly)).toBe(false);
    expect(openNativeDatePicker(null)).toBe(false);
    expect(disabled.focus).not.toHaveBeenCalled();
    expect(readOnly.focus).not.toHaveBeenCalled();
  });
});
