'use client'

import {ChangeEvent, memo, useCallback, useEffect, useRef, useState} from "react";
import {useAtomValue, useSetAtom} from "jotai";
import {jsonAtom} from "@/components/pages/main/atoms";
import {JSONData, User} from "@/models/User";
import {debounce} from "next/dist/server/utils";

function convertArrayToObject(array: User[]): JSONData {
    const ids: number[] = [];
    const data: JSONData["data"] = {};

    array.forEach((item, index) => {
        const randomId = index // Generate a random ID
        ids.push(randomId);
        data[randomId] = item;
    });

    return {ids, data};
}

function FilePicker() {
    const setJSONData = useSetAtom(jsonAtom);
    const [isLoading, setIsLoading] = useState<boolean>()
    const fileProcessor = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setIsLoading(true);
        const file = event.target?.files?.[0]; // Get the selected file
        if (!file) {
            alert('No file selected!');
            return;
        }

        const reader = new FileReader(); // Create a FileReader instance

        // Define the onload event to parse and display the JSON
        reader.onload = function (e: ProgressEvent<FileReader>) {
            try {
                if (e.target?.result && typeof e.target?.result === 'string') {
                    const json = JSON.parse(e.target.result); // Parse JSON content
                    const data = convertArrayToObject(json)
                    setJSONData(data)
                }
            } catch (error: unknown) {
                if (error instanceof Error) {
                    console.log('Invalid JSON file!', error.message);
                }
            } finally {
                setIsLoading(false);
            }
        };

        reader.onerror = () => {
            setIsLoading(false);
        }

        reader.readAsText(file);

    }, [setJSONData]);

    return <div>
        {isLoading && "Loading..."}
        <input type="file" onChange={fileProcessor} accept={"application/json"}/>
    </div>
}

const JSONDataRenderer = memo(function JSONDataRenderer({data, el}: { data: User, el: number }) {
    console.log("rerenders");
    const inputRef = useRef<HTMLInputElement>(null);
    const setJSONData = useSetAtom(jsonAtom);
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
    return <div className={"flex flex-col gap-4 max-w-[320px]"}>{jsonData?.ids.map(el => {
        return <JSONDataRenderer key={el} data={jsonData?.data[el]} el={el}/>
    })}</div>
}

export default function Home() {
    const jsonData = useAtomValue(jsonAtom);

    return (
        <div className="">
            <button onClick={() => {
                console.log(jsonData);
            }}>download modified json
            </button>
            <FilePicker/>
            <JSONArrayRenderer/>
        </div>
    );
}
