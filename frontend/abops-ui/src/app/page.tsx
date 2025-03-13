import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold">ABOps</span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign up</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
          <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              Unified Management Console
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              ABOps is a modern SaaS platform designed to manage organizations, teams, and users through a unified management console.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/signup">
                <Button size="lg">Get Started</Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg">Login</Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="container space-y-6 py-8 md:py-12 lg:py-24">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">
              Core Features
            </h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              ABOps provides a comprehensive set of tools to manage your organization's structure and users.
            </p>
          </div>

          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
            <div className="relative overflow-hidden rounded-lg border bg-background p-6">
              <div className="flex h-[180px] flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="font-bold">Organization Management</h3>
                  <p className="text-sm text-muted-foreground">
                    Create and manage organizations with ease. Add teams and users to your organizations.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-lg border bg-background p-6">
              <div className="flex h-[180px] flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="font-bold">Team Management</h3>
                  <p className="text-sm text-muted-foreground">
                    Organize your users into teams. Assign roles and permissions to team members.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-lg border bg-background p-6">
              <div className="flex h-[180px] flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="font-bold">User Management</h3>
                  <p className="text-sm text-muted-foreground">
                    Manage user accounts, roles, and permissions. Track user activity with audit logs.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-lg border bg-background p-6">
              <div className="flex h-[180px] flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="font-bold">Audit Logging</h3>
                  <p className="text-sm text-muted-foreground">
                    Keep track of all changes with detailed audit logs. Monitor user activity and system changes.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-lg border bg-background p-6">
              <div className="flex h-[180px] flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="font-bold">API Integration</h3>
                  <p className="text-sm text-muted-foreground">
                    All admin UI functions are exposed as API endpoints for seamless third-party integrations.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-lg border bg-background p-6">
              <div className="flex h-[180px] flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="font-bold">Modern UI</h3>
                  <p className="text-sm text-muted-foreground">
                    Clean, responsive design with light and dark mode support. Built with Next.js and Tailwind CSS.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} ABOps. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
