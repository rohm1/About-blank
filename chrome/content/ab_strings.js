var ab_strings = {
	bundle: Components.classes["@mozilla.org/intl/stringbundle;1"]
			.getService(Components.interfaces.nsIStringBundleService)
				.createBundle("chrome://aboutblank/locale/overlay.properties"),
	
	get: function(propertyName) {
		return this.bundle.GetStringFromName(propertyName);
	}
}