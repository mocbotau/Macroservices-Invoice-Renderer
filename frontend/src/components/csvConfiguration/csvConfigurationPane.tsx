import React, { useState, SyntheticEvent } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box, Container } from "@mui/system";
import { Button, Tab, Tabs } from "@mui/material";
import { invoiceOptions } from "./csvConfigurationFields";
import { mapFieldItems } from "./paneComponents/fieldInputs";
import { TabPanel } from "./paneComponents/tabPanel";

interface ComponentProps {
  selection: string[][];
}

export default function CSVConfigurationPane(props: ComponentProps) {
  const [expanded, setExpanded] = useState<string | false>(false);
  const [value, setValue] = useState(0);
  const [selectedField, setSelectedField] = useState("");

  const handleAccordionChange =
    (panel: string) => (event: SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <Container sx={{ py: 3 }}>
        <Typography
          variant="h4"
          color="secondary"
          align="center"
          gutterBottom={true}
          sx={{ textEmphasis: 20 }}
        >
          CSV Configurator
        </Typography>
        {invoiceOptions.map((category) => {
          return (
            <Accordion
              expanded={expanded === `${category.id}`}
              onChange={handleAccordionChange(`${category.id}`)}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                id={`${category.id}bh-header`}
              >
                <Typography>{category.name}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {category.id === "invoice_parties" ? (
                  <Box sx={{ width: "100%" }}>
                    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                      <Tabs
                        value={value}
                        onChange={handleTabChange}
                        variant="fullWidth"
                        textColor="secondary"
                        indicatorColor="secondary"
                      >
                        <Tab label="From" />
                        <Tab label="To" />
                      </Tabs>
                    </Box>
                    {["from", "to"].map((v, i) => {
                      return (
                        <TabPanel value={value} index={i}>
                          {mapFieldItems(
                            category.items,
                            props.selection,
                            selectedField,
                            setSelectedField,
                            category.id === "invoice_item",
                            v
                          )}
                        </TabPanel>
                      );
                    })}
                  </Box>
                ) : (
                  mapFieldItems(
                    category.items,
                    props.selection,
                    selectedField,
                    setSelectedField,
                    category.id === "invoice_item"
                  )
                )}
              </AccordionDetails>
            </Accordion>
          );
        })}
        <Box sx={{ position: "fixed", bottom: "20px" }}>
          <Box sx={{ display: "flex" }}>
            <Button variant="outlined" sx={{ flexGrow: 1, marginX: 1 }}>
              RESET
            </Button>
            <Button variant="contained" sx={{ flexGrow: 1, marginX: 1 }}>
              NEXT
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
}
