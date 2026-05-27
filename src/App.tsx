import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useAuthenticator } from '@aws-amplify/ui-react';

//const client = generateClient<Schema>();
const API_URL = "https://3rkrufkw17.execute-api.eu-north-1.amazonaws.com/led";

function App() {
  const {signOut, user } = useAuthenticator();
  
  async function sendCommand(action: string) {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      const data = await res.json();
      alert(data.result || data.error);
    } catch (e) {
      alert('Errore di connessione');
    }
  }

  return (
    <main>
      <h1>Ciao {user?.signInDetails?.loginId}</h1>
      <button onClick={() => sendCommand('ON')}>Accendi</button>
      <button onClick={() => sendCommand('OFF')}>Spegni</button>
      <button onClick={signOut}>Logout</button>
    </main>
  );
}


export default App;
