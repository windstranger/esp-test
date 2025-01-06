import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {useAtomValue} from "jotai/index";
import {jsonArrayAtom} from "@/components/pages/main/atoms";
import {JSONDataRenderer} from "@/components/pages/main/JSONDataRenderer";

const arr = new Array(10000).fill(0).map((_, i) => i);
const amountOfElementsToRender = 20
const chunksToRender = 3

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
    const [renderedIndex, setRenderedIndex] = useState<number>(0);
    const arr = useAtomValue(jsonArrayAtom)

    const arrToRender = useMemo(() => {
        if (renderedIndex > chunksToRender) {
            return [...arr.slice((renderedIndex - chunksToRender) * amountOfElementsToRender, renderedIndex * amountOfElementsToRender + amountOfElementsToRender)]
        }
        return [...arr.slice(0, renderedIndex * amountOfElementsToRender + amountOfElementsToRender)]
    }, [arr, renderedIndex])

    const onScroll = useCallback(() => {
        const nodes = containerRef?.current?.childNodes;
        const node = nodes?.[nodes.length - 1]
        const firstNode = nodes?.[0]
        if (node instanceof HTMLElement && firstNode instanceof HTMLElement) {
            if (isElementPartiallyInViewport(node)) {
                setRenderedIndex(renderedIndex + 1)
                console.log("seee you")
            } else if (isElementPartiallyInViewport(firstNode)) {
                if (renderedIndex > chunksToRender)
                    setRenderedIndex(renderedIndex - chunksToRender - 1)
                console.log("seee first")
            } else {
                console.log("dont seee you")
            }
            ;
        }
    }, [renderedIndex, setRenderedIndex]);

    useEffect(() => {
        window.addEventListener("scroll", onScroll);
    }, [onScroll]);

    return (
        <div ref={containerRef} style={{height: arr.length * 100}} className="relative flex">
            {arrToRender.map((item, i) => {
                const bg = i % 2 ? "bg-gray-100" : "bg-gray-200";
                return <div key={i} style={{
                    top: item * 100
                }} className={`absolute h-[100px] w-auto ${bg}`}><JSONDataRenderer el={item}/></div>
            })}
        </div>
    )
}
