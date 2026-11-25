import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom';
import {ErrorBoundary} from './components/ErrorBoundary';
import {Layout} from './components/Layout';
import {FirebaseProvider} from './context/FirebaseContext';
import {LanguageProvider} from './context/LanguageContext';
import {AboutPage} from './pages/AboutPage';
import {AdminPage} from './pages/AdminPage';
import {ContactPage} from './pages/ContactPage';
import {DivisionsPage} from './pages/DivisionsPage';
import {HomePage} from './pages/HomePage';
import {InsightsPage} from './pages/InsightsPage';
import {ProductsPage} from './pages/ProductsPage';
import {ProjectsPage} from './pages/ProjectsPage';
import {ServicesPage} from './pages/ServicesPage';

export default function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <FirebaseProvider>
          <BrowserRouter>
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/divisions" element={<DivisionsPage />} />
                <Route path="/divisions/:slug" element={<DivisionsPage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/projects/:slug" element={<ProjectsPage />} />
                <Route path="/insights" element={<InsightsPage />} />
                <Route path="/insights/:slug" element={<InsightsPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </FirebaseProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}
