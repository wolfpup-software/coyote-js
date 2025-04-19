import type { BuilderInterface } from "./component_string.js";
import type { RulesetInterface } from "./rulesets.js";
import type { Results as StepResults } from "./template_steps.js";

// import { compose } from "./template_steps.js";
import { compose, composeTemplateArr } from "./template_steps.js";

export { Builder };

class Builder implements BuilderInterface {
	// place to add cache for:
	// - templateStr
	// - templateArr

	build(ruleset: RulesetInterface, templateStr: string): StepResults {
		return compose(ruleset, templateStr);
	}

	buildTemplate(
		ruleset: RulesetInterface,
		templateArray: TemplateStringsArray,
	): StepResults {
		return composeTemplateArr(ruleset, templateArray);
	}
}
