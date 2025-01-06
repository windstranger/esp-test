import {useSetAtom} from "jotai/index";
import {jsonArrayAtom, jsonAtom} from "@/components/pages/main/atoms";
import {ChangeEvent, useCallback, useState} from "react";
import {simpleFileReader} from "@/components/FilePicker/fileService";

export function FilePicker() {
    const setJSONData = useSetAtom(jsonAtom);
    const setJSONArray = useSetAtom(jsonArrayAtom);
    const [isLoading, setIsLoading] = useState<boolean>()

    // const offset = useRef<number>(0)
    // const onObjectsRead = useCallback((objects: User[]) => {
    //     const update = (remaining: User[]) => {
    //         if (remaining.length === 0) return;
    //
    //         // const  res = remaining
    //         // const chunk = remaining.splice(0, 100); // Process smaller chunks
    //         const res = convertArrayToObject(remaining, offset.current);
    //         offset.current += remaining.length;
    //
    //         setJSONData((prev) => ({...prev, ...res.data}));
    //         setJSONArray((prev) => [...prev, ...res.ids]);
    //
    //         // requestAnimationFrame(() => update(remaining));
    //     };
    //
    //     update([...objects]);
    // }, []);

    const fileProcessor = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
        setIsLoading(true);
        const file = event.target?.files?.[0]; // Get the selected file
        if (!file) {
            alert('No file selected!');
            return;
        }
        try {
            //todo: choose which is better to render, for now they renders almost instant
            const jsonData = await simpleFileReader(file);
            setJSONData(jsonData.data)
            setJSONArray(jsonData.ids)
            // await processLargeJsonFile(file, onObjectsRead);
        } finally {
            setIsLoading(false)
        }

    }, [setJSONData]);

    return <div>
        {isLoading && "Loading..."}
        <input type="file" onChange={fileProcessor} accept={"application/json"}/>
    </div>
}
