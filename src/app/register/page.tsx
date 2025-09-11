import { redirect } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/icons/logo';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Link from 'next/link';

export default function RegisterPage() {
  async function register(formData: FormData) {
    'use server';
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password');
    const role = formData.get('role') as string;

    // In a real application, you would save the user to a database.
    // For this prototype, we'll just redirect to the dashboard.
    if (name && email && password && role) {
      redirect(
        `/dashboard?role=${role}&mode=fast&name=${encodeURIComponent(
          name
        )}&email=${encodeURIComponent(email)}`
      );
    }
  }

  return (
    <main className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md">
         <div className="flex justify-center mb-8">
            <Logo iconClassName="size-12 text-primary" textClassName="text-5xl" />
        </div>
        <Card className="shadow-2xl">
          <form action={register}>
            <CardHeader className="text-center">
              <CardTitle className="font-headline text-3xl">
                Create an Account
              </CardTitle>
              <CardDescription>
                Get started with the future of legal tech.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="advocate@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">I am a...</Label>
                <Select name="role" required>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="advocate">Advocate</SelectItem>
                    <SelectItem value="student">Law Student</SelectItem>
                    <SelectItem value="public">Member of the Public</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="flex-col items-stretch gap-4">
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
              >
                Register
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link
                  href="/"
                  className="font-semibold text-primary hover:underline"
                >
                  Login
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </main>
  );
}
