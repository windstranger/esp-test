import {useMemo} from "react";
import {useAtomValue} from "jotai/index";
import {jsonAtom} from "@/components/pages/main/atoms";
import {selectAtom} from "jotai/utils";
import {InputBuilder} from "@/components/pages/main/InputBuilder";
import {useUserMeta} from "@/services/apiHooks/useUserMeta";

export const JSONDataRenderer = function JSONDataRenderer({objectId}: { objectId: number }) {
    const {data: userMeta, isLoading: isMetaLoading} = useUserMeta();

    const jsonObjectAtom = useMemo(() => {
        return selectAtom(jsonAtom, item => item?.[objectId])
    }, [objectId]);

    const jsonObject = useAtomValue(jsonObjectAtom);

    return <div className={"flex p-4 gap-4"}>
        {isMetaLoading && "Loading..."}
        {!isMetaLoading && userMeta && Object.keys(userMeta).map((objectKey) => {
            return <div key={objectKey}>
                <label>{objectKey}</label>
                <InputBuilder fieldName={objectKey}
                              elId={objectId}
                              dataType={userMeta[objectKey]}
                              value={jsonObject?.[objectKey as keyof typeof jsonObject]}/>
            </div>
        })}
    </div>;
};
