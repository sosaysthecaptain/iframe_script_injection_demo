// This implementation does not have a web worker mechanism to ensure that scripts dont clog up the same thread.
// TODO :: Run untrusted scripts in sandboxed iframe web worker.

// Element Instance object containing data pertaining to the element instance itself and referenced data.
// const thisPluginInstanceCode = window.plugins["somerandompluginID_current"].plugin_elements.elementID.code.fn;
// Often you would want to see the component in its different states, thus renderState. Maybe a future consideration due to many considerations.
let instance = {
    renderStateToPreviewInEditor: {
        clickState: "Clicked",
        ProcessingSpinner: true
    },
    data: {
        name: "Button name",
        icon: "fa-checkmark",
        switch: false
    },
    properties: {
        height: 100,
        thisproperty: true,
        thatproperty: false
    },
    styles: {
        "background-color": "#fafafa",
        "border-color": "#000000",
        "border-thickness": "2px",
        "font-size":
        "calc(14px + (26 - 14) * ((100vw - 300px) / (1600 - 300))); // Yes I am hinting at responsive font sizes =)"
    }
    };
    
    // Plugin Instance object containing the different scripts and resources to be loaded into the iframe for rendering the plugin element(s).
    // For now it doesnt seem that we need to load plugin data like events++ so this is omitted in this abstract implementation.
    // You may want to process the headercode in the plugin editor (only for bubble editor use) into elements by order and classified as type. You would then make a richer array than below and run some switch cases to classify what processor function to use.
    // You may want to support custom attributes as well like integrity,nomodule,nonce,defer,async.
    const myplugindata = {
    headercss: [".textcolor { color: blue; }"],
    headerextcss: [
        "https://unpkg.com/simple-jscalendar@1.4.3/source/jsCalendar.min.css"
    ],
    headerjs: [
        {
        type: "url",
        resource: "https://unpkg.com/jquery/dist/jquery.min.js"
        },
        {
        type: "url",
        resource:
            "https://unpkg.com/simple-jscalendar@1.4.3/source/jsCalendar.min.js"
        },
        {
        type: "url",
        resource: "/script2.js"
        },
        {
        type: "inline",
        resource: "console.log('Header inline javascript item 1');"
        },
        {
        type: "inline",
        resource: "console.log('Header inline javascript item 2');"
        }
    ],
    elementscript: [
        'var newDiv = document.createElement("div"); \r\n  var newContent = document.createTextNode("Rendering a calendar that is dependent on external JS"); \r\n newDiv.className = "textcolor"; \r\n  newDiv.appendChild(newContent);  \r\n  document.body.appendChild(newDiv);',
        'var newDiv = document.createElement("div"); \r\n newDiv.id = "my-calendar";\r\n  document.body.appendChild(newDiv); var element = document.getElementById("my-calendar");   \r\n    jsCalendar.new(element);    ',
        "console.log('This runs after external resources >> ' + globalVar);",
        "function aFunction() { \
            console.log('  This is the execution of a multiline function stored as string variable in array'); }\
            aFunction(); ",
        "console.log('This is the last inline contentscript... 🦄');"
    ]
    };
    
    // Dynamic script loading using a callback queue to ensure that content scripts only runs after external JS resources are loaded.
    // This implementation assumes all external JS scripts are dependent.
    // TODO :: Add logic for parsing async tags and non-dependent loading order
    
    // Comment/uncomment the var scriptloader and last line after script to easily work with this script in your editor.
    // When uncommented the section will be a JS string. You need \ at end of each line to convert to string.
    //var scriptLoader =
    //  'console.log(_initialListener); window.removeEventListener("message", _initialListener, true); ';
    
    var scriptLoader =
    'console.log("Start of complex scriptloader"); \
    window.removeEventListener("message", _initialListener, true); \
    var _initialListener = function(event) { \
        if (~event.origin.indexOf("https://84lkr4nry2.codesandbox.io")) { \
        console.log("Secure origin function loading..."); \
        function extScriptLoader(thisscript, callbackF) { \
            console.log("Start processing of " + thisscript.resource); \
            var thisElement = document.createElement("script"); \
            thisElement.type = "text/javascript"; \
            if (thisscript.type == "inline") { \
            var inlineScript = document.createTextNode(thisscript.resource); \
            thisElement.appendChild(inlineScript); \
            } else if (thisscript.type == "url") { \
            thisElement.src = thisscript.resource; \
        \
            if (thisElement.readyState) { \
                thisElement.onreadystatechange = function() { \
                if ( \
                    thisElement.readyState == "loaded" || \
                    thisElement.readyState == "complete" \
                ) { \
                    thisElement.onreadystatechange = null; \
                    callbackF(); \
                } \
                }; \
            } else { \
                thisElement.onload = function() { \
                callbackF(); \
                }; \
            } \
            } \
        \
            document.getElementsByTagName("head")[0].appendChild(thisElement); \
        \
            if (thisscript.type == "inline") { \
            callbackF(); \
            } \
        } \
        \
        function processElement(type, list, completedcallback, item, index) { \
            if (list && list.length > 0) { \
            console.log( \
                "Processing element " + \
                type + \
                " script #" + \
                (index + 1) + \
                " of " + \
                list.length \
            ); \
            if (type == "js") { \
                var thisElement = document.createElement("script"); \
                thisElement.type = "text/javascript"; \
                var scriptVar = document.createTextNode(item); \
                thisElement.appendChild(scriptVar); \
                document.body.appendChild(thisElement); \
            } else if (type == "extcss") { \
                var thisElement = document.createElement("link"); \
                thisElement.href = item; \
                thisElement.type = "text/css"; \
                thisElement.rel = "stylesheet"; \
                document.head.append(thisElement); \
            } else if (type == "css") { \
                var thisElement = document.createElement("style"); \
                thisElement.type = "text/css"; \
                var cssVar = document.createTextNode(item); \
                thisElement.appendChild(cssVar); \
                document.head.appendChild(thisElement); \
            } \
            } \
        \
            if (!list || index + 1 - list.length == 0) { \
            completedcallback(); \
            } \
        } \
        \
        var hasRun = false; \
        function processExtJS(list, whendone) { \
            console.log( \
            "Completed loading " + \
                list[0].resource + \
                " - removed resource from the array. " \
            ); \
            list.shift(); \
            if (list && list.length > 0) { \
            var runthis = function() { \
                processExtJS(list, whendone); \
            }; \
            console.log(list.length + " external scripts left "); \
            extScriptLoader(list[0], runthis); \
            } \
            if (!hasRun && (!list || list.length == 0)) { \
            hasRun = true; \
            whendone(); \
            } \
        } \
        \
        function loadScripts() { \
            console.log("Ready for liftoff 🚀🚀🚀🚀🚀🚀🚀🚀"); \
            console.log("Loading header scripts"); \
            var runthis = function() { \
            processExtJS(event.data.headerjs, runExtCSS); \
            }; \
            extScriptLoader(event.data.headerjs[0], runthis); \
        } \
        \
        function runExtCSS() { \
            event.data.headerextcss.forEach( \
            processElement.bind( \
                null, \
                "extcss", \
                event.data.headerextcss, \
                runInlineCSS \
            ) \
            ); \
        } \
        \
        function runInlineCSS() { \
            event.data.headercss.forEach( \
            processElement.bind(null, "css", event.data.headercss, runInlineJS) \
            ); \
        } \
        function runInlineJS() { \
            event.data.elementscript.forEach( \
            processElement.bind(null, "js", event.data.elementscript, loadedAll) \
            ); \
        } \
        function loadedAll() { \
            console.log("I guess this is what success looks like! 🎉🎉🙌🏽"); \
        } \
        loadScripts();\
        } \
    }; \
    window.addEventListener("message", _initialListener, true);\
    console.log("Loaded the complex scriptloader");';
    
    // Second plugin loader object. This contains the more complex PostMessage receiver that can render headerscripts etc. into DOM. May be slightly redundant if you want to load a much bigger script into SRCDOC or use external URL.
    // Console logs can be omitted later. Debugging purposes.
    const pluginloader = {
    elementscript: [
        'console.log("Pre- loader inline script");',
        'var newDiv = document.createElement("div"); \r\n  var newContent = document.createTextNode("Loaded a more complex scriptloader via postMessage"); \r\n  newDiv.appendChild(newContent);  \r\n  document.body.appendChild(newDiv);',
        scriptLoader
    ]
    };
    
    // iFrame constructor method - Creates a new iframe in the DOM and loads initial JS so we can access it externally even though it is Sandboxed and cross-origin.
    var createiFrame = function(id, container) {
    if (!document.getElementById(id)) {
        let iFrame = document.createElement("iframe");
        iFrame.src = "about:blank";
        // later use element instance ID for bubble plugin. Just call f.ex. createiFrame("bGFOa");
        iFrame.id = id;
    
        //The below block is the code that is loaded dynamically on first creation of the iFrame using srcdoc. I kept this code shorter than the full code needed to parse headerscripts etc. so that it wont clutter too much.
        // Optionally one could load the full "loader" code here, or use an externally hosted URL (! separate origin is important !) that hosts an iframe-loader.html
        let oniframeload =
        'console.log("iFrame loaded with simple loaderscript");   \
        var _initialListener = function(event) {   \
            if (~event.origin.indexOf("https://84lkr4nry2.codesandbox.io")) {   \
            function processInlineJS1(item, index) {   \
                var thisScript = document.createElement("script");   \
                var inlineScript = document.createTextNode(item);   \
                thisScript.appendChild(inlineScript);   \
                thisScript.type = "text/javascript";   \
                document.body.append(thisScript);   \
            }   \
            event.data.elementscript.forEach(processInlineJS1);   \
            }   \
        };   \
        window.addEventListener("message", _initialListener, true);';
    
        // splitting body tags to avoid codesandbox weird inject of their own script
        iFrame.srcdoc =
        "<bo" +
        "dy> This is an iFrame with a simple scriptloader<script>" +
        oniframeload +
        "</script></bo" +
        "dy>";
    
        iFrame.height = "400px";
        iFrame.width = "400px";
        iFrame.sandbox = "allow-scripts";
        var rightcontainer = document.getElementById(container);
        rightcontainer.appendChild(iFrame);
        //    iFrame.contentWindow.postMessage(pluginloader, "*");
    } else {
        // Found an iframe with the same ID, not creating another one.
        console.error("iFrame with the same ID exists");
        // return;
    }
    };
    
    // Send a postMessage with initial plugin loader to the iFrame --  may be redundant if using full pluginloader in srcdoc or c.origin. remoteURL
    var sendPluginLoader = function(id) {
    // Checking if an iFrame with this id exists.
    if (!document.getElementById(id)) {
        // No iframe with this ID found. Creating a new one.
        console.log("Didnt find iFrame so creating a new");
        createiFrame(id);
        var iframeEl = document.getElementById(id);
        iframeEl.contentWindow.postMessage(pluginloader, "*");
    } else {
        console.log("Found iFrame. Shipping complex loader via postMessage.");
        var iframeEl = document.getElementById(id);
        iframeEl.contentWindow.postMessage(pluginloader, "*");
    }
    };
    
    // Send a postMessage to the iFrame with plugin element data object
    // TODO :: implement sending initial instance data too
    var sendToIframe = function(id, container) {
    // Checking if an iFrame with this id exists.
    if (!document.getElementById(id)) {
        // No iframe with this ID found. Creating a new one.
        console.log("Didnt find iFrame so creating a new");
        createiFrame(id, container);
        var iframeEl = document.getElementById(id);
        iframeEl.contentWindow.postMessage(myplugindata, "*");
    } else {
        // Found the iFrame. Sending plugin element data object.
        console.log("Found iFrame - Shipping plugin and component data for render");
        var iframeEl = document.getElementById(id);
        iframeEl.contentWindow.postMessage(myplugindata, "*");
    }
    };
    
    // TODO :: Create postMessage receiver for data updates and element updates
    // TODO :: Prevent multiple initalizations. If needed, destroy and re-create.
    // TODO :: Create postMessage receiver when iframe constructed. Or return response.
    
    // TODO: postMessage or writeStream mutationobserver that would watch the iframe document inner dimensions.
    
    // Inspiration: https://github.com/davidjbradshaw/iframe-resizer
    
    // Thoughts: Element constraints could be useful, such as max width. Could be used via responsive settings too.
    //           If SRCDOC is not viable, one would need to host a elementiframe.html on a different origin to load all eventlisteners and core scripts.
    