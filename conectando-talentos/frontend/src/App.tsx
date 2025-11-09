import './App.css'

import { BrowserRouter, Route, Routes } from 'react-router-dom'

// Layouts
import UserLayout from './components/layouts/user-layout'
import DefaultLayout from './components/layouts/default-layout'
import CompanyLayout from './components/layouts/company-layout'

// Pages - Default Layout
import HomePage from './_pages/(Default)/home/page'
import AboutUsPage from './_pages/(Default)/about-us/page'
import VacanciesPage from './_pages/(Default)/vacancies/page'
import CompaniesPage from './_pages/(Default)/companies/page'
import SingleVacancyPage from './_pages/(User)/single-vacancy/page'

// Pages - Auth Layout
import CandidateSignInPage from './_pages/(Auth)/candidate-signin/page'
import CandidateSignUpPage from './_pages/(Auth)/candidate-signup/page'
import CompanySignInPage from './_pages/(Auth)/company-signin/page'
import CompanySignUpPage from './_pages/(Auth)/company-signup/page'

// Pages - User Layout
import UserHomePage from './_pages/(User)/home/page'
import CurriculumPage from './_pages/(User)/curriculum/page'

// Pages - Company Layout
import CompanyHomePage from './_pages/(Company)/home/page'
import MyVacanciesPage from './_pages/(Company)/my-vacancies/page'
import PublishVacancyPage from './_pages/(Company)/publish-vacancy/page'

// Pages - Error
import Unauthorized from './_pages/errors/403/page'
import PageNotFound from './_pages/errors/404/page'

// Providers
import NotificationProvider from './components/notifications/context'

function App() {
	return (
		<>
			<NotificationProvider>
				<BrowserRouter>
					<Routes>
						{/* Rotas do layout Padrão */}
						<Route path='/' element={<DefaultLayout />}>
							<Route index element={<HomePage />} />
							<Route path='/vagas' element={<VacanciesPage />} />
							<Route path='/empresa' element={<CompaniesPage />} />
							<Route path='/sobre' element={<AboutUsPage />} />
							<Route path='/vaga/:id' element={<SingleVacancyPage />} />

							<Route path='/unauthorized' element={<Unauthorized />} />
							<Route path='*' element={<PageNotFound />} />
						</Route>

						{/* Rotas para layout Company */}
						<Route path='/minha-empresa' element={<CompanyLayout />}>
							<Route index element={<CompanyHomePage />} />
							<Route path='publicar-vaga' element={<PublishVacancyPage />} />
							{/* <Route path='candidaturas' element={<Application />} /> */}
							<Route path='vagas' element={<MyVacanciesPage />} />
							{/* <Route path='*' element={<PageNotFound />} /> */}
						</Route>

						{/* Rotas para layout User */}
						<Route path='/usuario' element={<UserLayout />}>
							<Route index element={<UserHomePage />} />
							<Route path='curriculo' element={<CurriculumPage />} />
							{/* <Route path='candidaturas' element={<UserApplication />} /> */}
							{/* <Route path='*' element={<PageNotFound />} /> */}
						</Route>

						{/* Rotas para layout Login/Register */}
						<Route path='/auth' element={<DefaultLayout />}>
							<Route path='login-usuario' element={<CandidateSignInPage />} />
							<Route path='register-usuario' element={<CandidateSignUpPage />} />
							<Route path='login-empresa' element={<CompanySignInPage />} />
							<Route path='register-empresa' element={<CompanySignUpPage />} />
						</Route>
					</Routes>
				</BrowserRouter>
			</NotificationProvider>
		</>
	)
}

export default App
