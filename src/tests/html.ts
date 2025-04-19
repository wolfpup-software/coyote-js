import { assert } from "./assertion.js";
import { tmplStr, Html } from "../mod.js";

function emptyElement() {
	let template = tmplStr(
		`<html>
		</html>`,
		[],
	);

	let expected = "<html></html>";

	let html = new Html();
	let results = html.build(template);

	return assert(expected, results);
}

function unbalancedEmptyElement() {
	let template = tmplStr(`<html>`, []);

	let html = new Html();
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

	let expected = "<h1>\n\tHello <span>World!</span>\n</h1>";

	let html = new Html();
	let results = html.build(template);

	return assert(expected, results);
}

function voidElements() {
	let template = tmplStr(
		`<input>   <input>
            <input><input> `,
		[],
	);

	let expected = "<input>\n<input>\n<input>\n<input>";

	let html = new Html();
	let results = html.build(template);

	return assert(expected, results);
}

function textAndInlineElements() {
	let template = tmplStr(
		`beasts <span>    tread		</span>     softly <span>    underfoot </span>      .`,
		[],
	);

	let expected = "beasts <span>tread</span> softly <span>underfoot</span> .";

	let html = new Html();
	let results = html.build(template);

	return assert(expected, results);
}

function textAndBlocks() {
	let template = tmplStr(
		`beasts <p>    tread		</p>     softly <p>    underfoot </p>      .`,
		[],
	);

	let expected =
		"beasts\n<p>\n\ttread\n</p>\nsoftly\n<p>\n\tunderfoot\n</p>\n.";

	let html = new Html();
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
		'<!DOCTYPE html>\n<input type=checkbox>\n<input woof="bark">\n<input grrr>\n<input>';

	let html = new Html();
	let results = html.build(template);

	return assert(expected, results);
}

function voidElementsWithSibling() {
	let template = tmplStr(
		`
            <input><p>hai :3</p>    `,
		[],
	);

	let expected = "<input>\n<p>\n\thai :3\n</p>";

	let html = new Html();
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

	let expected = "<section>\n\t<input>\n\t<p>\n\t\thai :3\n\t</p>\n</section>";

	let html = new Html();
	let results = html.build(template);

	return assert(expected, results);
}

function nestedElementsAndText() {
	let template = tmplStr(
		`<a><label><input type=woofer>bark!</label><img></a>`,
		[],
	);

	let expected =
		"<a>\n\t<label>\n\t\t<input type=woofer>\n\t\tbark!\n\t</label>\n\t<img>\n</a>";

	let html = new Html();
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
		"<!DOCTYPE>\n<html>\n\t<head></head>\n\t<body>\n\t\t<article>\n\t\t\tYou're a <span>boy kisser</span> aren't you?\n\t\t\tClick\n\t\t\t<a>\n\t\t\t\there\n\t\t\t</a>\n\t\t\tand go somewhere else.\n\t\t</article>\n\t\t<footer></footer>\n\t</body>\n</html>";

	let html = new Html();
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
		"<!DOCTYPE>\n<html>\n\t<head>\n\t\t<style>\n\t\t\t#woof .bark {\n\t\t\t\tcolor: doggo;\n\t\t\t}\n\t\t</style>\n\t\t<script>\n\t\t\tif 2 < 3 {\n\t\t\t\tconsole.log();\n\t\t\t}\n\t\t</script>\n\t</head>\n\t<body>\n\t\t<article></article>\n\t\t<footer></footer>\n\t</body>\n</html>";

	let html = new Html();
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
