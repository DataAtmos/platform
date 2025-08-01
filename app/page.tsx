import Image from "next/image"
import { MarketingContent } from "@/components/contents/marketing-content"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { ScheduleMeeting } from "@/components/contents/schedule-meeting"

export default function Home() {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-between px-4 py-8">
      <main className="flex-1 flex flex-col items-center justify-center max-w-4xl">
        <header className="text-center mb-12">
          <div className="mb-8 flex justify-center">
            <Image src="/logo.svg" alt="Data Atmos Logo" width={60} height={60} priority className="dark:hidden" />
            <Image src="/logo-white.svg" alt="Data Atmos Logo" width={60} height={60} priority className="hidden dark:block" />
          </div>
          <p className="font-mono text-muted-foreground text-xs max-w-md">
            OLTP, OLAP, and AI orchestration is about to get easier with Data Atmos
          </p>
        </header>
        <MarketingContent />
        <div className="mt-15">
          <ScheduleMeeting />
        </div>
      </main>

      <footer className="py-4">
        <div className="flex items-center justify-center gap-2 font-mono text-muted-foreground text-[10px]">
          <a href="https://x.com/dataatmos" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
            @x/dataatmos
          </a>
          <span>·</span>
          <a href="https://github.com/dataatmos" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
            @github/dataatmos
          </a>
          <span>·</span>
          <ThemeToggle />
        </div>
      </footer>
    </div>
  )
}
