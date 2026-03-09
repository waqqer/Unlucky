import { useState, useEffect } from 'react'

import SPWMini from 'spwmini/client'
import './App.css'

function App() {
  const [userName, setUserName] = useState("Noname")
  const [userHead, setUserHead] = useState("https://mc-heads.net/avatar/")

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
    /*<>
      <div>
          <img src={userHead} className="logo" alt="Vite logo" />
      </div>
      <h1>Hello, {userName}</h1>
    </>*/

    <>
      <header>
        <div className="container header-inner">
          <div className="nav-links">
            <a href="/">Главная</a>
            <a href="/games">Выбор игр</a>
            <a href="/about">О нас</a>
          </div>

          <a href="/profile" className="user-profile">
            <div className="user-avatar"><i style={{backgroundImage: `url(${userHead})`}}></i></div>
            <div className="user-info">
              <span className="user-nick">{userName}</span>
              <span className="user-balance">1000 Ар</span>
            </div>
          </a>

          <div className="mobile-header">
            <span className="mobile-balance">1000 Ар</span>
            <a href="/profile" className="mobile-profile-link">Профиль</a>
          </div>
        </div>

      </header>

      <main>
        <div className="container hero">
          <h1><span style={{textShadow: "4px 4px 46px"}}><span style={{color: "#ffffff"}}>Un</span><span style={{color: "#9411ff"}}>Lucky</span></span></h1>
          <p>Онлайн казино на сервере СПм для поддержки казны и спонсирования Коробки..
          </p>
          <a href="/games" className="play-toggle">
            <span className="icon"><i className="fas fa-play"></i></span>
            <span className="text">играть</span>
          </a>
        </div>
      </main>
    </>
  )
}

export default App
