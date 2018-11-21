# 評価用プログラム　職務経歴参照システム

![システムアーキテクチャ](https://user-images.githubusercontent.com/35760519/48814526-691d7300-ed7e-11e8-9c58-6aae6cd4c0f4.png "システムアーキテクチャ")

## Demo
https://job-desciprtion.azurewebsites.net/

## Usage
- 初期表示は全経歴データを表示します。
- 各項目でフィルタリングできます。
- 表示中のリストデータ、全データをCSV形式の外部ファイルにエクスポートできます。

## Components

```bash
/server
　AzureFunctionsで実行されるプログラムです。
/db
　AzureSQLDatabase上のテーブル定義（DDL）です。
```

## License

[MIT License](http://opensource.org/licenses/MIT)
