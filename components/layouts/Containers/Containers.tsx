import styles from './Container.module.scss';

export const Box = ({ children }) => {
  return <div className={styles.box}>{children}</div>;
};

export const DashboardHeader = ({ children, ...props }) => {
  return (
    <div className={styles.dashboard_header} {...props}>
      {children}
    </div>
  );
};
