import type { StepInterface, StepKind } from "../../parse_str/dist/mod.ts";
import type { SieveInterface } from "../../sieve/dist/mod.ts";
import type { TagInfoInterface } from "./tag_info.ts";

import { TagInfo, from } from "./tag_info.js";
import { getTextFromStep, parseStr } from "../../parse_str/dist/mod.js";

type Router = (
  results: string[],
  stack: TagInfoInterface[],
  sieve: SieveInterface,
  templateStr: string,
  step: StepInterface,
) => void;

const spaceCharCodes = new Set([
  0x0009, 0x000b, 0x000c, 0xfeff,

  // whitespace chars
  0x0020, 0x00a0, 0x1680, 0x2000, 0x2001, 0x2002, 0x2003, 0x2004, 0x2005,
  0x2006, 0x2007, 0x2008, 0x2009, 0x200a, 0x202f, 0x205f, 0x3000,
]);

const htmlRoutes = new Map<StepKind, Router>([
  ["Tag", pushElement],
  ["ElementClosed", closeElement],
  ["EmptyElementClosed", closeEmptyElement],
  ["TailTag", popElement],
  ["Text", pushText],
  ["Attr", addAttr],
  ["AttrValue", addAttrValue],
  ["AttrValueUnquoted", addAttrValUnquoted],
  ["DescendantInjection", pushInjectionKind],
  ["InjectionSpace", pushInjectionKind],
  ["InjectionConfirmed", pushInjectionKind],
  ["CommentText", pushText],
  ["AltText", pushText],
  ["AltTextCloseSequence", popClosingSquence],
]);

function compose(sieve: SieveInterface, templateStr: string): string {
  let results = [];
  let stack: TagInfo[] = [];

  for (const step of parseStr(sieve, templateStr, "Initial")) {
    let route = htmlRoutes.get(step.kind);
    if (route) {
      route(results, stack, sieve, templateStr, step);
    }
  }

  return results.join("");
}

function pushElement(
  results: string[],
  stack: TagInfo[],
  sieve: SieveInterface,
  templateStr: string,
  step: StepInterface,
) {
  let tag = getTextFromStep(templateStr, step);
  let tagInfo = stack[stack.length - 1];
  tagInfo = tagInfo ? from(sieve, tagInfo, tag) : new TagInfo(sieve, tag);

  if (tagInfo.bannedPath) {
    let prevTagInfo = stack[stack.length - 1];
    if (prevTagInfo) {
      prevTagInfo.mostRecentDescendant = sieve.isInlineEl(tag)
        ? "InlineElement"
        : "Element";

      stack.push(tagInfo);
      return;
    }

    stack.push(tagInfo);
    return;
  }

  if (sieve.respectIndentation() && results.length > 0) {
    if (tagInfo.inlineEl) {
      results.push(" ");
    } else {
      results.push("\n");
      results.push("\t".repeat(tagInfo.indentCount));
    }
  }

  if (!sieve.respectIndentation() && tagInfo.inlineEl && !tagInfo.voidEl) {
    let prevTagInfo = stack[stack.length - 1];
    if (prevTagInfo && prevTagInfo.mostRecentDescendant === "Text") {
      results.push(" ");
    }
  }

  let prevTagInfo = stack[stack.length - 1];
  if (prevTagInfo) {
    prevTagInfo.mostRecentDescendant = sieve.isInlineEl(tag)
      ? "InlineElement"
      : "Element";
  }

  results.push("<");
  results.push(tag);

  stack.push(tagInfo);
}

function closeElement(results: string[], stack: TagInfo[]) {
  let tagInfo = stack[stack.length - 1];
  if (tagInfo === undefined) return;

  if (!tagInfo.bannedPath) {
    results.push(">");
  }

  if (tagInfo.voidEl && "html" === tagInfo.namespace) {
    stack.pop();
  }
}

function closeEmptyElement(results: string[], stack: TagInfo[]) {
  let tagInfo = stack[stack.length - 1];
  if (tagInfo === undefined) return;

  if (tagInfo.bannedPath || tagInfo.voidEl) {
    stack.pop();
    return;
  }

  if ("html" !== tagInfo.namespace) {
    results.push("/>");
  }

  if (!tagInfo.voidEl && "html" == tagInfo.namespace) {
    results.push(">/<");
    results.push(tagInfo.tag);
  }

  if ("html" === tagInfo.namespace) {
    results.push(">");
  }

  stack.pop();
}

