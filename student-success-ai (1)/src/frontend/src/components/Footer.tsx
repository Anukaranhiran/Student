import { BrainCircuit, Heart } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const utmLink = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`;

  return (
    <footer className="border-t border-border/40 py-8 mt-16">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-4 h-4 text-primary" />
          <span className="font-display font-semibold text-foreground/70">
            StudentSuccess AI
          </span>
        </div>
        <p className="flex items-center gap-1">
          © {year}. Built with{" "}
          <Heart className="w-3.5 h-3.5 text-primary inline fill-primary" />{" "}
          using{" "}
          <a
            href={utmLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </footer>
  );
}
