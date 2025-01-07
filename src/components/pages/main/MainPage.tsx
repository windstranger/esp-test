'use client'

import {FileUploadDownloadControls} from "@/components/pages/main/PageControls";
import {LazyRender} from "@/components/pages/main/LazyRender";
import {Provider as JotaiProvider} from 'jotai'

export const MainPage = () => {

    return <JotaiProvider>
        <div className={"pt-[126px] h-full"}>
            <FileUploadDownloadControls/>
            <LazyRender/>
        </div>
    </JotaiProvider>

}
