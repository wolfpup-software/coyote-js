// import {
// 	BuilderInterface,
// 	compose as buildComponent,
// } from "./component_string.js";
// import { Component } from "./coyote.js";
// import {
// 	compose,
// 	composeTemplateArr,
// 	Results,
// } from "./template_str.js";
// import { RulesetInterface } from "./rulesets.js";
// import { ClientRules, ServerRules, XmlRules } from "./rulesets.js";

// class Builder implements BuilderInterface {
// 	// place to add cache for:
// 	// - templateStr
// 	// - templateArr

// 	buildStr(ruleset: RulesetInterface, templateStr: string): Results {
// 		return compose(ruleset, templateStr);
// 	}

// 	buildTemplateStrs(
// 		ruleset: RulesetInterface,
// 		templateArray: TemplateStringsArray,
// 	): Results {
// 		return composeTemplateArr(ruleset, templateArray);
// 	}
// }

// class Html {
// 	// rules
// 	rules = new ServerRules();
// 	builder: BuilderInterface;

// 	build(component: Component): string {
// 		return buildComponent(this.builder, this.rules, component);
// 	}
// }

// class ClientHtml {
// 	// rules
// 	rules = new ClientRules();
// 	builder = new Builder();

// 	build(component: Component): string {
// 		return buildComponent(this.builder, this.rules, component);
// 	}
// }

// class Xml {
// 	// rules
// 	rules = new XmlRules();
// 	builder: BuilderInterface;

// 	build(component: Component): string {
// 		return buildComponent(this.builder, this.rules, component);
// 	}
// }

// export { ClientHtml, Html, Xml };
