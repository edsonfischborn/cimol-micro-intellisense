import styles from "./styles.module.css";

interface SidebarActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onActionClick: () => void;
}

export const ActionButton = (props: SidebarActionButtonProps) => {
  const { icon, onActionClick, label } = props;

  return (
    <li className={styles.generalSidebarActionButton}>
      <button className={styles.button} onClick={onActionClick}>
        {icon}
        <p className={styles.buttonLabel}>{label}</p>
      </button>
    </li>
  );
};
