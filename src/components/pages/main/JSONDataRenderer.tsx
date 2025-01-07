'use client'
import {memo, useMemo} from "react";
import {useAtomValue} from "jotai/index";
import {jsonAtom} from "@/components/pages/main/atoms";
import {selectAtom} from "jotai/utils";
import useSWR from 'swr'
import {fetcher} from "@/services/apiService";
import {InputBuilder} from "@/components/pages/main/InputBuilder";

export const JSONDataRenderer = memo(function JSONDataRenderer({el}: { el: number }) {
    const {data: userMeta, isLoading: isMetaLoading} = useSWR("/api/user-meta", fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false
    });
    const selectedElement = useMemo(() => {
        return selectAtom(jsonAtom, item => item?.[el])
    }, [el]);

    const data = useAtomValue(selectedElement);

    return <div className={"flex p-4 gap-4"}>
        {!isMetaLoading && userMeta && Object.keys(userMeta).map((objectKey) => {
            return <div key={objectKey}>
                <label>{objectKey}</label>
                <InputBuilder fieldName={objectKey}
                              elId={el}
                              dataType={userMeta[objectKey]}
                              value={data?.[objectKey as keyof typeof data]}/>
            </div>
        })}
    </div>;
});
