var ab_utils = {

	isBlank: function(doc) {
		return doc && doc.location == "about:blank";
	},
	
	readFile: function(file) {
		var ioService = Components.classes["@mozilla.org/network/io-service;1"]
			.getService(Components.interfaces.nsIIOService);
		var scriptableStream = Components
			.classes["@mozilla.org/scriptableinputstream;1"]
			.getService(Components.interfaces.nsIScriptableInputStream);

		var channel = ioService.newChannel(file, null, null);
		var input = channel.open();
		scriptableStream.init(input);
		var str = scriptableStream.read(input.available());
		scriptableStream.close();
		input.close();
		return str;
	},
	
	openAddBox: function(params) {
		params.in = {title: params.title, url: params.url};
		params.state = null;
		window.openDialog("chrome://aboutblank/content/add-site.xul", "",
                  "chrome,dialog,modal,centerscreen", params).focus();
		
		return params;
	},
	
	matchURI: function(uri) {
		return new RegExp(ab_infos.uri).test(uri);
	},

	getNsiURI: function(uri) {
		var nsiUri = Components.classes["@mozilla.org/network/simple-uri;1"]
					.createInstance(Components.interfaces.nsIURI);
		nsiUri.spec = uri;
		return nsiUri;
	},
	
	getFolder: function() {
		var folder = Components.classes["@mozilla.org/file/directory_service;1"]
				.getService(Components.interfaces.nsIProperties)
				.get("ProfD", Components.interfaces.nsIFile);
		
		folder.append(ab_infos.prefsFolder);  
		if( !folder.exists() || !folder.isDirectory() )   // if it doesn't exist, create  
			folder.create(Components.interfaces.nsIFile.DIRECTORY_TYPE, 0777);  
		
		return folder;
	},
	
	getFile: function(fileName) {
		var file = ab_utils.getFolder();
		file.append(fileName);
		
		if(!file.exists()) { // history ...
			var f = Components.classes["@mozilla.org/file/directory_service;1"]
				.getService(Components.interfaces.nsIProperties)
				.get("ProfD", Components.interfaces.nsIFile);
			f.append(fileName);
			if(f.exists()) {
				f.moveTo(ab_utils.getFolder(), fileName);
				file = f;
			}
			else
				file.create(Components.interfaces.nsIFile.NORMAL_FILE_TYPE, 0664);
		}
		
		return file;
	},
	
}
