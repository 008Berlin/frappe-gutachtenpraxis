// Copyright (c) 2023, Aron Wiederkehr and contributors
// For license information, please see license.txt

frappe.ui.form.on('Gutachten Rechnung', {
	onload: function (frm) {
		//alert('Komma bitte durch einen Punkt ersetzen!')
		zeitaufwand(frm);
	}
});

function zeitaufwand(frm) {
	//A. Zeitaufwand
	let r_vorbereitende_arbeiten = Number(frm.doc.r_vorbereitende_arbeiten);
	let r_aktenstudium = Number(frm.doc.r_aktenstudium);
	let r_exploration = Number(frm.doc.r_exploration);
	let r_entwurf = Number(frm.doc.r_entwurf);
	let r_ueberarbeitung = Number(frm.doc.r_ueberarbeitung);
	let r_fahrzeit_sum = Number((frm.doc.r_fahrzeit * 0.0166).toFixed(2));

	//A. Zeitaufwand: Gesamtzahl der Stunden
	let r_sum_zeitaufwand = (r_vorbereitende_arbeiten + r_aktenstudium + r_exploration + r_entwurf + r_ueberarbeitung + r_fahrzeit_sum).toFixed(2);
	frm.set_value('r_sum_zeitaufwand', r_sum_zeitaufwand);

	//A. Zeitaufwand: Jede angefangene 30min werden aufgerundet (§8 Justizvergütungs- und entschädigungsgesetz)
	let r_sum_zeitaufwand_round = (Math.ceil(r_sum_zeitaufwand * 2) / 2).toFixed(2);
	frm.set_value('r_sum_zeitaufwand_round', r_sum_zeitaufwand_round);

	//B. Zusammenfassung: Zeitaufwand
	let r_stundensatz = frm.doc.r_stundensatz;
	let r_stundensatz_sum = r_sum_zeitaufwand_round * r_stundensatz;
	frm.set_value('r_stundensatz_sum', r_stundensatz_sum);

	//B. Zusammenfassung: Auslagen- und Aufwendungsersatz
	let r_reisekosten_sum = Number((frm.doc.r_reisekosten * 0.42).toFixed(2));
	let r_schreibkosten_sum = Number((frm.doc.r_schreibkosten / 1000 * 1.50).toFixed(2));
	let r_auslagen_sum = r_reisekosten_sum + r_schreibkosten_sum;
	frm.set_value('r_auslagen_gesamt', r_auslagen_sum);

	//B. Zusammenfassung: Nettobetrag
	let r_netto_sum = r_stundensatz_sum + r_auslagen_sum;
	frm.set_value('r_nettobetrag', r_netto_sum);

}