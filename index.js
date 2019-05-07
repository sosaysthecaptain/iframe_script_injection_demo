// Get the target div, empty it
let target_div = $('#put-iframe-here')
target_div.empty()

// Construct the new thing we want to inject
var simple_div = $(`
    <div>this is stuff getting injected</div>
`)

simple_div.css('background-color', 'lightblue')
simple_div.css('height', 200)
simple_div.css('padding', 20)

// Inject it
// target_div.append(simple_div)

// iFrame example
var iframe_div = $(`
<iframe src="http://google.com" 
    frameborder="1" 
    height="600" 
    width="600">
        alternative content for browsers which do not support iframe.
    </iframe>
`)

target_div.append(iframe_div)