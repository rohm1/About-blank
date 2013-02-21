var ab_favs = {
	file: null,
	
	initFileObject: function(){
		ab_favs.file = ab_utils.getFile(ab_infos.favsFileName);
	},
	
	saveFavsFile: function(data){
		if(data != undefined) {
			if(ab_favs.file == null)
				ab_favs.initFileObject();
			
			data = JSON.stringify(data);
			
			var foStream = Components.classes["@mozilla.org/network/file-output-stream;1"]
							.createInstance(Components.interfaces.nsIFileOutputStream);
						 
			foStream.init(ab_favs.file, 0x02 | 0x08 | 0x20, 0664, 0); // écrire, créer, tronquer
			foStream.write(data, data.length);
			foStream.close();
		}
	},
	
	getFavs: function(){
		if(ab_favs.file == null)
			ab_favs.initFileObject();
		
		var istream = Components.classes["@mozilla.org/network/file-input-stream;1"]
						.createInstance(Components.interfaces.nsIFileInputStream);
		istream.init(ab_favs.file, 0x01, 0444, 0);
		istream.QueryInterface(Components.interfaces.nsILineInputStream);

		// lire les lignes dans un tableau
		var line = {}, lines = [], hasmore, data = "";
		do {
			hasmore = istream.readLine(line);
			data += line.value;
		} while(hasmore);

		istream.close();
		
		var fav_sites;
		try {//for history reasons...
			fav_sites = JSON.parse(data);
		}
		catch(e) {
			fav_sites = eval(data);
			ab_favs.saveFavsFile(fav_sites);
		}
		
		if(!(fav_sites instanceof Array))
			fav_sites = new Array();
			
		return fav_sites;
	},
	
	addFav: function(siteTitle, siteURL) {
		var fav_sites = ab_favs.getFavs();
		
		siteTitle = siteTitle.replace(/^\s+/g,'').replace(/\s+$/g,'');
		siteTitle = '' ? siteURL : siteTitle;
		
		fav_sites.push({title: siteTitle, url: siteURL});
		
		ab_favs.saveFavsFile(fav_sites);
	},
	
}