import * as assert from "assert";

import { parseDefaultSketchProfile } from "../src/arduino/sketchProfile";

suite("Arduino: sketch profile", () => {

    test("reads the top level default_profile of sketch.yaml", () => {
        const yaml = [
            "# comment",
            "profiles:",
            "  cores3:",
            "    fqbn: esp32:esp32:m5stack-cores3",
            "",
            "default_profile: cores3  # used by plain compiles",
        ].join("\n");
        assert.strictEqual(parseDefaultSketchProfile(yaml), "cores3");
        assert.strictEqual(parseDefaultSketchProfile("default_profile: \"core2\"\r\n"), "core2");
    });

    test("ignores sketch.yaml without a default_profile", () => {
        assert.strictEqual(parseDefaultSketchProfile("profiles:\n  a:\n    fqbn: x:y:z\n"), undefined);
        assert.strictEqual(parseDefaultSketchProfile("  default_profile: nested\n"), undefined);
        assert.strictEqual(parseDefaultSketchProfile("default_profile:\n"), undefined);
    });
});
