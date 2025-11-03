import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Layout } from '../components/Layout';
import { AuthProvider } from '../lib/hooks/useAuth';
import { RouteWrapper } from '../components/RouteWrapper';
import { ScrollToTop } from '../components/ScrollToTop';
import App from '../App';

// Critical routes - static imports for reliability
import Apply from '../pages/apply';
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';
import AuthCallback from '../pages/auth/Callback';
import AuthResult from '../pages/auth/AuthResult';
import SignIn from '../pages/auth/signin';
import SignUp from '../pages/auth/signup';

// Enhanced helper function to handle lazy imports with retry logic and better error handling
function lazyWithRetry(importFn: () => Promise<any>, retries = 3) {
  return lazy(() => {
    const retry = (attempt: number): Promise<any> =>
      importFn().catch((error) => {
        console.warn(`Dynamic import failed (attempt ${attempt + 1}/${retries + 1}):`, error);
        
        if (attempt >= retries) {
          // Log final error for debugging
          console.error('Dynamic import failed after all retries:', error);
          throw new Error(`Failed to load module after ${retries + 1} attempts: ${error.message}`);
        }
        
        // Exponential backoff with jitter
        const baseDelay = 1000 * Math.pow(2, attempt);
        const jitter = Math.random() * 500; // Add randomness to prevent thundering herd
        const delay = Math.min(baseDelay + jitter, 5000);
        
        return new Promise(resolve => setTimeout(resolve, delay)).then(() => retry(attempt + 1));
      });

    return retry(0);
  });
}

// Lazy-loaded components with retry logic
const Programs = lazyWithRetry(() => import('../pages/programs'));
const ProgramDetail = lazyWithRetry(() => import('../pages/programs/[id]'));
const CourseDetail = lazyWithRetry(() => import('../pages/programs/[programId]/courses/[courseId]'));
const Sponsorships = lazyWithRetry(() => import('../pages/sponsorships'));
const PartnershipInquiry = lazyWithRetry(() => import('../pages/partnership-inquiry'));
const Give = lazyWithRetry(() => import('../pages/give'));
const ComputerTechnology = lazyWithRetry(() => import('../pages/programs/computer-technology'));
const VocationalStudies = lazyWithRetry(() => import('../pages/programs/vocational-studies'));
const ConstructionTechnologies = lazyWithRetry(() => import('../pages/programs/construction-technologies'));
const About = lazyWithRetry(() => import('../pages/about'));
// Critical routes now use static imports - Apply, Dashboard, Profile, AuthCallback, AuthResult are imported above

const Settings = lazyWithRetry(() => import('../pages/Settings'));
const ResetPassword = lazyWithRetry(() => import('../pages/auth/ResetPassword'));
const ApplicationsPage = lazyWithRetry(() => import('../pages/applications'));
const ApplicationDetailPage = lazyWithRetry(() => import('../pages/applications/[id]'));
const CareerDevelopment = lazyWithRetry(() => import('../pages/CareerDevelopment'));
const Contact = lazyWithRetry(() => import('../components/Contact'));
const VolunteerToTeach = lazyWithRetry(() => import('../pages/volunteer-to-teach'));
const HireAGraduate = lazyWithRetry(() => import('../pages/hire-a-graduate'));

const FAQ = lazyWithRetry(() => import('../pages/faq'));
const GoogleOAuthTest = lazyWithRetry(() => import('../components/auth/GoogleOAuthTest'));
const OAuthTestPage = lazyWithRetry(() => import('../pages/oauth-test'));

// Enhanced Suspense wrapper with error handling
function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner message="Loading page..." />
        </div>
      }
    >
      {children}
    </Suspense>
  );
}

