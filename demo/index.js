var container = document.getElementById("container");
var perffect = new Perffect(container, ".blocks", 20);

setTimeout(function () {
    var div = document.createElement("div");
    div.className = "h2 blocks";

    var children = container.querySelectorAll(".blocks");

    container.insertBefore(div, children.item(3));
    perffect.rearrange();

}, 6000);
