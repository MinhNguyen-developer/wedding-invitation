"use client";

import { ArrowUpRight, Check, Copy } from "lucide-react";
import { useState, type FormEvent } from "react";
import { guestListError, guestNamesSchema, MAX_GUESTS_PER_BATCH, splitGuestLines } from "@/lib/guest-link";
import { weddingContent } from "@/lib/wedding-content";
import { PrimaryButton, TextArea, TextInput } from "./ui";

type GuestResult = { url: string; displayName: string };

export function GuestLinkGenerator() {
  const [groom, bride] = weddingContent.coupleNames.split(" & ");
  const [input, setInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState<GuestResult[]>([]);
  const [copyMessage, setCopyMessage] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const lines = splitGuestLines(input);
  const parsed = guestNamesSchema.safeParse(lines);
  const count = parsed.success ? parsed.data.length : lines.length;
  const preview = lines[0]?.trim().replace(/\s+/gu, " ").normalize("NFC");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!parsed.success) { setError(guestListError(parsed.error)); return; }
    setSaving(true); setError(""); setResults([]); setCopyMessage(""); setCopied(null);
    try {
      const response = await fetch("/api/guest-links", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayNames: parsed.data }),
      });
      const body = await response.json();
      if (!response.ok || !body.ok) { setError(body.message || "Chưa tạo được link. Bạn hãy thử lại nhé."); return; }
      setResults(body.guests.map((guest: { path: string; displayName: string }) => ({ url: new URL(guest.path, window.location.origin).href, displayName: guest.displayName })));
    } catch {
      setError("Chưa tạo được link. Bạn hãy kiểm tra kết nối rồi thử lại nhé.");
    } finally { setSaving(false); }
  }

  async function copy(text: string, target: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(target);
      setCopyMessage(target === "all" ? "Đã sao chép toàn bộ danh sách link." : "Đã sao chép link của khách.");
    } catch {
      setCopyMessage("Chưa sao chép tự động được. Bạn có thể chọn và sao chép link bên dưới.");
    }
  }

  return (
    <div className="guest-builder-grid">
      <div className="guest-preview" aria-label="Xem trước lời mời">
        <span className="guest-preview-eyebrow">{count > 1 ? "Xem trước khách đầu tiên" : "Một lời mời, dành riêng"}</span>
        <p className="guest-preview-name" aria-live="polite">{preview ? `Thân mời ${preview}` : "Thân mời…"}</p>
        <span className="guest-preview-rule" aria-hidden="true" />
        <p className="guest-preview-couple">{groom} <em>&</em> {bride}</p>
        <span className="guest-preview-date">{weddingContent.weddingDate}</span>
      </div>
      <div className="guest-builder-panel">
        <form onSubmit={submit} aria-label="Tạo link cho khách mời" aria-busy={saving} className="guest-builder-form">
          <TextArea label="Danh sách khách mời" placeholder={"bạn Hoàng Anh\nbạn Khánh\ncô Hằng\nchú Sơn"} rows={6} required
            helperText={`Mỗi dòng một khách, tối đa ${MAX_GUESTS_PER_BATCH} khách mỗi lượt. Bỏ qua dòng trống và tên trùng.`}
            value={input} disabled={saving} onChange={(event) => { setInput(event.target.value); setResults([]); setError(""); setCopyMessage(""); setCopied(null); }} />
          {count > 0 ? <p className="field-helper">{count} khách trong danh sách</p> : null}
          {error ? <p role="alert" className="form-feedback form-feedback-error">{error}</p> : null}
          <PrimaryButton type="submit" disabled={saving}>{saving ? "Đang tạo danh sách link…" : "Tạo link cho danh sách"}</PrimaryButton>
        </form>
        {results.length ? (
          <div className="guest-link-result" aria-label="Danh sách link đã tạo">
            <p className="guest-result-confirmation" role="status"><Check size={18} aria-hidden="true" /> Đã tạo {results.length} link lời mời.</p>
            <PrimaryButton type="button" onClick={() => void copy(results.map((guest) => `${guest.displayName}\n${guest.url}`).join("\n\n"), "all")}>
              {copied === "all" ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />} Sao chép tất cả
            </PrimaryButton>
            {copyMessage ? <p role="status" className="field-helper">{copyMessage}</p> : null}
            <ul className="guest-results-list">
              {results.map((guest) => (
                <li key={guest.url} className="guest-link-card">
                  <h3>{guest.displayName}</h3>
                  <TextInput label={`Link của ${guest.displayName}`} readOnly value={guest.url} onFocus={(event) => event.currentTarget.select()} />
                  <div className="guest-result-actions">
                    <PrimaryButton type="button" aria-label={`Sao chép link của ${guest.displayName}`} onClick={() => void copy(guest.url, guest.url)}>
                      {copied === guest.url ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />} {copied === guest.url ? "Đã sao chép" : "Sao chép link"}
                    </PrimaryButton>
                    <a href={guest.url} target="_blank" rel="noopener noreferrer" className="text-link" aria-label={`Mở thiệp của ${guest.displayName}`}>Mở thiệp <ArrowUpRight size={16} aria-hidden="true" /></a>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        <p className="guest-builder-note">Tạo xong, gửi từng link cho khách qua tin nhắn, hoặc sao chép toàn bộ danh sách để lưu lại.</p>
      </div>
    </div>
  );
}
