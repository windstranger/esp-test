import {useSetAtom} from "jotai/index";
import {fileReadAtom, jsonArrayAtom, jsonAtom} from "@/components/pages/main/atoms";
import {ChangeEvent, useCallback, useState} from "react";
import {simpleFileReader} from "@/components/pages/main/private/FilePicker/fileService";

export function FilePicker() {
    const setJSONData = useSetAtom(jsonAtom);
    const setJSONArray = useSetAtom(jsonArrayAtom);
    const setFileReadKey = useSetAtom(fileReadAtom);
    const [isLoading, setIsLoading] = useState<boolean>()

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
            setFileReadKey(new Date().getTime().toString())
            setIsLoading(false)
        }

    }, [setFileReadKey, setJSONArray, setJSONData]);

    return <div>
        {isLoading && "Loading..."}
        <input type="file" onChange={fileProcessor} accept={"application/json"}/>
    </div>
}
