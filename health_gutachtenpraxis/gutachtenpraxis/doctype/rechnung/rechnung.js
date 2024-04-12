// Copyright (c) 2023, Aron Wiederkehr and contributors
// For license information, please see license.txt

frappe.ui.form.on('Rechnung', {
	onload: function (frm) {
		//alert('Komma bitte durch einen Punkt ersetzen!')
		zeitaufwand(frm);
	}
});

function zeitaufwand(frm) {
	//A. Zeitaufwand
	var r_vorbereitende_arbeiten = Number(frm.doc.r_vorbereitende_arbeiten);
	var r_aktenstudium = Number(frm.doc.r_aktenstudium);
	var r_exploration = Number(frm.doc.r_exploration);
	var r_entwurf = Number(frm.doc.r_entwurf);
	var r_ueberarbeitung = Number(frm.doc.r_ueberarbeitung);

	var r_fahrzeit_sum = Number((frm.doc.r_fahrzeit * 0.0166).toFixed(2));
	frm.set_value('r_fahrzeit_sum', r_fahrzeit_sum);

	//A. Zeitaufwand: Gesamtzahl der Stunden
	var r_sum_zeitaufwand = (r_vorbereitende_arbeiten + r_aktenstudium + r_exploration + r_entwurf + r_ueberarbeitung + r_fahrzeit_sum).toFixed(2);
	frm.set_value('r_sum_zeitaufwand', r_sum_zeitaufwand);

	//A. Zeitaufwand: Jede angefangene 30min werden aufgerundet (§8 Justizvergütungs- und entschädigungsgesetz)
	var r_sum_zeitaufwand_round = (Math.ceil(r_sum_zeitaufwand * 2) / 2).toFixed(2);
	frm.set_value('r_sum_zeitaufwand_round', r_sum_zeitaufwand_round);

	//B. Zusammenfassung: Zeitaufwand
	var r_stundensatz = frm.doc.r_stundensatz;
	var r_stundensatz_sum = r_sum_zeitaufwand_round * r_stundensatz;
	frm.set_value('r_stundensatz_sum', r_stundensatz_sum);

	//B. Zusammenfassung: Auslagen- und Aufwendungsersatz
	var r_reisekosten_sum = Number((frm.doc.r_reisekosten * 0.42).toFixed(2));
	var r_schreibkosten_sum = Number((frm.doc.r_schreibkosten / 1000 * 1.50).toFixed(2));
	var r_auslagen_sum = r_reisekosten_sum + r_schreibkosten_sum;
	frm.set_value('r_auslagen_gesamt', r_auslagen_sum);

	//B. Zusammenfassung: Nettobetrag
	var r_netto_sum = r_stundensatz_sum + r_auslagen_sum;
	frm.set_value('r_nettobetrag', r_netto_sum);

	//B. Zusammenfassung: Bruttobetrag
	var r_mwst_answer = frm.doc.r_mwst;

	if (r_mwst_answer === 'Ja') {
		var r_brutto = Number((r_netto_sum * 1.19).toFixed(2));
		frm.set_value('r_rechnungssumme', r_brutto);
		frm.set_value('r_gutschrift', r_brutto);
		var r_mwst_betrag = Number((r_brutto - r_netto_sum).toFixed(2));
		frm.set_value('r_mwst_betrag', r_mwst_betrag);
	} else if (r_mwst_answer === 'Nein') {
		frm.set_value('r_rechnungssumme', r_netto_sum);
		frm.set_value('r_mwst_betrag', 0);
		frm.set_value('r_gutschrift', r_netto_sum);
	}
}