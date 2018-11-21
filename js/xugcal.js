/**
 * @author
 */
var scopes = 'https://www.googleapis.com/auth/calendar';
var event_type_label = {
	'1': '【生誕祭】',
	'2': '【ライブ】',
	'3': '【握手会】',
	'4': '【CD、DVD販売】',
	'5': '【撮影会】',
	'6': '【その他】'
};
/*************************************************************************************
	画面遷移コントロール
**************************************************************************************/
function show_hide(index)
{
	for(i=1;i<3;i++)
	{
		 $("#content" + i).hide();
	}
	$("#content" + index).show();
}
/*************************************************************************************
	GoogleMap表示
**************************************************************************************/
function set_googlemap(address)
{
	if(address == '' || address == null || address == undefined)
		return
	new google.maps.Geocoder().geocode({'address': address}, callbackRender);
}
/*************************************************************************************
	GoogleMap表示
**************************************************************************************/
function callbackRender(results, status) 
{
	if(status == google.maps.GeocoderStatus.OK) {
		var options = {
			zoom: 18,
			center: results[0].geometry.location, // 指定の住所から計算した緯度経度を指定する
			mapTypeId: google.maps.MapTypeId.ROADMAP // 「地図」で GoogleMap を出力する
		};
		var gmap = new google.maps.Map(document.getElementById('map-canvas'), options);
			// #map-canvas に GoogleMap を出力する
		new google.maps.Marker(
		{
				map: gmap
			,	position	: results[0].geometry.location
			,	title		: 'イベント開催場所'
		});
    	// クリックした箇所をセンターに移動させる
    	gmap.setCenter(results[0].geometry.location);

			// 指定の住所から計算した緯度経度の位置に Marker を立てる

		adjustMapSize();
	}
}

/*************************************************************************************
	GoogleMap を表示する部分のサイズを調整する。
**************************************************************************************/
function adjustMapSize() 
{
	var mapCanvas = $('#map-canvas');
	var marginBottom = 5; // CSS に定義してある margin の値
	//var mapHeight = $(window).height() - mapCanvas.offset().top - marginBottom;
	mapHeight = $('#map-canvas').width() * 0.5;
	console.debug('mapHeight:' + mapHeight);
	mapCanvas.css("height", mapHeight.toString() + "px");
}
var gGCalendar;
var	execute_flag = false;
var authorized = false;
/*************************************************************************************
	初期化
**************************************************************************************/
function handleClientLoad() 
{
	if(execute_flag)
	{
		return;
	}
	else
	{
		execute_flag = true;
	}
	console.debug('call handleClientLoad');
	gGCalendar = new xGCalendar(calendarId);
	gapi.client.setApiKey(apiKey);
	['start_datetime', 'end_datetime'].forEach(function(id) {
		$('#' + id).datetimepicker({lang: 'ja', closeOnDateSelect: true, closeOnTimeSelect: true});
	});
	$('#find_start_datetime').datetimepicker({lang: 'ja', timepicker:false, defaultTime:'0:00', closeOnDateSelect: true});
	$('#find_end_datetime').datetimepicker({lang: 'ja', timepicker:false, defaultTime:'23:59', closeOnDateSelect: true});
	window.setTimeout(gapi.auth.init,1);
	window.setTimeout(checkAuth,2);
	show_hide(2);
}
/*************************************************************************************
	認証関係
**************************************************************************************/
function checkAuth() 
{
	console.debug('call checkAuth');
	gapi.auth.authorize
	(		
			{client_id: clientId, scope: scopes, immediate: true}
		,	handleAuthResult
	);
}

function handleAuthResult(authResult) 
{
	console.debug('call handleAuthResult');
	console.debug(authResult);
	var authorizeButton = document.getElementById('authorize-button');
	makeApiCall(calendarId, 1);
	$('#find_event').click(function() {
		$('#find_condition').collapsible('collapse');
		makeApiCall(calendarId, 1);
	});
	if (authResult && authResult.status.signed_in) 
	{
		authorized = true;
		authorizeButton.style.visibility = 'hidden';
	}
	else
	{
		//authorizeButton.style.visibility = '';
		//authorizeButton.onclick = handleAuthClick;
	}
}

function handleAuthClick(event) 
{
	console.debug('call handleAuthClick');
	gapi.auth.authorize(
		{client_id: clientId, scope: scopes, immediate: false},
		handleAuthResult);
	return false;
}

