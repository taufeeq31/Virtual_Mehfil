import React from 'react';
import { SignInButton } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from '@/components/ui/card';

const AuthPage = () => {
    return (
        <div className="relative min-h-screen w-full bg-dotted-gradient flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-gradient-to-b from-[#08122f]/20 via-[#06214a]/50 to-[#08122f]/20 pointer-events-none" />
            <Card className="relative shadow-xl backdrop-blur-md w-full max-w-md rounded-2xl motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-2 motion-safe:duration-500 motion-safe:ease-out">
                <CardHeader className="text-center space-y-2">
                    <img
                        src="/Logo3.png"
                        alt="Mehfil logo"
                        className="mx-auto h-14 w-14 rounded  object-fit transition-transform duration-300 ease-out hover:scale-[1.03]"
                    />
                    <CardTitle className="text-2xl text-[#06214a] font-semibold  tracking-tight">
                        Sign in to Mehfil
                    </CardTitle>
                    <CardDescription className="text-base ">
                        A calm space to connect and share.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <SignInButton mode="modal" redirectUrl="/">
                        <Button
                            className="w-full transition-all duration-200 bg-[#06214a] ease-out hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 hover:bg-[#092e67]"
                            size="lg"
                        >
                            Continue to Mehfil
                        </Button>
                    </SignInButton>
                </CardContent>
                <CardFooter className="justify-center text-xs text-muted-foreground">
                    By continuing, you agree to our terms.
                </CardFooter>
            </Card>
        </div>
    );
};

export default AuthPage;
