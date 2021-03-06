require=(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/**
 * @typedef {Object} ParsingOptions
 *  @property {function(node)} filter Returns false to exclude a node. Default is true.
 */

/**
 * Parse the given XML string into an object.
 *
 * @param {String} xml
 * @param {ParsingOptions} [options]
 * @return {Object}
 * @api public
 */
function parse(xml, options = {}) {

    options.filter = options.filter || (() => true);

    function nextChild() {
        return tag() || content() || comment() || cdata();
    }

    function nextRootChild() {
        match(/\s*/);
        return tag(true) || comment() || doctype() || processingInstruction(false);
    }

    function document() {
        const decl = declaration();
        const children = [];
        let documentRootNode;
        let child = nextRootChild();

        while (child) {
            if (child.node.type === 'Element') {
                if (documentRootNode) {
                    throw new Error('Found multiple root nodes');
                }
                documentRootNode = child.node;
            }

            if (!child.excluded) {
                children.push(child.node);
            }

            child = nextRootChild();
        }

        if (!documentRootNode) {
            throw new Error('Failed to parse XML');
        }

        return {
            declaration: decl ? decl.node : null,
            root: documentRootNode,
            children
        };
    }

    function declaration() {
        return processingInstruction(true);
    }

    function processingInstruction(matchDeclaration) {
        const m = matchDeclaration ? match(/^<\?(xml)\s*/) : match(/^<\?([\w-:.]+)\s*/);
        if (!m) return;

        // tag
        const node = {
            name: m[1],
            type: 'ProcessingInstruction',
            attributes: {}
        };

        // attributes
        while (!(eos() || is('?>'))) {
            const attr = attribute();
            if (!attr) return node;
            node.attributes[attr.name] = attr.value;
        }

        match(/\?>/);

        return {
            excluded: matchDeclaration ? false : options.filter(node) === false,
            node
        };
    }

    function tag(matchRoot) {
        const m = match(/^<([\w-:.]+)\s*/);
        if (!m) return;

        // name
        const node = {
            type: 'Element',
            name: m[1],
            attributes: {},
            children: []
        };

        // attributes
        while (!(eos() || is('>') || is('?>') || is('/>'))) {
            const attr = attribute();
            if (!attr) return node;
            node.attributes[attr.name] = attr.value;
        }

        const excluded = matchRoot ? false : options.filter(node) === false;

        // self closing tag
        if (match(/^\s*\/>/)) {
            node.children = null;
            return {
                excluded,
                node
            };
        }

        match(/\??>/);

        if (!excluded) {
            // children
            let child = nextChild();
            while (child) {
                if (!child.excluded) {
                    node.children.push(child.node);
                }
                child = nextChild();
            }
        }

        // closing
        match(/^<\/[\w-:.]+>/);

        return {
            excluded,
            node
        };
    }

    function doctype() {
        const m = match(/^<!DOCTYPE\s+[^>]*>/);
        if (m) {
            const node = {
                type: 'DocumentType',
                content: m[0]
            };
            return {
                excluded: options.filter(node) === false,
                node
            };
        }
    }

    function cdata() {
        const m = match(/^<!\[CDATA\[[^\]\]>]*]]>/);
        if (m) {
            const node = {
                type: 'CDATA',
                content: m[0]
            };
            return {
                excluded: options.filter(node) === false,
                node
            };
        }
    }

    function comment() {
        const m = match(/^<!--[\s\S]*?-->/);
        if (m) {
            const node = {
                type: 'Comment',
                content: m[0]
            };
            return {
                excluded: options.filter(node) === false,
                node
            };
        }
    }

    function content() {
        const m = match(/^([^<]+)/);
        if (m) {
            const node = {
                type: 'Text',
                content: m[1]
            };
            return {
                excluded: options.filter(node) === false,
                node
            };
        }
    }

    function attribute() {
        const m = match(/([\w:-]+)\s*=\s*("[^"]*"|'[^']*'|\w+)\s*/);
        if (!m) return;
        return {name: m[1], value: strip(m[2])}
    }

    /**
     * Strip quotes from `val`.
     */
    function strip(val) {
        return val.replace(/^['"]|['"]$/g, '');
    }

    /**
     * Match `re` and advance the string.
     */
    function match(re) {
        const m = xml.match(re);
        if (!m) return;
        xml = xml.slice(m[0].length);
        return m;
    }

    /**
     * End-of-source.
     */
    function eos() {
        return 0 === xml.length;
    }

    /**
     * Check for `prefix`.
     */
    function is(prefix) {
        return 0 === xml.indexOf(prefix);
    }

    xml = xml.trim();

    return document();
}

module.exports = parse;

},{}],"xml-formatter":[function(require,module,exports){
/**
 * @typedef {Object} XMLFormatterOptions
 *  @property {string} [indentation='    '] The value used for indentation
 *  @property {function(node): boolean} [filter] Return false to exclude the node.
 *  @property {boolean} [collapseContent=false] True to keep content in the same line as the element. Only works if element contains at least one text node
 *  @property {string} [lineSeparator='\r\n'] The line separator to use
 *   @property {string} [whiteSpaceAtEndOfSelfclosingTag=false] to either end ad self closing tag with `<tag/>` or `<tag />`
 */


/**
 * 
 * @param {*} output 
 */
function newLine(output) {
    output.content += output.options.lineSeparator;
    let i;
    for (i = 0; i < output.level; i++) {
        output.content += output.options.indentation;
    }
}

function appendContent(output, content) {
    output.content += content;
}

/**
 * @param {XMLFormatterOptions} options 
 */
function processNode(node, output, preserveSpace, options) {
    if (typeof node.content === 'string') {
        processContentNode(node, output, preserveSpace);
    } else if (node.type === 'Element') {
        processElement(node, output, preserveSpace, options);
    } else if (node.type === 'ProcessingInstruction') {
        processProcessingIntruction(node, output, preserveSpace);
    } else {
        throw new Error('Unknown node type: ' + node.type);
    }
}

function processContentNode(node, output, preserveSpace) {
    if (node.content.trim() !== '' || preserveSpace) {
      if (!preserveSpace && output.content.length > 0) {
          newLine(output);
      }
      appendContent(output, node.content);
    }
}

/**
 * @param {XMLFormatterOptions} options 
 */
function processElement(node, output, preserveSpace, options) {
    if (!preserveSpace && output.content.length > 0) {
        newLine(output);
    }

    appendContent(output, '<' + node.name);
    processAttributes(output, node.attributes);

    if (node.children === null) {
        const selfClosingNodeClosingTag = options.whiteSpaceAtEndOfSelfclosingTag ? ' />' : '/>'
        // self-closing node
        appendContent(output, selfClosingNodeClosingTag);
    } else if (node.children.length === 0) {
        // empty node
        appendContent(output, '></' + node.name + '>');
    } else {

        appendContent(output, '>');

        output.level++;

        let nodePreserveSpace = node.attributes['xml:space'] === 'preserve';

        if (!nodePreserveSpace && output.options.collapseContent) {

            const containsTextNodes = node.children.some(function(child) {
                return child.type === 'Text' && child.content.trim() !== '';
            });

            if (containsTextNodes) {
                nodePreserveSpace = true;
            }
        }

        node.children.forEach(function(child) {
            processNode(child, output, preserveSpace || nodePreserveSpace, options);
        });

        output.level--;

        if (!preserveSpace && !nodePreserveSpace) {
            newLine(output);
        }
        appendContent(output, '</' + node.name + '>');
    }
}

function processAttributes(output, attributes) {
    Object.keys(attributes).forEach(function(attr) {
        appendContent(output, ' ' + attr + '="' + attributes[attr] + '"');
    });
}

function processProcessingIntruction(node, output) {
    if (output.content.length > 0) {
        newLine(output);
    }
    appendContent(output, '<?' + node.name);
    processAttributes(output, node.attributes);
    appendContent(output, '?>');
}


/**
 * Converts the given XML into human readable format.
 *
 * @param {String} xml
 * @param {XMLFormatterOptions} options
 *  @config {String} [indentation='    '] The value used for indentation
 *  @config {function(node): boolean} [filter] Return false to exclude the node.
 *  @config {Boolean} [collapseContent=false] True to keep content in the same line as the element. Only works if element contains at least one text node
 *  @config {String} [lineSeparator='\r\n'] The line separator to use
 *  @config {string} [whiteSpaceAtEndOfSelfclosingTag=false] to either end with `<tag/>` or `<tag />`
 * @returns {string}
 */
function format(xml, options = {}) {

    options = options || {};
    options.indentation = options.indentation || '    ';
    options.collapseContent = options.collapseContent === true;
    options.lineSeparator = options.lineSeparator || '\r\n';
    options.whiteSpaceAtEndOfSelfclosingTag = !!options.whiteSpaceAtEndOfSelfclosingTag;

    const parse = require('xml-parser-xo');
    const parsedXml = parse(xml, {filter: options.filter});
    const output = {content: '', level: 0, options: options};

    if (parsedXml.declaration) {
        processProcessingIntruction(parsedXml.declaration, output);
    }

    parsedXml.children.forEach(function(child) {
        processNode(child, output, false, options);
    });

    return output.content;
}


module.exports = format;

},{"xml-parser-xo":1}]},{},[]);
