import { Folder, File, HardDrive, Image, Music, Video } from "lucide-react";

const MOCK_FILES = [
  { name: "Documents", type: "folder", items: 5 },
  { name: "Images", type: "folder", items: 12 },
  { name: "Music", type: "folder", items: 8 },
  { name: "project-notes.txt", type: "file", size: "2kb" },
  { name: "resume.pdf", type: "file", size: "1.2mb" },
  { name: "vacation.jpg", type: "image", size: "4.5mb" },
];

export function FilesApp() {
  return (
    <div className="h-full flex bg-background text-foreground">
      {/* Sidebar */}
      <div className="w-48 bg-card border-r border-white/5 p-4 space-y-1">
        <h3 className="text-xs font-bold text-muted-foreground uppercase mb-2 px-2">Places</h3>
        <SidebarItem icon={HardDrive} label="Home" active />
        <SidebarItem icon={Image} label="Pictures" />
        <SidebarItem icon={Video} label="Videos" />
        <SidebarItem icon={Music} label="Music" />
        
        <h3 className="text-xs font-bold text-muted-foreground uppercase mt-6 mb-2 px-2">Devices</h3>
        <SidebarItem icon={HardDrive} label="File System" />
        <SidebarItem icon={HardDrive} label="Data (D:)" />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="h-10 border-b border-white/5 flex items-center px-4 gap-2 bg-card/30">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Home</span>
            <span>/</span>
            <span className="text-foreground">user</span>
          </div>
        </div>
        
        <div className="flex-1 p-4 grid grid-cols-[repeat(auto-fill,minmax(90px,1fr))] content-start gap-4 overflow-y-auto">
          {MOCK_FILES.map((file, i) => (
            <button 
              key={i} 
              className="flex flex-col items-center gap-2 p-2 rounded hover:bg-white/5 active:bg-primary/10 group transition-colors"
            >
              {file.type === 'folder' ? (
                <Folder className="w-12 h-12 text-primary fill-primary/20" strokeWidth={1.5} />
              ) : file.type === 'image' ? (
                <Image className="w-12 h-12 text-purple-400" strokeWidth={1.5} />
              ) : (
                <File className="w-12 h-12 text-muted-foreground" strokeWidth={1.5} />
              )}
              <span className="text-xs text-center truncate w-full group-hover:text-primary transition-colors">
                {file.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function SidebarItem({ icon: Icon, label, active }: { icon: any, label: string, active?: boolean }) {
  return (
    <button className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm transition-colors ${active ? 'bg-primary/20 text-primary' : 'hover:bg-white/5 text-muted-foreground hover:text-foreground'}`}>
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}
