import { MarketingContent } from "@/components/marketing/marketing-content";
import { ScheduleMeeting } from "@/components/marketing/schedule-meeting";

export default function Home() {
  return (
    <div className="centered">
      <div className="max-w-4xl text-center">
        <MarketingContent />
        <div className="mt-12">
          <ScheduleMeeting />
        </div>
      </div>
    </div>
  );
}