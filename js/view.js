'use strict'

/** DataTables初期設定 */
//setDataTablesStatus(2, 1);

/** ページ遷移前の確認 */
window.onbeforeunload = function(event){
    event.returnValue = 'ページを離れますか？\r\n保存していない内容は破棄されます！';
};

/** 設定用vueインスタンス */
var vmConfig = Vue.createApp({
	data(){
		return{
			canvasSize: '1',
			strokeAnim: 'off',
			resultTag: 'default',
			resultTagName: 'RESULT'
		}
	},
	methods: {
		changeCanvasSize(){
			changeCanvasSize(this.canvasSize)
		}
	}
}).mount('#control-bar')

function changeCanvasSize(value){
	if(value == "1"){
		$('#canvas-wrapper').css({'width': '100%', 'height': '100vh'});
	}else if(value == "2"){
		$('#canvas-wrapper').css({'width': '1280px', 'height': '720px'});
	}
}

/** スマホ用入力ボタン表示/非表示 */
$('#calc-keys-show').click(function(){
	$('#calc-keys').animate({height: 'show', opacity:'show'},'slow');
	$(this).animate({height: 'hide', opacity:'hide'},'slow');
});
$('#calc-keys-hide').click(function(){
	$('#calc-keys').animate({height: 'hide', opacity:'hide'},'slow');
	$('#calc-keys-show').animate({height: 'show', opacity:'show'},'slow');
});

/** 操作ガイドボタンが押された時 */
$("#guide-btn").click(function() {
    $('.popup-guide').addClass('popup-show').fadeIn();
});

/** 操作ガイドを閉じる時 */
$('.popup-guide').click(function(e){
    if(!$(e.target).closest('.content').length){
		$('.popup-guide').fadeOut();
	}
});
$('#close-guide').click(function() {
    $('.popup-guide').fadeOut();
});

/** 全消去ボタンが押された時 */
$('#delete-btn').click(function() {
    if(confirm("本当に全て削除しますか？")){
        allDelete();
    }
});

/** ファイルを開くボタンが押された時 */
$('#open-btn').click(function() {
    $('.popup-file').addClass('popup-show').fadeIn();
    ajaxGetFormulaList();
});

/** ファイルを閉じる時 */
$('.popup-file').click(function(e){
    if(!$(e.target).closest('.content').length){
    	if($(e.target).prop("tagName") != "A"){
    		$('.popup-file').fadeOut();
    	}
	}
});
$('#close-file').click(function() {
    $('.popup-file').fadeOut();
});

/** 新規保存ボタンが押された時 */
$('#addData').click(function() {
	let title = prompt("保存する計算式のタイトルを入力", this.text);
	if(title == null || title == ""){
		alert("キャンセルしました");
		return;
	}

	ajaxAddFormula(title);
});


/** 読み込み前の確認 */
function loadConfirm(){
	if(!confirm("データを読み込むと現在編集中の計算表は上書きされますがよろしいですか？")){
        return;
    }
    ajaxLoadFormula();
}

/** リストデータを元にtbodyに要素を追加する(formula.jsから呼び出し) */
function updateFormulaTable(formulaData){
	// 既にdataTableが定義されていれば削除
	if(dataTable !== null){
		dataTable.destroy();
	}

	dataTable = $('#dataTable').DataTable({
		data: formulaData,
		columns: [
			// タイトル
			{
				data: 'title',
				render: function(data,type,row){
					let insert =
						'<div class="d-flex justify-content-between">' +
							data +
							"<button class='btn btn-sm btn-secondary' type='button' value='" + row.id + "' onclick='ajaxUpdateFormulaTitle(\"" + data + "\");'>" +
									"<i class='fas fa-pen'></i>" +
							"</button>"
						'</div>';
					return insert;
				}
			},
			// 更新日
			{
				data: 'updateDate',
				render: function(data){
					return dateToTextDef(new Date(data));
				}
			},
			// 操作
			{
				data: 'id',
				render: function(data){
					let insert =
						"<button class='btn btn-sm btn-success mr-2' type='button' value='" + data + "' onclick='ajaxUpdateFormulaJson();'>" +
							"<i class='fas fa-save'></i>&ensp;上書き保存" +
						"</button>" +
						"<button class='btn btn-sm btn-info mr-2' type='button' value='" + data + "' onclick='loadConfirm();'>" +
							"<i class='fas fa-download'></i>&ensp;読込" +
						"</button>" +
						"<button class='btn btn-sm btn-danger' type='button' value='" + data + "' onclick='ajaxDeleteFormula();'>" +
							"<i class='fas fa-trash-alt'></i>&ensp;削除" +
						"</button>";
					return insert;
				}
			}
		]
	});
}