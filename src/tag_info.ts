import type { RulesetInterface } from "./rulesets.ts";

type DescendantStatus =
	| "Text"
	| "Element"
	| "ElementClosed"
	| "InlineElement"
	| "InlineElementClosed"
	| "Initial";

interface TagInfoInterface {
	namespace: string;
	tag: string;
	mostRecentDescendant: DescendantStatus;
	indentCount: number;
	voidEl: boolean;
	inlineEl: boolean;
	preservedTextPath: boolean;
	bannedPath: boolean;
}

class TagInfo implements TagInfoInterface {
	namespace: string;
	tag: string;
	mostRecentDescendant: DescendantStatus;
	indentCount = 0;
	voidEl: boolean;
	inlineEl: boolean;
	preservedTextPath: boolean;
	bannedPath: boolean;

	constructor(rules: RulesetInterface, tag: string) {
		this.namespace = rules.isNamespaceEl(tag)
			? tag
			: rules.getInitialNamespace();
		this.tag = tag;
		this.mostRecentDescendant = "Initial";
		this.indentCount = 0;
		this.voidEl = rules.isVoidEl(tag);
		this.inlineEl = rules.isInlineEl(tag);
		// is preserved text element?
		this.preservedTextPath = false;
		this.bannedPath = rules.isBannedEl(tag);
	}
}

function from(
	rules: RulesetInterface,
	prevTagInfo: TagInfoInterface,
	tag: string,
): TagInfoInterface {
	let tagInfo = new TagInfo(rules, tag);

	tagInfo.namespace = prevTagInfo.namespace;
	tagInfo.indentCount = prevTagInfo.indentCount;

	if (rules.isNamespaceEl(tag)) {
		tagInfo.namespace = tag;
	}

	if (rules.isPreservedTextEl(prevTagInfo.tag)) {
		tagInfo.preservedTextPath = true;
	}

	if (rules.isBannedEl(tag)) {
		tagInfo.bannedPath = true;
	}

	if (!rules.isVoidEl(prevTagInfo.tag) && !rules.isInlineEl(tag)) {
		tagInfo.indentCount += 1;
	}

	return tagInfo;
}

export type { TagInfoInterface, DescendantStatus };
export { TagInfo, from };
