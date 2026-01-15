import { useState, useRef, useEffect } from "react";

export function TerminalApp() {
  const [lines, setLines] = useState<string[]>([
    "Welcome to Lunix Mint Web Edition",
    "Kernel v1.0.0-web running on browser",
    "",
    "Type 'help' for available commands.",
  ]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  const handleCommand = (cmd: string) => {
    const newLines = [...lines, `user@lunix:~$ ${cmd}`];
    
    switch (cmd.trim().toLowerCase()) {
      case 'help':
        newLines.push("Available commands: help, clear, echo [text], whoami, date, reboot");
        break;
      case 'clear':
        setLines([]);
        setInput("");
        return;
      case 'whoami':
        newLines.push("guest");
        break;
      case 'date':
        newLines.push(new Date().toString());
        break;
      case 'reboot':
        window.location.reload();
        break;
      default:
        if (cmd.startsWith('echo ')) {
          newLines.push(cmd.slice(5));
        } else if (cmd.trim() !== "") {
          newLines.push(`bash: ${cmd}: command not found`);
        }
    }
    setLines(newLines);
    setInput("");
  };

  return (
    <div className="h-full bg-black/90 text-green-400 font-mono text-sm p-4 overflow-y-auto" onClick={() => document.getElementById('term-input')?.focus()}>
      {lines.map((line, i) => (
        <div key={i} className="whitespace-pre-wrap mb-1">{line}</div>
      ))}
      <div className="flex items-center gap-2">
        <span className="text-green-500 font-bold">user@lunix:~$</span>
        <input
          id="term-input"
          autoFocus
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleCommand(input);
          }}
          className="flex-1 bg-transparent border-none outline-none text-green-400 font-mono"
          autoComplete="off"
        />
      </div>
      <div ref={endRef} />
    </div>
  );
}
