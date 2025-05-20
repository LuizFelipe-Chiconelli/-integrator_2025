import './App.css'

import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Páginas padrão
import Home from './pages/home'
import Jobs from './pages/jobs'
import Login from './pages/login/login'
import Register from './pages/register/register'
import About from './pages/abouts/abouts'
import Business from './pages/business/business'

// Páginas do Dashboard
import PublishVacancy from './pages/(dashboard)/publish-vacancy/page'

// Layouts
import DefaultLayout from './components/layouts/default'
import DashboardLayout from './components/layouts/dashboard'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Rotas do layout Padrão */}
          <Route path='/' element={<DefaultLayout />}>
            <Route index element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/vagas' element={<Jobs />} />
            <Route path='/sobre' element={<About />} />
            <Route path='/empresa' element={<Business />} />
          </Route>

          {/* Rotas para layout Dashboard */}
          <Route path='/dashboard' element={<DashboardLayout />}>
            <Route path='publicar-vaga' element={<PublishVacancy />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
