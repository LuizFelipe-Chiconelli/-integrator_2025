import './App.css'

import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Home from './pages/home'
import Jobs from './pages/jobs'
import Login from './pages/login/login'
import Register from './pages/register/register'
import About from './pages/abouts/abouts'
import Business from './pages/business/business'

import DefaultLayout from './components/layouts/default'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<DefaultLayout><Home /></DefaultLayout>} />
          <Route path='/login' element={<DefaultLayout><Login /></DefaultLayout>} />
          <Route path='/register' element={<DefaultLayout><Register /></DefaultLayout>} />
          <Route path='/vagas' element={<DefaultLayout><Jobs /></DefaultLayout>} />
          <Route path='/sobre' element={<DefaultLayout><About /></DefaultLayout>} />
          <Route path='/empresa' element={<DefaultLayout><Business /></DefaultLayout>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
