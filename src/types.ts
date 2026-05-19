export type MessageType = 
  | 'text' 
  | 'image' 
  | 'input' 
  | 'options' 
  | 'checklist' 
  | 'price' 
  | 'testimonial' 
  | 'bonus' 
  | 'final_cta';

export interface Option {
  label: string;
  value: string;
  nextStep?: string;
}

export interface ChatMessage {
  id: string;
  type: MessageType;
  content?: string;
  imageUrl?: string;
  imageCaption?: string;
  options?: Option[];
  items?: string[];
  sender: 'bot' | 'user';
  name?: string; // used for testimonials
  location?: string; // used for testimonials
  price?: string;
  delay?: number; // ms to wait before showing
}
