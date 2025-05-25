import './App.css'

import { BrowserRouter, Routes, Route,} from 'react-router-dom'

// Páginas padrão
import Home from './pages/(default)/home/page'
import Jobs from './pages/(default)/jobs/page'
import About from './pages/(default)/abouts/page'
import Business from './pages/(default)/business/page'

// Páginas do Dashboard
import Application from './pages/(dashboard)/application/page'
import PublishVacancy from './pages/(dashboard)/publish-vacancy/page'

// Páginas Login e Registro
import Login from './pages/(login-register)/login-usuario/page'
import Register from './pages/(login-register)/register-usuario/page'
import EmpresaLogin from './pages/(login-register)/login_empresa/page'
import EmpresaRegister from './pages/(login-register)/register_empresa/page'

// Layouts
import DefaultLayout from './components/layouts/default'
import DashboardLayout from './components/layouts/dashboard'
import AuthLayout from './components/layouts/auth'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Rotas do layout Padrão */}
          <Route path='/' element={<DefaultLayout />}>
            <Route index element={<Home />} />
            <Route path='/vagas' element={<Jobs />} />
            <Route path='/sobre' element={<About />} />
            <Route path='/empresa' element={<Business />} />
          </Route>

          {/* Rotas para layout Dashboard */}
          <Route path='/dashboard' element={<DashboardLayout />}>
            <Route path='publicar-vaga' element={<PublishVacancy />} />
            <Route path='candidaturas' element={<Application />} />
          </Route>

          {/* Rotas para layout Login/Register */}
          <Route path='/login-register' element={<AuthLayout />}>
            <Route path='login-usuario' element={< Login/>}/>
            <Route path='register-usuario' element={< Register/>}/>
            <Route path='login-empresa' element={< EmpresaLogin/>}/>
            <Route path='register-empresa' element={< EmpresaRegister/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
