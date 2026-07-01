// src/hooks/useLanguage.ts
import { useLanguage as useLanguageContext } from '../context/LanguageContext';

export const useLanguage = () => {
  const { t, currentLanguage, setLanguage } = useLanguageContext();
  
  // Có thể thêm các hàm helper khác nếu cần
  const translate = (key: string, defaultValue?: string) => {
    const translated = t(key);
    return translated === key ? defaultValue || key : translated;
  };
  
  return { t: translate, currentLanguage, setLanguage };
};