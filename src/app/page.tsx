import { Button } from '@/components/ui/button';
import { Logo } from '@/components/icons/logo';
import Link from 'next/link';

export default function WelcomePage() {
  return (
    <main className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-background to-primary/10">
      <div className="w-full max-w-xl mx-auto animate-fade-in text-center">
        <Logo iconClassName="size-20 text-primary mx-auto" textClassName="text-7xl" />
        <p className="mt-6 text-2xl font-headline">
          Welcome to Your AI-Powered Legal Assistant
        </p>
        <p className="mt-2 text-lg text-muted-foreground max-w-md mx-auto">
          Get instant, accurate, and context-aware legal insights with the power of generative AI.
        </p>
        
        <div className="mt-10">
          <Button asChild size="lg" className="shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
            <Link href="/register">
                Sign in with Google
            </Link>
          </Button>
        </div>
        
        <div className="text-center mt-12">
            <p className="text-sm text-muted-foreground">
                By continuing, you agree to our <Link href="#" className="underline hover:text-primary">Terms of Service</Link> and <Link href="#" className="underline hover:text-primary">Privacy Policy</Link>.
            </p>
        </div>
      </div>
    </main>
  );
}
