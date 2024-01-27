import './index.css'
import {
  LocationProvider,
  Router,
  Route,
  hydrate,
  prerender as ssr,
  lazy,
  ErrorBoundary,
} from 'preact-iso'
import { HomeView } from './pages/home/home'
import { NotFound } from './pages/_404'

function App() {
  return (
    <LocationProvider>
      <ErrorBoundary>
        <Router>
          <Route path="/" component={HomeView} />
          <Route
            path="/edit"
            component={lazy(() => import('./pages/edit/edit'))}
          />
          <Route default component={NotFound} />
        </Router>
      </ErrorBoundary>
    </LocationProvider>
  )
}

if (typeof window !== 'undefined') {
  hydrate(<App />, document.getElementById('app')!)
}

export async function prerender(data: any) {
  return await ssr(<App {...data} />)
}
