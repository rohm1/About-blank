/** bookmarks **/
var ab_mw = 0;

function ab_setArrowsOffsets(ulContainer){
	$("#bookmarks a, #bookmarks span").css({"max-width": ab_mw - $("#bookmarks > ul > li.folder > span.arrow").eq(0).width() });

	ulContainer.children("li.folder")
		.each(function(){
			$(this).children(".arrow").eq(0)
			       .offset({left : ulContainer.offset().left + ulContainer.width() - $("#bookmarks > ul > li.folder > span.arrow").eq(0).width(),
						top : $(this).offset().top })
		});
}

function ab_initBookmarks() {
	ab_mw = parseInt($("#bookmarks a").eq(0).css('max-width'));
	if(ab_mw == 0)
		ab_mw = parseInt($("#bookmarks span").eq(0).css('max-width'));

	$("#bookmarks li.folder")
		.append('<span style="display: inline; position: absolute;" class="arrow">&raquo;&nbsp;</span>')
		.mouseenter(function(){
			var ul = $(this).children("ul").eq(0);
			ul.css({"left": $(this).width() + parseInt($(this).css('padding-left')) + parseInt($(this).css('padding-right')), "top": $(this).offset().top - $(this).parent().offset().top});
			ab_setArrowsOffsets(ul);
		});

	ab_setArrowsOffsets($("#bookmarks > ul").eq(0));
}

/** favs **/
function ab_initFavs() {
	$("#favs li")
		.append('<span class="tools"><span class="move"></span><span class="edit"></span><span class="delete"></span><span class="clearer"></span></span>')
		.sortable({anchor: '.move', axis: 'y'});

	ab_endEdit(false);
}


/** edit **/
var ab_editState = false;
function ab_edit() {
	if(ab_editState)
		ab_endEdit(true);
	else
		ab_editStart();
}

function ab_editStart() {
	ab_editState = true;

	$('#saveEdit').show();
	$('#editLink').html(ab_strings.get('CANCEL'));

	if($("#favs li a ").length != 0) {
		var targets = $("#favs li");
		targets
			.mouseenter(function() {
				var h = $(this).height();
				$(this).find('.tools')
					.css({"display": "block"})
					.css({"top": -h + (h - $(this).find('.edit').height())/2 })
				$(this).height(h);
			})
			.mouseleave(function() {
				$(this).find('.tools').hide();
			})
			.mouseenter()
			.find('.tools')
				.fadeOut(900, function() {
					targets.bind('mousecollide', function(e, data) {
						if(!data.state && !$(this).hasClass('dragged'))
							$(this).find('.tools').hide();
					});
				})
				.end()
			.find('.edit')
				.click(function() {
					var elt = $(this).parent().parent().find('a').eq(0);
					var params = ab_utils.openAddBox({title: elt.html(), url: elt.attr('href')});

					if(params.state) {
						elt
							.html(params.out.title)
							.attr('href', params.out.url)
					}
				})
				.end()
			.find('.delete')
				.click(function() {
					var r = confirm(ab_strings.get('CONFIRM_DELETE_FAV'));
					if(r) {
						$(this).parent().parent().remove();
					}
				})
				.end()

	}
}

function ab_endEdit(reload) {
	ab_editState = false;

	$('#saveEdit').hide();
	$('#editLink').html(ab_strings.get('EDIT'));

	$("#favs li")
		.unbind('mouseenter')
		.unbind('mouseleave')
		.unbind('mousecollide')
		.find('.edit')
			.unbind('click')
			.end()
		.find('.delete')
			.unbind('click')
			.end();

	if(reload)
		ab_loadFavs();
}

function ab_saveEdit() {
	ab_endEdit(false);

	var favs = new Array();
	$("#favs li a").each(function() {
		favs.push({"title": $(this).html(), "url": $(this).attr('href')});
	});
	ab_favs.saveFavsFile(favs);

	ab_loadFavs();
}
