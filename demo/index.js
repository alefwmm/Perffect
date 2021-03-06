var first = document.getElementById('first');
var root = first.createShadowRoot();
root.innerHTML = "<div class='h1'>1</div>";

var container = document.getElementById("container");
var perffect = new Perffect({container: container, selector: ".blocks", gutter: 20, align: 'center'});

setTimeout(function () {
    var div = document.createElement("div");
    div.className = "h2 blocks";

    var children = container.querySelectorAll(".blocks");

    container.insertBefore(div, children.item(3));
    perffect.rearrange();

}, 6000);
