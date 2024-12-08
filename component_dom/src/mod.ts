// take builder for template strings
import type { Component } from "../../coyote/dist/mod.js";

import { Results as TemplateResults } from "../../template_str/dist/mod.js";

// then make builder for DOM from template_str builder results
interface Results {
	fragment: Node;
	injs: number[][];
}

interface BuilderInterface {
	build(templateResults: TemplateResults): Results;
}

// the "stack" is basically an object:
interface StackBit {
	parent?: Node;
	left?: Node;
	dom: Node[][];
	injections: number[];
}

function compose(builder: BuilderInterface, component: Component): Node {
	// create and return a document fragment
	let fragment = new DocumentFragment();

	// iterate through tree

	return fragment;
}

export type { Results, BuilderInterface };

export { compose };
