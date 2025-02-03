type StepKind =
	| "AttrQuoteClosed"
	| "AttrQuote"
	| "AttrMapInjection"
	| "AttrSetter"
	| "AttrValue"
	| "AttrValueUnquoted"
	| "Attr"
	| "TailElementClosed"
	| "TailElementSolidus"
	| "TailElementSpace"
	| "TailTag"
	| "DescendantInjection"
	| "FragmentClosed"
	| "Fragment"
	| "EmptyElementClosed"
	| "EmptyElement"
	| "Initial"
	| "InjectionConfirmed"
	| "InjectionSpace"
	| "ElementClosed"
	| "ElementSpace"
	| "Element"
	| "Tag"
	| "Text"
	| "AltText"
	| "AltTextCloseSequence"
	| "CommentText";

type Router = (glyph: string) => StepKind;

let glyphGraph = new Map<StepKind, Router>([
	["Attr", getKindFromAttribute],
	["AttrMapInjection", getKindFromInjection],
	["AttrQuote", getKindFromAttributeQuote],
	["AttrQuoteClosed", getKindFromAttributeQuoteClosed],
	["AttrSetter", getKindFromAttributeSetter],
	["AttrValue", getKindFromAttributeQuote],
	["AttrValueUnquoted", getKindFromAttributeValueUnquoted],
	["DescendantInjection", getKindFromInjection],
	["Element", getKindFromElement],
	["ElementSpace", getKindFromElementSpace],
	["EmptyElement", getKindFromEmptyElement],
	["InjectionSpace", getKindFromInjection],
	["Tag", getKindFromTag],
	["TailElementSolidus", getKindFromTailElementSolidus],
	["TailElementSpace", getKindFromTailElementSpace],
	["TailTag", getKindFromTailTag],
]);

function route(glyph: string, prevKind: StepKind) {
	let router = glyphGraph.get(prevKind) ?? getKindFromInitial;
	return router(glyph);
}

function isSpace(glyph: string) {
	return glyph.length !== glyph.trim().length;
}

function getKindFromAttribute(glyph: string): StepKind {
	if ("=" === glyph) return "AttrSetter";
	if (">" === glyph) return "ElementClosed";
	if ("/" === glyph) return "EmptyElement";
	if ("{" === glyph) return "AttrMapInjection";

	if (isSpace(glyph)) return "ElementSpace";

	return "Attr";
}

function getKindFromInjection(glyph: string): StepKind {
	if ("}" === glyph) return "InjectionConfirmed";

	return "InjectionSpace";
}

function getKindFromAttributeQuote(glyph: string): StepKind {
	if ('"' === glyph) return "AttrQuoteClosed";

	return "AttrValue";
}

function getKindFromAttributeQuoteClosed(glyph: string): StepKind {
	if (">" === glyph) return "ElementClosed";
	if ("/" === glyph) return "EmptyElement";

	return "ElementSpace";
}

function getKindFromAttributeSetter(glyph: string): StepKind {
	if ('"' === glyph) return "AttrQuote";

	if (isSpace(glyph)) return "AttrSetter";

	return "AttrValueUnquoted";
}

function getKindFromAttributeValueUnquoted(glyph: string): StepKind {
	if (">" === glyph) return "ElementClosed";

	if (isSpace(glyph)) return "ElementSpace";

	return "AttrValueUnquoted";
}

function getKindFromElement(glyph: string): StepKind {
	if ("/" === glyph) return "TailElementSolidus";
	if (">" === glyph) return "Fragment";

	if (isSpace(glyph)) return "Element";

	return "Tag";
}

function getKindFromElementSpace(glyph: string): StepKind {
	if (">" === glyph) return "ElementClosed";
	if ("/" === glyph) return "EmptyElement";
	if ("{" === glyph) return "AttrMapInjection";

	if (isSpace(glyph)) return "ElementSpace";

	return "Attr";
}

function getKindFromEmptyElement(glyph: string): StepKind {
	if (">" === glyph) return "EmptyElementClosed";

	return "EmptyElement";
}

function getKindFromTag(glyph: string): StepKind {
	if (">" === glyph) return "ElementClosed";
	if ("/" === glyph) return "EmptyElement";

	if (isSpace(glyph)) return "ElementSpace";

	return "Tag";
}

function getKindFromTailElementSolidus(glyph: string): StepKind {
	if (">" === glyph) return "FragmentClosed";

	if (isSpace(glyph)) return "TailElementSolidus";

	return "TailTag";
}

function getKindFromTailElementSpace(glyph: string): StepKind {
	if (">" === glyph) return "TailElementClosed";

	return "TailElementSpace";
}

function getKindFromTailTag(glyph: string): StepKind {
	if (">" === glyph) return "TailElementClosed";

	if (isSpace(glyph)) return "TailElementSpace";

	return "TailTag";
}

function getKindFromInitial(glyph: string): StepKind {
	if ("<" === glyph) return "Element";
	if ("{" === glyph) return "DescendantInjection";

	return "Text";
}

export type { StepKind };
export { route };
