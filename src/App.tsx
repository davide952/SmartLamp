import { useState } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import './App.css';

const API_URL = "https://3rkrufkw17.execute-api.eu-north-1.amazonaws.com/led";

function App() {
  const { signOut } = useAuthenticator();
  const [isOn, setIsOn] = useState(false);
  const [status, setStatus] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  const [brightness, setBrightness] = useState(255);
  const [color, setColor] = useState('#ffffff');

  async function sendBrightness(value: number) {
    const r = Math.round(parseInt(color.slice(1,3), 16) * value / 255); //logica invertita per l'anodo comune, minimo 255 e max 0
    const g = Math.round(parseInt(color.slice(3,5), 16) * value / 255); //taglia la stringa per prendere solo i due caratteri esadecimali del colorpicker
    const b = Math.round(parseInt(color.slice(5,7), 16) * value / 255);
    await sendCommand(`COLOR:${r},${g},${b}`);
  }

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
      if (action === 'ON') {
        setIsOn(true);
        setStatus({ text: 'lampada accesa', type: 'ok' });
      } else if (action === 'OFF') {
        setIsOn(false);
        setStatus({ text: 'lampada spenta', type: 'ok' });
      } else if (action === 'MODE_LDR') {
        setStatus({ text: 'modalità luce attiva', type: 'ok' });
      } else if (action === 'MODE_DISTANCE') {
        setStatus({ text: 'modalità distanza attiva', type: 'ok' });
      }
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

        <input 
          type="range" min="0" max="255" value={brightness}
          onChange={(e) => setBrightness(Number(e.target.value))}
          onMouseUp={(e) => sendBrightness(Number((e.target as HTMLInputElement).value))}
          onTouchEnd={(e) => sendBrightness(Number((e.target as HTMLInputElement).value))}
        />
        
        <input 
          type="color" value={color}
          onChange={(e) => { setColor(e.target.value); sendBrightness(brightness); }}
        />        
      </div>

      <p className={`status ${status.type}`}>{status.text}</p>

      <button className="logout" onClick={signOut}>Esci</button>
    </div>
  );
}
export default App;
