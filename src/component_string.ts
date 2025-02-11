import type { RulesetInterface } from "./rulesets.ts";
import type { Component } from "./coyote.ts";
import type { Results } from "./template_steps.js";
import type { TagInfo } from "./tag_info.js";

import {
	CoyoteComponent,
	TmplComponent,
	TaggedTmplComponent,
	AttrComponent,
	AttrValComponent,
} from "./coyote.js";

import { composeSteps, pushText } from "./compose_steps.js";

interface BuilderInterface {
	build(rules: RulesetInterface, templateStr: string): Results;
	buildTemplate(
		rules: RulesetInterface,
		templateArray: TemplateStringsArray,
	): Results;
}

class TemplateBit {
	component: Component;
	results: Results;
	index = 0;

	constructor(component: Component, results: Results) {
		this.component = component;
		this.results = results;
	}
}

type StackBit = Component | TemplateBit;

function compose(
	builder: BuilderInterface,
	rules: RulesetInterface,
	component: CoyoteComponent,
): string {
	let results: string[] = [];

	let bit = getStackBitFromComponent(builder, rules, component);

	let tagInfoStack: TagInfo[] = [];
	let stack = [bit];

	while (0 < stack.length) {
		const bit = stack.pop();

		if (typeof bit === "string") {
			pushText(results, tagInfoStack, rules, bit);
		}

		if (Array.isArray(bit)) {
			// reverse
			for (let index = bit.length - 1; 0 < index; index--) {
				const next_bit = getStackBitFromComponent(builder, rules, bit);
				stack.push(next_bit);
			}
		}

		if (bit instanceof TemplateBit) {
			// increase index
			let index = bit.index;
			bit.index += 1;

			// add text chunk
			let currChunk = bit.results.steps[index];
			if (currChunk) {
				let templateStr;
				if (component instanceof TaggedTmplComponent) {
					templateStr = component.templateArr[index];
				}
				if (component instanceof TmplComponent) {
					templateStr = component.templateStr;
				}
				if (templateStr) {
					composeSteps(rules, results, tagInfoStack, templateStr, currChunk);
				}
			}

			// handle injection
			// injection is from two kinds of templates
			let injKind = bit.results.injs[index];

			let inj;
			if (bit.component instanceof TaggedTmplComponent) {
				inj = bit.component.injections[index];
			}
			if (bit.component instanceof TmplComponent) {
				inj = bit.component.injections[index];
			}

			if ("AttrMapInjection" === injKind && undefined !== inj) {
				addAttrInj(results, component);
			}
			if ("DescendantInjection" === injKind && undefined !== inj) {
				stack.push(bit);

				let nuBit = getStackBitFromComponent(builder, rules, inj);
				stack.push(nuBit);
				continue;
			}

			// tail case
			if (index < bit.results.steps.length) {
				stack.push(bit);
			}
		}
	}

	console.log("compose_string\n", results);
	return results.join("");
}

function getStackBitFromComponent(
	builder: BuilderInterface,
	rules: RulesetInterface,
	component: CoyoteComponent,
): StackBit {
	if (typeof component === "string" || Array.isArray(component))
		return component;

	if (component instanceof TmplComponent) {
		let buildResults = builder.build(rules, component.templateStr);
		return new TemplateBit(component, buildResults);
	}

	if (component instanceof TaggedTmplComponent) {
		let buildResults = builder.buildTemplate(rules, component.templateArr);
		return new TemplateBit(component, buildResults);
	}
}

function addAttrInj(results: string[], component: Component) {
	if (component instanceof AttrComponent)
		return addAttr(results, component.attr);
	if (component instanceof AttrValComponent)
		return addAttrVal(results, component.attr, component.value);

	if (Array.isArray(component)) {
		for (const cmpnt of component) {
			if (component instanceof AttrComponent)
				return addAttr(results, component.attr);
			if (component instanceof AttrValComponent)
				return addAttrVal(results, component.attr, component.value);
		}
	}
}

function addAttr(results: string[], attr: string) {
	results.push(" ", attr);
}

function addAttrVal(results: string[], attr: string, val: string) {
	results.push(" ", attr, '="', val, '"');
}

export type { BuilderInterface };
export { compose };
