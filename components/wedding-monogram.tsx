import { weddingContent } from "@/lib/wedding-content";

export function WeddingMonogram({ className = "" }: { className?: string }) {
  return (
    <svg className={`wedding-monogram ${className}`} viewBox="0 0 320 400" fill="none" aria-hidden="true" focusable="false">
      <ellipse cx="160" cy="198" rx="103" ry="153" stroke="currentColor" strokeWidth="0.7" />
      <ellipse cx="160" cy="198" rx="94" ry="144" stroke="currentColor" strokeWidth="0.35" />
      <g stroke="currentColor" strokeWidth="1">
        <path d="M83 339C26 281 24 184 60 116M237 339c57-58 59-155 23-223" />
        <path d="M49 249c-24-8-29-25-24-38 18 7 25 21 24 38Zm-3-47c-21-15-23-32-16-44 16 12 20 28 16 44Zm7-46c-15-20-14-36-4-46 12 15 13 31 4 46Zm5 138c-25-3-35-16-34-30 20 2 31 12 34 30Zm213-45c24-8 29-25 24-38-18 7-25 21-24 38Zm3-47c21-15 23-32 16-44-16 12-20 28-16 44Zm-7-46c15-20 14-36 4-46-12 15-13 31-4 46Zm-5 138c25-3 35-16 34-30-20 2-31 12-34 30Z" />
        <path d="m160 19 3 9 9 3-9 3-3 9-3-9-9-3 9-3 3-9Zm0 338 3 9 9 3-9 3-3 9-3-9-9-3 9-3 3-9Z" />
      </g>
      <text x="95" y="212" fill="currentColor" className="monogram-initial">{weddingContent.groomName.charAt(0)}</text>
      <path d="m190 140-60 111" stroke="currentColor" strokeWidth="0.5" />
      <text x="158" y="252" fill="currentColor" className="monogram-initial">{weddingContent.brideName.charAt(0)}</text>
    </svg>
  );
}
