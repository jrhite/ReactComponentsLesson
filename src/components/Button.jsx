// PRESENTATIONAL: one look for every button in the app.
// It has no idea what clicking it does. The parent passes onClick.

export default function Button({ variant = "default", children, ...rest }) {
  return (
    <button type="button" className={`btn btn-${variant}`} {...rest}>
      {children}
    </button>
  );
}
