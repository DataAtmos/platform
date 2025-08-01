import { MarketingContent } from "@/components/marketing/marketing-content"
import { ScheduleMeeting } from "@/components/marketing/schedule-meeting"

export default async function Home() {

  return (
    <div className="h-full overflow-auto">
      <div className="min-h-full flex flex-col">
        <main className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto px-4 py-8">
          <header className="text-center mb-8">
            <p className="font-mono text-muted-foreground text-xs max-w-md">
              OLTP, OLAP, and AI orchestration is about to get easier with Data Atmos
            </p>
          </header>
          
          <MarketingContent />
          <div className="mt-12">
            <ScheduleMeeting />
          </div>
        </main>

        <footer className="py-3 bg-background border-t border-border/40 mt-auto">
          <div className="flex items-center justify-center gap-2 font-mono text-muted-foreground text-[10px]">
            <a href="https://x.com/dataatmos" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
              @x/dataatmos
            </a>
            <span>·</span>
            <a href="https://github.com/dataatmos" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
              @github/dataatmos
            </a>
          </div>
        </footer>
      </div>
    </div>
  )
}