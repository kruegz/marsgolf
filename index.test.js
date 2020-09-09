
// import { rotateVector } from "./index.js";
rotateVector = require("./index.js");
// import * as BABYLON from '@babylonjs/core/Legacy/legacy';

test("positiveZ", () => {
	var input = {x:0, y:0, z:1};
	var output = {x:10, y:0, z:0};
	var backspin = 10;
    // expect(rotateVector(input, 10, 0)).toBe(output);
    expect(JSON.parse(JSON.stringify(rotateVector(input, backspin, 0)))).toStrictEqual(output);

    backspin = -10;
	output = {x:-10, y:0, z:0};

    // expect(rotateVector(input, 10, 0)).toBe(output);
    expect(JSON.parse(JSON.stringify(rotateVector(input, backspin, 0)))).toStrictEqual(output);
});

test("negativeZ", () => {
	var input = {x:0, y:0, z:-1};
	var output = {x:-10, y:0, z:0};
	var backspin = 10;
    // expect(rotateVector(input, 10, 0)).toBe(output);
    expect(JSON.parse(JSON.stringify(rotateVector(input, backspin, 0)))).toStrictEqual(output);

    backspin = -10;
	output = {x:10, y:0, z:0};

    // expect(rotateVector(input, 10, 0)).toBe(output);
    expect(JSON.parse(JSON.stringify(rotateVector(input, backspin, 0)))).toStrictEqual(output);
});

test("positiveX", () => {
	var input = {x:1, y:0, z:0};
	var output = {x:0, y:0, z:10};
	var backspin = 10;
    // expect(rotateVector(input, 10, 0)).toBe(output);
    expect(JSON.parse(JSON.stringify(rotateVector(input, backspin, 0)))).toStrictEqual(output);

	output = {x:0, y:0, z:-10};
	backspin = -10;
    // expect(rotateVector(input, 10, 0)).toBe(output);
    expect(JSON.parse(JSON.stringify(rotateVector(input, backspin, 0)))).toStrictEqual(output);
});

test("negativeX", () => {
	var input = {x:-1, y:0, z:0};
	var output = {x:0, y:0, z:-10};
	var backspin = 10;
    // expect(rotateVector(input, 10, 0)).toBe(output);
    expect(JSON.parse(JSON.stringify(rotateVector(input, backspin, 0)))).toStrictEqual(output);

	output = {x:0, y:0, z:10};
	backspin = -10;
    // expect(rotateVector(input, 10, 0)).toBe(output);
    expect(JSON.parse(JSON.stringify(rotateVector(input, backspin, 0)))).toStrictEqual(output);
});

