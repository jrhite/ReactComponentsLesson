// PRESENTATIONAL: one look for every button in the app.
// It has no idea what clicking it does. The parent passes onClick.

import type { ComponentProps } from "react";

// Every prop a normal <button> accepts (onClick, disabled, ...), plus `variant`
interface ButtonProps extends ComponentProps<"button"> {
  variant?: "default" | "primary" | "danger";
}

export default function Button({ variant = "default", children, ...rest }: ButtonProps) {
  return (
    <button type="button" className={`btn btn-${variant}`} {...rest}>
      {children}
    </button>
  );
}
