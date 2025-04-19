import type { Component } from "./components.js";
import type { RulesetInterface } from "./rulesets.ts";
import type { Results as TemplateSteps } from "./template_steps.js";

import {
	TmplComponent,
	TaggedTmplComponent,
	AttrComponent,
	AttrValComponent,
} from "./components.js";
import { TagInfo } from "./tag_info.js";
import {
	composeSteps,
	pushTextComponent,
	pushAttrComponent,
	pushAttrValueComponent,
} from "./compose_steps.js";

export type { BuilderInterface, Results };
export { composeString };

interface BuilderInterface {
	build(rules: RulesetInterface, templateStr: string): TemplateSteps;
	buildTemplate(
		rules: RulesetInterface,
		templateArray: TemplateStringsArray,
	): TemplateSteps;
}

class TemplateBit {
	component: TaggedTmplComponent | TmplComponent;
	results: TemplateSteps;
	stackDepth: number;

	index = 0;

	constructor(
		component: TaggedTmplComponent | TmplComponent,
		results: TemplateSteps,
		stackDepth: number,
	) {
		this.component = component;
		this.results = results;
		this.stackDepth = stackDepth;
	}
}

type StackBit = Component | TemplateBit;

type Results = [string?, Error?];

function composeString(
	builder: BuilderInterface,
	rules: RulesetInterface,
	component: Component,
): Results {
	let results: string[] = [];

	let tagInfoBit = new TagInfo(rules, ":root");
	let tagInfoStack: TagInfo[] = [tagInfoBit];

	let bit = getStackBitFromComponent(tagInfoStack, builder, rules, component);
	let stack = [bit];

	while (0 < stack.length) {
		const bit = stack.pop();

		if (typeof bit === "string") {
			pushTextComponent(results, tagInfoStack, rules, bit);
		}

		if (Array.isArray(bit)) {
			// reverse
			// while (bit.length) {
			// 	let popped = bit.pop();
			// 	let nubit = getStackBitFromComponent(tagInfoStack, builder, rules, popped);
			// 	stack.push(nubit);
			// }
		}

		if (bit instanceof TemplateBit) {
			// increase index
			let index = bit.index;
			bit.index += 1;

			// add text chunk
			let currChunk = bit.results.steps[index];
			if (currChunk) {
				let templateStr: string;
				if (component instanceof TaggedTmplComponent) {
					templateStr = component.templateArr[index];
				}
				if (component instanceof TmplComponent) {
					templateStr = component.templateStr;
				}
				if (templateStr) {
					composeSteps(rules, results, tagInfoStack, templateStr, currChunk);
				}
			} else {
				if (bit.stackDepth !== tagInfoStack.length) {
					return [
						undefined,
						new Error(`
Coyote Err: the following template component is imbalanced:
${currChunk}`),
					];
				}
			}

			// handle injection
			let injKind = bit.results.injs[index];
			if ("AttrMapInjection" === injKind) {
				addAttrInj(tagInfoStack, results, bit.component.injections[index]);
			}

			if ("DescendantInjection" === injKind) {
				stack.push(bit);

				let nuBit = getStackBitFromComponent(
					tagInfoStack,
					builder,
					rules,
					bit.component.injections[index],
				);
				stack.push(nuBit);

				continue;
			}

			// tail case
			if (index < bit.results.steps.length) {
				stack.push(bit);
			}
		}
	}

	return [results.join(""), undefined];
}

function getStackBitFromComponent(
	stack: TagInfo[],
	builder: BuilderInterface,
	rules: RulesetInterface,
	component: Component,
): StackBit {
	console.log("get stack bit!", component);
	if (typeof component === "string" || Array.isArray(component))
		return component;

	if (component instanceof TmplComponent) {
		let buildResults = builder.build(rules, component.templateStr);
		return new TemplateBit(component, buildResults, stack.length);
	}

	if (component instanceof TaggedTmplComponent) {
		let buildResults = builder.buildTemplate(rules, component.templateArr);
		return new TemplateBit(component, buildResults, stack.length);
	}
}

function addAttrInj(stack: TagInfo[], results: string[], component: Component) {
	console.log("add attribute!", component);
	if (component instanceof AttrComponent)
		return pushAttrComponent(results, stack, component.attr);
	if (component instanceof AttrValComponent) {
		pushAttrComponent(results, stack, component.attr);
		return pushAttrValueComponent(results, stack, component.value);
	}

	if (Array.isArray(component)) {
		for (const cmpnt of component) {
			if (cmpnt instanceof AttrComponent)
				pushAttrComponent(results, stack, cmpnt.attr);
			if (cmpnt instanceof AttrValComponent) {
				pushAttrComponent(results, stack, cmpnt.attr);
				pushAttrValueComponent(results, stack, cmpnt.value);
			}
		}
	}
}
