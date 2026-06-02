import Link from "next/link";

export default function Home() {
  return (
    <main className="flex-1 flex items-center justify-center">
      <div className="max-w-xl mx-auto px-6 text-center">
        {/* Logo / Title */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-3 mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
            >
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" x2="12" y1="19" y2="22" />
            </svg>
            <h1 className="text-3xl font-semibold tracking-tight">
              MeetingMind AI
            </h1>
          </div>

          <p className="text-muted-foreground text-lg leading-relaxed">
            Share a meeting screen and let AI generate transcripts, action
            items, decisions, risks, and summaries in real time.
          </p>
        </div>

        {/* CTA */}
        <Link
          href="/analysis"
          className="inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-8 py-3.5 text-base font-medium transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="6 3 20 12 6 21 6 3" />
          </svg>
          Start Meeting Analysis
        </Link>

        <p className="mt-6 text-sm text-muted-foreground">
          Works with Google Meet, Zoom, Microsoft Teams, or any browser tab.
        </p>
      </div>
    </main>
  );
}
