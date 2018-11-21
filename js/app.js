       
/******************************************************************************************************
*    初期表示設定
*******************************************************************************************************/
var E_SERVER_ERROR = 'サーバとの通信に失敗しました';
var column_names = 
{
        period: '期間'
    ,    area: '業種・業界'
    ,    description: '業務内容'
    ,    language:'開発環境・言語'
    ,    output:'アウトプット'
    ,    role:'役割・プロジェクト規模'
};
var app;
$(document).ready(function () 
{
    // create Vue object
    app = new Vue(
    {
        el: "#app",
        data:
        {
                now_page: 0
            ,   columns: column_names
            ,   list:[]
            ,   message:''
            ,   searchFor_period_start: ''
            ,   searchFor_area: ''
            ,   searchFor_description: ''
            ,   searchFor_language: ''
            ,   searchFor_output: ''
            ,   searchFor_role: ''
            ,   fields: column_names
            ,   sortKey:''
            ,   sortOrders:
                {
                    period: 1
                    ,   area:1
                    ,   description:1
                    ,   language:1
                    ,   output:1
                    ,   role:1
                }
            ,   multiSort: true
            ,   perPage: 10
            ,   paginationComponent: 'vuetable-pagination'
            ,   paginationInfoTemplate: 'แสดง {from} ถึง {to} จากทั้งหมด {total} รายการ'
            ,   moreParams: [],
        },
        computed: 
        {
            filteredList: function () 
            {
                var sortKey = this.sortKey;
                var searchFor_period_start = this.searchFor_period_start && this.searchFor_period_start.toLowerCase();
                var searchFor_area = this.searchFor_area && this.searchFor_area.toLowerCase();
                var searchFor_description = this.searchFor_description && this.searchFor_description.toLowerCase();
                var searchFor_language = this.searchFor_language && this.searchFor_language.toLowerCase();
                var searchFor_output = this.searchFor_output && this.searchFor_output.toLowerCase();
                var searchFor_role = this.searchFor_role && this.searchFor_role.toLowerCase();
                var order = this.sortOrders[sortKey] || 1
                var data = this.list
                if (searchFor_period_start) 
                {
                    data = data.filter(function (row) 
                    {
                        return Object.keys(row).some(function (key) 
                        {
                            return String(row['period']).toLowerCase().indexOf(searchFor_period_start) > -1
                        })
                    })
                }
                if (searchFor_area) 
                {
                    data = data.filter(function (row) 
                    {
                        return Object.keys(row).some(function (key) 
                        {
                            return String(row['area']).toLowerCase().indexOf(searchFor_area) > -1
                        })
                    })
                }
                if (searchFor_description) 
                {
                    data = data.filter(function (row) 
                    {
                        return Object.keys(row).some(function (key) 
                        {
                            return String(row['description']).toLowerCase().indexOf(searchFor_description) > -1
                        })
                    })
                }
                if (searchFor_language) 
                {
                    data = data.filter(function (row) 
                    {
                        return Object.keys(row).some(function (key) 
                        {
                            return String(row['language']).toLowerCase().indexOf(searchFor_language) > -1
                        })
                    })
                }
                if (searchFor_output) 
                {
                    data = data.filter(function (row) 
                    {
                        return Object.keys(row).some(function (key) 
                        {
                            return String(row['output']).toLowerCase().indexOf(searchFor_output) > -1
                        })
                    })
                }
                if (searchFor_role) 
                {
                    data = data.filter(function (row) 
                    {
                        return Object.keys(row).some(function (key) 
                        {
                            return String(row['role']).toLowerCase().indexOf(searchFor_role) > -1
                        })
                    })
                }
                if (sortKey) 
                {
                    data = data.slice().sort(function (a, b) 
                    {
                        a = a[sortKey]
                        b = b[sortKey]
                        return (a === b ? 0 : a > b ? 1 : -1) * order
                    })
                }
                return data
            }
        },
        methods:
        {
            initialize: function (ctx) 
            {
                app.get_list(ctx);
            },
            get_list: function (ctx) 
            {
                var url_string = 'https://rgroupconnectioncheck.azurewebsites.net/api/get_job_list?code=ap412OBtEm/2qdS8aD12VOjdnqFPKgKTeFspEIQMOJkAZPvSjcaPMA==&token=test';
                $.ajax({
                    type: "POST",
                    url: url_string
                })
                .then(
                    // 1つめは通信成功時のコールバック
                    function (data) 
                    {
                        $('#form_list').DataTable();
                        app['list'] = expandJsonToApp(data);
                    },
                    // 2つめは通信失敗時のコールバック
                    function () 
                    {
                        console.log(error);
                    }
                );
            },
            get_csv_all: function (ctx) 
            {
                app.get_csv(ctx,'all');
            },
            get_csv_condition: function (ctx) 
            {
                app.get_csv(ctx,'condition');
            },
            get_csv: function (ctx,key) 
            {
                var table = [];
                var target;
                var a_key;
                if(key =='all')
                {
                    target = app.list;
                    a_key = 'download_all';
                }
                else
                {
                    target = app.filteredList;
                    a_key = 'download_condition';
                }
                // タイトル
                table.push(['期間','業種・業界','業務内容','開発環境・言語','アウトプット','役割・プロジェクト規模']);
                for(var i = 0; i < target.length; i++) 
                { // 配列の長さ分の繰り返し
                    var row_data = [];
                    row_data.push(target[i]['period']);
                    row_data.push(target[i]['area']);
                    row_data.push(target[i]['description']);
                    row_data.push(target[i]['language']);
                    row_data.push(target[i]['output']);
                    row_data.push(target[i]['role']);
                    table.push(row_data);
                }
                handleDownload(tableToCsvString(table),a_key);
                //downloadCsv(table);
            },
            sortBy: function (key) 
            {
                this.sortKey = key
                this.sortOrders[key] = this.sortOrders[key] * -1
            },
            /**
             * Other functions
             */
            setFilter: function() {
                this.moreParams = [
                    'filter=' + this.searchFor
                ]
                this.$nextTick(function() {
                    this.$broadcast('vuetable:refresh')
                })
            },
            resetFilter: function() {
                this.searchFor = ''
                this.setFilter()
            },
            preg_quote: function( str ) {
                // http://kevin.vanzonneveld.net
                // +   original by: booeyOH
                // +   improved by: Ates Goral (http://magnetiq.com)
                // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
                // +   bugfixed by: Onno Marsman
                // *     example 1: preg_quote("$40");
                // *     returns 1: '\$40'
                // *     example 2: preg_quote("*RRRING* Hello?");
                // *     returns 2: '\*RRRING\* Hello\?'
                // *     example 3: preg_quote("\\.+*?[^]$(){}=!<>|:");
                // *     returns 3: '\\\.\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:'

                return (str+'').replace(/([\\\.\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:])/g, "\\$1");
            },
            paginationConfig: function(componentName) {
                    this.$broadcast('vuetable-pagination:set-options', {
                        wrapperClass: 'pagination',
                        icons: { first: '', prev: '', next: '', last: ''},
                        activeClass: 'active',
                        linkClass: 'btn btn-default',
                        pageClass: 'btn btn-default'
                    })
            }
        }
    });

    app.initialize();
    


});