function popElement(
  results: string[],
  stack: TagInfo[],
  sieve: SieveInterface,
  templateStr: string,
  step: StepInterface,
) {
  let tag = getTextFromStep(templateStr, step);
  let tagInfo = stack[stack.length - 1];
  if (tagInfo === undefined) return;

  if (tag != tagInfo.tag) return;

  if (tagInfo.bannedPath) {
    stack.pop();
    return;
  }

  if (tagInfo.voidEl && "html" !== tagInfo.namespace) {
    results.push(">");
    stack.pop();

    let prevTagInfo = stack[stack.length - 1];
    if (prevTagInfo) {
      prevTagInfo.mostRecentDescendant = "ElementClosed";
    }

    return;
  }

  if (
    sieve.respectIndentation() &&
    !tagInfo.inlineEl &&
    !tagInfo.preservedTextPath &&
    "Initial" !== tagInfo.mostRecentDescendant
  ) {
    results.push("\n");
    results.push("\t".repeat(tagInfo.indentCount));
  }

  results.push("</");
  results.push(tag);
  results.push(">");

  stack.pop();

  let prevTagInfo = stack[stack.length - 1];
  if (prevTagInfo) {
    prevTagInfo.mostRecentDescendant = sieve.isInlineEl(tag)
      ? "InlineElementClosed"
      : "ElementClosed";
  }
}

function addAttr(
  results: string[],
  stack: TagInfo[],
  _sieve: SieveInterface,
  templateStr: string,
  step: StepInterface,
) {
  let tagInfo = stack[stack.length - 1];
  if (tagInfo === undefined) return;

  if (tagInfo.bannedPath) return;

  let attr = getTextFromStep(templateStr, step);
  results.push(" ");
  results.push(attr);
}

function addAttrValue(
  results: string[],
  stack: TagInfo[],
  _sieve: SieveInterface,
  templateStr: string,
  step: StepInterface,
) {
  let tagInfo = stack[stack.length - 1];
  if (tagInfo === undefined) return;

  if (tagInfo.bannedPath) return;

  let val = getTextFromStep(templateStr, step);
  results.push('="');
  results.push(val);
  results.push('"');
}

function addAttrValUnquoted(
  results: string[],
  stack: TagInfo[],
  _sieve: SieveInterface,
  templateStr: string,
  step: StepInterface,
) {
  let tagInfo = stack[stack.length - 1];
  if (tagInfo === undefined) return;

  if (tagInfo.bannedPath) return;

  let val = getTextFromStep(templateStr, step);
  results.push("=");
  results.push(val);
}

function pushInjectionKind(
  results: string[],
  stack: TagInfo[],
  _sieve: SieveInterface,
  templateStr: string,
  step: StepInterface,
) {
  let tagInfo = stack[stack.length - 1];
  if (tagInfo === undefined) return;

  if (tagInfo.bannedPath) return;

  let glpyhs = getTextFromStep(templateStr, step);
  results.push(glpyhs);
}

function pushText(
  results: string[],
  stack: TagInfo[],
  sieve: SieveInterface,
  templateStr: string,
  step: StepInterface,
) {
  let text = getTextFromStep(templateStr, step);
  let tagInfo = stack[stack.length - 1];
  if (tagInfo === undefined) {
    let splitText = text.split("\n");
    for (let splitted of splitText) {
      if (splitted.length === getIndexOfFirstChar(splitted)) continue;

      results.push("\n");
      results.push(splitted.trim());
    }
    return;
  }
  // if no stack?

  if (tagInfo.bannedPath || tagInfo.voidEl) return;

  if (tagInfo.preservedTextPath) {
    tagInfo.mostRecentDescendant = "Text";
    results.push(text);
    return;
  }

  // alt text
  let altText = sieve.getCloseSequenceFromAltTextTag(tagInfo.tag);
  if (altText) {
    let commonIndex = getMostCommonSpaceIndex(text);
    for (let line of text.split("\n")) {
      if (line.length === getIndexOfFirstChar(line)) continue;
      results.push("\n");
      results.push("\t".repeat(tagInfo.indentCount + 1));
      results.push(line.slice(commonIndex).trimEnd());
    }

    tagInfo.mostRecentDescendant = "Text";
    return;
  }

  // decide what to do with text
  let texts: string[] = [];
  for (let line of text.split("\n")) {
    let trimmed = line.trim();
    if (trimmed.length === 0) continue;
    texts.push(trimmed);
  }

  if (texts.length === 0) return;

  if (sieve.respectIndentation()) {
    if ("InlineElement" === tagInfo.mostRecentDescendant) {
      addInlineElementText(results, texts);
    } else if ("InlineElementClosed" === tagInfo.mostRecentDescendant) {
      addInlineElementClosedText(results, texts, tagInfo);
    } else if ("Initial" === tagInfo.mostRecentDescendant) {
      if (tagInfo.inlineEl) {
        addInlineElementText(results, texts);
      } else {
        addText(results, texts, tagInfo);
      }
    } else {
      addText(results, texts, tagInfo);
    }
  } else {
    if ("InlineElementClosed" === tagInfo.mostRecentDescendant) {
      addUnprettyInlineElementClosedText(results, texts);
    } else if ("Text" === tagInfo.mostRecentDescendant) {
      addInlineElementText(results, texts);
    } else {
      addInlineElementText(results, texts);
    }
  }

  tagInfo.mostRecentDescendant = "Text";
}

