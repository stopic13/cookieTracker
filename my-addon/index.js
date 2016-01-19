var data = require("sdk/self").data;

require("sdk/ui/button/action").ActionButton({
                                             id: "show-panel",
                                             label: "Show Panel",
                                             icon: {
                                             "16": "./ccc-16.png",
                                             "32": "./ccc-32.png",
                                             "64": "./ccc-64.png"
                                             },
                                             onClick: handleClick
                                             });

function handleClick() {
    console.log("cookie");
    require("sdk/tabs").on("ready", function(tab) {
                           tab.attach({
    contentScript : "console.log(document.cookie);"
    });
});
