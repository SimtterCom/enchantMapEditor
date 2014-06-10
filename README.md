# jQuery UI版enchant.js Map Editor

[enchant.js](http://enchantjs.com/ja/)の公式マップエディタ[enchantMapEditor](https://github.com/wise9/enchantMapEditor)を[jQuery UI](http://jqueryui.com/)に置き換えてみた。 

<http://9leap.net/games/3338/>で実際の動作を確認できます。 
※上記のフレームをクリックするとMap Editorを操作できるが、フレームが狭すぎてまともに使えないので、[こちら](http://r.jsgames.jp/games/3338/)から開くことをおススメする。 

## 動作するブラウザ

機能は公式とほぼ一緒だが、公式はsafariでしか動かなかったが、こちらはIE,chrome,safariで動く。 
※firefoxではレイヤーが切り替えられないバグがある。 

## 画面構成

画面構成を解説します。 

Create Mapボタン: 
起動したらまず最初にこのボタンを押して、横のチップ数、縦のチップ数などを指定してマップを作成する。 

Import Mapボタン: 
すでに作成済みのMapデータをインポートする。エクスポートと同じ書式のコードから読み込む。 

Undo: 
アンドゥ(履歴は１回しか覚えていない) 

Tool bar: 
ドローツール。pen(ペン),fill(塗りつぶし),straight(線),rect(矩形)がある。 

selected chip: 
パレットから選択したチップを表示 

eraser chip: 
消しゴムチップ 

palette: 
マップに配置したいチップをクリックして選択する。選択したチップはselected chipに表示される。 

Export Mapボタン: 
作成したマップのコードを表示する。ユーザーはこのコードをコピーして自分のプログラミングにペーストして反映させる。 

Add Layerボタン: 
マップのレイヤーを追加する。 
※現在レイヤー追加は未対応。UIは実装したが、内部処理を実装していない。 

collision detectionタブ: 
当り判定を配置するレイヤー 

Layer 0タブ: 
チップを配置するレイヤー(ベースとなるフィールドを配置) 

Layer 1タブ: 
チップを配置するレイヤー(フィールドの上に建つ建物などを配置) 

enchant-stage: 
マップにチップを配置する。Create Mapボタンで作られる。 

## チュートリアル

使い方を順を追って解説します。 
![enchantMapEditor01](/README/enchantMapEditor01.png)
1.まずenchantMapEditorを開いたら、 
Create Mapボタンを押して、マップ作成ダイアログを開きます。 

![enchantMapEditor02](/README/enchantMapEditor02.png)
2.マップ作成ダイアログを開いたら、 
Number of chips for width: マップの幅のチップ数（チップのサイズは16ドット固定ですのでマップの幅はチップ数*16になります。デフォルトでは20個になっています。これは20*16=320でマップ幅は320ドットになります。） 
Number of chips for height: マップの高さのチップ数（チップのサイズは16ドット固定です。デフォルトでは20個になっている） 
Image: マップの画像ファイルの種類を指定します。RPG用と2Dスクロール用が用意されています。RPGを指定するとhtmlファイルを同じディレクトリにあるmap0.gifを読み込み、2Dスクロールを指定するとmap1.gifを読み込みます。画像ファイルは置き換えることも可能ですが、256x256のサイズを想定しています。 
Enable MAP EXTENTION:マップ拡張と言う機能を有効するか指定します。マップ拡張とはRPGのフィールドマップを作成する場合に、海岸線や森と平原の境目を自動補間する機能です。主にRPG(map0.gif)用の機能になりますので、2Dスクロールの場合はチェックを外してください。 
以上を設定して、Create a new mapボタンを押してください。 

![enchantMapEditor03](/README/enchantMapEditor03.png)
3.マップ作成ダイアログの設定にしたがって、パレットにマップ画像ファイルが読み込まれ、enchant-stageに指定したサイズのマップが作られます。 

![enchantMapEditor04](/README/enchantMapEditor04.png)
4.paletteのどこかをクリックすると、描画したいチップを選択できます。この例では草原あたりをクリックします。 
マップ拡張を有効にしていると、パレットの左側96x256をそれぞれ48x64を同一のタイプとして認識（例では海、草原、石造物、砂漠、床、森、ダンジョンの床、穴）し、そのタイプを選択したことになります。（例えば、海の海岸線チップは選択できず、海岸線はenchant-stageへ描くときに自動補間され書き込まれる） 
マップ拡張を無効にしていると、タイプとして認識せず、選択したチップをそのまま認識します。 

![enchantMapEditor05](/README/enchantMapEditor05.png)
5.ツールバーでペンを選択し、enchant-stage内で適当にドラッグすると選択したチップが描き込まれます。 

![enchantMapEditor06](/README/enchantMapEditor06.png)
6.さらに、ツールバーでfill(塗りつぶし)を選択し、パレットで海タイプを選択し、enchant-stage内の空白部分を適当にクリックすると、空白を海で塗りつぶせます。草原との境界はマップ拡張機能により自動補間されます。 

![enchantMapEditor07](/README/enchantMapEditor07.png)
7.当り判定も設定してみましょう。 
ツールをペンに変え、collision detection（当り判定）をクリックし、enchant-stage内の海岸線に沿ってクリックすると、当り判定を設定できます。 
当り判定は初期値0になっており、設定した箇所は1が入ります。ゲーム上で当り判定1の場合はプレイヤーがそこを通れないといった処理に使えます。 

![enchantMapEditor08](/README/enchantMapEditor08.png)
8.レイヤーは２つ使えます。 
レイヤー0ではフィールドを設定し、レイヤー1では建物を設定するのに適しています。 
建物を建ててみましょう。 
パレットから建物（この例ではダンジョン）をクリックし、Layer 1をクリックしてレイヤーを切り替え、enchant-stageの草原をクリックすると、建物が建てれます。 

![enchantMapEditor09](/README/enchantMapEditor09.png)
9.ここまで作ったら、作成したマップをエクスポートしてみましょう。 
Export Mapボタンを押します。 

![enchantMapEditor10](/README/enchantMapEditor10.png)
10.するとエクスポートダイアログが開きます。 

![enchantMapEditor11](/README/enchantMapEditor11.png)
11.テキスト内をドラッグ＆ドロップで選択し、Ctrl+Cでテキストをコピーし、自分のゲームのソースコード内に貼り付けてください。 

以上でチュートリアルは終わりですが、その他の機能についても説明しましょう。 

![enchantMapEditor12](/README/enchantMapEditor12.png)
12.インポート機能について説明しましょう。 
インポート機能とは、エクスポートでコピーしたマップのソースコードを貼り付けて、再編集するときに使います。 
また、現在編集中のマップをソースコードレベルで編集したいときにも使えます。 
では、手順を説明します。 
Import Mapボタンを押してください。 

![enchantMapEditor13](/README/enchantMapEditor13.png)
13.インポートダイアログが開きます。 
テキスト内には、エクスポートで表示されるソースコードを同じソースコードが表示されています。 

![enchantMapEditor14](/README/enchantMapEditor14.png)
14.この例では現在編集中のマップをソースコードレベルで編集してみましょう。 
スクリーンショットの赤丸で囲っている部分の数字がマップのレイヤー0のx:0,y:0のチップ番号になります。 
これを別のチップ番号に変えてみましょう。（例ではダンジョンのチップ番号を指定している） 
変え終わったら、Import a crated mapボタンを押します。 

![enchantMapEditor15](/README/enchantMapEditor15.png)
15.すると、左上x:0,y:0がダンジョンに置き換わっています。 

![enchantMapEditor16](/README/enchantMapEditor16.png)
16.レイヤーの追加について説明します。 
ただし、現在レイヤー追加機能は正しく動きませんので、予備知識ぐらいに考えておいてください。 
UIとしては機能しているのですが、内部の機能を実装していません。 
と言うのも、ほとんどのマップは2レイヤーで収まってしまうと思うので、作る必要が無いかなと思って作ってません。 
必要だよと言う方がいたら作りますので、コメント等々いただければと思います。 
では、説明します。 
まず、Add Layerボタンを押してください。 

![enchantMapEditor17](/README/enchantMapEditor17.png)
17.Layer 2が追加されます。 

![enchantMapEditor18](/README/enchantMapEditor18.png)
18.レイヤーは削除するこも可能です。 
Layer 2の隣のバツボタンを押すと削除できます。 

![enchantMapEditor19](/README/enchantMapEditor19.png)
19.Layer 2が削除されました。 

以上で、スクリーンショットを使った解説を終了します。 

## ファイル構成

せっかくなので、ファイル構成も解説しておきます。 

### index.html

公式のmapeditor.htmlをindex.htmlに名前を変更したうえで大幅変更。 
公式ではhtmlにはenchant-stageタグとeditタグしか存在せず、その他のタグはjavascriptで生成していたが、こちらはタグ構成をすべてhtmlに書いてある。 
jQuery UIのサンプルを参考に書いた。 

### main.js 

公式の同名ファイルから大幅変更。 
enchantの初期化とjQuery UIのスクリプトが書いてある。 
今回の変更の大半はこのファイルをjQuery UIのスクリプトに置き換える作業になった。 

### mapeditor.js 

公式の同名ファイルから多少変更。 
ehchantのcoreの初期化とenchant-stageタグのタッチイベントハンドラが記述してある。 
タッチイベント（マウスクリックイベント）でマウス位置が正しく入ってきてなかったり、イベント自体が発生しなかったりなどのバグっぽい動きを修正した。 

### drawing.js

公式の同名ファイルからほとんど変更なし。 
plugins/extendMap.enchant.js を更に拡張してドローツールのpen,fillなどの機能が記述されている。 
Export Mapで吐き出す文字列をgame.からcore.に変更したぐらいで、ほとんど変更なし。 

### enchant.min.js

いわずと知れたehchant.jsの本体。 
公式はv0.3と古いバージョンが使われていたが、jQuery UIとの相性が悪くinputタグが動かなかったので、最新版v0.6.3に変更した。 

### plugins/extendMap.enchant.js

enchant.jsのマップ拡張プラグイン 
これもv0.3からv0.6.3へ変更した。 

### jsディレクトリ

jQueryとjQuery UIの本体が入っている。 

### css/main.css

スタイルシートまわりを個別ファイルとして新規追加した。 
jQuery UIのサンプルを参考に書いた。 

### css/imagesディレクトリ

ツールバーや消しゴムチップ、アンドゥのアイコンのpngファイルが入っている。 
main.cssで参照している。 

### css/ui-lightnessディレクトリ

jQuery UIの公式スタイルシート。 
ui-lightnessというテーマを使っている。 

## 今後対応したいこと

* パレット用の画像ファイルを読み込めるように。
今は画像固定、画像を変えたければツールをダウンロードして、ローカルで差し替える必要がある。
* Create Mapをしたあともう一度Createすると、落ちるのを直す。
今は再度Createしたい場合は、ページを読み直す必要がある
* firefoxでもレイヤーが切り替わるように。（原因不明、firefoxか、jQuery UIのバグか？）
* レイヤーの追加・削除の内部処理に対応
* Import Mapでレイヤーが追加された場合にGUIに反映させる。

## 使用したオープンソースプロジェクト

  * [enchantMapEditor](https://github.com/wise9/enchantMapEditor)
  * [enchant.js](http://enchantjs.com/ja/)

これらのプロジェクトの全ての寄稿者および開発者に感謝いたします！

## ライセンス

The GPL version 3, read it at <http://www.gnu.org/licenses/gpl.txt> 

## 寄稿者

URL: [SimtterCom](http://blog.simtter.com/) 

