import { useEffect, } from "react";
import * as constants from"../utils/Functions";

let initialized = false;

export function useProjects() {
    useEffect(() => { 
        //useEffect vil kjøre to ganger i utviklingsmodus, dette er for å stoppe det fra å kjøre to ganger
        if (!initialized) {
            initialized = true;

            constants.handleProjects();
        }
    }, [])
}