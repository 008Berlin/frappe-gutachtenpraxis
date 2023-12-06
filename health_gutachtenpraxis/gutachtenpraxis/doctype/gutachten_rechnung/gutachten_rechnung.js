// Copyright (c) 2023, Aron Wiederkehr and contributors
// For license information, please see license.txt

// Die Funktionen sind in die einzelnen Bereiche der Rechnungslegung unterteilt
frappe.ui.form.on('Gutachten Rechnung', {
	onload: function (frm) {
		zeitaufwand(frm);
		aufwendungsersatz(frm);
		zusammenfassung(frm);
	}
});

function zeitaufwand(frm) {
	let r_vorbereitende_arbeiten = Number(frm.doc.r_vorbereitende_arbeiten);
	let r_aktenstudium = Number(frm.doc.r_aktenstudium).value.replace(',', '.');
	let r_exploration = Number(frm.doc.r_exploration).value.replace(',', '.');
	let r_entwurf = Number(frm.doc.r_entwurf).value.replace(',', '.');
	let r_ueberarbeitung = Number(frm.doc.r_ueberarbeitung).value.replace(',', '.');

	let r_fahrzeit = frm.doc.r_fahrzeit;
	let r_fahrzeit_sum = Number((r_fahrzeit * 0.0166).toFixed(2));

	//let r_sum_zeitaufwand = r_vorbereitende_arbeiten + r_aktenstudium + r_exploration + r_entwurf + r_ueberarbeitung + r_fahrzeit_sum;

	frm.set_value('r_sum_zeitaufwand', r_fahrzeit_sum);
}
