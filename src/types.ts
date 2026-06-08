export type MessageType = 
  | 'text' 
  | 'image' 
  | 'video'
  | 'input' 
  | 'options' 
  | 'checklist' 
  | 'price' 
  | 'testimonial' 
  | 'bonus' 
  | 'audio'
  | 'pdf_list'
  | 'final_cta';

export interface Option {
  label: string;
  value: string;
  nextStep?: string;
}

export interface PdfItem {
  title: string;
  filename: string;
  pages: number;
}

export interface ChatMessage {
  id: string;
  type: MessageType;
  content?: string;
  imageUrl?: string;
  videoUrl?: string;
  imageCaption?: string;
  audioUrl?: string;
  duration?: string;
  options?: Option[];
  items?: string[];
  pdfItems?: PdfItem[];
  sender: 'bot' | 'user';
  name?: string; // used for testimonials
  location?: string; // used for testimonials
  price?: string;
  delay?: number; // ms to wait before showing
}
