import './App.css'

import { BrowserRouter, Routes, Route,} from 'react-router-dom'

// Páginas padrão
import Home from './pages/(default)/home/page'
import Jobs from './pages/(default)/jobs/page'
import About from './pages/(default)/abouts/page'
import Business from './pages/(default)/business/page'

// Páginas do Dashboard
import Profile from './pages/(dashboard)/profile/page'
import Application from './pages/(dashboard)/application/page'
import PublishVacancy from './pages/(dashboard)/publish-vacancy/page'
import CompanyJobs from './pages/(dashboard)/Jobs/page'

// Páginas Login e Registro
import Login from './pages/(auth)/login-usuario/page'
import Register from './pages/(auth)/register-usuario/page'
import EmpresaLogin from './pages/(auth)/login-empresa/page'
import EmpresaRegister from './pages/(auth)/register-empresa/page'

// Páginas de Erro
import PageNotFound from './pages/errors/404/page'
import Unauthorized from './pages/errors/403/page'

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
            <Route path='/unauthorized' element={<Unauthorized />} />
            <Route path='*' element={<PageNotFound />} />
          </Route>

          {/* Rotas para layout Dashboard */}
          <Route path='/dashboard' element={<DashboardLayout />}>
            <Route index element={<Profile />} />
            <Route path='publicar-vaga' element={<PublishVacancy />} />
            <Route path='candidaturas' element={<Application />} />
            <Route path='vagas' element={<CompanyJobs />} />
          </Route>

          {/* Rotas para layout Login/Register */}
          <Route path='/auth' element={<AuthLayout />}>
            <Route path='login-usuario' element={<Login />}/>
            <Route path='register-usuario' element={<Register />}/>
            <Route path='login-empresa' element={<EmpresaLogin />}/>
            <Route path='register-empresa' element={<EmpresaRegister />}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
