// SETTINGS //

var IconNames = {
    ["All items"]:      "th",
    ["User story"]:     "list-alt",
    ["Programming"]:    "code",
    ["Art"]:            "photo",
    ["Design"]:         "puzzle-piece",
    ["Writing"]:        "pencil",
    ["Marketing"]:      "line-chart",
    ["Sound"]:          "headphones",
    ["Ideas"]:          "lightbulb-o",
    ["Bug"]:            "bug"
};

var IconColors = {
    ["All items"]:      "rgb(235, 59, 90)",
    ["User story"]:     "rgb(250, 130, 49)",
    ["Programming"]:    "rgb(247, 183, 49)",
    ["Art"]:            "rgb(32, 191, 107)",
    ["Design"]:         "rgb(15, 185, 177)",
    ["Writing"]:        "rgb(45, 152, 218)",
    ["Marketing"]:      "rgb(56, 103, 214)",
    ["Sound"]:          "rgb(136, 84, 208)",
    ["Ideas"]:          "rgb(242, 99, 206)",
    ["Bug"]:            "rgb(165, 177, 194)",
    ["Custom"]:         "rgb(128, 128, 128)",
    ["Settings"]:       "rgb(32, 32, 32)"
}

var ThemeSettings = {
    Light: {
        Color:              "rgb(255, 255, 255)",
        BadgeInactiveColor: "rgb(0, 0, 0)",
        BadgeInactiveText:  "rgb(255, 255, 255)",
        BadgeActiveColor:   "rgb(255, 255, 255)",
        BadgeActiveText:    "rgb(0, 0, 0)"
    },

    Dark: {
        Color:              "rgb(71, 71, 71)",
        BadgeInactiveColor: "rgb(255, 255, 255)",
        BadgeInactiveText:  "rgb(0, 0, 0)",
        BadgeActiveColor:   "rgb(255, 255, 255)",
        BadgeActiveText:    "rgb(0, 0, 0)" 
    }
}

var IconSize    = 48;
var IconPadding = 20;
var BadgeInset  = 2; // pixels from bottom and right
var PanelWidth  = IconSize + IconPadding + 1;

var THEME = "Dark"; // This doesn't actually work. Always dark.

// FUNCTIONS //
function setIconActive(target)
{
    var child = target.getElementsByTagName("a")[0];
    var badge = child.getElementsByClassName("badge")[0];

    if (target.className == "active")
    {    
        child.style.backgroundColor = IconNames[child.getAttribute("title")] ? IconColors[child.getAttribute("title")] : IconColors.Custom;
        badge.style.backgroundColor = ThemeSettings[THEME].BadgeActiveColor;
        badge.style.color = ThemeSettings[THEME].BadgeActiveText;
    }
    else
    {    
        child.style.backgroundColor = ""; // transparent
        badge.style.backgroundColor = ThemeSettings[THEME].BadgeInactiveColor;
        badge.style.color = ThemeSettings[THEME].BadgeInactiveText;
    }
}

function modifyIcon(element) { 
    var parentNode = element.parentNode;
    var icon = parentNode.childNodes[4].textContent; // 5th child is always the icon name

    // Modify parent
    parentNode.removeChild(parentNode.childNodes[4]); // Expand
    parentNode.style = "height: " + (IconSize + IconPadding / 2) + "px; width: " + (PanelWidth - 1) + "px;";
    parentNode.className = "";
    parentNode.setAttribute("title", icon); // see name on hover

    // Re-position badge
    var badge = parentNode.getElementsByClassName("badge")[0];
    badge.style = "position: absolute; margin: 0px; border: 0px; padding: 3px 6px 3px 6px; right: " + BadgeInset + "px; bottom: " + BadgeInset + "px;";

    // Create new icon
    var span0 = document.createElement("span");
    span0.className = "inline-block category-color-icon";
    span0.setAttribute("ng-style", "::{'background-color': categoryInfo.Category.Color}");
    var style = IconNames[icon] ? "background-color: " + IconColors[icon] + ";" : "background-color: " + IconColors["Custom"] + ";";
    span0.style = style + " width: " + IconSize + "px; height: " + IconSize + "px; position: absolute; top: " + (IconPadding / 4) + "px; left: " + (IconPadding / 2) + "px;";

    var span1 = document.createElement("span");
    span1.className = IconNames[icon] ? "fa fa-" + IconNames[icon] + " fa-2x" : "fa fa-star fa-2x";
    span1.setAttribute("ng-if", "categoryInfo.Category.Icon");
    span1.style = "padding-top: " + ((IconSize - 26) / 2) + "px;";

    span0.appendChild(span1);
    
    // Listen for icon activation
    var config = {attributes: true};
    var observer = new MutationObserver(function (mutations) {
        setIconActive(mutations[0].target);
    });
    observer.observe(parentNode.parentNode, config);
    setIconActive(parentNode.parentNode); // initialize icon

    // Parent new icon
    parentNode.insertBefore(span0, parentNode.children[0]);
    parentNode.removeChild(element);
}

function checkDOMChange() {
    // Modify icons
    var icons = document.querySelectorAll(".category-icon");
    for (var i = icons.length - 1; i >= 0; i--)
    {
        if (icons[i].getAttribute("ng-show") == "::!category.Icon") // remove the fakers
            icons[i].parentNode.removeChild(icons[i]);
        else
            modifyIcon(icons[i]);
    }

    // Resize boards container
    var boardsContainer = document.getElementById("boards-categories")
    if (boardsContainer && boardsContainer.style.width != PanelWidth + "px")
    {
        boardsContainer.style = "width: " + PanelWidth + "px;";

    }

    // Modify settings
    var cog = document.getElementsByClassName("custom-round-button-sm");
    if (cog.length > 0 && cog[0].style.width != IconSize + "px")
    {
        element = cog[0];

        if (element.childNodes[1].childNodes.length == 2)
        {
            var span = element.childNodes[1];
            span.removeChild(span.childNodes[1]);

            element.style = "width: " + IconSize + "px; height: " + IconSize + "px; position: absolute; left: " + (IconPadding / 2) + "px; background-color: " + IconColors["Settings"] + ";";
            element.parentNode.style = "margin: 0px; padding: " + (IconPadding / 4) + "px;";
            element.parentNode.removeChild(element.parentNode.childNodes[1]);

            span.childNodes[0].className = "fa fa-cog fa-2x";
        }
    }

    // Shift board panel
    var boardPanel = document.getElementsByClassName("board-right-panel");
    if (boardPanel.length > 0 && boardPanel[0].style.left != PanelWidth + "px")  
    {
        boardPanel[0].style = "left: " + PanelWidth + "px;";
    }

    // Repeat
    setTimeout(checkDOMChange, 100);
}

function init() {
    // Move collapse button    
    var footer = document.getElementsByClassName("application-side-menu-footer");
    if (footer)   
        footer[0].style = "position: static;";

    var body = document.getElementsByClassName("application-side-menu-body");
    if (body)
       body[0].style = "position: static;";

    var header = document.getElementsByClassName("application-side-menu-header");
    if (header)
        header[0].style = "position: static;";

    // Constantly check for new elements or elements that aren't immediately loaded
    checkDOMChange();
}

window.onload = init();