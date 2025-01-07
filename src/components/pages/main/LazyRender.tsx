import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAtomValue } from 'jotai/index';
import { fileReadAtom, jsonArrayAtom } from '@/components/pages/main/atoms';
import { JSONDataRenderer } from '@/components/pages/main/JSONDataRenderer';
import { useUserMeta } from '@/services/apiHooks/useUserMeta';

const oneElementHeight = 100;
const elementsToPrerenderOffScreen = 5;

export const LazyRender = () => {
  //because of using indexes as keys when rendering array, I need to reset data. and I was lazy, to rewrite logic,
  // so I just reset the key on file change... =)
  //precache data needed to render edit form
  const fileReadKey = useAtomValue(fileReadAtom);

  const containerRef = useRef<HTMLDivElement>(null);
  const scrollableRef = useRef<HTMLDivElement>(null);

  const [startIndex, setStartIndex] = useState<number>(0);
  const [endIndex, setEndIndex] = useState<number>(0);

  const jsonIdsArray = useAtomValue(jsonArrayAtom);

  const jsonIdsToRender = useMemo(() => {
    return [...jsonIdsArray.slice(startIndex, endIndex)];
  }, [jsonIdsArray, startIndex, endIndex]);

  const calculateSlice = useCallback(() => {
    const scrollTop = scrollableRef?.current?.scrollTop || 0;
    const clientHeight = scrollableRef?.current?.clientHeight || 0;
    // find available visible area in order to see how many elements we can render
    const calculatedAmountOfElementsToRender = Math.floor(clientHeight / oneElementHeight);
    // check at which element we are located
    const scrollElementIndex = scrollTop / oneElementHeight;

    if (jsonIdsArray.length) {
      //calculate start and end indexes
      const scrollEndIndex = Math.ceil(
        scrollElementIndex + calculatedAmountOfElementsToRender + elementsToPrerenderOffScreen,
      );
      setStartIndex(
        scrollElementIndex > elementsToPrerenderOffScreen
          ? Math.floor(scrollElementIndex - elementsToPrerenderOffScreen)
          : scrollElementIndex,
      );
      setEndIndex(jsonIdsArray.length < scrollEndIndex ? jsonIdsArray.length : scrollEndIndex);
    }
  }, [setStartIndex, setEndIndex, jsonIdsArray.length]);

  useEffect(() => {
    calculateSlice();
  }, [calculateSlice]);

  const onScroll = useCallback(() => {
    calculateSlice();
  }, [calculateSlice]);

  //prefetch metadata
  useUserMeta();

  return (
    <div
      key={fileReadKey}
      ref={scrollableRef}
      onScroll={onScroll}
      className={'relative h-full overflow-auto'}
    >
      <div
        ref={containerRef}
        style={{ height: jsonIdsArray.length * oneElementHeight }}
        className="absolute flex"
      >
        {jsonIdsToRender.map((objectId, i) => {
          const bg = i % 2 ? 'bg-gray-100' : 'bg-gray-200';
          return (
            <div
              key={objectId}
              style={{
                top: objectId * oneElementHeight,
                height: oneElementHeight,
              }}
              className={`absolute  w-auto ${bg}`}
            >
              <JSONDataRenderer objectId={objectId} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
