import {atom} from "jotai";
import {JSONData} from "@/models/User";

export const jsonAtom = atom<JSONData["data"]>();
export const jsonArrayAtom = atom<JSONData["ids"]>();

