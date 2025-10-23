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
        <div className="min-h-screen w-full bg-gradient-to-b from-secondary/20 to-background flex items-center justify-center px-4">
            <Card className="w-full max-w-md border-border/60 shadow-lg motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-2 motion-safe:duration-500 motion-safe:ease-out">
                <CardHeader className="text-center space-y-2">
                    <img
                        src="/Logo3.png"
                        alt="Mehfil logo"
                        className="mx-auto h-14 w-14 rounded-lg bg-secondary/40 p-2 ring-1 ring-border object-contain transition-transform duration-300 ease-out hover:scale-[1.03]"
                    />
                    <CardTitle className="text-2xl font-semibold tracking-tight">
                        Sign in to Mehfil
                    </CardTitle>
                    <CardDescription className="text-base ">
                          A calm space to connect and share.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <SignInButton mode="modal" redirectUrl="/">
                        <Button
                            className="w-full transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
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
