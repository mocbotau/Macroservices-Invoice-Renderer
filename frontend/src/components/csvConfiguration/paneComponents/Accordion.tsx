import { AccordionDetails, AccordionSummary, Typography } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ReactNode, useState } from "react";
import { SetStateType } from "@src/interfaces";

interface ComponentProps {
  id: string;
  title: string;
  setMultipleSelection: SetStateType<boolean>;
  children: ReactNode;
}

/**
 * Handles the formation of an accordion, as well as its opening/closing behaviour etc.
 *
 * @param {ComponentProps} props - an object containing the props needed for the element
 * @returns {JSX.Element} - the component
 */
export const CustomAccordion = (props: ComponentProps): JSX.Element => {
  const { id, title, setMultipleSelection } = props;
  const [expanded, setExpanded] = useState(false);

  const handleAccordionChange = () => () => {
    setExpanded(!expanded);
    setMultipleSelection(false);
  };

  return (
    <Accordion expanded={expanded} onChange={handleAccordionChange()} key={id}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} id={id + "_bh_header"}>
        <Typography>{title}</Typography>
      </AccordionSummary>
      <AccordionDetails>{props.children}</AccordionDetails>
    </Accordion>
  );
};
