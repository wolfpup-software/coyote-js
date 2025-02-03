// import type { RulesetInterface } from "./rulesets.ts";
// import type { Component } from "./coyote.ts";
// import type { Results } from "./template_str.js";

// import {
// 	CoyoteComponent,
// 	TmplComponent,
// 	TaggedTmplComponent,
// 	AttrComponent,
// 	AttrValComponent,
// } from "./coyote.js";

// interface BuilderInterface {
// 	buildStr(ruleset: RulesetInterface, templateStr: string): Results;
// 	buildTemplateStrs(
// 		ruleset: RulesetInterface,
// 		templateArray: TemplateStringsArray,
// 	): Results;
// }

// class TemplateBit {
// 	component: Component;
// 	results: Results;
// 	index = 0;

// 	constructor(component: Component, results: Results) {
// 		this.component = component;
// 		this.results = results;
// 	}
// }

// type StackBit = Component | TemplateBit;

// function compose(
// 	builder: BuilderInterface,
// 	ruleset: RulesetInterface,
// 	component: CoyoteComponent,
// ): string {
// 	let results = [];

// 	let bit = getStackBitFromComponent(builder, ruleset, component);
// 	let stack = [bit];

// 	while (0 < stack.length) {
// 		const bit = stack.pop();

// 		if (typeof bit === "string") {
// 			results.push(bit);
// 		}

// 		if (Array.isArray(bit)) {
// 			// reverse
// 			for (let index = bit.length - 1; 0 < index; index--) {
// 				const next_bit = getStackBitFromComponent(builder, ruleset, bit);
// 				stack.push(next_bit);
// 			}
// 		}

// 		if (bit instanceof TemplateBit) {
// 			// increase index
// 			let index = bit.index;
// 			bit.index += 1;

// 			// add text chunk
// 			let currChunk = bit.results.strs[index];
// 			if (currChunk) {
// 				results.push(currChunk);
// 			}

// 			// handle injection
// 			let injKind = bit.results.injs[index];
// 			let inj = bit.results.injs[index];

// 			if ("AttrMapInjection" === injKind && undefined !== inj) {
// 				addAttrInj(results, component);
// 			}
// 			if ("DescendantInjection" === injKind && undefined !== inj) {
// 				stack.push(bit);

// 				let nuBit = getStackBitFromComponent(builder, ruleset, inj);
// 				stack.push(nuBit);
// 				continue;
// 			}

// 			// tail case
// 			if (index < bit.results.strs.length) {
// 				stack.push(bit);
// 			}
// 		}
// 	}

// 	return results.join("");
// }

// function getStackBitFromComponent(
// 	builder: BuilderInterface,
// 	rules: RulesetInterface,
// 	component: CoyoteComponent,
// ): StackBit {
// 	if (typeof component === "string" || Array.isArray(component))
// 		return component;

// 	if (component instanceof TmplComponent) {
// 		let buildResults = builder.buildStr(rules, component.templateStr);
// 		return new TemplateBit(component, buildResults);
// 	}

// 	if (component instanceof TaggedTmplComponent) {
// 		let buildResults = builder.buildTemplateStrs(rules, component.templateArr);
// 		return new TemplateBit(component, buildResults);
// 	}
// }

// function addAttrInj(results: string[], component: Component) {
// 	if (component instanceof AttrComponent)
// 		return addAttr(results, component.attr);
// 	if (component instanceof AttrValComponent)
// 		return addAttrVal(results, component.attr, component.value);

// 	if (Array.isArray(component)) {
// 		for (const cmpnt of component) {
// 			if (component instanceof AttrComponent)
// 				return addAttr(results, component.attr);
// 			if (component instanceof AttrValComponent)
// 				return addAttrVal(results, component.attr, component.value);
// 		}
// 	}
// }

// function addAttr(results: string[], attr: string) {
// 	results.push(" ", attr);
// }

// function addAttrVal(results: string[], attr: string, val: string) {
// 	results.push(" ", attr, '="', val, '"');
// }

// export type { BuilderInterface };
// export { compose };