function popClosingSquence(
  results: string[],
  stack: TagInfo[],
  sieve: SieveInterface,
  templateStr: string,
  step: StepInterface,
) {
  let closingSequence = getTextFromStep(templateStr, step);
  let tag = sieve.getTagFromCloseSequence(closingSequence);
  if (tag === undefined) return;

  let tagInfo = stack[stack.length - 1];
  if (tagInfo === undefined) return;

  if (tag !== tagInfo.tag) return;

  if (tagInfo.bannedPath) {
    stack.pop();
    return;
  }

  if (
    sieve.respectIndentation() &&
    !tagInfo.inlineEl &&
    !tagInfo.preservedTextPath &&
    "Initial" != tagInfo.mostRecentDescendant
  ) {
    results.push("\n");
    results.push("\t".repeat(tagInfo.indentCount));
  }

  results.push(closingSequence);

  stack.pop();
}

// helpers
function addInlineElementText(results: string[], texts: string[]) {
  let firstLine = texts[0];
  if (firstLine === undefined) return;

  results.push(firstLine);

  for (let index = 1; index < texts.length; index++) {
    results.push(" ");
    results.push(texts[index]);
  }
}

function addInlineElementClosedText(
  results: string[],
  texts: string[],
  tagInfo: TagInfo,
) {
  let firstLine = texts[0];
  if (firstLine === undefined) return;

  results.push(" ");
  results.push(firstLine);

  for (let index = 1; index < texts.length; index++) {
    results.push("\n");
    results.push("\t".repeat(tagInfo.indentCount + 1));
    results.push(texts[index]);
  }
}

function addUnprettyInlineElementClosedText(
  results: string[],
  texts: string[],
) {
  let firstLine = texts[0];
  if (firstLine === undefined) return;

  results.push(" ");
  results.push(firstLine);

  for (let index = 1; index < texts.length; index++) {
    results.push(" ");
    results.push(texts[index]);
  }
}

function addText(results: string[], texts: string[], tagInfo: TagInfo) {
  for (let line of texts) {
    results.push("\n");
    results.push("\t".repeat(tagInfo.indentCount + 1));
    results.push(line);
  }
}

function getIndexOfFirstChar(text: string): number {
  for (let index = 0; index < text.length; index++) {
    if (!spaceCharCodes.has(text.charCodeAt(index))) return index;
  }

  return text.length;
}

function getMostCommonSpaceIndex(text: string): number {
  let spaceIndex = 0;

  let prevSpace = "";
  let currSpace = "";

  for (let line of text.split("\n")) {
    prevSpace = currSpace;

    let currIndex = getIndexOfFirstChar(line);
    if (line.length === currIndex) continue;

    currSpace = line;
    if (spaceIndex === currIndex) continue;

    spaceIndex = getMostCommonIndexBetweenTwoStrings(prevSpace, currSpace);
  }

  return spaceIndex;
}

function getMostCommonIndexBetweenTwoStrings(
  source: string,
  target: string,
): number {
  let minLength = Math.min(source.length, target.length);
  for (let index = 0; index < minLength; index++) {
    let sourceChar = source.charCodeAt(index);
    let targetChar = target.charCodeAt(index);

    if (
      sourceChar !== targetChar ||
      !spaceCharCodes.has(sourceChar) ||
      !spaceCharCodes.has(targetChar)
    )
      return index;
  }

  return minLength - 1;
}

export { compose };
