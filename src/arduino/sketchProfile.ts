// Copyright (c) Elektronik Workshop. All rights reserved.
// Licensed under the MIT license.

import * as fs from "fs";
import * as path from "path";

/**
 * Return the default_profile named in a sketch project file (sketch.yaml),
 * or undefined if there is none.
 *
 * Only the top level default_profile key matters here, so a line based
 * match is enough and avoids a YAML parser dependency.
 */
export function parseDefaultSketchProfile(yaml: string): string | undefined {
    for (const line of yaml.split(/\r?\n/)) {
        const match = /^default_profile\s*:\s*(.*)$/.exec(line);
        if (!match) {
            continue;
        }
        let value = match[1].replace(/\s+#.*$/, "").trim();
        if (/^(["']).*\1$/.test(value)) {
            value = value.slice(1, -1);
        }
        return value || undefined;
    }
    return undefined;
}

/**
 * Return the default sketch profile of the sketch in sketchDir.
 *
 * Arduino CLI reads sketch.yaml (or sketch.yml) next to the main sketch and,
 * when it names a default_profile, builds with that profile's platforms and
 * libraries even if --fqbn is given.
 */
export function defaultSketchProfile(sketchDir: string): string | undefined {
    for (const name of ["sketch.yaml", "sketch.yml"]) {
        const file = path.join(sketchDir, name);
        try {
            return parseDefaultSketchProfile(fs.readFileSync(file, "utf8"));
        } catch {
            continue;
        }
    }
    return undefined;
}
