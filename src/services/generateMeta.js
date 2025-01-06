'use server'

import {Project} from "ts-morph";
import path from "path";
import {cache} from "react";

//having fun with generating metadata
export const generateMeta = async  () => {
    const typeName = "User";
    const project = new Project();

    // Resolve absolute path to the TypeScript file
    // const resolvedPath = path.resolve(process.cwd(), filePath);
    const resolvedPath = path.join(process.cwd(), "/src/models/User.ts");

    const sourceFile = project.addSourceFileAtPath(resolvedPath);

    const typeAlias = sourceFile.getTypeAliasOrThrow(typeName);
    const type = typeAlias.getType();

    const properties = type.getProperties();
    const meta = {};

    properties.forEach((property) => {
        const name = property.getName();
        const type = property.getValueDeclarationOrThrow().getType().getText();

        // Simplify type information
        if (type.includes("|")) {
            meta[name] = type.split("|").map((t) => t.trim());
        } else {
            meta[name] = type;
        }
    });

    return meta;
}

// export const getUserMeta = async ()=> generateMeta("User", "/models/User.ts");
