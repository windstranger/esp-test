'use client'

import {memo, useEffect, useRef} from "react";
import {useAtomValue, useSetAtom} from "jotai";
import {jsonAtom} from "@/components/pages/main/atoms";
import {JSONData, User} from "@/models/User";
import {debounce} from "next/dist/server/utils";
import {FilePicker} from "@/components/pages/main/FilePicker";
import {LazyRender} from "@/components/pages/main/LazyRender";

export function convertArrayToObject(array: User[]): JSONData {
    const ids: number[] = [];
    const data: JSONData["data"] = {};

    array.forEach((item, index) => {
        const randomId = index // Generate a random ID
        ids.push(randomId);
        data[randomId] = item;
    });

    return {ids, data};
}

const JSONDataRenderer = memo(function JSONDataRenderer({data, el}: { data: User, el: number }) {
    const inputRef = useRef<HTMLInputElement>(null);
    const setJSONData = useSetAtom(jsonAtom);

    console.log("rerenders");
    useEffect(() => {
        const inputElement = inputRef.current;
        if (inputElement) {
            const handleChange = debounce((event: Event) => {
                const target = event.target as HTMLInputElement;
                console.log("Input value changed to:", target.value);
                setJSONData(prev => {
                    if (prev) {
                        prev.data[el] = {...prev.data[el], age: Number(target.value)}
                        const res = {...prev, data: {...prev.data}};
                        return res;
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
            <div>{data.name}</div>
        </div>
        <div className={"grid grid-cols-2 justify-between"}>
            <div>age:</div>
            <input ref={inputRef} defaultValue={data.age} type={"text"}/>
        </div>
    </div>;
});

function JSONArrayRenderer() {
    const jsonData = useAtomValue(jsonAtom)
    // const nameAtom = selectAtom(jsonAtom, (users) => users.ids)
    return <div className={"flex flex-col gap-4 max-w-[320px]"}>{jsonData?.ids.map(el => {
        return <JSONDataRenderer key={el} data={jsonData?.data[el]} el={el}/>
    })}</div>
}

export default function Home() {
    const jsonData = useAtomValue(jsonAtom);

    return (
        <div className="">
            <button className={"bg-blue-300 p-4"} onClick={() => {
                console.log(jsonData);
            }}>download modified json
            </button>
            <FilePicker/>
            <div id={"output"}></div>
            <LazyRender/>
            {/*<JSONArrayRenderer/>*/}
        </div>
    );
}
