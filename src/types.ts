export type TimeOfDay =
  | 'dawn'
  | 'morning'
  | 'midmorning'
  | 'midday'
  | 'afternoon'
  | 'sunset'
  | 'night'
  | 'sleeping';

export type MessageStyle =
  | 'sweet'
  | 'nostalgic'
  | 'elegant'
  | 'mysterious'
  | 'calming'
  | 'emotional'
  | 'inspiring'
  | 'indirect'
  | 'soft_romantic'
  | 'deep';

export interface CardConfig {
  bgColor: string;     // Tailwind gradient classes, e.g. "from-[#FFF8F0] to-[#EBE3FC]"
  textColor: string;   // Text classes, e.g. "text-slate-800"
  accentColor: string; // Accent styling for decorations, e.g. "bg-amber-400"
  glassStyles: string; // Additional Tailwind styling for glass effect
  overlayOpacity: number; // For cinematic lighting customization
  atmosphere: string;  // Short string summarizing visual backdrop
  effectType: 'rays' | 'lens_flare' | 'shadows' | 'dust' | 'sunset_glow' | 'stars' | 'moonlight' | 'none';
}

export interface GeneratedMessage {
  id: string;
  text: string;
  timeOfDay: TimeOfDay;
  style: MessageStyle;
  atmosphereSuggestion: string;
  colorAccent: string;
  isFavorite: boolean;
  createdAt: string;
  isCustomized?: boolean;
}

export interface UserPreferences {
  favoriteStyle: MessageStyle;
  selectedModel: 'flash' | 'pro';
  history: GeneratedMessage[];
}
