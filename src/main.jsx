import { createRoot } from 'react-dom/client'
import App from './app'
import { BrowserRouter, Route, Routes } from 'react-router'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path='/Unlucky/' element={<App />} />
    </Routes>
  </BrowserRouter>
)