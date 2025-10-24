
'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Send, Bot, MessageSquare } from 'lucide-react';
import { chatWithBot } from '@/ai/flows/chatbot';
import type { ChatbotInput } from '@/ai/flows/chatbot-schemas';
import { useToast } from '@/hooks/use-toast';
import { Logo } from './logo';
import { useUser } from '@/firebase';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { User } from 'lucide-react';
import Link from 'next/link';


type Message = {
  role: 'user' | 'model';
  content: string;
};

const initialMessage: Message = {
    role: 'model',
    content: 'Halo! Saya Learnibot, asistenmu di Learniverse. Ada yang bisa saya bantu terkait fitur-fitur Learniverse hari ini?',
};

function getInitials(name: string | null | undefined): string {
  if (!name) return '';
  const names = name.split(' ');
  if (names.length > 1) {
    return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}


export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();

  const handleSend = async () => {
    if (input.trim() === '') return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const chatInput: ChatbotInput = {
        message: input,
        history: messages,
      };
      const response = await chatWithBot(chatInput);
      const botMessage: Message = {
        role: 'model',
        content: response.response,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Oops! Terjadi kesalahan',
        description: 'Gagal mendapatkan jawaban dari bot. Silakan coba lagi.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
        // Access the underlying viewport element to scroll
        const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages, isLoading]);


  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
          onClick={() => setIsOpen(true)}
        >
          <MessageSquare className="h-7 w-7" />
          <span className="sr-only">Buka Chatbot</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="flex h-full w-full flex-col p-0 sm:max-w-md"
        onOpenAutoFocus={(e) => e.preventDefault()} // Prevent autofocus on the close button
      >
        <SheetHeader className="p-4 pb-2 border-b shadow-sm">
          <SheetTitle className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
                <Logo withText={false} />
                <span>Learnibot Assistant</span>
            </Link>
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex-1" ref={scrollAreaRef}>
          <div className="space-y-4 py-4 px-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 ${
                  message.role === 'user' ? 'justify-end' : ''
                }`}
              >
                {message.role === 'model' && (
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Bot className="h-5 w-5" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-lg p-3 text-sm ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  {message.content}
                </div>
                {message.role === 'user' && (
                  <Avatar className="h-8 w-8">
                    {user?.photoURL && (
                      <AvatarImage
                        src={user.photoURL}
                        alt={user.displayName ?? 'User'}
                      />
                    )}
                    <AvatarFallback className="bg-secondary text-secondary-foreground">
                      {user?.photoURL ? (
                        getInitials(user.displayName)
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Bot className="h-5 w-5" />
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-muted p-3">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Mengetik...</span>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <SheetFooter className="border-t p-4 sm:p-4">
          <div className="flex w-full gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Tanya sesuatu..."
              disabled={isLoading}
              autoFocus
            />
            <Button onClick={handleSend} disabled={isLoading}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
