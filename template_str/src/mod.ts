import type { StepInterface, StepKind } from "../../parse_str/dist/mod.ts";
import type { RulesetInterface } from "../../rulesets/dist/mod.ts";

import { getTextFromStep, parseStr, route } from "../../parse_str/dist/mod.js";

interface ResultsInterface {
	strs: string[][];
	injs: StepKind[];
}

class Results implements ResultsInterface {
	strs = [];
	injs = [];
}

function compose(
	ruleset: RulesetInterface,
	templateStr: string,
): ResultsInterface {
	let results = new Results();

	for (let step of parseStr(ruleset, templateStr, "Initial")) {
		if (step.kind === "AttrMapInjection") {
			pushAttrMapInjection(results);
			continue;
		}

		if (step.kind === "DescendantInjection") {
			pushDescendantInjection(results);
			continue;
		}

		if (step.kind === "InjectionSpace") continue;
		if (step.kind === "InjectionConfirmed") continue;

		pushText(results, templateStr, step);
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
			pushText(results, templateStr, step);
		}

		// if last template str stop
		if (index > templateStrArr.length - 1) continue;

		let injStepKind = route("{", stepKind);

		if (injStepKind === "AttrMapInjection") {
			pushAttrMapInjection(results);
		}

		if (injStepKind === "DescendantInjection") {
			pushDescendantInjection(results);
		}
	}

	return results;
}

function pushText(
	results: ResultsInterface,
	templateStr: string,
	step: StepInterface,
) {
	const text = getTextFromStep(templateStr, step);
	results.strs[results.strs.length - 1]?.push(text);
}

function pushAttrMapInjection(results: ResultsInterface) {
	results.strs.push([]);
	results.injs.push("AttrMapInjection");
}

function pushDescendantInjection(results: ResultsInterface) {
	results.strs.push([]);
	results.injs.push("DescendantInjection");
}

export type { ResultsInterface };
export { Results, compose, composeTemplateArr };
