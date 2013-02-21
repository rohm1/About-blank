var ab_core = function(){
	document.title = ab_infos.name;

	ab_loadBookmarks();
	ab_loadFavs();
}

function ab_loadBookmarks() {
	// init vars
	this.rootId = 1;

	this.ab_queue = new Array();
	this.bookmarks = new Array();
	this.bookmarks[this.rootId] = new Array();

	// used to fill the bookmarks array
	this.browse = function(folder, itemId) {
		switch (bookmarksService.getItemType(itemId)){
			case bookmarksService.TYPE_BOOKMARK:
				if(bookmarksService.getBookmarkURI(itemId).prePath != 'place:')
					folder.push({type: bookmarksService.getItemType(itemId), name: bookmarksService.getItemTitle(itemId), uri: bookmarksService.getBookmarkURI(itemId)});
				break;
			case bookmarksService.TYPE_FOLDER:
				folder.push({type: bookmarksService.getItemType(itemId), name: bookmarksService.getItemTitle(itemId), id: itemId});
				this.ab_queue.push(itemId);
				break;
			default:
				break;
		}
	};

	//
	this.fillList = function(base, folderId){
		for(var i = 0 ; i < this.bookmarks[folderId].length ; i++) {
			var li = document.createElement('li');
			if(this.bookmarks[folderId][i].type == bookmarksService.TYPE_BOOKMARK){
				var a = document.createElement('a');
				a.innerHTML = this.bookmarks[folderId][i].name;
				nsIURI = this.bookmarks[folderId][i].uri;
				a.href = nsIURI.prePath + nsIURI.path;
				a.title = a.innerHTML + " | " + a.href;
				li.appendChild(a);
				li.className = 'bookmark';
			}
			else if(this.bookmarks[folderId][i].type == bookmarksService.TYPE_FOLDER) {
				var s = document.createElement('span');
				s.innerHTML = this.bookmarks[folderId][i].name;
				li.appendChild(s);
				var ul = document.createElement('ul');
				this.fillList(ul, this.bookmarks[folderId][i].id);
				li.appendChild(ul);
				li.className = 'folder';
			}
			base.appendChild(li);
		}
	};

	// create query service
	var historyService = Components.classes["@mozilla.org/browser/nav-history-service;1"]
								.getService(Components.interfaces.nsINavHistoryService);
	var options = historyService.getNewQueryOptions();
	var query = historyService.getNewQuery();
	var bookmarksService = Components.classes["@mozilla.org/browser/nav-bookmarks-service;1"]
								.getService(Components.interfaces.nsINavBookmarksService);
	var rootFolder = bookmarksService.bookmarksMenuFolder;

	query.setFolders([rootFolder], this.rootId);
	var result = historyService.executeQuery(query, options);
	var rootNode = result.root;
	rootNode.containerOpen = true;

	// query done; start browing bookmarks
	// 1. the root
	for(i = 0 ; i < rootNode.childCount ; i++)
		this.browse(this.bookmarks[this.rootId], rootNode.getChild(i).itemId);

	rootNode.containerOpen = false;

	// 2. folders
	while(this.ab_queue.length > 0) {

		folderId = this.ab_queue.shift();
		this.bookmarks[folderId] = new Array();

		i = 0;
		while(1) {
			itemId = bookmarksService.getIdForItemAt(folderId, i++);
			if(itemId != -1)
				this.browse(this.bookmarks[folderId], itemId);
			else
				break;
		}
	}

	// now print!
	var base = document.createElement('ul');
	this.fillList(base, this.rootId);

	var h2Bk = document.createElement('h2');
	h2Bk.innerHTML = ab_strings.get("BOOKMARKS");

	document.getElementById('bookmarks').appendChild(h2Bk);
	document.getElementById('bookmarks').appendChild(base);

	//
	ab_initBookmarks();
}

function ab_loadFavs() {
	$("#favs h2, #favs ul").remove();

	var fav_sites = ab_favs.getFavs();
	var favUl = document.createElement('ul');
	if(fav_sites.length == 0) {
		var li = document.createElement('li');
		li.innerHTML = ab_strings.get("NO_FAVS");
		favUl.appendChild(li);
	}
	for(i = 0 ; i < fav_sites.length ; i++){
		var site = fav_sites[i];
		var li = document.createElement('li');
		var a = document.createElement('a');
		a.innerHTML = site.title;
		a.href = site.url;
		a.title = a.innerHTML + " | " + a.href;
		li.appendChild(a);
		favUl.appendChild(li);
	}

	var h2Fvs = document.createElement('h2');
	h2Fvs.innerHTML = ab_strings.get("FAVORITE_PAGES");

	document.getElementById('favs').appendChild(h2Fvs);
	document.getElementById('favs').appendChild(favUl);

	//
	ab_initFavs();
}
