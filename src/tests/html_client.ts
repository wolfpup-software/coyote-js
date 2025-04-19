import { assert } from "./assertion.js";
import { tmplStr, ClientHtml } from "../mod.js";

function emptyElement() {
	let template = tmplStr(
		`<html>
		</html>`,
		[],
	);

	let expected = "<html></html>";

	let html = new ClientHtml();
	let results = html.build(template);

	return assert(expected, results);
}

function unbalancedEmptyElement() {
	let template = tmplStr(`<html>`, []);

	let html = new ClientHtml();
	let [_doc, err] = html.build(template);

	if (!err) {
		return "Failed to return error from unbalanced template.";
	}
}

function mozillaExample() {
	let template = tmplStr(
		`
        <h1>   Hello
                <span> World!</span>   </h1>`,
		[],
	);

	let expected = "<h1>Hello <span>World!</span></h1>";

	let html = new ClientHtml();
	let results = html.build(template);

	return assert(expected, results);
}

function voidElements() {
	let template = tmplStr(
		`<input>   <input>
            <input><input> `,
		[],
	);

	let expected = "<input><input><input><input>";

	let html = new ClientHtml();
	let results = html.build(template);

	return assert(expected, results);
}

function textAndInlineElements() {
	let template = tmplStr(
		`beasts <span>    tread		</span>     softly <span>    underfoot </span>      .`,
		[],
	);

	let expected = "beasts <span>tread</span> softly <span>underfoot</span> .";

	let html = new ClientHtml();
	let results = html.build(template);

	return assert(expected, results);
}

function textAndBlocks() {
	let template = tmplStr(
		`beasts <p>    tread		</p>     softly <p>    underfoot </p>      .`,
		[],
	);

	let expected = "beasts <p>tread</p> softly <p>underfoot</p> .";

	let html = new ClientHtml();
	let results = html.build(template);

	return assert(expected, results);
}

function voidElementsWithAttributes() {
	let template = tmplStr(
		`
        <!DOCTYPE html><input type=checkbox>   <input woof=\"bark\">
            <input grrr><input> `,
		[],
	);

	let expected =
		'<!DOCTYPE html><input type=checkbox><input woof="bark"><input grrr><input>';

	let html = new ClientHtml();
	let results = html.build(template);

	return assert(expected, results);
}

function voidElementsWithSibling() {
	let template = tmplStr(
		`
            <input><p>hai :3</p>    `,
		[],
	);

	let expected = "<input><p>hai :3</p>";

	let html = new ClientHtml();
	let results = html.build(template);

	return assert(expected, results);
}

function nestedVoidElementsWithSibling() {
	let template = tmplStr(
		`
        <section>
            <input><p>hai :3</p>
        </section>
    `,
		[],
	);

	let expected = "<section><input><p>hai :3</p></section>";

	let html = new ClientHtml();
	let results = html.build(template);

	return assert(expected, results);
}

function nestedElementsAndText() {
	let template = tmplStr(
		`<a><label><input type=woofer>bark!</label><img></a>`,
		[],
	);

	let expected = "<a><label><input type=woofer>bark!</label><img></a>";

	let html = new ClientHtml();
	let results = html.build(template);

	return assert(expected, results);
}

function document() {
	let template = tmplStr(
		`        <!DOCTYPE>
    <html>
    <head>

    </head>
        <body>
            <article>
                You're a <span>boy kisser</span> aren't you?
                Click <a>here</a> and go somewhere else.
            </article>
            <footer/>
        </body>
</html>`,
		[],
	);

	let expected =
		"<!DOCTYPE><html><head></head><body><article>You're a <span>boy kisser</span> aren't you? Click <a>here</a> and go somewhere else.</article><footer></footer></body></html>";

	let html = new ClientHtml();
	let results = html.build(template);

	return assert(expected, results);
}

function documentWithAltTextElements() {
	let template = tmplStr(
		`        <!DOCTYPE>
    <html>
    <head>
        <style>
#woof .bark {
	color: doggo;
}
        </style>
        <script>
if 2 < 3 {
	console.log();
}
        </script>
    </head>
        <body>
            <article></article>
            <footer/>
        </body>
</html>`,
		[],
	);

	let expected =
		"<!DOCTYPE><html><head></head><body><article></article><footer></footer></body></html>";

	let html = new ClientHtml();
	let results = html.build(template);

	return assert(expected, results);
}

export const tests = [
	emptyElement,
	unbalancedEmptyElement,
	mozillaExample,
	voidElements,
	textAndInlineElements,
	textAndBlocks,
	voidElementsWithAttributes,
	voidElementsWithSibling,
	nestedVoidElementsWithSibling,
	nestedElementsAndText,
	document,
	documentWithAltTextElements,
];

export const options = {
	title: import.meta.url,
};
