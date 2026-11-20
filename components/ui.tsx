import { forwardRef, useId, type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & { label: string; helperText?: string; error?: string };

export const TextInput = forwardRef<HTMLInputElement, InputProps>(function TextInput(
  { label, helperText, error, id, className = "", ...props }, ref
) {
  const generatedId = useId();
  const inputId = id ?? props.name ?? generatedId;
  const describedBy = [helperText ? `${inputId}-help` : null, error ? `${inputId}-error` : null].filter(Boolean).join(" ");

  return (
    <div className="field-label">
      <label htmlFor={inputId}>{label}</label>
      <input ref={ref} id={inputId} className={`form-control ${className}`} aria-invalid={Boolean(error)} aria-describedby={describedBy || undefined} {...props} />
      {helperText ? <span id={`${inputId}-help`} className="field-helper">{helperText}</span> : null}
      {error ? <span id={`${inputId}-error`} role="alert" className="field-error">{error}</span> : null}
    </div>
  );
});

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; helperText?: string; error?: string };

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  { label, helperText, error, id, className = "", ...props }, ref
) {
  const generatedId = useId();
  const inputId = id ?? props.name ?? generatedId;
  const describedBy = [helperText ? `${inputId}-help` : null, error ? `${inputId}-error` : null].filter(Boolean).join(" ");

  return (
    <div className="field-label">
      <label htmlFor={inputId}>{label}</label>
      <textarea ref={ref} id={inputId} className={`form-control ${className}`} aria-invalid={Boolean(error)} aria-describedby={describedBy || undefined} {...props} />
      {helperText ? <span id={`${inputId}-help`} className="field-helper">{helperText}</span> : null}
      {error ? <span id={`${inputId}-error`} role="alert" className="field-error">{error}</span> : null}
    </div>
  );
});

export function PrimaryButton({ className = "", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={`primary-button ${className}`} {...props} />;
}

export function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return <p className="section-eyebrow">{children}</p>;
}
