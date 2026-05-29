import { useState } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import './App.css';

const API_URL = "https://3rkrufkw17.execute-api.eu-north-1.amazonaws.com/led";

function App() {
  const { signOut } = useAuthenticator();
  const [isOn, setIsOn] = useState(false);
  const [status, setStatus] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  async function sendCommand(action: string) {
    setLoading(true);
    setStatus({ text: 'invio...', type: 'loading' });

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      const data = await res.json();

      if (res.ok) {
        setIsOn(action === 'ON');
        setStatus({ text: action === 'ON' ? 'lampada accesa' : 'lampada spenta', type: 'ok' });
      } else {
        setStatus({ text: data.error || 'errore', type: 'err' });
      }
    } catch {
      setStatus({ text: 'errore di connessione', type: 'err' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Lampada</h1>
      </div>

      <div className={`bulb ${isOn ? 'on' : ''}`} />

      <div className="controls">
        <button className="btn btn-on" onClick={() => sendCommand('ON')} disabled={loading}>
          Accendi
        </button>
        <button className="btn btn-off" onClick={() => sendCommand('OFF')} disabled={loading}>
          Spegni
        </button>
      
        <hr style={{ border: 'none', borderTop: '1px solid #e0e0e0', margin: '8px 0' }} />
      
        <button className="btn btn-off" onClick={() => sendCommand('MODE_LDR')} disabled={loading}>
          Modalità Luce
        </button>
        <button className="btn btn-off" onClick={() => sendCommand('MODE_DISTANCE')} disabled={loading}>
          Modalità Distanza
        </button>
      </div>

      <p className={`status ${status.type}`}>{status.text}</p>

      <button className="logout" onClick={signOut}>Esci</button>
    </div>
  );
}

export default App;
