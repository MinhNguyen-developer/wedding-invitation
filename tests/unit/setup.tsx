import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

vi.mock("next/image", () => ({
  default: ({
    alt,
    src,
    fill: _fill,
    priority: _priority,
    ...props
  }: {
    alt: string;
    src: string;
    fill?: boolean;
    priority?: boolean;
    [key: string]: unknown;
  }) => {
    return <img alt={alt} src={typeof src === "string" ? src : ""} {...props} />;
  }
}));
