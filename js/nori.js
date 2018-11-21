/****************************************************************************************************
*    モジュール名    	：nori.js
*    モジュール概要		：MVCフレームワーク
*---------------------------------------------------------------------------------------------------
* License: MIT
* Update: 2013/05/29
* Version: 0.2
*
****************************************************************************************************/

/* @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ */
class Data
{
    /**
    * 新しいDataオブジェクトを作成します
    * @class SessionStorageまたはlocalStorageの情報を格納するクラス
    * @param {int} type data管理クラス
    * @param {key} result_set data管理クラス
    * @param {work_line} result_set data管理クラス
    */
    constructor(mode)
    {
        if ( mode = 'local' ) 
        { 
            this.storage = localStorage;
        }
        else if ( mode = 'session' ) 
        { 
            this.storage = sessionStorage;
        }   
    }
            
    /**
    * データを取得します.
    * @memberOf Data#
    * @param {String} key 取得先のキー
    */
    get(key)
    {
        try
        {
            return JSON.parse(this.storage.getItem(key));
        }
        catch(e)
        {
            this.log.set('Data.prototype.get',e,true);
        }
    }

    /**
    * データを取得します.
    * @memberOf Data#
    * @param {String} key 設定先のキー
    * @param {Object} value 設定する値
    */
    set(key,value)
    {
        try
        {
            this.storage.setItem(key,JSON.stringify(value));
        }
        catch(e)
        {
            this.log.set('Data.prototype.get',e,true);
        }
    }
    
    /**
    * データ件数を取得します.
    * @memberOf Data#
    * @param {String} key カウント先のキー
    */
    get_length(key,value)
    {
        try
        {
            var counter = 0;
            if(!this.get(key)) return counter;
            var work = this.get(key);
            for( var keyString in work )
            {
                counter += 1;
            }
            return counter;
        }
        catch(e)
        {
            this.log.set('Data.prototype.get_length',e,true);
        }
    }
    
    /**
    * JSON形式のデータを変換します.
    * @memberOf Data#
    * @param {Object} json_obj セットするJSONデータ
    */
    get_from_JSON(json_obj)
    {
        try
        {
        }
        catch(e)
        {
            this.log.set('Data.prototype.get_from_JSON',e,true);
        }
    }
    /**
    * JSON形式のデータを変換します.
    * @memberOf Data#
    * @param {String} key 取得先のキー
    */
    set_to_JSON(json_obj)
    {
        try
        {
        }
        catch(e)
        {
            this.log.set('Data.prototype.set_to_JSON',e,true);
        }
    }
}

