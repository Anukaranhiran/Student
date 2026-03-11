interface Props {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({ content, className = "" }: Props) {
  const lines = content.split("\n");

  const rendered = lines.map((line, lineIdx) => {
    const k = `md-${lineIdx}`;

    if (line.startsWith("### ")) {
      return (
        <h3 key={k} className="text-base font-semibold text-accent mt-4 mb-1">
          {line.replace("### ", "")}
        </h3>
      );
    }
    if (line.startsWith("## ")) {
      return (
        <h2
          key={k}
          className="text-lg font-bold text-primary mt-6 mb-2 pb-1 border-b border-border/50"
        >
          {line.replace("## ", "")}
        </h2>
      );
    }
    if (line.startsWith("# ")) {
      return (
        <h1 key={k} className="text-xl font-bold text-foreground mt-6 mb-2">
          {line.replace("# ", "")}
        </h1>
      );
    }
    if (line.startsWith("**") && line.endsWith("**")) {
      return (
        <p key={k} className="font-semibold text-foreground mt-3">
          {line.replace(/\*\*/g, "")}
        </p>
      );
    }
    if (line.startsWith("- ") || line.startsWith("* ")) {
      const text = line.replace(/^[-*] /, "");
      const parts = text.split(/(\*\*[^*]+\*\*)/);
      return (
        <li
          key={k}
          className="flex gap-2 items-start text-muted-foreground text-sm leading-relaxed"
        >
          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary/60 flex-shrink-0" />
          <span>
            {parts.map((part, partIdx) => {
              const pk = `${k}-p${partIdx}`;
              return part.startsWith("**") && part.endsWith("**") ? (
                <strong key={pk} className="text-foreground font-medium">
                  {part.replace(/\*\*/g, "")}
                </strong>
              ) : (
                part
              );
            })}
          </span>
        </li>
      );
    }
    if (line.match(/^\d+\. /)) {
      const num = line.match(/^(\d+)\. /)![1];
      const text = line.replace(/^\d+\. /, "");
      return (
        <li
          key={k}
          className="flex gap-2 items-start text-muted-foreground text-sm leading-relaxed"
        >
          <span className="mt-0.5 w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center flex-shrink-0 font-bold">
            {num}
          </span>
          <span>{text}</span>
        </li>
      );
    }
    if (line.trim() === "") {
      return <div key={k} className="h-1" />;
    }
    const parts = line.split(/(\*\*[^*]+\*\*)/);
    return (
      <p key={k} className="text-muted-foreground text-sm leading-relaxed">
        {parts.map((part, partIdx) => {
          const pk = `${k}-p${partIdx}`;
          return part.startsWith("**") && part.endsWith("**") ? (
            <strong key={pk} className="text-foreground font-medium">
              {part.replace(/\*\*/g, "")}
            </strong>
          ) : (
            part
          );
        })}
      </p>
    );
  });

  return (
    <div className={`space-y-1 ${className}`}>
      <ul className="space-y-1">{rendered}</ul>
    </div>
  );
}
