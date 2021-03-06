YAHOO.example.onMenuBarAvailable = function(p_oEvent) {
// Animation object
var oAnim;

// Utility function used to setup animation for submenus
function setupMenuAnimation(p_oMenu) {
if(!p_oMenu.animationSetup) {
var aItems = p_oMenu.getItemGroups();
if(aItems && aItems[0]) {
var i = aItems[0].length - 1;
var oSubmenu;
do {
oSubmenu = p_oMenu.getItem(i).cfg.getProperty("submenu");
if(oSubmenu) {
oSubmenu.beforeShowEvent.subscribe(onMenuBeforeShow, oSubmenu, true);
oSubmenu.showEvent.subscribe(onMenuShow, oSubmenu, true);
}
}
while(i--);
}
p_oMenu.animationSetup = true;
}
}

// "beforeshow" event handler for each submenu of the menu bar
function onMenuBeforeShow(p_sType, p_sArgs, p_oMenu) {
if(oAnim && oAnim.isAnimated()) {
oAnim.stop();
oAnim = null;
}
YAHOO.util.Dom.setStyle(this.element, "overflow", "hidden");
YAHOO.util.Dom.setStyle(this.body, "marginTop", ("-" + this.body.offsetHeight + "px"));
}
// "show" event handler for each submenu of the menu bar
function onMenuShow(p_sType, p_sArgs, p_oMenu) {
oAnim = new YAHOO.util.Anim(
this.body, 
{ marginTop: { to: 0 } },
.5, 
YAHOO.util.Easing.easeOut
);
oAnim.animate();
var me = this;

function onTween() {
me.cfg.refireEvent("iframe");
}

function onAnimationComplete() {
YAHOO.util.Dom.setStyle(me.body, "marginTop", ("0px"));
YAHOO.util.Dom.setStyle(me.element, "overflow", "visible");
setupMenuAnimation(me);
}
/*
 Refire the event handler for the "iframe" 
 configuration property with each tween so that the  
 size and position of the iframe shim remain in sync 
 with the menu.
*/
if(this.cfg.getProperty("iframe") == true) {
oAnim.onTween.subscribe(onTween);
}
oAnim.onComplete.subscribe(onAnimationComplete);
}

// "render" event handler for the menu bar
function onMenuRender(p_sType, p_sArgs, p_oMenu) {
setupMenuAnimation(p_oMenu);
}
// Instantiate and render the menu bar
var oMenuBar = new YAHOO.widget.MenuBar("productsandservices", { autosubmenudisplay:true, hidedelay:750, lazyload:true });
// Subscribe to the "beforerender" event
oMenuBar.renderEvent.subscribe(onMenuRender, oMenuBar, true);
oMenuBar.render();
}
// Initialize and render the menu bar when it is available in the DOM
YAHOO.util.Event.onAvailable("productsandservices", YAHOO.example.onMenuBarAvailable);