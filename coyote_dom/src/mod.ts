import { Component } from "../../coyote/dist/mod.js";
import { Results as TemplateResults } from "../../template_str/dist/mod.js";
import type {
	Results,
	BuilderInterface,
} from "../../component_dom/dist/mod.ts";

import { compose } from "../../component_dom/dist/mod.js";

class Builder implements BuilderInterface {
	// place to add cache

	build(results: TemplateResults): Results {
		return {
			fragment: new DocumentFragment(),
			injs: [],
		};
	}
}

class Dom {
	builder: BuilderInterface;

	constructor(builder: BuilderInterface) {
		this.builder = builder;
	}

	build(component: Component): Node {
		// take builder, take component
		return compose(this.builder, component);
	}
}

export { Builder, Dom };
