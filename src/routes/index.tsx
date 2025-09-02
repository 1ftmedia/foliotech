import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Layout } from '../components/Layout';
import { AuthProvider } from '../lib/hooks/useAuth';
import { RouteWrapper } from '../components/RouteWrapper';
import { ScrollToTop } from '../components/ScrollToTop';
import App from '../App';

// Helper function to handle lazy imports with retry logic
function lazyWithRetry(importFn: () => Promise<any>, retries = 3) {
  return lazy(() => {
    const retry = (attempt: number): Promise<any> =>
      importFn().catch((error) => {
        if (attempt >= retries) {
          throw error;
        }
        // Exponential backoff
        const delay = Math.min(1000 * Math.pow(2, attempt), 5000);
        return new Promise(resolve => setTimeout(resolve, delay)).then(() => retry(attempt + 1));
      });

    return retry(0);
  });
}

// Lazy-loaded components with retry logic
const Programs = lazyWithRetry(() => 
  import('../pages/programs').then(module => ({ default: module.default }))
);

const ProgramDetail = lazyWithRetry(() => 
  import('../pages/programs/[id]').then(module => ({ default: module.default }))
);

const CourseDetail = lazyWithRetry(() => 
  import('../pages/programs/[programId]/courses/[courseId]').then(module => ({ default: module.default }))
);

const Sponsorships = lazyWithRetry(() => 
  import('../pages/sponsorships').then(module => ({ default: module.default }))
);

const PartnershipInquiry = lazyWithRetry(() => 
  import('../pages/partnership-inquiry').then(module => ({ default: module.default }))
);

const Give = lazyWithRetry(() => 
  import('../pages/give').then(module => ({ default: module.default }))
);

const ComputerTechnology = lazyWithRetry(() => 
  import('../pages/programs/computer-technology').then(module => ({ default: module.default }))
);

const VocationalStudies = lazyWithRetry(() => 
  import('../pages/programs/vocational-studies').then(module => ({ default: module.default }))
);

const ConstructionTechnologies = lazyWithRetry(() => 
  import('../pages/programs/construction-technologies').then(module => ({ default: module.default }))
);

const About = lazyWithRetry(() => 
  import('../pages/about').then(module => ({ default: module.default }))
);

const Apply = lazyWithRetry(() => 
  import('../pages/apply').then(module => ({ default: module.default }))
);

const Profile = lazyWithRetry(() => 
  import('../pages/Profile').then(module => ({ default: module.default }))
);

const Settings = lazyWithRetry(() => 
  import('../pages/Settings').then(module => ({ default: module.default }))
);

const Dashboard = lazyWithRetry(() => 
  import('../pages/Dashboard').then(module => ({ default: module.default }))
);

const AuthCallback = lazyWithRetry(() => 
  import('../pages/auth/Callback').then(module => ({ default: module.default }))
);

const ResetPassword = lazyWithRetry(() => 
  import('../pages/auth/ResetPassword').then(module => ({ default: module.default }))
);

const ApplicationsPage = lazyWithRetry(() => 
  import('../pages/applications').then(module => ({ default: module.default }))
);

const ApplicationDetailPage = lazyWithRetry(() => 
  import('../pages/applications/[id]').then(module => ({ default: module.default }))
);

const CareerDevelopment = lazyWithRetry(() => 
  import('../pages/CareerDevelopment').then(module => ({ default: module.default }))
);

const Contact = lazyWithRetry(() => 
  import('../components/Contact').then(module => ({ default: module.Contact }))
);

const VolunteerToTeach = lazyWithRetry(() => 
  import('../pages/volunteer-to-teach').then(module => ({ default: module.default }))
);

const HireAGraduate = lazyWithRetry(() => 
  import('../pages/hire-a-graduate').then(module => ({ default: module.default }))
);

const FAQ = lazyWithRetry(() => 
  import('../pages/faq').then(module => ({ default: module.default }))
);

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
        <App />
      </RouteWrapper>
    ),
    errorElement: <ErrorBoundary />,
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
            <SuspenseWrapper>
              <Apply />
            </SuspenseWrapper>
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
            <SuspenseWrapper>
              <Profile />
            </SuspenseWrapper>
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
            <SuspenseWrapper>
              <Dashboard />
            </SuspenseWrapper>
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
    path: '/auth/callback',
    element: (
      <RouteWrapper>
        <ErrorBoundary>
          <SuspenseWrapper>
            <AuthCallback />
          </SuspenseWrapper>
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
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}