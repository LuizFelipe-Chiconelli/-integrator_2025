import './App.css'

import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Home from './pages/home'
import JobOffers from './pages/joboffers'

import Header from './components/header/header'
import Footer from './components/footer/footer'
import Login from './pages/login/login';
import Register from './pages/register/register'

function App() {

  return (
    <>
      <BrowserRouter>
        <Header />

        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/vagas' element={<JobOffers/>} />
        </Routes>

        <Footer />
      </BrowserRouter>
    </>
  )
}

export default App
