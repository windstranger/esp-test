import {useAtomValue} from "jotai/index";
import {jsonArrayAtom, jsonAtom} from "@/components/pages/main/atoms";
import {useCallback} from "react";
import {saveJsonToFile} from "@/services/fileDownloader";
import {FilePicker} from "@/components/pages/main/FilePicker";

export function PageControls() {
    const jsonData = useAtomValue(jsonAtom);
    const jsonArray = useAtomValue(jsonArrayAtom);
    const onDownloadJSON = useCallback(() => {
        jsonData && saveJsonToFile({data: jsonData, ids: jsonArray}, "updatedData.json");
    }, [jsonArray, jsonData])

    return <div className={"fixed top-0 right-0"}>
        <button className={"bg-blue-300 p-4"} onClick={onDownloadJSON}>Download JSON</button>
        <FilePicker/>
    </div>
}
