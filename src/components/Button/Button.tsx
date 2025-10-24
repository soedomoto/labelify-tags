export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export const Button: React.FC<ButtonProps> = ({ variant = "primary", children, ...props }) => {
  return (
    <button
      {...props}
      style={{
        backgroundColor: variant === "primary" ? "#007bff" : "#6c757d",
        color: "#fff",
        padding: "8px 16px",
        borderRadius: "6px",
        border: "none",
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
};
