import React, { createContext, useState, useContext, ReactNode } from 'react';
import {ContentsInfoWithFiles, ContentsResponse} from '../api/contentsApi';

// 팝업 컨텍스트의 타입 정의
interface PopupContextType {
  showPopup: (content: ContentsResponse) => void;
  hidePopup: () => void;
  popupContent: ContentsResponse | null;
}

// 컨텍스트 생성
const PopupContext = createContext<PopupContextType | undefined>(undefined);

// 컨텍스트를 쉽게 사용하기 위한 커스텀 훅
export const usePopup = () => {
  const context = useContext(PopupContext);
  if (!context) {
    throw new Error('usePopup must be used within a PopupProvider');
  }
  return context;
};

// 컨텍스트 프로바이더 컴포넌트
interface PopupProviderProps {
  children: ReactNode;
}

export const PopupProvider: React.FC<PopupProviderProps> = ({ children }) => {
  const [popupContent, setPopupContent] = useState<ContentsResponse | null>(null);

  const showPopup = (content: ContentsResponse) => {
    setPopupContent(content);
  };

  const hidePopup = () => {
    setPopupContent(null);
  };

  return (
    <PopupContext.Provider value={{ showPopup, hidePopup, popupContent }}>
      {children}
    </PopupContext.Provider>
  );
};
