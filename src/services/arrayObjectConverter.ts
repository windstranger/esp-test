import {JSONData, User} from "@/models/User";

export function convertObjectToArray(object: JSONData) {
    const ids = object.ids;
    const data: JSONData["data"] = object.data;
    return ids?.map((item) => {
        return data?.[item];
    });
}

export function convertArrayToObject(array: User[]): JSONData {
    const ids: number[] = [];
    const data: JSONData["data"] = {};

    array.forEach((item, index) => {
        const randomId = index // Generate a random ID
        ids.push(randomId);
        data[randomId] = item;
    });

    return {ids, data};
}

