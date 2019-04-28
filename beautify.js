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
        BadgeInactiveColor: "rgb(240, 71, 71)",
        BadgeInactiveText:  "rgb(255, 255, 255)",
        BadgeActiveColor:   "rgb(240, 71, 71)",
        BadgeActiveText:    "rgb(255, 255, 255)" 
    }
}

var IconSize    = 50;
var IconPadding = 10; // on left and right
var IconBorderRadius = IconSize / 2;
var IconActiveBorderRadius = 15;
var ContentBackgroundColor = "rgb(54, 57, 63)";
var BadgeInset  = 2; // pixels from bottom and right
var PanelWidth  = IconSize + 2 * IconPadding;

var THEME = "Dark"; // This doesn't actually work. Always dark.
var ICON_IMAGE_HEIGHT = 26; // 2x icon images are 26px in height
var CHECK_WAIT = 100; // how many milliseconds between each check

// DECLARATIONS //
var CategoryPill = document.createElement("div");
CategoryPill.style.height = IconSize - 6 + "px";
CategoryPill.style.width = "3px";
CategoryPill.style.position = "absolute";
CategoryPill.style.backgroundColor = "rgb(255, 255, 255";
CategoryPill.style.borderTopRightRadius = "3px";
CategoryPill.style.borderBottomRightRadius = "3px";
CategoryPill.style.top = (IconSize + IconPadding - (IconSize - 6)) / 2 + "px";
CategoryPill.style.left = "0px";

// FUNCTIONS //
function setIconActive(categoryContainer) // update badge and icon selection indicator
{
    var innerContainer = categoryContainer.getElementsByTagName("a")[0];
    var newIconContainer = innerContainer.getElementsByClassName("new-icon-container")[0];
    var badge = innerContainer.getElementsByClassName("badge")[0];

    innerContainer.style.backgroundColor = "#0000";
    if (categoryContainer.className == "active")
    {
        newIconContainer.style.borderRadius = IconActiveBorderRadius + "px";
        badge.style.backgroundColor = ThemeSettings[THEME].BadgeActiveColor;
        badge.style.color = ThemeSettings[THEME].BadgeActiveText;
        categoryContainer.appendChild(CategoryPill);
    }
    else
    {
        newIconContainer.style.borderRadius = IconBorderRadius + "px";
        badge.style.backgroundColor = ThemeSettings[THEME].BadgeInactiveColor;
        badge.style.color = ThemeSettings[THEME].BadgeInactiveText;
    }
}

function modifyIcon(categoryContainer) { 
/*
Category hierarchy pre-modification:

<li> category container
    + text node
    + <a> icon/name/badge container
        + text node
        + <span> icon container
            + ::before
        + text node
        + <span> failsafe icon if custom category
        + text node
        + <span> category name
        + text node
        + <span> badge
        + text node    
    + text node

Category hierarchy post-modification:

<li> category container
    + text node
    + <a> icon/name/badge container
        + <span> span0
            + <span> span1
        + text node
        + text node
        + text node
        + text node
        + <span> badge
        + text node    
    + text node
*/

    var innerContainer  = categoryContainer.childNodes[1];  
    var iconContainer   = innerContainer.childNodes[1];
    var iconFailsafe    = innerContainer.childNodes[3];
    var iconName        = innerContainer.childNodes[5];
    var badge           = innerContainer.childNodes[7];

    var name            = iconName.textContent; // retrieve icon name

    // Modify innerContainer
    innerContainer.removeChild(iconContainer);
    innerContainer.removeChild(iconFailsafe);
    innerContainer.removeChild(iconName);

    innerContainer.style.height = IconSize + IconPadding + "px";
    innerContainer.style.width = PanelWidth + "px";
    innerContainer.style.top = "0px";
    innerContainer.className = ""; // remove class name so category is not detected again
    innerContainer.setAttribute("title", name); // see category name on hover

    // Modify badge
    badge.style.position    = "absolute";
    badge.style.margin      = "0px";
    badge.style.border      = "0px";
    badge.style.padding     = "3px 4px 3px 4px";
    badge.style.right       = BadgeInset + "px";
    badge.style.bottom      = BadgeInset + "px";
    badge.style.borderRadius = "4px";
 
    // Create new icon
    var span0 = document.createElement("span"); // new icon container
    span0.className = "inline-block category-color-icon new-icon-container";
    span0.setAttribute("ng-style", "::{'background-color': categoryInfo.Category.Color}");
    span0.style.backgroundColor = IconNames[name] ? IconColors[name] : IconColors.Custom;
    span0.style.width       = IconSize + "px";
    span0.style.height      = IconSize + "px";
    span0.style.position    = "absolute";
    span0.style.top         = IconPadding / 2 + "px";
    span0.style.left        = IconPadding + "px";
    span0.style.borderRadius = IconBorderRadius + "px";
    span0.style.transition  = "border-radius 0.25s ease";

    var span1 = document.createElement("span"); // new icon
    span1.className = IconNames[name] ? "fa fa-" + IconNames[name] + " fa-2x" : "fa fa-star fa-2x"; // custom categories get a grey star
    span1.setAttribute("ng-if", "categoryInfo.Category.Icon");
    span1.style.paddingTop = (IconSize - ICON_IMAGE_HEIGHT) / 2 + "px"; // 2x icons have a height of 26px

    span0.appendChild(span1);
    innerContainer.insertBefore(span0, badge);

    // Event listeners
    span0.addEventListener("mouseover", function() {
        if (categoryContainer.className != "active")
        {
            span0.style.borderRadius = IconActiveBorderRadius + "px";
        }
    });

    span0.addEventListener("mouseleave", function() {
        if (categoryContainer.className != "active")
        {
            span0.style.borderRadius = IconBorderRadius + "px";
        }
    });

    // Listen for icon activation
    var config = {attributes: true};
    var observer = new MutationObserver(function (mutations) {
        setIconActive(mutations[0].target);
    });
    observer.observe(categoryContainer, config);
    setIconActive(categoryContainer); // initialize icon
}

