// Runs supplied js in an iFrame
let inject_plugin_code = function(user_code) {
    
    // Create and inject an iframe
    let inject_iframe_with_content = function(content) {
        // Create the iFrame
        var iframe = $(`
            <iframe src="" 
            frameborder="1"
            height="600" 
            width="600">
            alternative content for browsers which do not support iframe.
            </iframe>
        `)
    
        // Fetch the target div, empty, and append iFrame
        let target_div = $('#put-iframe-here')
        target_div.empty()
        target_div.append(iframe)
    
        // Find the iFrame in its containing div, add content to it
        $("#put-iframe-here").each(function(){
            var iframe = $(this).find('iframe');
            iframe[0].contentDocument.write(content);
            iframe[0].contentWindow.document.close(); //without this line, page loading animations won't go away!
        });
    }

    let html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta http-equiv="X-UA-Compatible" content="ie=edge" />
            <title>user plugin</title>
            
            </head>
        <body>
            <script src="https://unpkg.com/jquery/dist/jquery.min.js"></script>
            
            <script>${user_code}</script>
            
        </body>
        </html>
    `
    inject_iframe_with_content(html)
}

let example_user_js_string = `
    let simple_div = document.createElement("div")
    let text_node = document.createTextNode("content being rendered by the user's plugin")
    simple_div.appendChild(text_node)
    
    document.body.appendChild(simple_div)
`

inject_plugin_code(example_user_js_string)
// inject_plugin_code(user_js_string)

