import "./Button.css";

export default function Button({
  as: As = "button",
  variant = "primary",
  children,
  className = "",
  ...rest
}) {
  return (
    <As className={`btn btn--${variant} ${className}`.trim()} {...rest}>
      <span className="btn__label">{children}</span>
    </As>
  );
}
