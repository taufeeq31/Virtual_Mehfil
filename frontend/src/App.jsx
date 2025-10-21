import { Button } from '@/components/ui/button';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { Routes, Route, Navigate } from 'react-router';
import HomePage from './pages/HomePage.jsx';
import AuthPage from './pages/AuthPage.jsx';

function App() {
    return (
        <>
            <SignedIn>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/auth" element={<Navigate to={'/'} replace />} />
                </Routes>
            </SignedIn>

            <SignedOut>
                <Routes>
                    <Route path="/auth" element={<AuthPage />} />
                    <Route path="/*" element={<Navigate to={'/auth'} replace />} />
                </Routes>
            </SignedOut>
        </>
    );
}

export default App;