function doAuth(callback) 
{
	console.debug('call doAuth');
	var authorizeButton = document.getElementById('authorize-button');
	if (authorized) {
		callback();
	} else {
		gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: false}, function(authResult) {
			if (authResult && authResult.status.signed_in) 
			{
				authorized = true;
				authorizeButton.style.visibility = 'hidden';
				callback();
			}
		});
	}
}

var event_array = [];
/*************************************************************************************
	イベント一覧画面初期化・リスト生成
**************************************************************************************/
function makeApiCall(calendarId, mode)
{
	console.debug('call makeapicall');

	// リスト削除
	$("ul#list").children().each(function()
	{
		$(this).remove();
	});

	// リスト作成
	//gGCalendar = new xGCalendar(calendarId);
	//gGCalendar.AAA();return;
	//gGCalendar.getEventList(function(res)
	var getEventListA = null;
	if (mode == 0) {
		var now	 = new Date();
		y	 = now.getFullYear();
		m	 = now.getMonth()+1;
		d	 = now.getDate();
		str	 = y+'/'+m+'/'+d;
		getEventListA = function(callback) {
			gGCalendar.getEventListDayStr(str, callback);
		}
	} else if (mode == 1) {
		var datetimeStart = new Date($('#find_start_datetime').val());
		if (datetimeStart.toString() == 'Invalid Date') 
		{
			datetimeStart = new Date(formatDate(new Date(),'YYYY/MM/DD')+' 00:00');	//new Date('2000/01/01 00:00');
			$('#find_start_datetime').val(formatDate(new Date(),'YYYY/MM/DD')+' 00:00');
		}
		var datetimeEnd = new Date($('#find_end_datetime').val());
		if (datetimeEnd.toString() == 'Invalid Date') 
		{
			datetimeEnd = new Date(formatDate(new Date(),'YYYY/MM/DD')+' 23:59');		//new Date('2099/12/31 23:59');
			$('#find_end_datetime').val(formatDate(new Date(),'YYYY/MM/DD')+' 23:59');
		}
		//datetimeEnd.setTime(datetimeEnd.getTime() + 1000*60*60*24); // 翌日
		getEventListA = function(callback) {
			gGCalendar.getEventListPeriod(datetimeStart, datetimeEnd, callback);
		}
	}
	getEventListA(function(res)
	{
		gGCEvent = res;
		var row_no = 1;
		event_array = []
		$.each(res, function(n, event) 
		{
			event_array.push(event);
			var elem_li = document.createElement('li');
			var elem_a = document.createElement('a');
			work = event.summary;
			var work_line ='' ;
			if(work.indexOf('【')>-1)
			{
				//work_line = work.slice(work.indexOf('【')+1,work.indexOf('】'));
				var work = work.slice(work.indexOf('】')+1);
			}
			if(work.indexOf('《')>-1)
			{
				work_line = work.slice(work.indexOf('《')+1,work.indexOf('》'));
				var work = work.slice(work.indexOf('》')+1);
			}
			if(work.indexOf('[')>-1)
			{
				var event_type = work.slice(work.indexOf('[')+1,work.indexOf(']'));
				if ('1' <= event_type && event_type <= '6') {
					work_line = work_line + event_type_label[event_type];
				}
				var work = work.slice(work.indexOf(']')+1);
			}
			work_line = work_line + work;
			elem_a.href = "javascript:swipe_detail(" + row_no + ");";
			elem_a.innerHTML = formatDate(new Date(event.start_dateTime),"YYYY-MM-DD hh:mm") + '　　' + work_line;
			elem_li.appendChild(elem_a);
			$(elem_li).appendTo($('#list'));
			row_no++;
		}); 
		$('#list').listview('refresh');
		execute_flag = true;
	});
}
/*************************************************************************************
	イベント登録画面に遷移（変更モード）
**************************************************************************************/
function swipe_detail(row_no)
{
	$('#calendar_id').val(event_array[row_no-1].id);
	$('#calendar_seq').val(event_array[row_no-1].sequence);
	var work = event_array[row_no-1].summary;
	if(work.indexOf('【')>-1)
	{
		$('#account_name').val(work.slice(work.indexOf('【')+1,work.indexOf('】')));
		var work = work.slice(work.indexOf('】')+1);
	}
	else
	{
		$('#account_name').val('');
	}
	if(work.indexOf('《')>-1)
	{
		$('#idol_name').val(work.slice(work.indexOf('《')+1,work.indexOf('》')));
		var work = work.slice(work.indexOf('》')+1);
	}
	else
	{
		$('#idol_name').val('');
	}
	if(work.indexOf('[')>-1)
	{
		$("select[name='event_type']").val(work.slice(work.indexOf('[')+1,work.indexOf(']')));
		var work = work.slice(work.indexOf(']')+1);
	}
	else
	{
		$("select[name='event_type']").val('6');
	}
	$("select[name='event_type']").selectmenu('refresh');
	$('#start_datetime').val(formatDate(new Date(event_array[row_no-1].start_dateTime),"YYYY/MM/DD hh:mm"));
	$('#end_datetime').val(formatDate(new Date(event_array[row_no-1].end_dateTime),"YYYY/MM/DD hh:mm"));
	$('#event_name').val(work);
	var work = event_array[row_no-1].location;
	if(work != '' && work != 'null' && typeof work != 'undefined')
	{
		if(work.indexOf('【')>-1)
		{
			$('#place').val(work.slice(work.indexOf('【')+1,work.indexOf('】')));
			var work = work.slice(work.indexOf('】')+1);
		}
		else
		{
			$('#place').val('');
		}
		set_googlemap(work);
	}
	$('#address').val(work);
	$('#detail').val( event_array[row_no-1].description);

	// 登録ボタン押下時アクション	
	$('#regist_event').unbind('click');
	$('#regist_event').click(function()
	{
		console.debug('regist_event(update)');
		doAuth(function() {
			gGCalendar.updEventA
			(
					$('#calendar_id').val()
				,	'【' + $('#account_name').val() + '】' + '《' + $('#idol_name').val() + '》' + '[' + $('#event_type').val() + ']' + $('#event_name').val()
				,	$('#start_datetime').val()
				,	$('#end_datetime').val()
				,	'【' + $('#place').val() + '】' + $('#address').val()
				,	$('#detail').val()
				,	1 + parseInt($('#calendar_seq').val())
				,	function(resp){
						if (resp.status == 'confirmed') {
							alert('イベントが登録されました' + resp.id);
							makeApiCall(calendarId, 1);
							show_hide(1);
						} else {
							alert('イベントを登録できませんでした[' + resp.code + ' ' + resp.message + ']');
						}
					}
			);
		});
	});	

	// 削除ボタン押下時アクション
	$('#delete_event').unbind('click');
	$('#delete_event').click(function()
	{
		console.debug('delete_event');
		doAuth(function() {
			gGCalendar.delEventA($('#calendar_id').val(), function(resp){
				if (resp.error == undefined) {
					alert('イベントが削除されました');
					makeApiCall(calendarId, 1);
					show_hide(1);
				} else {
					alert('イベントを削除できませんでした[' + resp.code + ' ' + resp.message + ']');
				}
			});
		});
	});
	show_hide(2);
}
/*************************************************************************************
	イベント登録画面に遷移（新規作成モード）
**************************************************************************************/
function swipe_new_regist()
{
	$('#account_name').val('');
	$('#idol_name').val('');
	$('#start_datetime').val(formatDate(new Date,'YYYY-MM-DD hh:mm'));
	$('#end_datetime').val(formatDate(new Date,'YYYY-MM-DD hh:mm'));
	$('#event_name').val('');
	$('#place').val('');
	$('#detail').val('');
	$('#address').val('');
	show_hide(2);
	$('#regist_event').unbind('click');
	$('#regist_event').click(function()
	{
		console.debug('regist_event(insert)');
		doAuth(function() {
			gGCalendar.addEventA
			( 
					'【' + $('#account_name').val() + '】' + '《' + $('#idol_name').val() + '》' + '[' + $('#event_type').val() + ']' + $('#event_name').val()
				,	$('#start_datetime').val()
				,	$('#end_datetime').val()
				,	'【' + $('#place').val() + '】' + $('#address').val()
				,	$('#detail').val()
				,	function(resp)
					{
						if (resp.status == 'confirmed') {
							alert('イベントが登録されました' + resp.id);
							makeApiCall(calendarId, 1);
							show_hide(1);
						} else {
							alert('イベントを登録できませんでした[' + resp.code + ' ' + resp.message + ']');
						}
					}
			);
		});
	});
	$('#delete_event').unbind('click');
	$('#map-canvas').html('').css('height', '300px');
}
/**
 * 日付をフォーマットする
 * @param	{Date}	 date	 日付
 * @param	{String} [format] フォーマット
 * @return {String}	 フォーマット済み日付
 */
