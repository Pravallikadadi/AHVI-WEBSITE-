import { Fragment, type ReactNode } from "react";

/** Splits `text` on the literal word "AHVI" and wraps each occurrence in the Anton wordmark style, leaving everything else untouched. */
export function highlightAhvi(text: string): ReactNode {
  const parts = text.split(/(AHVI)/g);
  if (parts.length === 1) return text;
  return parts.map((part, i) =>
    part === "AHVI" ? (
      <span key={i} className="ahvi-wordmark ahvi-wordmark-light">
        AHVI
      </span>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    )
  );
}
