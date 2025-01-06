import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {useAtomValue} from "jotai/index";
import {jsonArrayAtom} from "@/components/pages/main/atoms";
import {JSONDataRenderer} from "@/components/pages/main/JSONDataRenderer";

const oneElementHeight = 100
const elementsToPrerenderOffScreen = 5

export const LazyRender = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollableRef = useRef<HTMLDivElement>(null);

    const [startIndex, setStartIndex] = useState<number>(0)
    const [endIndex, setEndIndex] = useState<number>(0)

    const arr = useAtomValue(jsonArrayAtom)
    console.log("arr length", arr.length);

    const arrToRender = useMemo(() => {
        return [...arr.slice(startIndex, endIndex)]
    }, [arr, startIndex, endIndex])


    const calculateSlice = useCallback(() => {
        const scrollTop = scrollableRef?.current?.scrollTop || 0;
        const clientHeight = scrollableRef?.current?.clientHeight || 0;
        // find available visible area in order to see how many elements we can render
        const calculatedAmountOfElementsToRender = Math.floor(clientHeight / oneElementHeight);
        // check at which element we are located
        const scrollElementIndex = scrollTop / oneElementHeight;

        if (arr.length) {
            //calculate start and end indexes
            const scrollEndIndex = Math.ceil(scrollElementIndex + calculatedAmountOfElementsToRender + elementsToPrerenderOffScreen);
            setStartIndex(scrollElementIndex > elementsToPrerenderOffScreen ? Math.floor(scrollElementIndex - elementsToPrerenderOffScreen) : scrollElementIndex)
            setEndIndex(arr.length < scrollEndIndex ? arr.length : scrollEndIndex)
        }
    }, [setStartIndex, setEndIndex, arr.length])

    useEffect(() => {
        calculateSlice()
    }, [calculateSlice])

    const onScroll = useCallback(() => {
        calculateSlice()
    }, [calculateSlice]);


    return (
        <div id={"scrollable"} ref={scrollableRef} onScroll={onScroll}
             className={"relative h-full overflow-auto"}>
            <div ref={containerRef} id={"container"} style={{height: arr.length * oneElementHeight}}
                 className="absolute flex">
                {arrToRender.map((item, i) => {
                    const bg = i % 2 ? "bg-gray-100" : "bg-gray-200";
                    return <div key={item} style={{
                        top: item * oneElementHeight,
                        height: oneElementHeight
                    }} className={`absolute  w-auto ${bg}`}>
                        <JSONDataRenderer el={item}/>
                    </div>
                })}
            </div>
        </div>
    )
}
