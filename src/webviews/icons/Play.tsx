interface PlayProps {
  size?: number;
  color?: string;
}

export const Play = (props: PlayProps) => {
  const { size = 24, color = "var(--vscode-icon-foreground)" } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ stroke: color }}
    >
      <polygon points="6 3 20 12 6 21 6 3" />
    </svg>
  );
};
