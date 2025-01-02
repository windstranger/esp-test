import {memo, useEffect, useMemo, useRef} from "react";
import {useAtomValue, useSetAtom} from "jotai/index";
import {jsonAtom} from "@/components/pages/main/atoms";
import {selectAtom} from "jotai/utils";
import {debounce} from "next/dist/server/utils";

export const JSONDataRenderer = memo(function JSONDataRenderer({el}: { el: number }) {
    const inputRef = useRef<HTMLInputElement>(null);
    const setJSONData = useSetAtom(jsonAtom);
    const selectedElement = useMemo(() => {
        return selectAtom(jsonAtom, item => item?.[el])
    }, [el]);
    const data = useAtomValue(selectedElement);

    console.log("rerenders");
    useEffect(() => {
        const inputElement = inputRef.current;
        if (inputElement) {
            const handleChange = debounce((event: Event) => {
                const target = event.target as HTMLInputElement;
                console.log("Input value changed to:", target.value);
                setJSONData(prev => {
                    if (prev) {
                        prev[el] = {...prev[el], age: Number(target.value)}
                        return {...prev};
                    }
                });
            }, 500);

            inputElement.addEventListener("input", handleChange);

            // Cleanup event listener on component unmount
            return () => {
                inputElement.removeEventListener("input", handleChange);
            };
        }
    }, [setJSONData]);


    return <div className={"flex flex-col bg-gray-200 p-4 shadow"}>
        <div className={"grid grid-cols-2 justify-between"}>
            <div>name:</div>
            <div>{data?.name}</div>
        </div>
        <div className={"grid grid-cols-2 justify-between"}>
            <div>age:</div>
            <input ref={inputRef} defaultValue={data?.age} type={"text"}/>
        </div>
    </div>;
});
