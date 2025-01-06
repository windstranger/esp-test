'use client'

import {PageControls} from "@/components/pages/main/PageControls";
import {LazyRender} from "@/components/pages/main/LazyRender";

export const MainPage = () => {
    return (<div className={"pt-[126px] h-full"}>
            <PageControls/>
            <div id={"output"}></div>
            <LazyRender/>
        </div>
    )
}
