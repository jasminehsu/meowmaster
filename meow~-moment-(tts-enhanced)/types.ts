
export type LanguageCode = 'zh-TW' | 'zh-CN' | 'en';

export interface MultilingualText {
  'zh-TW': string;
  'zh-CN'?: string;
  'en'?: string;
}

export interface Quote {
  main: MultilingualText;
  action: MultilingualText;
  author: MultilingualText;
  music_type?: string;
  music_hint?: MultilingualText;
  music_url?: string;
}

export interface Scenario {
  id: string;
  label: MultilingualText;
  icon: string;
}

export interface CatProfile {
  id: string;
  name: MultilingualText;
  color: string;
}

export type AppStep = 'state' | 'quote' | 'cat' | 'rx';
