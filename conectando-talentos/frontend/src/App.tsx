import './App.css'

import Header from './components/header/header'

import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Home from './pages/home'

function App() {

  return (
    <>
      <BrowserRouter>
        <Header />

        <Routes>
          <Route path='/' element={<Home/>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
