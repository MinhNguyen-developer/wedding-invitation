import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { RsvpForm } from "@/components/rsvp-form";
import { WeddingInvitation } from "@/components/wedding-invitation";
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
  it("switches the form to the new recipient when navigating between guest invitations", async () => {
    const user = userEvent.setup();
    const { rerender } = renderWithProviders(<WeddingInvitation />);
    await user.type(screen.getByLabelText("Họ và tên"), "Tên ở thiệp chung");
    rerender(<WeddingInvitation guestName="general" guestSlug="general" />);
    expect(screen.getByLabelText("Họ và tên")).toHaveValue("general");
    rerender(<WeddingInvitation guestName="bạn Hoàng Anh" guestSlug="ban-hoang-anh" />);
    expect(screen.getByLabelText("Họ và tên")).toHaveValue("bạn Hoàng Anh");
    await user.clear(screen.getByLabelText("Họ và tên"));
    await user.type(screen.getByLabelText("Họ và tên"), "Tên đã chỉnh sửa");
    rerender(<WeddingInvitation guestName="cô Hằng" guestSlug="co-hang" />);
    expect(screen.getByLabelText("Họ và tên")).toHaveValue("cô Hằng");
  });

  it("prefills the invited guest name, submits it and keeps it after success", async () => {
    fetchMock.mockResolvedValue(response(true, "Đã nhận phản hồi của bạn."));
    const user = userEvent.setup();
    renderWithProviders(<RsvpForm initialGuestName="bạn Hoàng Anh" />);
    expect(screen.getByLabelText("Họ và tên")).toHaveValue("bạn Hoàng Anh");
    await user.click(screen.getByRole("button", { name: "Gửi phản hồi" }));
    await screen.findByRole("status");
    expect(JSON.parse(fetchMock.mock.calls[0][1].body).guestName).toBe("bạn Hoàng Anh");
    expect(screen.getByLabelText("Họ và tên")).toHaveValue("bạn Hoàng Anh");
  });

  it("allows editing a prefilled name and retains that edit if submission fails", async () => {
    fetchMock.mockResolvedValue(response(false, "Vui lòng thử lại sau."));
    const user = userEvent.setup();
    renderWithProviders(<RsvpForm initialGuestName="cô Hằng" />);
    const name = screen.getByLabelText("Họ và tên");
    await user.clear(name);
    await user.type(name, "Nguyễn Thị Hằng");
    await user.click(screen.getByRole("button", { name: "Gửi phản hồi" }));
    await screen.findByRole("alert");
    expect(JSON.parse(fetchMock.mock.calls[0][1].body).guestName).toBe("Nguyễn Thị Hằng");
    expect(name).toHaveValue("Nguyễn Thị Hằng");
  });

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
