import React, { useState, useEffect } from "react";
import '@aws-amplify/ui-react/styles.css';
import {
  Button,
  Flex,
  Heading,
  Text,
  TextField,
  View,
  Authenticator
} from "@aws-amplify/ui-react";

import { listNotes } from "./graphql/queries";
import {
  createNote as createNoteMutation,
  deleteNote as deleteNoteMutation,
} from "./graphql/mutations";

import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';
import config from './amplifyconfiguration.json';

Amplify.configure(config);

const client = generateClient();

export default function App() {
  const [notes, setNotes] = useState([]);
  
    useEffect(() => {
      fetchNotes();
    }, []);
  
    async function fetchNotes() {
      const clientData = await client.graphql({ query: listNotes });
      const notesFromclient = clientData.data.listNotes.items;
      setNotes(notesFromclient);
    }
  
    async function createNote(event) {
      event.preventDefault();
      const form = new FormData(event.target);
      const data = {
        name: form.get("name"),
        description: form.get("description"),
      };
      await client.graphql({
        query: createNoteMutation,
        variables: { input: data },
      });
      fetchNotes();
      event.target.reset();
    }
  
    async function deleteNote({ id }) {
      const newNotes = notes.filter((note) => note.id !== id);
      setNotes(newNotes);
      await client.graphql({
        query: deleteNoteMutation,
        variables: { input: { id } },
      });
    }
  return (
    <Authenticator className="pt-10" loginMechanisms={['email']}>
      {({ signOut, user }) => (
        <div className="h-screen">
          <View className="p-4">
              <span className="uppercase">Welcome Back {user.username}</span>
              <Heading level={2}>Create Notes</Heading>
              <View as="form" margin="3rem" onSubmit={createNote}>
                <Flex direction="row" justifyContent="center">
                  <TextField
                    name="name"
                    placeholder="Note Name"
                    label="Note Name"
                    labelHidden
                    variation="quiet"
                    required
                  />
                  <TextField
                    name="description"
                    placeholder="Note Description"
                    label="Note Description"
                    labelHidden
                    variation="quiet"
                    required
                  />
                  <Button type="submit" variation="primary">
                    Create Note
                  </Button>
                </Flex>
              </View>
              <Heading level={2}>Current Notes</Heading>
              <View margin="3rem 0">
                {notes.map((note) => (
                  <Flex
                    padding="0rem 1rem"
                    key={note.id || note.name}
                    direction="row"
                    justifyContent="left"
                    alignItems="center"
                  >
                    <Text as="strong" fontWeight={700}>
                      {note.name}
                    </Text>
                    <Text as="span">{note.description}</Text>
                    <Button variation="link" onClick={() => deleteNote(note)}>
                      Delete note
                    </Button>
                  </Flex>
                ))}
              </View>
              <Button onClick={signOut}>Sign Out</Button>
          </View>
        </div>
      )}
    </Authenticator>
  );
}



