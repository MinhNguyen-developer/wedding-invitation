import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  helperText?: string;
  error?: string;
};

export const TextInput = forwardRef<HTMLInputElement, InputProps>(function TextInput(
  { label, helperText, error, id, className = "", ...props },
  ref
) {
  const inputId = id ?? props.name;
  const describedBy = [helperText ? `${inputId}-help` : null, error ? `${inputId}-error` : null]
    .filter(Boolean)
    .join(" ");

  return (
    <label className="grid gap-2 text-sm font-semibold text-ink" htmlFor={inputId}>
      <span>{label}</span>
      <input
        ref={ref}
        id={inputId}
        className={`min-h-12 rounded-xl border border-rosewood/20 bg-white px-4 text-base font-normal text-ink shadow-[0_2px_8px_rgb(55_35_33/0.035)] transition placeholder:text-ink/70 focus:border-rosewood focus:ring-2 focus:ring-rosewood/15 ${className}`}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy || undefined}
        {...props}
      />
      {helperText ? (
        <span id={`${inputId}-help`} className="text-sm font-normal leading-5 text-ink/70">
          {helperText}
        </span>
      ) : null}
      {error ? (
        <span id={`${inputId}-error`} role="alert" className="text-sm font-medium text-rosewood">
          {error}
        </span>
      ) : null}
    </label>
  );
});

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  helperText?: string;
  error?: string;
};

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  { label, helperText, error, id, className = "", ...props },
  ref
) {
  const inputId = id ?? props.name;
  const describedBy = [helperText ? `${inputId}-help` : null, error ? `${inputId}-error` : null]
    .filter(Boolean)
    .join(" ");

  return (
    <label className="grid gap-2 text-sm font-semibold text-ink" htmlFor={inputId}>
      <span>{label}</span>
      <textarea
        ref={ref}
        id={inputId}
        className={`min-h-32 resize-y rounded-xl border border-rosewood/20 bg-white px-4 py-3 text-base font-normal text-ink shadow-[0_2px_8px_rgb(55_35_33/0.035)] transition placeholder:text-ink/70 focus:border-rosewood focus:ring-2 focus:ring-rosewood/15 ${className}`}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy || undefined}
        {...props}
      />
      {helperText ? (
        <span id={`${inputId}-help`} className="text-sm font-normal leading-5 text-ink/70">
          {helperText}
        </span>
      ) : null}
      {error ? (
        <span id={`${inputId}-error`} role="alert" className="text-sm font-medium text-rosewood">
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
      className={`inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-rosewood px-6 py-3 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-rosewood/90 active:bg-rosewood/80 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      {...props}
    />
  );
}

export function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-gold">
      <span aria-hidden="true" className="h-px w-8 bg-gold/70" />
      {children}
    </p>
  );
}
