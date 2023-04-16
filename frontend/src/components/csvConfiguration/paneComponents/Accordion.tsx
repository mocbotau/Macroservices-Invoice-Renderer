import { AccordionDetails, AccordionSummary, Typography } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React, { ReactNode, useState } from "react";
import { SetStateType } from "@src/interfaces";

interface ComponentProps {
  id: string;
  title: string;
  setMultipleSelection: SetStateType<boolean>;
  expanded: string | false;
  setExpanded: SetStateType<string | false>;
  children: ReactNode;
}

/**
 * Handles the formation of an accordion, as well as its opening/closing behaviour etc.
 *
 * @param {ComponentProps} props - an object containing the props needed for the element
 * @returns {JSX.Element} - the component
 */
export const CustomAccordion = (props: ComponentProps): JSX.Element => {
  const { id, title, setMultipleSelection, expanded, setExpanded } = props;

  const handleAccordionChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
      setMultipleSelection(false);
    };

  return (
    <Accordion
      expanded={expanded === title}
      onChange={handleAccordionChange(title)}
      key={id}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />} id={id + "_bh_header"}>
        <Typography>{title}</Typography>
      </AccordionSummary>
      <AccordionDetails>{props.children}</AccordionDetails>
    </Accordion>
  );
};
