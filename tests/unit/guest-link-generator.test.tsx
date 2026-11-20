import { fireEvent, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { GuestLinkGenerator } from "@/components/guest-link-generator";
import { renderWithProviders } from "./test-utils";

afterEach(() => vi.unstubAllGlobals());
const guests = [{ path: "/for/ban-hoang-anh", displayName: "bạn Hoàng Anh" }, { path: "/for/co-hang", displayName: "cô Hằng" }];

describe("bulk guest-link form", () => {
  it("creates multiple links without a password and copies the full list", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true, guests }) }));
    const user = userEvent.setup();
    renderWithProviders(<GuestLinkGenerator />);
    expect(screen.queryByLabelText("Mật khẩu quản lý")).not.toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Danh sách khách mời"), { target: { value: "bạn Hoàng Anh\n\ncô Hằng\nbạn Hoàng Anh" } });
    expect(screen.getByText("Thân mời bạn Hoàng Anh")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Tạo link cho danh sách" }));
    expect(new URL((await screen.findByLabelText("Link của bạn Hoàng Anh") as HTMLInputElement).value).pathname).toBe("/for/ban-hoang-anh");
    expect(new URL((screen.getByLabelText("Link của cô Hằng") as HTMLInputElement).value).pathname).toBe("/for/co-hang");
    await user.click(screen.getByRole("button", { name: "Sao chép tất cả" }));
    expect(await navigator.clipboard.readText()).toBe("bạn Hoàng Anh\nhttp://localhost:3000/for/ban-hoang-anh\n\ncô Hằng\nhttp://localhost:3000/for/co-hang");
    fireEvent.change(screen.getByLabelText("Danh sách khách mời"), { target: { value: "chú Sơn" } });
    expect(screen.queryByLabelText("Link của cô Hằng")).not.toBeInTheDocument();
  });

  it("retains every entered line when saving fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Offline")));
    const user = userEvent.setup();
    renderWithProviders(<GuestLinkGenerator />);
    fireEvent.change(screen.getByLabelText("Danh sách khách mời"), { target: { value: "cô Hằng\nchú Sơn" } });
    await user.click(screen.getByRole("button", { name: "Tạo link cho danh sách" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Chưa tạo được link");
    expect(screen.getByLabelText("Danh sách khách mời")).toHaveValue("cô Hằng\nchú Sơn");
  });

  it("reports an invalid guest without creating the valid names first", async () => {
    const fetch = vi.fn(); vi.stubGlobal("fetch", fetch);
    const user = userEvent.setup();
    renderWithProviders(<GuestLinkGenerator />);
    fireEvent.change(screen.getByLabelText("Danh sách khách mời"), { target: { value: "bạn Khánh\n<invalid>" } });
    await user.click(screen.getByRole("button", { name: "Tạo link cho danh sách" }));
    expect(within(screen.getByRole("alert")).getByText(/Khách thứ 2/)).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });
});
