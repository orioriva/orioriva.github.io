/** 日付をYYYY/MM/DD形式にフォーマットする */
function formatDate(date, format) {
    format = format.replace(/YYYY/, date.getFullYear());
    format = format.replace(/MM/, date.getMonth() + 1).padStart(2, "0");
    format = format.replace(/DD/, date.getDate()).padStart(2, "0");
    format = format.replace(/hh/, date.getHours()).padStart(2, "0");
    format = format.replace(/mm/, date.getMinutes()).padStart(2, "0");
    return format;
}

function dateToTextDef(date){
	let str =
		date.getFullYear() + " / " +
		(date.getMonth() + 1).toString().padStart(2, "0") + " / " +
		date.getDate().toString().padStart(2, "0") + "　" +
		date.getHours().toString().padStart(2, "0") + ":" +
		date.getMinutes().toString().padStart(2, "0");
	return str;
}