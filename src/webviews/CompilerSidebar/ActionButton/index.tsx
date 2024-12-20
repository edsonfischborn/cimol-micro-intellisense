import styles from './styles.module.css';

interface ActionButtonProps {
  icon: React.ReactNode;
  tip?: string;
  tipPos?: 'top' | 'bottom';
  isDisabled?: boolean;
  onClick: () => void;
}

export const ActionButton = (props: ActionButtonProps) => {
  const { icon, onClick, tip = '', isDisabled = false, tipPos = 'top' } = props;

  const tipClass = `${styles.actionButtonTip} ${
    tipPos === 'top'
      ? styles['actionButtonTip--top']
      : styles['actionButtonTip--bottom']
  }`;

  const buttonClass = `${styles.actionButton} ${
    isDisabled ? styles['actionButton--disabled'] : {}
  }`;

  return (
    <button disabled={isDisabled} className={buttonClass} onClick={onClick}>
      {tip && <span className={tipClass}>{tip}</span>}
      {icon}
    </button>
  );
};
