class CoyoteComponent {}
type Component = CoyoteComponent | Node | string | undefined;

class TextComponent extends CoyoteComponent {
	#text: string;
	constructor(text: string) {
		super();
		this.#text = text
			.replace("<", "&lt;")
			.replace("&", "&amp;")
			.replace("{", "&#123;");
	}

	get text() {
		return this.#text;
	}
}

class AttrComponent extends CoyoteComponent {
	#attr: string;
	constructor(attr: string) {
		super();
		this.#attr = attr;
	}

	get attr() {
		return this.#attr;
	}
}

class AttrValComponent extends CoyoteComponent {
	#attr: string;
	#value: string;

	constructor(attr: string, val: string) {
		super();
		this.#attr = attr;
		this.#value = val.replace('"', "&quot;").replace("&", "&amp;");
	}

	get attr() {
		return this.#attr;
	}

	get value() {
		return this.#value;
	}
}

class TmplComponent extends CoyoteComponent {
	#templateStr: string;
	#injections: Component[];

	constructor(txt: string, injections: Component[]) {
		super();
		this.#templateStr = txt;
		this.#injections = injections;
	}

	get templateStr() {
		return this.#templateStr;
	}

	get injections() {
		return this.#injections;
	}
}

class TaggedTmplComponent extends CoyoteComponent {
	#templateArr: TemplateStringsArray;
	#injections: Component[];

	constructor(txts: TemplateStringsArray, injections: Component[]) {
		super();
		this.#templateArr = txts;
		this.#injections = injections;
	}

	get templateArr() {
		return this.#templateArr;
	}

	get injections() {
		return this.#injections;
	}
}

function tmpl(txt: string, injections: Component[]): TmplComponent {
	return new TmplComponent(txt, injections);
}

function draw(
	txts: TemplateStringsArray,
	...injections: Component[]
): TaggedTmplComponent {
	return new TaggedTmplComponent(txts, injections);
}

function text(txt: string): TextComponent {
	return new TextComponent(txt);
}

function attr(attrStr: string): AttrComponent {
	return new AttrComponent(attrStr);
}

function attrVal(attr: string, val: string): AttrValComponent {
	return new AttrValComponent(attr, val);
}

export type { Component };

export {
	CoyoteComponent,
	AttrComponent,
	AttrValComponent,
	TextComponent,
	TmplComponent,
	TaggedTmplComponent,
	draw,
	tmpl,
	text,
	attr,
	attrVal,
};
