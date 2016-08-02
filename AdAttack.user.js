// ==UserScript==
// @name            AdAttack
// @namespace       https://github.com/elcattivo/AdAttack
// @version         0.1.1-alpha
// @description     Removes ads shown by AdDefend.
// @author          elcattivo
// @copyright       2016, El Cattivo (http://byteland.cc)
// @license         The MIT License (MIT); https://opensource.org/licenses/MIT
// @include         *
// @grant           none
// @run-at          document-end
// @nocompat        Chrome
// @updateURL       https://raw.githubusercontent.com/elcattivo/AdAttack/master/AdAttack.meta.js
// @downloadURL     https://raw.githubusercontent.com/elcattivo/AdAttack/master/AdAttack.user.js
// @supportURL      https://github.com/elcattivo/AdAttack/issues
// ==/UserScript==

(function() {
    'use strict';

    var idPattern = /[a-zA-z]{1}\([a-zA-z]{1}\,\"([a-zA-Z]{2,})\s*\"\)/g,
        ids = {},
        isInitialized = false,
        cachedNodes = [],
        scriptContent,
        match,
        observer;

    observer = new WebKitMutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            for(var i = 0; i < mutation.addedNodes.length; i++) {
                var node = mutation.addedNodes[i];

                if (isInitialized === true) {
                    for (var id in ids) {
                        if (node.id === id || node.classList.contains(id)) {
                            node.parentNode.removeChild(node);
                            break;
                        }
                    }
                } else {
                    cachedNodes.push(node);
                }
            }
        });
    });

    observer.observe(document, {
        childList: true,
        subtree: true,
        attributes: false
    });

    Array.from(document.scripts).forEach(function (script) {
        scriptContent = script.innerHTML;

        match = idPattern.exec(scriptContent);
        while (match !== null) {
            ids[match[1].trim()] = true;
            match = idPattern.exec(scriptContent);
        }
    });

    isInitialized = true;

    var currentNode = cachedNodes.pop();
    while (currentNode !== null && currentNode !== undefined) {
        currentNode.parentNode.removeChild(currentNode);
        currentNode = cachedNodes.pop();
    }
})();