function formatDate(date, format) 
{
	if (!format) format = 'YYYY-MM-DD hh:mm:ss.SSS';
	format = format.replace(/YYYY/g, date.getFullYear());
	format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
	format = format.replace(/DD/g, ('0' + date.getDate()).slice(-2));
	format = format.replace(/hh/g, ('0' + date.getHours()).slice(-2));
	format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
	format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
	if (format.match(/S/g)) {
		var milliSeconds = ('00' + date.getMilliseconds()).slice(-3);
		var length = format.match(/S/g).length;
		for (var i = 0; i < length; i++) format = format.replace(/S/, milliSeconds.substring(i, i + 1));
	}
	return format;
};
/*************************************************************************************
	GoogleCalendar管理
**************************************************************************************/
function xGCalendar(calendarID)
{

	this.calendarID = calendarID;
	/*************************************************************************************
		イベントの新規作成
	**************************************************************************************/
	function newEvent(id, summary, startDatetime, endDatetime, location, description, updated, sequence)
	{
		var resource = new Object();
		resource['id'] = id; // GoogleがEventオブジェクト作成時に付与するID
		resource['summary'] = summary; // 予定のタイトル
		resource['start_dateTime'] = startDatetime;// Dateオブジェクト
		resource['end_dateTime'] = endDatetime;// Dateオブジェクト
		resource['location'] = location; // 場所
		resource['description'] = description; // 説明
		resource['updated'] = updated; // Dateオブジェクト
		resource['sequence'] = sequence; // シーケンス番号(更新時に1ずつ増えていく)
		return resource;
	}
	/*************************************************************************************
		イベントを登録する（ベース）
	**************************************************************************************/
	this.addEvent = function (xEvent, callback){
		xEvent['start'] = new Object();
		xEvent['start'].dateTime = xEvent['start_dateTime'].toISOString();
		xEvent['end'] = new Object();
		xEvent['end'].dateTime = xEvent['end_dateTime'].toISOString();
		// xEvent['updated'] は追加時に自動でセットされる
		gapi.client.load('calendar', 'v3', function(){
			var request = gapi.client.calendar.events.insert({
				'calendarId': calendarID,
				'resource': xEvent
			});
			request.execute(function(resp){
				console.debug(resp);//var xEvent = newEvent()
				callback(resp);
			});
		});
	}
	/*************************************************************************************
		イベントを登録する（拡張）
	**************************************************************************************/
	this.addEventA = function(summary, start, end, location, description, callback)
	{
		console.debug('addEventA:'+summary+start+end+location+description);
		var item = newEvent(null, summary, new Date(start), new Date(end), location, description, null, 0);
		this.addEvent(item, function(data){
			callback(data);
		});
	}
	/*************************************************************************************
		イベントの一覧を取得する（日時指定）
	**************************************************************************************/
	// '2013/03/29' 形式
	this.getEventListDayStr = function(datetimeStr, callback)
	{
		console.debug('call getEventListDayStr');
		var datetimeStart = new Date(datetimeStr);
		var datetimeEnd = new Date(datetimeStr);
		datetimeEnd.setTime(datetimeEnd.getTime() + 1000*60*60*24); // 翌日
		this.getEventListPeriod(datetimeStart, datetimeEnd, function(a){
			callback(a);
		});
	}

	/*************************************************************************************
		イベントの一覧を取得する（期間指定）
	**************************************************************************************/
	this.getEventListPeriod = function(datetimeStart, datetimeEnd, callback)
	{
		console.debug('call getEventListPeriod');
		var find_event_type = $('#find_event_type').val();
		gapi.client.load('calendar', 'v3', function(){
			var request = gapi.client.calendar.events.list
			({  // メソッド
				'calendarId': calendarID,  // カレンダーID
				'timeMin': datetimeStart.toISOString(),
				'timeMax': datetimeEnd.toISOString()

			});
			request.execute(function(resp)
			{
				var xEventList = [];
				//console.debug(resp);
				for (var i in resp.items) 
				{
					var event = resp.items[i];
					var sd = new Date(event.start.dateTime);
					var ed = new Date(event.end.dateTime);
					var ud = new Date(event.updated);
					var sequence = event.sequence;
					var xEvent = newEvent(event.id, event.summary,sd , ed, event.location, event.description, ud, sequence);
					//var xEvent = this.newEvent(event.id, event.summary,sd , ed, event.location, event.description, ud, sequence);
					if (find_event_type != '0' && event.summary.indexOf('[' + find_event_type + ']') < 0) {
						continue;
					}
					xEventList.push(xEvent);
				}
				callback(xEventList);
			});
		});
	}
	/*************************************************************************************
		イベントの一覧を取得する	
	**************************************************************************************/
	this.getEventList = function (callback){
		console.debug(calendarID);
		gapi.client.load('calendar', 'v3', function(){
			var request = gapi.client.calendar.events.list({  // メソッド
				'calendarId': calendarID  // カレンダーID
			});
			request.execute(function(resp){
				var xEventList = [];
				//console.debug(resp);
				for (var i in resp.items) {
					var event = resp.items[i];
					var sd = new Date(event.start.dateTime);
					var ed = new Date(event.end.dateTime);
					var ud = new Date(event.updated);
					var sequence = event.sequence;
					var xEvent = newEvent(event.id, event.summary,sd , ed, event.location, event.description, ud, sequence);
					//var xEvent = this.newEvent(event.id, event.summary,sd , ed, event.location, event.description, ud, sequence);
					xEventList.push(xEvent);
				}
				callback(xEventList);
			});
		});
	}
	/*************************************************************************************
		イベントの詳細を取得する	
	**************************************************************************************/
	this.getEvent = 	function (eventID, callback){
		gapi.client.load('calendar', 'v3', function(){
			var request = gapi.client.calendar.events.get({  // メソッド
				'calendarId': calendarID,  // パラメータ
				'eventId': eventID
			});
			request.execute(function(resp){
				console.debug(resp);
				var sd = new Date(resp.start.dateTime);
				var ed = new Date(resp.end.dateTime);
				var ud = new Date(resp.updated);
				var sequence = resp.sequence;
				var xEvent = newEvent(resp.id, resp.summary,sd , ed, resp.location, resp.description, ud, sequence);
				callback(xEvent);
			});
		});
	}
	/*************************************************************************************
		イベントを更新する	
	**************************************************************************************/
	this.updEventA = function(event_id,summary, start, end, location, description, sequence, callback)
	{
		console.debug('updEventA:'+event_id);
		var xEvent = newEvent(event_id, summary, new Date(start), new Date(end), location, description, null, sequence);
		
		this.updEvent(xEvent, callback);
	}
	this.updEvent = function(xEvent, callback)
	{
		xEvent['start'] = new Object();
		xEvent['start'].dateTime = xEvent['start_dateTime'].toISOString();
		xEvent['end'] = new Object();
		xEvent['end'].dateTime = xEvent['end_dateTime'].toISOString();
		gapi.client.load('calendar', 'v3', function(){
			var request = gapi.client.calendar.events.update({  // メソッド
				'calendarId': calendarID,  // パラメータ
				'eventId': xEvent.id,
				'resource': xEvent
			});
			console.debug(xEvent);
			request.execute(function(resp){
				console.debug(resp);
				callback(resp);
			});
		});
	}
	/*************************************************************************************
		イベントを削除する	
	**************************************************************************************/
	this.delEventA = function(event_id, callback)
	{
		console.debug('delEventA:'+event_id);
		var xEvent = {};
		xEvent['id'] = event_id;
		
		this.delEvent(xEvent, callback);
	}
	this.delEvent = function(xEvent, callback)
	{
		gapi.client.load('calendar', 'v3', function(){
			var request = gapi.client.calendar.events.delete({  // メソッド
				'calendarId': calendarID,  // パラメータ
				'eventId': xEvent.id
			});
			console.debug(xEvent);
			request.execute(function(resp){
				console.debug(resp);
				callback(resp);
			});
		});
	}
	/*************************************************************************************
		カレンダーの一覧を取得する	
	**************************************************************************************/
	this.getCalList = function(callback)
	{
		gapi.client.load('calendar', 'v3', function()
		{
			var request = gapi.client.calendar.calendarList.list();
			request.execute(function(resp){
			console.debug(resp);
			callback(resp.items);
			});
		});
	}

}
////////// authorization
