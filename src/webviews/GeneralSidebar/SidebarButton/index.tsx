import styles from './styles.module.css';

interface SidebarButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

export const SidebarButton = (props: SidebarButtonProps) => {
  const { icon, onClick, label } = props;

  return (
    <li className={styles.sidebarButton}>
      <button className={styles.button} onClick={onClick}>
        {icon}
        <p className={styles.buttonLabel}>{label}</p>
      </button>
    </li>
  );
};
