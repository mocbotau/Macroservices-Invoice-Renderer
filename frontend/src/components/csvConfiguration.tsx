import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Papa from "papaparse";

interface ComponentProps {
  file: File;
}

export default function CSVConfiguration(props: ComponentProps) {
  const [columnNames, setColumnNames] = useState<string[]>([]);
  const [values, setValues] = useState<string[][]>([]);

  useEffect(() => {
    Papa.parse(props.file, {
      header: true,
      skipEmptyLines: true,
      complete: (results: Papa.ParseResult<string>) => {
        const columnsArray = Object.keys(results.data[0]);
        const valuesArray = results.data.map((d) => Object.values(d));

        setColumnNames(columnsArray);
        setValues(valuesArray);
      },
    });
  }, []);

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              {columnNames.map((name: string) => (
                <TableCell>{name}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {values.map((row) => (
              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                {row.map((value) => (
                  <TableCell>{value}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
