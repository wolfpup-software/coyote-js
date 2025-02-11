import { tmpl, ClientHtml, Html } from "./mod.js";

function testPrettyHtmlNoEmptySpace() {
	const template = tmpl`<html></html>`;
	const expected = "<html></html>";

	const html = new Html();
	let results = html.build(template);

	return expected !== results;
}

function testPrettyHtmlVoidEl() {
	const template = tmpl`
         <input>   <input>
             <input><input> `;
	const expected = "<input>\n<input>\n<input>\n<input>";

	const html = new Html();
	let results = html.build(template);

	return expected !== results;
}

function testPrettyHtmlVoidElWithAttributes() {
	const template = tmpl`
         <!DOCTYPE html><input type=checkbox>   <input woof=\"bark\">
             <input grrr><input> `;
	const expected =
		'<!DOCTYPE html>\n<input type=checkbox>\n<input woof="bark">\n<input grrr>\n<input>';

	const html = new Html();
	let results = html.build(template);

	return expected !== results;
}

function testPrettyHtmlVoidElAndOthers() {
	const template = tmpl`
             <input><p>hai :3</p>    `;
	const expected = "<input>\n<p>\n\thai :3\n</p>";

	const html = new Html();
	let results = html.build(template);

	return expected !== results;
}

function testPrettyHtmlNestedVoidEl() {
	const template = tmpl`
         <section>
             <input><p>hai :3</p>
         </section>
     `;
	const expected =
		"<section>\n\t<input>\n\t<p>\n\t\thai :3\n\t</p>\n</section>";

	const html = new Html();
	let results = html.build(template);

	return expected !== results;
}

function testPrettyHtmlPreservedSpaceEl() {
	const template = tmpl`<style>#woof .bark {
     color: doggo;
 }</style>`;
	const expected =
		"<style>\n\t#woof .bark {\n\t    color: doggo;\n\t}\n</style>";

	const html = new Html();
	let results = html.build(template);

	console.log("expected:");
	console.log(expected);
	console.log("results:\n");
	console.log(results);

	return expected !== results;
}

function testPrettyHtmlDoc() {
	const template = tmpl`        <!DOCTYPE>
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
</html>`;
	const expected =
		"<!DOCTYPE>\n<html>\n\t<head>\n\t\t<style>\n\t\t\t#woof .bark {\n\t\t\t\tcolor: doggo;\n\t\t\t}\n\t\t</style>\n\t\t<script>\n\t\t\tif 2 < 3 {\n\t\t\t\tconsole.log();\n\t\t\t}\n\t\t</script>\n\t</head>\n\t<body>\n\t\t<article></article>\n\t\t<footer></footer>\n\t</body>\n</html>";

	const html = new Html();
	let results = html.build(template);

	console.log("expected:");
	console.log(expected);
	console.log("results:\n");
	console.log(results);

	return expected !== results;
}

function testPrettyHtmlClient() {
	const template = tmpl`        <!DOCTYPE>
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
</html>`;
	const expected =
		"<!DOCTYPE><html><head></head><body><article></article><footer></footer></body></html>";

	const clientHtml = new ClientHtml();
	let results = clientHtml.build(template);

	console.log("expected:");
	console.log(expected);
	console.log("results:\n");
	console.log(results);

	return expected !== results;
}

function testPrettyHtmlWithoutIndents() {
	const template = tmpl`        <!DOCTYPE>
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
</html>`;
	const expected =
		"<!DOCTYPE>\n<html>\n\t<head></head>\n\t<body>\n\t\t<article>\n\t\t\tYou're a <span>boy kisser</span> aren't you?\n\t\t\tClick\n\t\t\t<a>\n\t\t\t\there\n\t\t\t</a>\n\t\t\tand go somewhere else.\n\t\t</article>\n\t\t<footer></footer>\n\t</body>\n</html>";

	const html = new Html();
	let results = html.build(template);

	console.log("expected:");
	console.log(expected);
	console.log("results:");
	console.log(results);

	return expected !== results;
}

function testPrettyHtmlWithoutIndentsClient() {
	const template = tmpl`        <!DOCTYPE>
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
</html>`;
	const expected =
		"<!DOCTYPE>\n<html>\n\t<head></head>\n\t<body>\n\t\t<article>\n\t\t\tYou're a <span>boy kisser</span> aren't you?\n\t\t\tClick\n\t\t\t<a>\n\t\t\t\there\n\t\t\t</a>\n\t\t\tand go somewhere else.\n\t\t</article>\n\t\t<footer></footer>\n\t</body>\n</html>";

	const clientHtml = new ClientHtml();
	let results = clientHtml.build(template);

	console.log("expected:");
	console.log(expected);
	console.log("results:");
	console.log(results);

	return expected !== results;
}

function testPrettyHtmWithoutIndentsAndText() {
	const template = tmpl`<a><label><input type=woofer>bark!</label><img></a>`;
	const expected = "<a><label><input type=woofer>bark!</label><img></a>";

	const clientHtml = new ClientHtml();
	let results = clientHtml.build(template);

	console.log("expected:");
	console.log(expected);
	console.log("results:\n");
	console.log(results);

	return expected !== results;
}

export const tests = [
	testPrettyHtmlNoEmptySpace,
	testPrettyHtmlVoidEl,
	testPrettyHtmlVoidElWithAttributes,
	testPrettyHtmlVoidElAndOthers,
	testPrettyHtmlNestedVoidEl,
	// testPrettyHtmlPreservedSpaceEl,
	// testPrettyHtmlDoc,
	// testPrettyHtmlClient,
	// testPrettyHtmlWithoutIndents,
	// testPrettyHtmlWithoutIndentsClient,
	testPrettyHtmWithoutIndentsAndText,
];

// /* complicated inline cases */
// #[test]
// fn test_pretty_html_without_indents_and_text() {
//     let template = tmpl("<a><label><input type=woofer>bark!</label><img></a>", []);

//     let expected = "<a><label><input type=woofer>bark!</label><img></a>";

//     let mut html = ClientHtml::new();
//     let results = html.build(&template);

//     assert_eq!(expected, results);
// }
