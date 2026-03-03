import { useState, useEffect } from 'react'

import SPWMini from 'spwmini/client'
import './App.css'

function App() {
  const [userName, setUserName] = useState("Noname")
  const [userHead, setUserHead] = useState("")

  const spm = new SPWMini('2c3db6cc-a30d-4c65-8b18-cc7e4fb42fbd', {
    autoinit: true,
  });

  useEffect(() => {
    const handleReady = () => {
      setUserName(spm.user.username);
      const uuid = spm.user.minecraftUUID;
      console.log(uuid);
      setUserHead(`https://mc-heads.net/avatar/${uuid}`);
    };

    spm.on('ready', handleReady)

    return () => {
      spm.off('ready', handleReady)
    }
  }, [])

  return (
    <>
      <div>
          <img src={userHead} className="logo" alt="Vite logo" />
      </div>
      <h1>Hello, {userName}</h1>
    </>
  )
}

export default App
