var aboutblank = {

	initialized: false,
	isNewTab: false,
	
	init: function() {
		isNewTab = false;
		
		gBrowser.tabContainer.addEventListener("TabOpen", this.tabOpened, false);
		gBrowser.addEventListener("load", this.tabLoaded, true);
		
		initialized = true;
		
		aboutblank.URLBarSetURI = URLBarSetURI;
		URLBarSetURI = function(uri, valid) {
			if (!uri || !ab_utils.matchURI(uri.spec)) {
				return aboutblank.URLBarSetURI(uri, valid);
			}
			aboutblank.URLBarSetURI(ab_utils.getNsiURI("about:blank"));
			SetPageProxyState("valid");
		}
	},
	
	tabOpened: function(e) {
		isNewTab = true;
	},
	
	tabLoaded: function(e) {
		if (e.originalTarget instanceof HTMLDocument && isNewTab) {
			var w = gBrowser.contentDocument;
			if(ab_utils.isBlank(w)) {
				w.location = ab_infos.uri;
			}
		}
		isNewTab = false;
	},

	onMenuItemCommand: function(e) {
		var params = ab_utils.openAddBox({title: content.document.title, url: content.location.href});
		if(params.state)
			ab_favs.addFav(params.out.title, params.out.url);
	},
	
	getString: function(stringName){
		return aboutblank.strings.getString(stringName);
	},

	// onToolbarButtonCommand: function(e) {
		// just reuse the function above.	you can change this, obviously!
		// aboutblank.onMenuItemCommand(e);
	// },
	
	
}
