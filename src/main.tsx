import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createHashRouter } from 'react-router-dom'

/* Tokens first — Tailwind's @theme reads these variables, so they
   have to be defined before it binds its colour and shape scales. */
import './styles/tokens.css'
import './styles/tailwind.css'
import './styles/base.css'
import './styles/cover.css'

import { AppProvider } from './store/app'
import { SiteLayout } from './components/site/SiteLayout'
import Home from './pages/Home'

/* Route-level code splitting. Home ships in the entry chunk because
   it is the landing page; the rest load on navigation. */
const Courses = lazy(() => import('./pages/Courses'))
const CourseDetail = lazy(() => import('./pages/CourseDetail'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const MyLearning = lazy(() => import('./pages/MyLearning'))
const Learn = lazy(() => import('./pages/Learn'))
const NotFound = lazy(() => import('./pages/NotFound'))

/** Shown while a route chunk is in flight — usually a single frame. */
function RouteFallback() {
  return (
    <div className="routeload" role="status" aria-label="Loading">
      <span />
    </div>
  )
}

const page = (node: React.ReactNode) => <Suspense fallback={<RouteFallback />}>{node}</Suspense>

/* Hash routing: a static build with no server to rewrite deep links,
   so it works from any plain static host or sub-directory. */
const router = createHashRouter([
  {
    path: '/',
    element: <SiteLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'courses', element: page(<Courses />) },
      { path: 'courses/:slug', element: page(<CourseDetail />) },
      { path: 'about', element: page(<About />) },
      { path: 'contact', element: page(<Contact />) },
      { path: 'my-learning', element: page(<MyLearning />) },
      { path: 'learn/:slug', element: page(<Learn />) },
      { path: '*', element: page(<NotFound />) },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  </StrictMode>,
)
