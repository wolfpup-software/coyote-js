import type { StepInterface, StepKind } from "./parse_str.ts";
import type { RulesetInterface } from "./rulesets.ts";

import { parseStr, route } from "./parse_str.js";

interface ResultsInterface {
	steps: StepInterface[][];
	injs: StepKind[];
}

class Results implements ResultsInterface {
	steps = [[]];
	injs = [];
}

function compose(
	ruleset: RulesetInterface,
	templateStr: string,
): ResultsInterface {
	let results = new Results();

	for (let step of parseStr(ruleset, templateStr, "Initial")) {
		if ("AttrMapInjection" === step.kind) {
			pushInjection(results, step.kind);
			continue;
		}

		if ("DescendantInjection" === step.kind) {
			pushInjection(results, step.kind);
			continue;
		}

		pushStep(results, step);
	}

	return results;
}

function composeTemplateArr(
	ruleset: RulesetInterface,
	templateStrArr: TemplateStringsArray,
): ResultsInterface {
	let results = new Results();

	let stepKind: StepKind = "Initial";

	// every one except for the last
	for (let [index, templateStr] of templateStrArr.entries()) {
		for (let step of parseStr(ruleset, templateStr, stepKind)) {
			stepKind = step.kind;
			pushStep(results, step);
		}

		// if last template str stop
		if (index > templateStrArr.length - 1) continue;

		let injStepKind = route("{", stepKind);

		if ("AttrMapInjection" === injStepKind) {
			pushInjection(results, "AttrMapInjection");
		}

		if ("DescendantInjection" === injStepKind) {
			pushInjection(results, "DescendantInjection");
		}
	}

	return results;
}

function pushStep(results: ResultsInterface, step: StepInterface) {
	results.steps[results.steps.length - 1]?.push(step);
}

function pushInjection(results: ResultsInterface, stepKind: StepKind) {
	results.steps.push([]);
	results.injs.push(stepKind);
}

export type { ResultsInterface };
export { Results, compose, composeTemplateArr };
