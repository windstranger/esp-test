'use client'
import {memo, useEffect, useMemo, useRef} from "react";
import {useAtomValue, useSetAtom} from "jotai/index";
import {jsonAtom} from "@/components/pages/main/atoms";
import {selectAtom} from "jotai/utils";
import {debounce} from "next/dist/server/utils";
import {User} from "@/models/User";
import useSWR from 'swr'

type UserMeta = Record<keyof User, string>

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const dataTypeConverter = (dataType: string, value: any) => {
    let res;
    if (dataType === "number") {
        res = Number(value);
    }

    if (dataType === "boolean") {
        debugger
        res = value === "on";
    }


    return res
}

const InputBuilder = ({fieldName, dataType, value, elId}: {
    fieldName: string,
    elId: number,
    dataType: string,
    value?: any
}) => {
    const setJSONData = useSetAtom(jsonAtom);
    const inputRef = useRef<HTMLInputElement | HTMLSelectElement>(null);
    useEffect(() => {
        const inputElement = inputRef.current;
        if (inputElement) {
            const handleChange = debounce((event: Event) => {
                const target = event.target as HTMLInputElement;
                console.log("Input value changed to:", target.value);
                setJSONData(prev => {
                    if (prev) {
                        prev[elId] = {...prev[elId], [fieldName]: dataTypeConverter(dataType, target.value)}
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

    if (dataType === "boolean") {
        return <input ref={inputRef} className={"bg-gray-100 p-2 border"} type={"checkbox"} defaultChecked={value}/>
    }

    if (Array.isArray(dataType)) {
        return <select ref={inputRef} className={"bg-gray-100 p-2 border"} defaultValue={value}>
            {dataType.map(opt => {
                return <option key={opt} value={opt}>{opt}</option>
            })}
        </select>
    }

    return <input ref={inputRef} className={"bg-gray-100 p-2 border"} defaultValue={value} type={dataType}/>
}
export const JSONDataRenderer = memo(function JSONDataRenderer({el}: { el: number }) {
    const {data: userMeta, isLoading: isMetaLoading} = useSWR("/api/user-meta", fetcher);
    const selectedElement = useMemo(() => {
        return selectAtom(jsonAtom, item => item?.[el])
    }, [el]);
    const data = useAtomValue(selectedElement);

    return <div className={"flex p-4 gap-4"}>
        {!isMetaLoading && userMeta && Object.keys(userMeta).map(objectKey => {
            return <div><label>{objectKey}</label><InputBuilder fieldName={objectKey} elId={el}
                                                                dataType={userMeta[objectKey]}
                                                                value={data?.[objectKey]}/></div>
        })}
    </div>;
});
