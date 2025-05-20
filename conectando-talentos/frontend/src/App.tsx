import './App.css'

import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Páginas padrão
import Home from './pages/(default)/home/page'
import Jobs from './pages/(default)/jobs/page'
import Login from './pages/(default)/login/page'
import Register from './pages/(default)/register/page'
import About from './pages/(default)/abouts/page'
import Business from './pages/(default)/business/page'

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
