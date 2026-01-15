import { AppTemplate } from "./AppTemplates";
import { Calculator } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function CalculatorApp() {
  const [display, setDisplay] = useState("0");
  
  const handleClear = () => setDisplay("0");
  const handleDigit = (d: string) => setDisplay(prev => prev === "0" ? d : prev + d);

  return (
    <AppTemplate title="Calculator" icon={Calculator}>
      <div className="max-w-[200px] mx-auto space-y-4">
        <div className="bg-black/40 p-4 rounded-md text-right text-2xl font-mono border border-white/5 truncate">
          {display}
        </div>
        <div className="grid grid-cols-4 gap-2">
          {["7", "8", "9", "/", "4", "5", "6", "*", "1", "2", "3", "-", "0", ".", "=", "+"].map((btn) => (
            <Button 
              key={btn} 
              variant={isNaN(Number(btn)) ? "secondary" : "outline"}
              size="sm"
              onClick={() => btn === "=" ? null : handleDigit(btn)}
              className="h-10"
            >
              {btn}
            </Button>
          ))}
          <Button 
            variant="destructive" 
            className="col-span-4 h-10 mt-2" 
            onClick={handleClear}
          >
            Clear
          </Button>
        </div>
      </div>
    </AppTemplate>
  );
}
