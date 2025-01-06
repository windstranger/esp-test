import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {useAtomValue} from "jotai/index";
import {jsonArrayAtom} from "@/components/pages/main/atoms";
import {JSONDataRenderer} from "@/components/pages/main/JSONDataRenderer";

const arr = new Array(10000).fill(0).map((_, i) => i);
const amountOfElementsToRender = 20
const chunksToRender = 3
const oneElementHeight = 100
const offsetElementAmount = 3;

function isElementPartiallyInViewport(element: HTMLElement): boolean {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;

    const verticalInView = rect.top < windowHeight && rect.bottom > 0;
    const horizontalInView = rect.left < windowWidth && rect.right > 0;

    return verticalInView && horizontalInView;
}


export const LazyRender = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollableRef = useRef<HTMLDivElement>(null);

    const [startIndex, setStartIndex] = useState<number>(0)
    const [endIndex, setEndIndex] = useState<number>(0)
    console.log(endIndex);

    const arr = useAtomValue(jsonArrayAtom)
    console.log("arr length", arr.length);

    const arrToRender = useMemo(() => {
        return [...arr.slice(startIndex, endIndex)]
    }, [arr, startIndex, endIndex])

    const calculateSlice = useCallback(() => {
        const offsetHeight = scrollableRef?.current?.offsetHeight || 0;
        const scrollTop = scrollableRef?.current?.scrollTop || 0;
        const clientHeight = scrollableRef?.current?.clientHeight || 0;
        // const containerHeight = scrollableRef?.current?.clientHeight || 0;
        const calculatedAmountOfElementsToRender = Math.floor(clientHeight / oneElementHeight);
        const scrollElementIndex = scrollTop / oneElementHeight;

        const scrollEndIndex = Math.ceil(scrollElementIndex + calculatedAmountOfElementsToRender + 5);


        if(arr.length) {
            setStartIndex(scrollElementIndex > 5 ? Math.floor(scrollElementIndex - 5) : scrollElementIndex)
            // if(arr.length){
                setEndIndex(arr.length < scrollEndIndex ? arr.length : scrollEndIndex)
            // }
            // setEndIndex(scrollEndIndex)
        }

    }, [setStartIndex, setEndIndex, arr.length])

    useEffect(() => {
        calculateSlice()
    }, [arr.length])

    const onScroll = useCallback(() => {
        calculateSlice()
    }, [calculateSlice]);


    return (
        <div id={"scrollable"} ref={scrollableRef} onScroll={onScroll}
             className={"relative bg-amber-400 h-full overflow-auto"}>
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
