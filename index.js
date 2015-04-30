var container = document.getElementById("container");
var perffect = new Perffect(container, ".blocks", 20);

setTimeout(function () {
    var div = document.createElement("div");
    div.className = "h2 blocks";

    container.insertBefore(div, container.childNodes[0]);
    perffect.rearrange();

}, 2000);
