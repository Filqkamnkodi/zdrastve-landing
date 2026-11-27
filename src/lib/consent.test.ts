import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";

describe("regional visitor consent", () => {
  beforeEach(() => {
    vi.resetModules();
    const values = new Map<string, string>();
    vi.stubGlobal("localStorage", { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => values.set(key, value) });
    vi.stubGlobal("window", Object.assign(new EventTarget(), { gtag: vi.fn() }));
    vi.stubGlobal("navigator", { globalPrivacyControl: false });
    vi.stubGlobal("location", { hostname: "clinic.test" });
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("h=clinic.test\nloc=BG\n")));
  });
  afterEach(() => vi.unstubAllGlobals());

  it("requires separate advertising acceptance in Bulgaria", async () => {
    const consent = await import("./consent");
    expect(await consent.needsAnswer(["analytics", "advertising"])).toBe(true);
    expect(await consent.canTrack("advertising")).toBe(false);
    consent.saveChoices({ analytics: "granted" });
    expect(await consent.canTrack("analytics")).toBe(true);
    expect(await consent.canTrack("advertising")).toBe(false);
    consent.saveChoices({ advertising: "granted" });
    expect(await consent.canTrack("advertising")).toBe(true);
  });
  it("withdraws advertising permission immediately without changing analytics", async () => {
    const consent = await import("./consent");
    consent.saveChoices({ analytics: "granted", advertising: "granted" });
    consent.saveChoices({ advertising: "denied" });
    expect(await consent.canTrack("advertising")).toBe(false);
    expect(await consent.canTrack("analytics")).toBe(true);
  });
  it("blocks both purposes under Global Privacy Control even after acceptance", async () => {
    const consent = await import("./consent");
    consent.saveChoices({ analytics: "granted", advertising: "granted" });
    vi.stubGlobal("navigator", { globalPrivacyControl: true });
    expect(await consent.canTrack("analytics")).toBe(false);
    expect(await consent.canTrack("advertising")).toBe(false);
    expect(await consent.needsAnswer(["analytics", "advertising"])).toBe(false);
  });
  it("blocks unanswered advertising when location lookup fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("unavailable")));
    const consent = await import("./consent");
    expect(await consent.canTrack("advertising")).toBe(false);
    expect(await consent.needsAnswer(["analytics", "advertising"])).toBe(true);
  });
  it("allows ordinary tracking outside consent regions unless refused", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("h=clinic.test\nloc=US\n")));
    const consent = await import("./consent");
    expect(await consent.needsAnswer(["analytics", "advertising"])).toBe(false);
    expect(await consent.canTrack("advertising")).toBe(true);
    consent.saveChoices({ advertising: "denied" });
    expect(await consent.canTrack("advertising")).toBe(false);
  });
});