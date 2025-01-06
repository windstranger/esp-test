'use client'

import {FileUploadDownloadControls} from "@/components/pages/main/PageControls";
import {LazyRender} from "@/components/pages/main/LazyRender";
import useSWR from "swr";
import {fetcher} from "@/components/pages/main/JSONDataRenderer";
import {useAtomValue} from "jotai/index";
import {fileReadAtom} from "@/components/pages/main/atoms";
import {Provider as JotaiProvider} from 'jotai'

export const MainPage = () => {

    //because of using indexes as keys when rendering array, I need to reset data. and I was lazy, to rewrite logic,
    // so I just reset the key on file change... =)
    //precache data needed to render edit form


    return <JotaiProvider>
        <div className={"pt-[126px] h-full"}>
            <FileUploadDownloadControls/>
            <LazyRender />
        </div>
    </JotaiProvider>

}
