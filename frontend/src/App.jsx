import { Button } from '@/components/ui/button';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';

function App() {
    return (
        <header className="">
            {/* If Not Sign In, Show the sign in button */}
            <SignedOut>
                <SignInButton mode="modal">
                    <Button>Sign In</Button>
                </SignInButton>
            </SignedOut>
            {/* If Sign In, Shows user Profile */}
            <SignedIn>
                <UserButton />
            </SignedIn>
        </header>
    );
}

export default App;
