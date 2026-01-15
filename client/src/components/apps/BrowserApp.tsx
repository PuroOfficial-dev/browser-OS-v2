import { useState } from "react";
import { ArrowLeft, ArrowRight, RotateCw, Globe } from "lucide-react";

export function BrowserApp() {
  const [url, setUrl] = useState("https://en.wikipedia.org/wiki/Linux_Mint");
  const [inputUrl, setInputUrl] = useState(url);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUrl(inputUrl.startsWith('http') ? inputUrl : `https://${inputUrl}`);
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Toolbar */}
      <div className="h-10 bg-[#3c3c3c] flex items-center px-2 gap-2 border-b border-black">
        <div className="flex items-center text-gray-400">
          <button className="p-1 hover:text-white"><ArrowLeft className="w-4 h-4" /></button>
          <button className="p-1 hover:text-white"><ArrowRight className="w-4 h-4" /></button>
          <button className="p-1 hover:text-white"><RotateCw className="w-4 h-4" /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="flex-1">
          <div className="bg-[#2b2b2b] rounded flex items-center px-3 h-7 text-sm text-white">
            <Globe className="w-3.5 h-3.5 text-gray-400 mr-2" />
            <input 
              className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-500"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
            />
          </div>
        </form>
      </div>

      {/* Content */}
      <div className="flex-1 bg-white relative">
        <iframe 
          src={url}
          title="Browser"
          className="w-full h-full border-none"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        />
        {/* Note: Many sites block iframes. This is expected. */}
        <div className="absolute inset-0 -z-10 flex items-center justify-center text-gray-400">
          Loading content...
        </div>
      </div>
    </div>
  );
}