/* @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ */
class Log
{   
    /**
    * Logコンストラクタ.
    * ユーザはリダイレクト先のページで認証されるため,Baseコンストラクタにアカウント情報が設定されていなくても動作します.<br />
    * すべてのメンバ関数の実行の前に,この関数が実行される必要があります.
    * @memberOf Base#
    * @param {Boolean} debug デバッグモードかどうか
    */
    constuctor(debug)
    {
        // デバッグモードの設定
        this.debug = debug;
    }
    /**
    *************************************************************************************処理見直し
    * ログ出力処理（ノーマル）.
    * ユーザはリダイレクト先のページで認証されるため,Baseコンストラクタにアカウント情報が設定されていなくても動作します.<br />
    * すべてのメンバ関数の実行の前に,この関数が実行される必要があります.
    * @memberOf Base#
    * @param {String} function_name 初期化成功後に呼び出される関数
    * @param {String} isError 初期化成功後に呼び出される関数
    */
    set(function_name,message,isError) 
    {
        //	エラー出力用ファンクション名が指定されていなければエラー終了
        if(function_name == "")
        {
            alert(myError["NORI-00001"]);
            return;
        }

        if (isError) 
        {
            // エラーの場合は必ずログ出力
            window.console.error(this.getDate("yyyy-mm-dd hh:mi") + " " + function_name + ' ' + message);
            //window.console.error('パラメータ: ' + JSON.stringify(this.parameter));
    
            // さらにデバッグモードの場合にはアラートを表示
            if (this.debug) {alert(this.function_name + ' ' + message);}
        } 
        else if (this.debug) 
        {
            // 正常ログはデバッグモードの場合のみログ出力
            window.console.log(this.getDate("yyyy-mm-dd hh:mi") + " " + function_name + ' ' + message);
            //window.console.log('パラメータ: ' + JSON.stringify(this.parameter));
        }
    }
    /**
    * ログ出力処理（フレームワークモディファイ）.
    * ユーザはリダイレクト先のページで認証されるため,Baseコンストラクタにアカウント情報が設定されていなくても動作します.<br />
    * すべてのメンバ関数の実行の前に,この関数が実行される必要があります.
    * @memberOf Base#
    * @param {String} function_name 初期化成功後に呼び出される関数
    * @param {String} isError 初期化成功後に呼び出される関数
    */
    set2(e)
    {
        if (!myError[e.message]) { this.set(e.message,true); }
        else { this.set(myError[e.message],true); }
    }
    /**
    * 現在日時の取得.
    * ユーザはリダイレクト先のページで認証されるため,Baseコンストラクタにアカウント情報が設定されていなくても動作します.<br />
    * すべてのメンバ関数の実行の前に,この関数が実行される必要があります.
    * @memberOf Base#
    * @param {String} getDate 初期化成功後に呼び出される関数
    */
    getDate(format)
    {
        // 対象日時のデフォルト設定
        var now = new Date();
        var result;
        result = format.replace("yyyy",now.getYear());	// 年
        result = result.replace("YYYY",now.getYear()); 	// 年
        result = result.replace("mm",now.getMonth()); 	// 月
        result = result.replace("MM",now.getMonth()); 	// 月
        result = result.replace("dd",now.getDate()); 	// 日
        result = result.replace("DD",now.getDate()); 	// 日
        result = result.replace("hh",now.getHours()); 	// 時
        result = result.replace("HH",now.getHours()); 	// 時
        result = result.replace("mi",now.getMinutes()); // 分
        result = result.replace("MI",now.getMinutes()); // 分
        return result;
    }
    /**
    * メッセージ取得処理.
    * ユーザはリダイレクト先のページで認証されるため,Baseコンストラクタにアカウント情報が設定されていなくても動作します.<br />
    * すべてのメンバ関数の実行の前に,この関数が実行される必要があります.
    * @memberOf Base#
    * @param {String} getDate 初期化成功後に呼び出される関数
    */
    getMessage(code)
    {
        if ( !myMessage[code]) {return "";}
        else { return myMessage[code];}
    }
    /**
    * ネットワーク接続確認処理.
    * ユーザはリダイレクト先のページで認証されるため,Baseコンストラクタにアカウント情報が設定されていなくても動作します.<br />
    * すべてのメンバ関数の実行の前に,この関数が実行される必要があります.
    * @memberOf Base#
    * @param {String} getDate 初期化成功後に呼び出される関数
    */
    is_online() 
    {
        return navigator.onLine;
    }
}
    
    /* @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ */

    /* @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ */
    class Controller
    {
        /**
        * 新しいControllerオブジェクトを作成します
        * 
        * @class SessionStorageまたはlocalStorageの情報を格納するクラス
        * @param {int} mode 実行モード
        * @param {key} result_set data管理クラス
        * @param {work_line} result_set data管理クラス
        */
        constructor()
        { 
            try
            {
                this.data = new Data('local');
                this.data_session = new Data('session');
                this.log = new Log(true); 
                this.log.set('constructor',false);
                
                this.is_loading=false;
                
                $.when
                (
                        // ビジネスコードリストの取得
                        this.model.execute('get_business_list',this.get_api('get_business_list'))
                    ,   
                        // パラメータリストの取得
                        this.model.execute('get_parameter_list',this.get_api('get_parameter_list'))
                )
                .then
                (
                        function()
                        {
                            // デフォルト画面の表示
                            local_view.shower(local_data.get('default_screen'));
                        }
                    ,	function() 
                        {
                            // エラーがあった時
                            throw new Error('初期処理に失敗しました');
                        }
                );
            }
            catch(e)
            {
                this.log.set('Controller.prototype',e,true);
            }
        }
        
        /**
        * OAuth認証を実行します.
        * ユーザはリダイレクト先のページで認証されるため,Baseコンストラクタにアカウント情報が設定されていなくても動作します.<br />
        * すべてのメンバ関数の実行の前に,この関数が実行される必要があります.
        * @memberOf Base#
        * @param {Function} onSuccess 初期化成功後に呼び出される関数
        */
        initialize(onSuccess) 
        {
            try
            {
                this.log.set('Base.prototype.initialize','[parameters]onSuccess:' + onSuccess,false);

                var auth = new Auth();

                var thisObj = this;
                auth.exec(function () 
                {
                    thisObj._isAuth = true;
                    onSuccess();
                });
            }
            catch(e)
            {
                this.log.set('Base.prototype.initialize',e,true);
            }
        }
        /**
        * ブラウザがフレームワークに対応しているかチェックします.
        * ユーザはリダイレクト先のページで認証されるため,Baseコンストラクタにアカウント情報が設定されていなくても動作します.<br />
        * すべてのメンバ関数の実行の前に,この関数が実行される必要があります.
        * @memberOf Base#
        * @param {Function} onSuccess 初期化成功後に呼び出される関数
        */
        check_browser()
        {
            try
            {
                this.log.set('Base.prototype.check_browser','[parameters]なし',false);

                if (typeof sessionStorage !== 'undefined' || typeof localStorage !== 'undefined' ) 
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
            catch(e)
            {
                this.log.set('Base.prototype.check_browser',e,true);
                return false;
            }
        }
    
        /**
        * インプット情報をDataオブジェクトから取得します.
        * @memberOf Controller#
        * @param {String} business_code 【必須】実行するビジネスコード
        * @param {Object} button 【任意】制御対象のボタンオブジェクト
        * @param {Object} directive 【必須】レンダリング用のディレクティブキー
        */
        execute(business_code,data_source,button,directive)
        {
            try
            {
                this.log.set('Controller.prototype.execute','[parameters]business_code:' + business_code + ',data_source:' + data_source + ',button' + button + ',mode:' + mode + ',directive:' + directive,false);

                var dfd = $.Deferred();

                // パラメータチェック
                if(!business_code) throw new Error('business_codeが指定されていません');
                //if(!button) throw new Error('buttonが指定されていません');
                if(!mode) throw new Error('modeが指定されていません');
                if(mode != '1' && mode != '2') throw new Error('modeの指定が不正です 指定されたmode:' + mode);
                if(!directive) throw new Error('directiveが指定されていません');
                
                // ボタンを無効化し、二重送信を防止
                if(this.is_loading)
                    return;

                // ロジック実行
                var local_this = this;
                var work_promise;
                this.is_loading=true;

                // HTML to Session
                //this.view.expander(business_code);
                
                dfd.promise();
                
                // ロジック実行
                work_promise = this.model.execute(business_code,this.get_api(business_code));

                //処理を先に進めるためのダミー
                work_promise = $.Deferred();
                work_promise.resolve();

                work_promise.then
                (
                    function()
                    {
                        
                        this.is_loading=false;
                        
                        //return 1;
                        dfd.resolve();
                    }
                );
            }
            catch(e)
            {
                this.log.set('Controller.prototype.execute',e,true);
                // ボタンを有効化し、再送信を許可
                if(button) button.attr('disabled', false);
                dfd.reject();
            }
        }
        /**
        *************************************************************************************処理見直し
        * 実行するAPIを取得します.
        * @business_code API取得キー
        * 現状は固定値を返すようになっているが、可変にできるように見直す！
        */
        get_api(business_code)
        {
            try
            {	
                this.log.set('Controller.prototype.get_api','[parameters]business_code:' + business_code,false);

                return  {
                                url		: 'http://bokusuta-apps.herokuapp.com/'
                            ,	type	: 'post'
                        };
            }
            catch(e)
            {
                this.log.set('Controller.prototype.get_api',e,true);
            }
        }

        /**
        * インプット情報をDataオブジェクトから取得します.
        * @business_code {String} 実行対象コード
        */
        input_gen(business_code)
        {
            try
            {   
                this.log.set('Model.prototype.input_gen','[parameters]business_code:' + business_code,false);

                // パラメータチェック
                if(!business_code) throw new Error('business_codeが設定されていません');
                //	
                //if(!this.data.get('user_info')) throw new Error('user_infoがlocalStorageに設定されていません');

                //var result = this.data.get('user_info');
                var result = {};
                
                if(business_code=='get_parameter_list')
                    result['business_code'] = '%';

                // get_parameter_listの結果を反映
                if(this.data.get('get_parameter_list'))
                {
                    $.extend(result, this.data.get(business_code)[0]);
                }
                return result;
                // return this.data.get(business_code)[0];
            }
            catch(e)
            {
                this.log.set('Model.prototype.input_gen',e,true);
            }
        }
        /**実行結果Dataオブジェクトに展開します.
        * @result {Object} execute(ajax)の結果オブジェクト
        */
        output_gen(key_name,result,data)
        {
            try
            {
                
                new Log(true).set('Model.prototype.output_gen','[parameters]key_name:' + key_name + ',result:dummy,data:dummy',false);

                // パラメータチェック
                if(!key_name) throw new Error('key_nameが設定されていません');
                if(!result) throw new Error('resultが設定されていません');
                if(!data) throw new Error('dataが設定されていません');

                data.set(key_name,result);
            }
            catch(e)
            {
                new Log(true).log.set('Model.prototype.input_gen',e,true);
            }
        }
        /**
        * Ajax経由でビジネスロジックを実行します.
        * @business_code {String} 実行対象コード
        * @api {String} 呼び出すAPI
        */
        execute(business_code,api)
        {
            try
            {
                this.log.set('Model.prototype.execute','[parameters]business_code:' + business_code  + ',api:' + JSON.stringify(api),false);

                var defer = $.Deferred();
                
                // パラメータチェック
                if(!business_code) throw new Error('business_code:' + business_code + 'が設定されていません');
                if(!api) throw new Error('apiが設定されていません');

                // HTMLでの送信をキャンセル
                //event.preventDefault();
                if(event)
                    (event.preventDefault) ? event.preventDefault():event.returnValue=false;
                
                // 送信
                var post_data = 
                {
                        'action_code'	: 	business_code
                    ,	'data'			: 	this.input_gen(business_code)
                };
                var callback = this.output_gen;
                $.ajax(
                {
                        // アクセス情報 ------------------------------------------------
                        url		: api['url']
                    ,	type	: api['type']
                    ,	data	: post_data
                    ,  	timeout	: 10000  								// 単位はミリ秒
                //	,	async	: false
                    ,	// ①送信前 ----------------------------------------------------
                        beforeSend: function(xhr, settings) 
                        {
                            //return;
                        }
                    ,	// ②応答後 ----------------------------------------------------
                        complete: function(xhr, textStatus) 
                        {
                            //return;
                        }
                    ,	// ③通信成功時の処理 ------------------------------------------
                        success: function(result, textStatus) 
                        {
                            // 入力値を初期化
                            // $form[0].reset();
                            callback(business_code,result['data'][0],new Data('local'));
                            defer.resolve();
                            //work = result['data'];
                        }
                    ,	// ④通信失敗時の処理 ------------------------------------------
                        error: function(xhr, textStatus, error) 
                        {
                            defer.reject();
                            throw new Error(JSON.stringify(xhr));
                        }
                });
            }
            catch(e)
            {
                this.log.set('Model.prototype.execute',e,true);
            }
            return defer.promise();
        }
    }
	// 基本クラスのフレームワーク化
    nori_model = new Model();

}