function checkDOMChange() {
    // Modify icons
    var icons = document.getElementsByClassName("left-panel-item");
    for (var i = icons.length - 1; i >= 0; i--)
       modifyIcon(icons[i].parentElement);

    // Resize boards container
    var boards_categories = document.getElementById("boards-categories")
    if (boards_categories && !document.getElementById("boards-categories-success"))
    {
        boards_categories.id = "boards-categories-success";
        boards_categories.style.borderRight = "0px";
        boards_categories.style.width = PanelWidth + "px";
        boards_categories.style.backgroundColor = "rgb(47, 49, 54)";
    }

    // board-right-panel
    var board_right_panel = document.getElementsByClassName("board-right-panel")[0];
    if (board_right_panel && !document.getElementById("board-right-panel-success"))
    {
        board_right_panel.id = "board-right-panel-success";
        board_right_panel.style.left = PanelWidth + "px";
    }
        
    // board-panel-header
    var board_panel_header = document.getElementsByClassName("board-panel-header")[0];
    if (board_panel_header && !document.getElementById("board-panel-header-success"))
    {
        board_panel_header.id = "board-panel-header-success";
        board_panel_header.style.borderBottom = "0px";
        board_panel_header.style.backgroundColor = "rgb(51, 52, 57)";
    }

    // Modify settings icon
    var cog = document.getElementsByClassName("custom-round-button-sm")[0];
    if (cog && !document.getElementById("cog-success"))
    {
        cog.id = "cog-success";

        var span = cog.childNodes[1];
        span.style.position = "absolute";
        span.style.top = IconSize / 2 - 13 + "px"; // settings icon is 13px in height
        span.style.left = "0px";
        span.removeChild(span.childNodes[1]); // remove settings text

        cog.style.width = IconSize + "px";
        cog.style.height = IconSize + "px";
        cog.style.position = "absolute";
        cog.style.left = IconPadding + "px";
        cog.style.backgroundColor = IconColors["Settings"];
        cog.style.borderRadius = IconBorderRadius + "px";
        cog.parentNode.style = "margin: 0px; padding: " + (IconPadding / 2) + "px;";
        cog.parentNode.removeChild(cog.parentNode.childNodes[1]);

        span.childNodes[0].className = "fa fa-cog fa-2x";
    }

    // Repeat
    setTimeout(checkDOMChange, CHECK_WAIT);
}

function init() {
    // Modify application side menu
    var sideMenu = document.getElementsByClassName("application-side-menu")[0];
    sideMenu.style.borderRight = "0px";
    sideMenu.style.backgroundColor = "rgb(32, 34, 37)";
    //sideMenu.style.width = "200px";

    // Modify application content container
    var applicationContent = document.getElementsByClassName("application-content")[0];
    //applicationContent.style.left = "200px";

    // Move collapse button    
    var footer = document.getElementsByClassName("application-side-menu-footer")[0] 
    footer.style.position = "static";
    footer.style.borderTop = "0px";

    var body = document.getElementsByClassName("application-side-menu-body")[0];
    body.style.position = "static";

    var header = document.getElementsByClassName("application-side-menu-header")[0];
    header.style.position = "static";

    // application-top-menu
    var applicationTopMenu = document.getElementsByClassName("application-top-menu")[0];
    applicationTopMenu.style.borderBottom = "0px";
    applicationTopMenu.style.backgroundColor = "rgb(32, 34, 37)";

    // application-content
    var application_content = document.getElementsByClassName("application-content")[0];
    application_content.id = "application-content-success";
    //application_content.style.backgroundColor = ContentBackgroundColor;
    
    // Scrollbar
    var sheet = window.document.styleSheets[0];
    sheet.insertRule("::-webkit-scrollbar { display: none;}", sheet.cssRules.length);

    // Constantly check for new elements or elements that aren't immediately loaded
    checkDOMChange();
}

window.onload = init();