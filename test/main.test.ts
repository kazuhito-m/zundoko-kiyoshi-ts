/// <reference path="typings/main.d.ts" />

// test/main.test.ts
import assert from 'power-assert';
import TestTarget from '../main';

describe("TestTarget", () => {
	it("should have a name", () => {
        	let testTarget = new TestTarget("test");
		assert.equal(testTarget.name, "test");
	});
});
