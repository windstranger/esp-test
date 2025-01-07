'use client';

import { LazyRender } from '@/components/pages/main/LazyRender';
import { Provider as JotaiProvider } from 'jotai';
import { JSONControls } from '@/components/pages/main/JSONControls';

export const MainPage = () => {
  return (
    <JotaiProvider>
      <div className={'pt-[126px] h-full'}>
        <JSONControls />
        <LazyRender />
      </div>
    </JotaiProvider>
  );
};
