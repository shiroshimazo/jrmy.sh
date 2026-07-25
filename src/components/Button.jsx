import { useClickSound } from "../hooks/useClickSound";
import "./Button.css";

export default function Button({
  as: As = "button",
  variant = "primary",
  children,
  className = "",
  onClick,
  ...rest
}) {
  const play = useClickSound();
  const handleClick = (e) => {
    play(variant === "primary" ? "click" : "tap");
    onClick?.(e);
  };
  return (
    <As
      className={`btn btn--${variant} ${className}`.trim()}
      onClick={handleClick}
      {...rest}
    >
      <span className="btn__label">{children}</span>
    </As>
  );
}