function expandJsonToApp(data)
{ 
    var work_array = JSON.parse(data);
    var work_result = [];
    for (var pname in work_array) 
    {    
        work_result.push(work_array[pname]);
    }
    return work_result;
}
/******************************************************************************************************
*   CSV出力
*******************************************************************************************************/

var handleDownload = function(content,a_key) {
                var bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
                var blob = new Blob([ bom, content ], { "type" : "text/csv" });

                if (window.navigator.msSaveBlob) { 

                    // msSaveOrOpenBlobの場合はファイルを保存せずに開ける
                    window.navigator.msSaveOrOpenBlob(blob, "output.csv"); 
                } else {
                   // document.getElementById(a_key).href = window.URL.createObjectURL(blob);
                    // Attempt to use an alternative method
                    var anchor = document.body.appendChild(
                    document.createElement( "a" )
                    );
                    // If the [download] attribute is supported, try to use it
                    if ( "download" in anchor ) {
                    anchor.download = "output.csv";
                    anchor.href = URL.createObjectURL( blob );
                    anchor.click();
                    }
                }
            }



    var tableToCsvString = function(table) {
        var str = '\uFEFF';
        for (var i = 0, imax = table.length - 1; i <= imax; ++i) {
            var row = table[i];
            for (var j = 0, jmax = row.length - 1; j <= jmax; ++j) {
                str_work = row[j];
                str += '"' + str_work + '"';
                //str += '"' + str_work.replace('"', '""') + '"';
                if (j !== jmax) {
                    str += ',';
                }
            }
            str += '\n';
        }
        return str;
    };
