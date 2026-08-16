import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export const TextInput = forwardRef<HTMLInputElement, InputProps>(function TextInput(
  { label, error, id, className = "", ...props },
  ref
) {
  const inputId = id ?? props.name;

  return (
    <label className="grid gap-2 text-sm font-medium text-ink" htmlFor={inputId}>
      <span>{label}</span>
      <input
        ref={ref}
        id={inputId}
        className={`min-h-12 rounded-md border border-rosewood/25 bg-white/80 px-4 text-base shadow-sm transition focus:border-rosewood focus:ring-2 focus:ring-rosewood/20 ${className}`}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
      />
      {error ? (
        <span id={`${inputId}-error`} className="text-sm text-rosewood">
          {error}
        </span>
      ) : null}
    </label>
  );
});

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: string;
};

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  { label, error, id, className = "", ...props },
  ref
) {
  const inputId = id ?? props.name;

  return (
    <label className="grid gap-2 text-sm font-medium text-ink" htmlFor={inputId}>
      <span>{label}</span>
      <textarea
        ref={ref}
        id={inputId}
        className={`min-h-28 resize-y rounded-md border border-rosewood/25 bg-white/80 px-4 py-3 text-base shadow-sm transition focus:border-rosewood focus:ring-2 focus:ring-rosewood/20 ${className}`}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
      />
      {error ? (
        <span id={`${inputId}-error`} className="text-sm text-rosewood">
          {error}
        </span>
      ) : null}
    </label>
  );
});

export function PrimaryButton({
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-rosewood px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-rosewood/90 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      {...props}
    />
  );
}

export function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">{children}</p>;
}
