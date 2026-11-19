import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { RsvpForm } from "@/components/rsvp-form";
import { renderWithProviders } from "./test-utils";

const fetchMock = vi.fn();
beforeEach(() => { fetchMock.mockReset(); vi.stubGlobal("fetch", fetchMock); });
afterEach(() => vi.unstubAllGlobals());
const response = (ok: boolean, message: string) => new Response(JSON.stringify({ ok, message }), { status: ok ? 201 : 503 });

async function enterName() {
  const user = userEvent.setup();
  renderWithProviders(<RsvpForm />);
  await user.type(screen.getByLabelText("Họ và tên"), "Nguyễn Minh Anh");
  return user;
}

describe("RsvpForm", () => {
  it("prevents an unnamed RSVP and focuses the invalid field", async () => {
    const user = userEvent.setup();
    renderWithProviders(<RsvpForm />);
    await user.click(screen.getByRole("button", { name: "Gửi phản hồi" }));
    expect(await screen.findByText("Vui lòng nhập họ và tên.")).toBeInTheDocument();
    expect(screen.getByLabelText("Họ và tên")).toHaveFocus();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("sends the selected attendee count and confirms success", async () => {
    fetchMock.mockResolvedValue(response(true, "Đã nhận phản hồi của bạn."));
    const user = await enterName();
    const count = screen.getByLabelText(/Số lượng người tham dự/);
    await user.clear(count);
    await user.type(count, "2");
    await user.type(screen.getByLabelText("Lời nhắn yêu thương"), "Chúc hai bạn hạnh phúc!");
    await user.click(screen.getByRole("button", { name: "Gửi phản hồi" }));
    expect(await screen.findByRole("status")).toHaveTextContent("Đã nhận phản hồi của bạn.");
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toMatchObject({ guestName: "Nguyễn Minh Anh", attendanceStatus: "attending", attendeeCount: 2, message: "Chúc hai bạn hạnh phúc!" });
    expect(screen.getByLabelText("Họ và tên")).toHaveValue("");
  });

  it("submits zero attendees when the guest cannot attend", async () => {
    fetchMock.mockResolvedValue(response(true, "Đã nhận phản hồi của bạn."));
    const user = await enterName();
    await user.click(screen.getByRole("radio", { name: "Rất tiếc, mình không tham dự" }));
    expect(screen.queryByLabelText(/Số lượng người tham dự/)).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Gửi phản hồi" }));
    await screen.findByRole("status");
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toMatchObject({ attendanceStatus: "not_attending", attendeeCount: 0 });
  });

  it("keeps guest input after a server error and lets them retry", async () => {
    fetchMock.mockResolvedValueOnce(response(false, "Vui lòng thử lại sau.")).mockResolvedValueOnce(response(true, "Đã gửi thành công."));
    const user = await enterName();
    await user.click(screen.getByRole("button", { name: "Gửi phản hồi" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Vui lòng thử lại sau.");
    expect(screen.getByLabelText("Họ và tên")).toHaveValue("Nguyễn Minh Anh");
    await user.click(screen.getByRole("button", { name: "Gửi phản hồi" }));
    expect(await screen.findByRole("status")).toHaveTextContent("Đã gửi thành công.");
  });

  it("recovers from network failure without losing guest input", async () => {
    fetchMock.mockRejectedValue(new Error("offline"));
    const user = await enterName();
    await user.click(screen.getByRole("button", { name: "Gửi phản hồi" }));
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("kiểm tra kết nối"));
    expect(screen.getByLabelText("Họ và tên")).toHaveValue("Nguyễn Minh Anh");
    expect(screen.getByRole("button", { name: "Gửi phản hồi" })).toBeEnabled();
  });
});
