import { assert } from "./assertion.js";
import { tmplStr, Html } from "../mod.js";

function textElement() {
	let template = tmplStr(
		`

            Beasts tread
            softly underfoot.
		
		`,
		[],
	);

	let expected = "Beasts tread\nsoftly underfoot.";

	let html = new Html();
	let results = html.build(template);

	return assert(expected, results);
}

function emptyElement() {
	let template = tmplStr(
		`

        <p>
		</p>
		
		`,
		[],
	);

	let expected = "<p></p>";

	let html = new Html();
	let results = html.build(template);

	return assert(expected, results);
}

function fragment() {
	let template = tmplStr(
		`

        <>
		</>
		
		`,
		[],
	);

	let expected = "";

	let html = new Html();
	let results = html.build(template);

	return assert(expected, results);
}

function elementWithText() {
	let template = tmplStr(
		`
	<p>hello!</p>
		`,
		[],
	);

	let expected = "<p>\n\thello!\n</p>";

	let html = new Html();
	let results = html.build(template);

	return assert(expected, results);
}

function inlineElementWithText() {
	let template = tmplStr(
		`
	<b>     hello!
			</b>
		`,
		[],
	);

	let expected = "<b>hello!</b>";

	let html = new Html();
	let results = html.build(template);

	return assert(expected, results);
}

function anchorElementWithText() {
	let template = tmplStr(
		`
	<a>
		hello!    </a>
		`,
		[],
	);

	let expected = "<a>\n\thello!\n</a>";

	let html = new Html();
	let results = html.build(template);

	return assert(expected, results);
}

function voidElement() {
	let template = tmplStr(
		`
		<input />
		`,
		[],
	);

	let expected = "<input>";

	let html = new Html();
	let results = html.build(template);

	return assert(expected, results);
}

function nonVoidElement() {
	let template = tmplStr(
		`
		<p />
		`,
		[],
	);

	let expected = "<p></p>";

	let html = new Html();
	let results = html.build(template);

	return assert(expected, results);
}

function commentElement() {
	let template = tmplStr(
		`
	<!--
			Hello!
		-->
		`,
		[],
	);

	let expected = "<!--\n\tHello!\n-->";

	let html = new Html();
	let results = html.build(template);

	return assert(expected, results);
}

function altTextElement() {
	let template = tmplStr(
		`<style>#woof .bark {
    color: doggo;
}</style>`,
		[],
	);

	let expected = "<style>\n\t#woof .bark {\n\t    color: doggo;\n\t}\n</style>";

	let html = new Html();
	let results = html.build(template);

	return assert(expected, results);
}

function altTextElementNoDescendants() {
	let template = tmplStr(
		`
		<script>
			{}
		</script>
		`,
		[],
	);

	let expected = "<script>\n\t{}\n</script>";

	let html = new Html();
	let results = html.build(template);

	return assert(expected, results);
}

function preservedTextElement() {
	let template = tmplStr(
		`
<pre>
	U w U
	  woof woof!
</pre>
		`,
		[],
	);

	let expected = "<pre>\n\tU w U\n\t  woof woof!\n</pre>";

	let html = new Html();
	let results = html.build(template);

	return assert(expected, results);
}

export const tests = [
	textElement,
	emptyElement,
	fragment,
	elementWithText,
	inlineElementWithText,
	anchorElementWithText,
	voidElement,
	nonVoidElement,
	commentElement,
	altTextElement,
	altTextElementNoDescendants,
	preservedTextElement,
];

export const options = {
	title: import.meta.url,
};