// Route configuration with proper error boundaries and suspense
const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <RouteWrapper>
        <Layout>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
        </Layout>
      </RouteWrapper>
    ),
  },
  {
    path: '/about',
    element: (
      <RouteWrapper>
        <Layout>
          <ErrorBoundary>
            <SuspenseWrapper>
              <About />
            </SuspenseWrapper>
          </ErrorBoundary>
        </Layout>
      </RouteWrapper>
    ),
  },
  {
    path: '/programs',
    element: (
      <RouteWrapper>
        <Layout>
          <ErrorBoundary>
            <SuspenseWrapper>
              <Programs />
            </SuspenseWrapper>
          </ErrorBoundary>
        </Layout>
      </RouteWrapper>
    ),
  },
  {
    path: '/programs/computer-technology',
    element: (
      <RouteWrapper>
        <Layout>
          <ErrorBoundary>
            <SuspenseWrapper>
              <ComputerTechnology />
            </SuspenseWrapper>
          </ErrorBoundary>
        </Layout>
      </RouteWrapper>
    ),
  },
  {
    path: '/programs/vocational-studies',
    element: (
      <RouteWrapper>
        <Layout>
          <ErrorBoundary>
            <SuspenseWrapper>
              <VocationalStudies />
            </SuspenseWrapper>
          </ErrorBoundary>
        </Layout>
      </RouteWrapper>
    ),
  },
  {
    path: '/programs/construction-technologies',
    element: (
      <RouteWrapper>
        <Layout>
          <ErrorBoundary>
            <SuspenseWrapper>
              <ConstructionTechnologies />
            </SuspenseWrapper>
          </ErrorBoundary>
        </Layout>
      </RouteWrapper>
    ),
  },
  {
    path: '/programs/:id',
    element: (
      <RouteWrapper>
        <Layout>
          <ErrorBoundary>
            <SuspenseWrapper>
              <ProgramDetail />
            </SuspenseWrapper>
          </ErrorBoundary>
        </Layout>
      </RouteWrapper>
    ),
  },
  {
    path: '/programs/:programId/courses/:courseId',
    element: (
      <RouteWrapper>
        <Layout>
          <ErrorBoundary>
            <SuspenseWrapper>
              <CourseDetail />
            </SuspenseWrapper>
          </ErrorBoundary>
        </Layout>
      </RouteWrapper>
    ),
  },
  {
    path: '/sponsorships',
    element: (
      <RouteWrapper>
        <Layout>
          <ErrorBoundary>
            <SuspenseWrapper>
              <Sponsorships />
            </SuspenseWrapper>
          </ErrorBoundary>
        </Layout>
      </RouteWrapper>
    ),
  },
  {
    path: '/partnership-inquiry',
    element: (
      <RouteWrapper>
        <Layout>
          <ErrorBoundary>
            <SuspenseWrapper>
              <PartnershipInquiry />
            </SuspenseWrapper>
          </ErrorBoundary>
        </Layout>
      </RouteWrapper>
    ),
  },
  {
    path: '/give',
    element: (
      <RouteWrapper>
        <Layout>
          <ErrorBoundary>
            <SuspenseWrapper>
              <Give />
            </SuspenseWrapper>
          </ErrorBoundary>
        </Layout>
      </RouteWrapper>
    ),
  },
  {
    path: '/apply',
    element: (
      <RouteWrapper>
        <Layout>
          <ErrorBoundary>
            <Apply />
          </ErrorBoundary>
        </Layout>
      </RouteWrapper>
    ),
  },
  {
    path: '/profile',
    element: (
      <RouteWrapper>
        <Layout>
          <ErrorBoundary>
            <Profile />
          </ErrorBoundary>
        </Layout>
      </RouteWrapper>
    ),
  },
  {
    path: '/settings',
    element: (
      <RouteWrapper>
        <Layout>
          <ErrorBoundary>
            <SuspenseWrapper>
              <Settings />
            </SuspenseWrapper>
          </ErrorBoundary>
        </Layout>
      </RouteWrapper>
    ),
  },
  {
    path: '/dashboard',
    element: (
      <RouteWrapper>
        <Layout>
          <ErrorBoundary>
            <Dashboard />
          </ErrorBoundary>
        </Layout>
      </RouteWrapper>
    ),
  },
  {
    path: '/applications',
    element: (
      <RouteWrapper>
        <Layout>
          <ErrorBoundary>
            <SuspenseWrapper>
              <ApplicationsPage />
            </SuspenseWrapper>
          </ErrorBoundary>
        </Layout>
      </RouteWrapper>
    ),
  },
  {
    path: '/applications/:id',
    element: (
      <RouteWrapper>
        <Layout>
          <ErrorBoundary>
            <SuspenseWrapper>
              <ApplicationDetailPage />
            </SuspenseWrapper>
          </ErrorBoundary>
        </Layout>
      </RouteWrapper>
    ),
  },
  {
    path: '/career-development',
    element: (
      <RouteWrapper>
        <Layout>
          <ErrorBoundary>
            <SuspenseWrapper>
              <CareerDevelopment />
            </SuspenseWrapper>
          </ErrorBoundary>
        </Layout>
      </RouteWrapper>
    ),
  },
  {
    path: '/contact',
    element: (
      <RouteWrapper>
        <Layout>
          <ErrorBoundary>
            <SuspenseWrapper>
              <Contact />
            </SuspenseWrapper>
          </ErrorBoundary>
        </Layout>
      </RouteWrapper>
    ),
  },
  {
    path: '/volunteer-to-teach',
    element: (
      <RouteWrapper>
        <Layout>
          <ErrorBoundary>
            <SuspenseWrapper>
              <VolunteerToTeach />
            </SuspenseWrapper>
          </ErrorBoundary>
        </Layout>
      </RouteWrapper>
    ),
  },
  {
    path: '/faq',
    element: (
      <RouteWrapper>
        <Layout>
          <ErrorBoundary>
            <SuspenseWrapper>
              <FAQ />
            </SuspenseWrapper>
          </ErrorBoundary>
        </Layout>
      </RouteWrapper>
    ),
  },
  {
    path: '/hire-a-graduate',
    element: (
      <RouteWrapper>
        <Layout>
          <ErrorBoundary>
            <SuspenseWrapper>
              <HireAGraduate />
            </SuspenseWrapper>
          </ErrorBoundary>
        </Layout>
      </RouteWrapper>
    ),
  },
  {
    path: '/auth/signin',
    element: (
      <RouteWrapper>
        <Layout>
          <ErrorBoundary>
            <SignIn />
          </ErrorBoundary>
        </Layout>
      </RouteWrapper>
    ),
  },
  {
    path: '/auth/signup',
    element: (
      <RouteWrapper>
        <Layout>
          <ErrorBoundary>
            <SignUp />
          </ErrorBoundary>
        </Layout>
      </RouteWrapper>
    ),
  },
  {
    path: '/auth/callback',
    element: (
      <RouteWrapper>
        <ErrorBoundary>
          <AuthCallback />
        </ErrorBoundary>
      </RouteWrapper>
    ),
  },
  {
    path: '/auth/reset-password',
    element: (
      <RouteWrapper>
        <ErrorBoundary>
          <SuspenseWrapper>
            <ResetPassword />
          </SuspenseWrapper>
        </ErrorBoundary>
      </RouteWrapper>
    ),
  },
  {
    path: '/auth/success',
    element: (
      <RouteWrapper>
        <ErrorBoundary>
          <AuthResult />
        </ErrorBoundary>
      </RouteWrapper>
    ),
  },
  {
    path: '/test/google-oauth',
    element: (
      <RouteWrapper>
        <Layout>
          <ErrorBoundary>
            <SuspenseWrapper>
              <GoogleOAuthTest />
            </SuspenseWrapper>
          </ErrorBoundary>
        </Layout>
      </RouteWrapper>
    ),
  },
  {
    path: '/oauth-test',
    element: (
      <RouteWrapper>
        <Layout>
          <ErrorBoundary>
            <SuspenseWrapper>
              <OAuthTestPage />
            </SuspenseWrapper>
          </ErrorBoundary>
        </Layout>
      </RouteWrapper>
    ),
  },
  {
    path: '*',
    element: (
      <RouteWrapper>
        <Layout>
          <ErrorBoundary>
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
              <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-900 dark:text-white">404</h1>
                <p className="mt-4 text-xl text-gray-600 dark:text-gray-400">Page not found</p>
                <p className="mt-2 text-gray-500 dark:text-gray-500">The page you're looking for doesn't exist.</p>
                <a 
                  href="/" 
                  className="mt-6 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Go Home
                </a>
              </div>
            </div>
          </ErrorBoundary>
        </Layout>
      </RouteWrapper>
    ),
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}