import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { Routes, Route, Navigate } from 'react-router';
import HomePage from './pages/HomePage.jsx';
import AuthPage from './pages/AuthPage.jsx';
import { Button } from '@/components/ui/button';

import * as Sentry from '@sentry/react';

const SentryRoutes = Sentry.withSentryReactRouterV7Routing(Routes);

function App() {
    return (
        <>
            <SignedIn>
                <SentryRoutes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/auth" element={<Navigate to={'/'} replace />} />
                </SentryRoutes>
            </SignedIn>

            <SignedOut>
                <SentryRoutes>
                    <Route path="/auth" element={<AuthPage />} />
                    <Route path="/*" element={<Navigate to={'/auth'} replace />} />
                </SentryRoutes>
            </SignedOut>
        </>
    );
}

export default App;
