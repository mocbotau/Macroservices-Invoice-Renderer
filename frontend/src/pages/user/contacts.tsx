import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  IconButton,
  Typography,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import { NextSeo } from "next-seo";

interface Contact {
  id: number;
  name: string;
  email?: string;
  phone?: string;
}

// const useStyles = makeStyles({
//   root: {
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     marginTop: 50,
//   },
//   table: {
//     minWidth: 650,
//   },
//   form: {
//     display: "flex",
//     flexDirection: "column",
//     marginTop: 20,
//     marginBottom: 20,
//   },
// });

export default function ContactPage() {
  const [emailContacts, setEmailContacts] = React.useState<Contact[]>([]);
  const [phoneContacts, setPhoneContacts] = React.useState<Contact[]>([]);
  const [emailName, setEmailName] = React.useState("");
  const [emailAddress, setEmailAddress] = React.useState("");
  const [phoneName, setPhoneName] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");

  const handleAddEmailContact = () => {
    const newContact: Contact = {
      id: Date.now(),
      name: emailName,
      email: emailAddress,
    };
    setEmailContacts([...emailContacts, newContact]);
    setEmailName("");
    setEmailAddress("");
  };

  const handleAddPhoneContact = () => {
    const newContact: Contact = {
      id: Date.now(),
      name: phoneName,
      phone: phoneNumber,
    };
    setPhoneContacts([...phoneContacts, newContact]);
    setPhoneName("");
    setPhoneNumber("");
  };

  const handleDeleteEmailContact = (id: number) => {
    const updatedContacts = emailContacts.filter(
      (contact) => contact.id !== id
    );
    setEmailContacts(updatedContacts);
  };

  return (
    <>
      <NextSeo title="Contacts" />
      <Typography variant="h5" fontWeight={600}>
        Manage Contacts
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email Address</TableCell>
              <TableCell>Phone Numbers</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {emailContacts.map((contact) => (
              <TableRow key={contact.id}>
                <TableCell>{contact.name}</TableCell>
                <TableCell>{contact.email}</TableCell>
                <TableCell>
                  <IconButton
                    aria-label="delete"
                    onClick={() => handleDeleteEmailContact(contact.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TextField
        label="Name"
        value={emailName}
        onChange={(event) => setEmailName(event.target.value)}
      />
      <TextField
        label="Email Address"
        value={emailAddress}
        onChange={(event) => setEmailAddress(event.target.value)}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddEmailContact}
      >
        <AddCircleIcon />
        Add Email Contact
      </Button>
      <TextField
        label="Name"
        value={phoneName}
        onChange={(event) => setPhoneName(event.target.value)}
      />
      <TextField
        label="Phone Number"
        value={phoneNumber}
        onChange={(event) => setPhoneNumber(event.target.value)}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddPhoneContact}
      >
        <AddCircleIcon />
        Add Phone Contact
      </Button>
    </>
  );
}
