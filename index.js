// Get the target div, empty it

// Construct the new thing we want to inject
// var simple_div = $(`
//     <div>this is stuff getting injected</div>
// `)

// simple_div.css('background-color', 'lightblue')
// simple_div.css('height', 200)
// simple_div.css('padding', 20)

// Inject it
// target_div.append(simple_div)



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

inject_iframe_with_content('this can be any html')