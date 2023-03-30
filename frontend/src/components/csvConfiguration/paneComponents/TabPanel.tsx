interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

/**
 * A tab panel component which handles the layout of the tabs
 *
 * @param {TabPanelProps} props - the required props for the component
 * @returns {JSX.Element} - the rendered component
 */
export const TabPanel = (props: TabPanelProps): JSX.Element => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      {...other}
      style={{ marginTop: "10px" }}
    >
      {value === index && children}
    </div>
  );
};
