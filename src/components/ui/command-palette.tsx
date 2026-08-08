import React, { useState, useEffect } from 'react';
import { Command } from 'cmdk';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Phone, GraduationCap, Calendar, Info, Beaker, FileText, Image, Home, HelpCircle } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // Toggle the menu when ⌘K is pressed
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="overflow-hidden p-0 shadow-2xl rounded-2xl md:min-w-[550px] border-border bg-background/80 backdrop-blur-3xl">
        <Command className="[&_[cmdk-root]]:min-h-[300px] [&_[cmdk-root]]:min-w-full [&_[cmdk-input]]:h-14 [&_[cmdk-item]]:px-4 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:w-5 [&_[cmdk-item]_svg]:h-5">
          <div className="flex items-center border-b border-border/50 px-4">
            <Search className="mr-3 h-5 w-5 shrink-0 text-muted-foreground" />
            <Command.Input
              className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Search pages, academics, or contact info..."
              autoFocus
            />
          </div>
          <Command.List className="max-h-[350px] overflow-y-auto overflow-x-hidden p-2 custom-scrollbar">
            <Command.Empty className="py-6 text-center text-sm text-muted-foreground flex flex-col items-center gap-2">
              <HelpCircle className="h-8 w-8 opacity-20" />
              <p>No results found.</p>
            </Command.Empty>

            <Command.Group heading="Navigation" className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:text-muted-foreground">
              <Command.Item
                onSelect={() => runCommand(() => navigate('/'))}
                className="relative flex cursor-pointer select-none items-center rounded-xl outline-none data-[selected=true]:bg-primary/10 data-[selected=true]:text-primary transition-colors hover:bg-muted/50"
              >
                <Home className="mr-3 text-muted-foreground" />
                <span>Home</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => navigate('/about'))}
                className="relative flex cursor-pointer select-none items-center rounded-xl outline-none data-[selected=true]:bg-primary/10 data-[selected=true]:text-primary transition-colors hover:bg-muted/50"
              >
                <Info className="mr-3 text-muted-foreground" />
                <span>About Us</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => navigate('/academics'))}
                className="relative flex cursor-pointer select-none items-center rounded-xl outline-none data-[selected=true]:bg-primary/10 data-[selected=true]:text-primary transition-colors hover:bg-muted/50"
              >
                <GraduationCap className="mr-3 text-muted-foreground" />
                <span>Academics & Curriculum</span>
              </Command.Item>
            </Command.Group>

            <Command.Group heading="Admissions & Contact" className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:text-muted-foreground mt-2">
              <Command.Item
                onSelect={() => runCommand(() => navigate('/admissions'))}
                className="relative flex cursor-pointer select-none items-center rounded-xl outline-none data-[selected=true]:bg-primary/10 data-[selected=true]:text-primary transition-colors hover:bg-muted/50"
              >
                <FileText className="mr-3 text-muted-foreground" />
                <span>Apply for Admission</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => navigate('/contact'))}
                className="relative flex cursor-pointer select-none items-center rounded-xl outline-none data-[selected=true]:bg-primary/10 data-[selected=true]:text-primary transition-colors hover:bg-muted/50"
              >
                <Phone className="mr-3 text-muted-foreground" />
                <span>Contact Us</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => navigate('/contact'))}
                className="relative flex cursor-pointer select-none items-center rounded-xl outline-none data-[selected=true]:bg-primary/10 data-[selected=true]:text-primary transition-colors hover:bg-muted/50"
              >
                <MapPin className="mr-3 text-muted-foreground" />
                <span>School Location & Map</span>
              </Command.Item>
            </Command.Group>

            <Command.Group heading="Campus Life" className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:text-muted-foreground mt-2">
              <Command.Item
                onSelect={() => runCommand(() => navigate('/events'))}
                className="relative flex cursor-pointer select-none items-center rounded-xl outline-none data-[selected=true]:bg-primary/10 data-[selected=true]:text-primary transition-colors hover:bg-muted/50"
              >
                <Calendar className="mr-3 text-muted-foreground" />
                <span>Events & Calendar</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => navigate('/facilities'))}
                className="relative flex cursor-pointer select-none items-center rounded-xl outline-none data-[selected=true]:bg-primary/10 data-[selected=true]:text-primary transition-colors hover:bg-muted/50"
              >
                <Beaker className="mr-3 text-muted-foreground" />
                <span>Facilities & Labs</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => navigate('/gallery'))}
                className="relative flex cursor-pointer select-none items-center rounded-xl outline-none data-[selected=true]:bg-primary/10 data-[selected=true]:text-primary transition-colors hover:bg-muted/50"
              >
                <Image className="mr-3 text-muted-foreground" />
                <span>Photo Gallery</span>
              </Command.Item>
            </Command.Group>
          </Command.List>
          
          <div className="flex items-center justify-between border-t border-border/50 px-4 py-3 sm:px-6">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <kbd className="font-sans border border-border/50 rounded bg-muted/30 px-1.5 py-0.5 shadow-sm text-[10px]">&#8593;</kbd>
              <kbd className="font-sans border border-border/50 rounded bg-muted/30 px-1.5 py-0.5 shadow-sm text-[10px]">&#8595;</kbd>
              <span className="ml-1">to navigate</span>
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <kbd className="font-sans border border-border/50 rounded bg-muted/30 px-1.5 py-0.5 shadow-sm text-[10px]">Enter</kbd>
              <span className="ml-1">to select</span>
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <kbd className="font-sans border border-border/50 rounded bg-muted/30 px-1.5 py-0.5 shadow-sm text-[10px]">Esc</kbd>
              <span className="ml-1">to close</span>
            </span>
          </div>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
