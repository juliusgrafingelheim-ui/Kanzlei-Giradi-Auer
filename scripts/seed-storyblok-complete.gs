/**
 * ================================================================
 * Storyblok COMPLETE Setup - Google Apps Script
 * Girardi & Auer Rechtsanwaltskanzlei
 * ================================================================
 *
 * Dieses Script macht ALLES in einem Durchlauf:
 *   1. LOESCHT alle Stories und Components (Clean Slate)
 *   2. Erstellt 6 Component-Schemas (flat, keine Tabs/Nesting)
 *   3. Erstellt einen "pages" Folder
 *   4. Erstellt & befuellt alle 6 Page-Stories mit Content
 *   5. Publiziert alles
 *
 * USAGE:
 *   1. script.google.com > Neues Projekt
 *   2. Diesen gesamten Code einfuegen
 *   3. MGMT_TOKEN unten eintragen
 *   4. Funktion "runAll" auswaehlen > Run
 *   5. Execution Log pruefen (~3-5 Min wegen Rate Limits)
 *
 * ================================================================
 */

// ── KONFIGURATION ────────────────────────────────────────────────
var MGMT_TOKEN = "DEIN_MANAGEMENT_TOKEN_HIER";  // <-- HIER EINTRAGEN!
var SPACE_ID   = "291045863485848";
var API_BASE   = "https://mapi.storyblok.com/v1/spaces/" + SPACE_ID;

// ── Lucide Icon Optionen fuer Storyblok Select Fields ────────────
var LUCIDE_ICON_OPTIONS = [
  "Award","Users","Target","TrendingUp","Scale","Shield","Briefcase","GraduationCap",
  "Mail","Phone","MapPin","Clock","ArrowRight","Send","CheckCircle2","MessageSquare",
  "Home","FileCheck","FileText","HeartHandshake","Building","Search","Lock","Eye",
  "Database","Globe","ExternalLink","ChevronRight","Gavel","ClipboardList",
  "Heart","Star","Bookmark","Calendar","Camera","Coffee","Compass","CreditCard",
  "Download","Edit","FileQuestion","Flag","Folder","Gift","HandCoins","Handshake",
  "HelpCircle","Info","Key","Landmark","Layers","Library","LifeBuoy","Lightbulb",
  "Link","List","Map","Megaphone","Menu","Monitor","Newspaper","Package","Pen",
  "PenTool","Percent","PersonStanding","PiggyBank","Pin","Printer","Receipt",
  "Rocket","Ruler","ScrollText","Settings","ShieldCheck","Sparkles","Stamp",
  "Swords","ThumbsUp","Timer","Trophy","Upload","UserCheck","Wallet","Wrench","Zap"
];

function getLucideOptions_() {
  var opts = [];
  for (var i = 0; i < LUCIDE_ICON_OPTIONS.length; i++) {
    opts.push({ name: LUCIDE_ICON_OPTIONS[i], value: LUCIDE_ICON_OPTIONS[i] });
  }
  return opts;
}

// ── API HELPER ───────────────────────────────────────────────────

function sbApi_(method, path, payload) {
  var url = API_BASE + path;
  var options = {
    method: method,
    headers: {
      "Authorization": MGMT_TOKEN,
      "Content-Type": "application/json"
    },
    muteHttpExceptions: true
  };
  if (payload) {
    options.payload = JSON.stringify(payload);
  }

  for (var attempt = 0; attempt < 8; attempt++) {
    var response = UrlFetchApp.fetch(url, options);
    var code = response.getResponseCode();

    if (code === 429) {
      var wait = Math.pow(2, attempt) * 1000 + Math.round(Math.random() * 500);
      Logger.log("  Rate limited (429), warte " + wait + "ms...");
      Utilities.sleep(wait);
      continue;
    }

    if (code >= 400) {
      throw new Error("API " + method + " " + path + " -> " + code + ": " + response.getContentText());
    }

    var text = response.getContentText();
    if (text && text.length > 0) {
      return JSON.parse(text);
    }
    return {};
  }
  throw new Error("Zu viele Retries: " + method + " " + path);
}

function wait_(ms) {
  Utilities.sleep(ms || 400);
}

// ── Schema Field Helpers ─────────────────────────────────────────

function textField_(pos, displayName) {
  var f = { type: "text", pos: pos };
  if (displayName) f.display_name = displayName;
  return f;
}

function textareaField_(pos, displayName) {
  var f = { type: "textarea", pos: pos };
  if (displayName) f.display_name = displayName;
  return f;
}

function imageField_(pos, displayName) {
  var f = { type: "image", pos: pos };
  if (displayName) f.display_name = displayName;
  return f;
}

function selectIconField_(pos, displayName) {
  return {
    type: "option",
    pos: pos,
    display_name: displayName || "Icon",
    source: "self",
    options: getLucideOptions_()
  };
}


// ═════════════════════════════════════════════════════════════════
// STEP 1: CLEAN ALL (Stories + Components loeschen)
// ═════════════════════════════════════════════════════════════════

function cleanAll_() {
  Logger.log("");
  Logger.log("=== STEP 1: Alle Stories und Components loeschen ===");
  Logger.log("");

  // Alle Stories loeschen
  try {
    var page = 1;
    var allStories = [];
    while (true) {
      var data = sbApi_("GET", "/stories?page=" + page + "&per_page=100");
      if (!data.stories || data.stories.length === 0) break;
      allStories = allStories.concat(data.stories);
      page++;
    }
    Logger.log("  Gefunden: " + allStories.length + " Stories zum Loeschen");
    for (var i = 0; i < allStories.length; i++) {
      Logger.log("  Loesche Story: " + allStories[i].full_slug + " (id: " + allStories[i].id + ")");
      sbApi_("DELETE", "/stories/" + allStories[i].id);
      wait_(300);
    }
  } catch (err) {
    Logger.log("  Stories Cleanup: " + err.message);
  }

  // Alle Components loeschen
  try {
    var compData = sbApi_("GET", "/components");
    var components = compData.components || [];
    Logger.log("  Gefunden: " + components.length + " Components");
    for (var j = 0; j < components.length; j++) {
      Logger.log("  Loesche Component: " + components[j].name + " (id: " + components[j].id + ")");
      try {
        sbApi_("DELETE", "/components/" + components[j].id);
        wait_(300);
      } catch (err2) {
        Logger.log("    Konnte " + components[j].name + " nicht loeschen: " + err2.message);
      }
    }
  } catch (err) {
    Logger.log("  Components Cleanup: " + err.message);
  }

  Logger.log("  DONE: Cleanup abgeschlossen");
  Logger.log("");
}


// ═════════════════════════════════════════════════════════════════
// STEP 2: COMPONENT SCHEMAS ERSTELLEN
// ═════════════════════════════════════════════════════════════════

function buildSchemas_() {
  var p, i, s;

  // ─── PAGE_HOME ─────────────────────────────────────────────────
  var page_home = {};
  p = 0;
  // SEO
  page_home.seo_title = textField_(p++, "SEO Title");
  page_home.seo_description = textareaField_(p++, "SEO Description");
  page_home.seo_keywords = textField_(p++, "SEO Keywords");
  // Hero
  page_home.hero_title = textField_(p++, "Hero Titel");
  page_home.hero_subtitle = textareaField_(p++, "Hero Untertitel");
  page_home.hero_cta_text = textField_(p++, "Hero CTA Text");
  page_home.hero_cta_link = textField_(p++, "Hero CTA Link");
  page_home.hero_image = imageField_(p++, "Hero Bild");
  // Stats
  page_home.stat_1_number = textField_(p++, "Statistik 1 Zahl");
  page_home.stat_1_label = textField_(p++, "Statistik 1 Label");
  page_home.stat_2_number = textField_(p++, "Statistik 2 Zahl");
  page_home.stat_2_label = textField_(p++, "Statistik 2 Label");
  page_home.stat_3_number = textField_(p++, "Statistik 3 Zahl");
  page_home.stat_3_label = textField_(p++, "Statistik 3 Label");
  // Process Steps
  for (i = 1; i <= 4; i++) {
    page_home["process_" + i + "_step"] = textField_(p++, "Prozess " + i + " Nummer");
    page_home["process_" + i + "_title"] = textField_(p++, "Prozess " + i + " Titel");
    page_home["process_" + i + "_desc"] = textField_(p++, "Prozess " + i + " Beschreibung");
  }
  // Expertise
  page_home.expertise_title = textField_(p++, "Expertise Titel");
  page_home.expertise_subtitle = textField_(p++, "Expertise Untertitel");
  for (i = 1; i <= 4; i++) {
    page_home["feature_" + i + "_title"] = textField_(p++, "Feature " + i + " Titel");
    page_home["feature_" + i + "_desc"] = textField_(p++, "Feature " + i + " Beschreibung");
    page_home["feature_" + i + "_icon"] = selectIconField_(p++, "Feature " + i + " Icon");
  }
  // Team Section
  page_home.team_section_title = textField_(p++, "Team Titel");
  page_home.team_section_subtitle = textareaField_(p++, "Team Untertitel");
  for (i = 1; i <= 5; i++) {
    page_home["team_" + i + "_name"] = textField_(p++, "Team " + i + " Name");
    page_home["team_" + i + "_role"] = textField_(p++, "Team " + i + " Rolle");
    page_home["team_" + i + "_since"] = textField_(p++, "Team " + i + " Seit");
  }
  page_home.team_image_1 = imageField_(p++, "Team Bild 1");
  page_home.team_image_2 = imageField_(p++, "Team Bild 2");
  page_home.team_image_3 = imageField_(p++, "Team Bild 3");
  page_home.team_image_4 = imageField_(p++, "Team Bild 4");
  // Why Section
  page_home.why_title = textField_(p++, "Warum-Titel");
  page_home.why_subtitle = textField_(p++, "Warum-Untertitel");
  for (i = 1; i <= 3; i++) {
    page_home["why_" + i + "_title"] = textField_(p++, "Warum " + i + " Titel");
    page_home["why_" + i + "_desc"] = textareaField_(p++, "Warum " + i + " Beschreibung");
    page_home["why_" + i + "_icon"] = selectIconField_(p++, "Warum " + i + " Icon");
  }
  // Location CTA
  page_home.location_badge = textField_(p++, "Standort Badge");
  page_home.location_title = textField_(p++, "Standort Titel");
  page_home.location_subtitle = textareaField_(p++, "Standort Untertitel");
  page_home.location_cta_text = textField_(p++, "Standort CTA Text");
  page_home.location_cta_link = textField_(p++, "Standort CTA Link");
  page_home.location_image = imageField_(p++, "Standort Bild");

  // ─── PAGE_ABOUT ────────────────────────────────────────────────
  var page_about = {};
  p = 0;
  page_about.seo_title = textField_(p++, "SEO Title");
  page_about.seo_description = textareaField_(p++, "SEO Description");
  page_about.seo_keywords = textField_(p++, "SEO Keywords");
  // Hero
  page_about.hero_badge = textField_(p++, "Hero Badge");
  page_about.hero_title_line1 = textField_(p++, "Hero Titel Zeile 1");
  page_about.hero_title_line2 = textField_(p++, "Hero Titel Zeile 2 (grau)");
  page_about.hero_description = textareaField_(p++, "Hero Beschreibung");
  page_about.hero_image = imageField_(p++, "Hero Bild");
  page_about.hero_stat_1_value = textField_(p++, "Hero Stat 1 Wert");
  page_about.hero_stat_1_label = textField_(p++, "Hero Stat 1 Label");
  page_about.hero_stat_2_value = textField_(p++, "Hero Stat 2 Wert");
  page_about.hero_stat_2_label = textField_(p++, "Hero Stat 2 Label");
  page_about.hero_stat_3_value = textField_(p++, "Hero Stat 3 Wert");
  page_about.hero_stat_3_label = textField_(p++, "Hero Stat 3 Label");
  // Timeline
  for (i = 1; i <= 3; i++) {
    page_about["timeline_" + i + "_year"] = textField_(p++, "Timeline " + i + " Jahr");
    page_about["timeline_" + i + "_title"] = textField_(p++, "Timeline " + i + " Titel");
    page_about["timeline_" + i + "_desc"] = textareaField_(p++, "Timeline " + i + " Beschreibung");
  }
  page_about.quote_text = textareaField_(p++, "Zitat Text");
  // Values
  for (i = 1; i <= 4; i++) {
    page_about["value_" + i + "_icon"] = selectIconField_(p++, "Wert " + i + " Icon");
    page_about["value_" + i + "_title"] = textField_(p++, "Wert " + i + " Titel");
    page_about["value_" + i + "_desc"] = textareaField_(p++, "Wert " + i + " Beschreibung");
  }
  // Team (5 members)
  page_about.team_badge = textField_(p++, "Team Badge");
  page_about.team_title = textField_(p++, "Team Titel");
  page_about.team_subtitle = textareaField_(p++, "Team Untertitel");
  for (i = 1; i <= 5; i++) {
    page_about["member_" + i + "_name"] = textField_(p++, "Mitglied " + i + " Name");
    page_about["member_" + i + "_title"] = textField_(p++, "Mitglied " + i + " Titel");
    page_about["member_" + i + "_role"] = textField_(p++, "Mitglied " + i + " Rolle");
    page_about["member_" + i + "_image"] = imageField_(p++, "Mitglied " + i + " Foto");
    page_about["member_" + i + "_description"] = textareaField_(p++, "Mitglied " + i + " Beschreibung");
    page_about["member_" + i + "_since"] = textField_(p++, "Mitglied " + i + " Seit");
    for (s = 1; s <= 6; s++) {
      page_about["member_" + i + "_spec_" + s] = textField_(p++, "Mitglied " + i + " Schwerpunkt " + s);
    }
  }
  // Sekretariat
  page_about.sekretariat_title = textField_(p++, "Sekretariat Titel");
  page_about.sekretariat_subtitle = textareaField_(p++, "Sekretariat Untertitel");
  for (i = 1; i <= 3; i++) {
    page_about["sekretariat_" + i + "_name"] = textField_(p++, "Sekretariat " + i + " Name");
    page_about["sekretariat_" + i + "_title"] = textField_(p++, "Sekretariat " + i + " Titel");
  }
  // CTA
  page_about.cta_title = textField_(p++, "CTA Titel");
  page_about.cta_description = textareaField_(p++, "CTA Beschreibung");
  page_about.cta_button_text = textField_(p++, "CTA Button Text");
  page_about.cta_phone = textField_(p++, "CTA Telefonnummer");

  // ─── PAGE_PRACTICE_AREAS ───────────────────────────────────────
  var page_practice_areas = {};
  p = 0;
  page_practice_areas.seo_title = textField_(p++, "SEO Title");
  page_practice_areas.seo_description = textareaField_(p++, "SEO Description");
  page_practice_areas.seo_keywords = textField_(p++, "SEO Keywords");
  page_practice_areas.hero_badge = textField_(p++, "Hero Badge");
  page_practice_areas.hero_title = textField_(p++, "Hero Titel");
  page_practice_areas.hero_subtitle = textareaField_(p++, "Hero Untertitel");
  // 9 Practice Areas
  for (i = 1; i <= 9; i++) {
    page_practice_areas["area_" + i + "_title"] = textField_(p++, "Bereich " + i + " Titel");
    page_practice_areas["area_" + i + "_desc"] = textareaField_(p++, "Bereich " + i + " Beschreibung");
    page_practice_areas["area_" + i + "_icon"] = selectIconField_(p++, "Bereich " + i + " Icon");
  }
  // Process
  page_practice_areas.process_badge = textField_(p++, "Prozess Badge");
  page_practice_areas.process_title = textField_(p++, "Prozess Titel");
  page_practice_areas.process_subtitle = textField_(p++, "Prozess Untertitel");
  for (i = 1; i <= 4; i++) {
    page_practice_areas["step_" + i + "_title"] = textField_(p++, "Schritt " + i + " Titel");
    page_practice_areas["step_" + i + "_desc"] = textField_(p++, "Schritt " + i + " Beschreibung");
    page_practice_areas["step_" + i + "_icon"] = selectIconField_(p++, "Schritt " + i + " Icon");
  }
  // Info Section
  page_practice_areas.info_title = textField_(p++, "Info Titel");
  page_practice_areas.info_para_1 = textareaField_(p++, "Info Absatz 1");
  page_practice_areas.info_para_2 = textareaField_(p++, "Info Absatz 2");
  page_practice_areas.info_cta_text = textField_(p++, "Info CTA Text");
  page_practice_areas.info_cta_link = textField_(p++, "Info CTA Link");
  // Partner
  page_practice_areas.partner_title = textField_(p++, "Partner Titel");
  page_practice_areas.partner_subtitle = textField_(p++, "Partner Untertitel");
  for (i = 1; i <= 3; i++) {
    page_practice_areas["partner_" + i + "_title"] = textField_(p++, "Partner " + i + " Titel");
    page_practice_areas["partner_" + i + "_desc"] = textareaField_(p++, "Partner " + i + " Beschreibung");
    page_practice_areas["partner_" + i + "_icon"] = selectIconField_(p++, "Partner " + i + " Icon");
  }

  // ─── PAGE_CONTACT ──────────────────────────────────────────────
  var page_contact = {};
  p = 0;
  page_contact.seo_title = textField_(p++, "SEO Title");
  page_contact.seo_description = textareaField_(p++, "SEO Description");
  page_contact.seo_keywords = textField_(p++, "SEO Keywords");
  page_contact.hero_badge = textField_(p++, "Hero Badge");
  page_contact.hero_title_line1 = textField_(p++, "Hero Titel Zeile 1");
  page_contact.hero_title_line2 = textField_(p++, "Hero Titel Zeile 2 (grau)");
  page_contact.hero_description = textareaField_(p++, "Hero Beschreibung");
  // Quick Contact
  page_contact.quick_phone_label = textField_(p++, "Quick Telefon Label");
  page_contact.quick_phone = textField_(p++, "Quick Telefonnummer");
  page_contact.quick_email_label = textField_(p++, "Quick Email Label");
  page_contact.quick_email = textField_(p++, "Quick Email");
  page_contact.quick_address_label = textField_(p++, "Quick Adresse Label");
  page_contact.quick_address = textField_(p++, "Quick Adresse");
  // Form
  page_contact.form_title = textField_(p++, "Formular Titel");
  page_contact.form_subtitle = textField_(p++, "Formular Untertitel");
  page_contact.form_success_title = textField_(p++, "Formular Erfolg Titel");
  page_contact.form_success_text = textField_(p++, "Formular Erfolg Text");
  page_contact.form_datenschutz_text = textField_(p++, "Formular Datenschutz Text");
  // Rechtsgebiet Options (comma-separated)
  page_contact.rechtsgebiet_options = textareaField_(p++, "Rechtsgebiet Optionen (komma-getrennt)");
  // Sidebar
  page_contact.hours_title = textField_(p++, "Oeffnungszeiten Titel");
  page_contact.hours_1_days = textField_(p++, "Oeffnungszeiten 1 Tage");
  page_contact.hours_1_time = textField_(p++, "Oeffnungszeiten 1 Zeit");
  page_contact.hours_2_days = textField_(p++, "Oeffnungszeiten 2 Tage");
  page_contact.hours_2_time = textField_(p++, "Oeffnungszeiten 2 Zeit");
  page_contact.hours_note = textField_(p++, "Oeffnungszeiten Hinweis");
  page_contact.contact_title = textField_(p++, "Kontakt Titel");
  page_contact.contact_phone = textField_(p++, "Kontakt Telefon");
  page_contact.contact_fax = textField_(p++, "Kontakt Fax");
  page_contact.contact_email = textField_(p++, "Kontakt Email");
  page_contact.trust_title = textField_(p++, "Vertrauen Titel");
  page_contact.trust_1 = textField_(p++, "Vertrauen 1");
  page_contact.trust_2 = textField_(p++, "Vertrauen 2");
  page_contact.trust_3 = textField_(p++, "Vertrauen 3");
  page_contact.trust_4 = textField_(p++, "Vertrauen 4");
  page_contact.address_title = textField_(p++, "Adresse Titel");
  page_contact.address_line1 = textField_(p++, "Adresse Zeile 1");
  page_contact.address_line2 = textField_(p++, "Adresse Zeile 2");
  page_contact.address_country = textField_(p++, "Adresse Land");
  page_contact.address_note = textareaField_(p++, "Adresse Hinweis");
  // Map
  page_contact.map_title = textField_(p++, "Karte Titel");
  page_contact.map_subtitle = textField_(p++, "Karte Untertitel");
  page_contact.map_embed_url = textareaField_(p++, "Karte Embed URL");
  // CTA
  page_contact.cta_title = textField_(p++, "CTA Titel");
  page_contact.cta_description = textareaField_(p++, "CTA Beschreibung");

  // ─── PAGE_IMPRESSUM ────────────────────────────────────────────
  var page_impressum = {};
  p = 0;
  page_impressum.seo_title = textField_(p++, "SEO Title");
  page_impressum.seo_description = textareaField_(p++, "SEO Description");
  page_impressum.hero_title = textField_(p++, "Hero Titel");
  page_impressum.hero_subtitle = textField_(p++, "Hero Untertitel");
  page_impressum.kanzlei_name = textField_(p++, "Kanzlei Name");
  page_impressum.kanzlei_desc = textField_(p++, "Kanzlei Beschreibung");
  page_impressum.address_line1 = textField_(p++, "Adresse Zeile 1");
  page_impressum.address_line2 = textField_(p++, "Adresse Zeile 2");
  page_impressum.phone = textField_(p++, "Telefon");
  page_impressum.fax = textField_(p++, "Fax");
  page_impressum.email = textField_(p++, "Email");
  for (i = 1; i <= 3; i++) {
    page_impressum["ra_" + i + "_name"] = textField_(p++, "RA " + i + " Name");
    page_impressum["ra_" + i + "_advm"] = textField_(p++, "RA " + i + " ADVM");
    page_impressum["ra_" + i + "_uid"] = textField_(p++, "RA " + i + " UID");
  }
  page_impressum.berufsbezeichnung = textField_(p++, "Berufsbezeichnung");
  page_impressum.kammer_name = textField_(p++, "Kammer Name");
  page_impressum.kammer_address = textField_(p++, "Kammer Adresse");
  page_impressum.kammer_url = textField_(p++, "Kammer URL");
  page_impressum.vorschrift_1 = textField_(p++, "Vorschrift 1");
  page_impressum.vorschrift_2 = textField_(p++, "Vorschrift 2");
  page_impressum.vorschrift_3 = textField_(p++, "Vorschrift 3");
  page_impressum.vorschrift_4 = textField_(p++, "Vorschrift 4");
  page_impressum.vorschriften_url = textField_(p++, "Vorschriften URL");
  page_impressum.haftung_inhalte_title = textField_(p++, "Haftung Inhalte Titel");
  page_impressum.haftung_inhalte_text = textareaField_(p++, "Haftung Inhalte Text");
  page_impressum.haftung_links_title = textField_(p++, "Haftung Links Titel");
  page_impressum.haftung_links_text = textareaField_(p++, "Haftung Links Text");
  page_impressum.urheberrecht_title = textField_(p++, "Urheberrecht Titel");
  page_impressum.urheberrecht_text = textareaField_(p++, "Urheberrecht Text");

  // ─── PAGE_DATENSCHUTZ ──────────────────────────────────────────
  var page_datenschutz = {};
  p = 0;
  page_datenschutz.seo_title = textField_(p++, "SEO Title");
  page_datenschutz.seo_description = textareaField_(p++, "SEO Description");
  page_datenschutz.hero_badge = textField_(p++, "Hero Badge");
  page_datenschutz.hero_title = textField_(p++, "Hero Titel");
  page_datenschutz.hero_subtitle = textField_(p++, "Hero Untertitel");
  page_datenschutz.datenschutz_text = textareaField_(p++, "Datenschutz Einleitung");
  page_datenschutz.verantwortlicher_name = textField_(p++, "Verantwortlicher Name");
  page_datenschutz.verantwortlicher_address1 = textField_(p++, "Verantwortlicher Adresse 1");
  page_datenschutz.verantwortlicher_address2 = textField_(p++, "Verantwortlicher Adresse 2");
  page_datenschutz.verantwortlicher_phone = textField_(p++, "Verantwortlicher Telefon");
  page_datenschutz.verantwortlicher_email = textField_(p++, "Verantwortlicher Email");
  page_datenschutz.cookies_text_1 = textareaField_(p++, "Cookies Text 1");
  page_datenschutz.cookies_text_2 = textareaField_(p++, "Cookies Text 2");
  page_datenschutz.cookies_text_3 = textareaField_(p++, "Cookies Text 3");
  page_datenschutz.google_maps_text_1 = textareaField_(p++, "Google Maps Text 1");
  page_datenschutz.google_maps_text_2 = textareaField_(p++, "Google Maps Text 2");
  page_datenschutz.google_maps_text_3 = textareaField_(p++, "Google Maps Text 3");
  page_datenschutz.google_maps_link = textField_(p++, "Google Maps Datenschutz Link");
  page_datenschutz.kontaktaufnahme_text = textareaField_(p++, "Kontaktaufnahme Text");
  page_datenschutz.server_logs_intro = textareaField_(p++, "Server-Logs Einleitung");
  for (i = 1; i <= 6; i++) {
    page_datenschutz["server_log_" + i] = textField_(p++, "Server-Log Punkt " + i);
  }
  page_datenschutz.server_logs_outro = textareaField_(p++, "Server-Logs Schlusssatz");
  page_datenschutz.rechte_text = textareaField_(p++, "Ihre Rechte Text");
  page_datenschutz.rechte_behoerde_name = textField_(p++, "Datenschutzbehoerde Name");
  page_datenschutz.rechte_behoerde_address = textField_(p++, "Datenschutzbehoerde Adresse");
  page_datenschutz.rechte_behoerde_phone = textField_(p++, "Datenschutzbehoerde Telefon");
  page_datenschutz.rechte_behoerde_url = textField_(p++, "Datenschutzbehoerde URL");
  page_datenschutz.ssl_text = textareaField_(p++, "SSL Text");
  page_datenschutz.speicherdauer_text = textareaField_(p++, "Speicherdauer Text");
  page_datenschutz.weitergabe_intro = textareaField_(p++, "Weitergabe Einleitung");
  page_datenschutz.weitergabe_1 = textareaField_(p++, "Weitergabe Punkt 1");
  page_datenschutz.weitergabe_2 = textareaField_(p++, "Weitergabe Punkt 2");
  page_datenschutz.weitergabe_3 = textareaField_(p++, "Weitergabe Punkt 3");
  page_datenschutz.weitergabe_4 = textareaField_(p++, "Weitergabe Punkt 4");
  page_datenschutz.footer_stand = textField_(p++, "Stand");
  page_datenschutz.footer_text = textareaField_(p++, "Fussnote Text");

  return {
    page_home: page_home,
    page_about: page_about,
    page_practice_areas: page_practice_areas,
    page_contact: page_contact,
    page_impressum: page_impressum,
    page_datenschutz: page_datenschutz
  };
}

function createComponents_() {
  Logger.log("");
  Logger.log("=== STEP 2: Component-Schemas erstellen ===");
  Logger.log("");

  var schemas = buildSchemas_();
  var displayNames = {
    page_home: "Startseite",
    page_about: "Ueber uns",
    page_practice_areas: "Rechtsgebiete",
    page_contact: "Kontakt",
    page_impressum: "Impressum",
    page_datenschutz: "Datenschutz"
  };

  var names = Object.keys(schemas);
  for (var idx = 0; idx < names.length; idx++) {
    var name = names[idx];
    var schema = schemas[name];
    var fieldCount = Object.keys(schema).length;
    Logger.log("  Erstelle Component: " + name + " (" + fieldCount + " Felder)");

    sbApi_("POST", "/components", {
      component: {
        name: name,
        display_name: displayNames[name] || name,
        schema: schema,
        is_root: true,
        is_nestable: false
      }
    });
    wait_(500);
  }

  Logger.log("  DONE: Components erstellt");
  Logger.log("");
}


// ═════════════════════════════════════════════════════════════════
// STEP 3: FOLDER + STORIES ERSTELLEN
// ═════════════════════════════════════════════════════════════════

function createFolderAndStories_() {
  Logger.log("");
  Logger.log("=== STEP 3: Folder und Stories erstellen ===");
  Logger.log("");

  // "pages" Folder erstellen
  var folderId = 0;
  try {
    var folderRes = sbApi_("POST", "/stories", {
      story: { name: "Pages", slug: "pages", is_folder: true, default_root: "page_home" }
    });
    folderId = folderRes.story ? folderRes.story.id : 0;
    Logger.log("  Folder 'pages' erstellt (id: " + folderId + ")");
  } catch (err) {
    Logger.log("  Folder-Erstellung: " + err.message);
  }
  wait_(500);

  // Stories erstellen
  var pages = [
    { slug: "home",            name: "Startseite",    component: "page_home" },
    { slug: "about",           name: "Ueber uns",     component: "page_about" },
    { slug: "practice-areas",  name: "Rechtsgebiete", component: "page_practice_areas" },
    { slug: "contact",         name: "Kontakt",       component: "page_contact" },
    { slug: "impressum",       name: "Impressum",     component: "page_impressum" },
    { slug: "datenschutz",     name: "Datenschutz",   component: "page_datenschutz" }
  ];

  var storyIds = {};
  for (var i = 0; i < pages.length; i++) {
    var pg = pages[i];
    Logger.log("  Erstelle Story: pages/" + pg.slug);
    try {
      var storyRes = sbApi_("POST", "/stories", {
        story: {
          name: pg.name,
          slug: pg.slug,
          parent_id: folderId || 0,
          content: { component: pg.component }
        }
      });
      storyIds[pg.slug] = storyRes.story ? storyRes.story.id : 0;
      Logger.log("    -> id: " + storyIds[pg.slug]);
    } catch (err) {
      Logger.log("    Fehler: " + err.message);
    }
    wait_(400);
  }

  Logger.log("  DONE: Stories erstellt");
  Logger.log("");
  return storyIds;
}


// ═════════════════════════════════════════════════════════════════
// STEP 4: CONTENT BEFUELLEN + PUBLIZIEREN
// ═════════════════════════════════════════════════════════════════

function getSeedData_() {
  return {

    home: {
      component: "page_home",
      seo_title: "Rechtsanwalt Innsbruck | Girardi & Auer | Seit 1989",
      seo_description: "Erfahrene Rechtsanwaelte in Innsbruck seit 1989. Spezialisiert auf Liegenschaftsrecht, Baurecht, Vertragsrecht & mehr. Persoenliche Betreuung. Jetzt Termin vereinbaren!",
      seo_keywords: "Rechtsanwalt Innsbruck, Anwalt Tirol, Rechtsberatung Innsbruck",
      hero_title: "Ihre Rechtsanwaelte in Innsbruck",
      hero_subtitle: "Seit 1989 vertreten wir Ihre Interessen mit Kompetenz, Erfahrung und persoenlichem Engagement. Vertrauen Sie auf unsere Expertise in allen Rechtsfragen.",
      hero_cta_text: "Beratungstermin vereinbaren",
      hero_cta_link: "/kontakt",
      stat_1_number: "35+", stat_1_label: "Jahre Erfahrung",
      stat_2_number: "9", stat_2_label: "Rechtsgebiete",
      stat_3_number: "5", stat_3_label: "Experten",
      process_1_step: "01", process_1_title: "Erstgespraech", process_1_desc: "Kostenlose Erstberatung zu Ihrem Anliegen",
      process_2_step: "02", process_2_title: "Analyse", process_2_desc: "Sorgfaeltige Pruefung Ihrer rechtlichen Situation",
      process_3_step: "03", process_3_title: "Strategie", process_3_desc: "Massgeschneiderte Vorgehensweise fuer Sie",
      process_4_step: "04", process_4_title: "Umsetzung", process_4_desc: "Engagierte Vertretung bis zum Ergebnis",
      expertise_title: "Unsere Expertise",
      expertise_subtitle: "Umfassende Rechtsberatung in allen relevanten Bereichen",
      feature_1_title: "Liegenschaftsrecht", feature_1_desc: "Baurecht, Kauf- und Mietvertraege", feature_1_icon: "Home",
      feature_2_title: "Familienrecht", feature_2_desc: "Ehe, Scheidung, Obsorge & Unterhalt", feature_2_icon: "HeartHandshake",
      feature_3_title: "Erbrecht", feature_3_desc: "Verlassenschaft & Testamente", feature_3_icon: "Users",
      feature_4_title: "Unternehmensrecht", feature_4_desc: "Gruendung & Gesellschaftsvertraege", feature_4_icon: "Building",
      team_section_title: "Unser Team",
      team_section_subtitle: "Erfahrene Rechtsanwaelte mit Engagement und Fachkompetenz",
      team_1_name: "Dr. Thomas Girardi", team_1_role: "Rechtsanwalt - Kanzleigruender", team_1_since: "Seit 1989",
      team_2_name: "DI (FH) Mag. Bernd Auer", team_2_role: "Rechtsanwalt - Regiepartner", team_2_since: "Seit 2010",
      team_3_name: "Mag. Anna Girardi", team_3_role: "Rechtsanwaeltin - Regiepartnerin", team_3_since: "Seit 2025",
      team_4_name: "Mag. B.A. Constanze Girardi", team_4_role: "Rechtsanwaltsanwaerterin", team_4_since: "",
      team_5_name: "Monika Girardi", team_5_role: "Kanzleiassistenz", team_5_since: "Seit 1989",
      why_title: "Warum Girardi & Auer?",
      why_subtitle: "Was uns seit ueber 35 Jahren auszeichnet",
      why_1_title: "Langjaehrige Erfahrung", why_1_desc: "Seit 1989 betreuen wir erfolgreich Privatpersonen und Unternehmen in Tirol und darueber hinaus.", why_1_icon: "Award",
      why_2_title: "Persoenliche Betreuung", why_2_desc: "Ihre Anliegen erhalten stets die volle persoenliche Aufmerksamkeit unseres erfahrenen Teams.", why_2_icon: "Users",
      why_3_title: "Umfassende Expertise", why_3_desc: "Neun Rechtsgebiete und fundierte Ausbildung fuer kompetente und zuverlaessige Beratung.", why_3_icon: "Scale",
      location_badge: "Innsbruck Zentrum",
      location_title: "Brauchen Sie rechtliche Beratung?",
      location_subtitle: "Vereinbaren Sie noch heute einen Termin fuer ein unverbindliches Erstgespraech.",
      location_cta_text: "Jetzt Kontakt aufnehmen",
      location_cta_link: "/kontakt"
    },

    about: {
      component: "page_about",
      seo_title: "Ueber uns - Erfahrene Rechtsanwaelte seit 1989 | Girardi & Auer",
      seo_description: "Lernen Sie das Team der Kanzlei Girardi & Auer kennen. Dr. Thomas Girardi, Mag. Bernd Auer & Mag. Anna Girardi - Ihre Rechtsanwaelte in Innsbruck seit 1989.",
      seo_keywords: "Rechtsanwalt Team Innsbruck, Dr. Thomas Girardi, Bernd Auer, Anna Girardi",
      hero_badge: "Seit 1989 in Innsbruck",
      hero_title_line1: "Tradition trifft",
      hero_title_line2: "Kompetenz",
      hero_description: "Drei Generationen rechtlicher Expertise unter einem Dach. Wir verbinden langjaehrige Erfahrung mit modernem Denken fuer die beste Loesung Ihrer rechtlichen Anliegen.",
      hero_stat_1_value: "35+", hero_stat_1_label: "Jahre Erfahrung",
      hero_stat_2_value: "9", hero_stat_2_label: "Rechtsgebiete",
      hero_stat_3_value: "3", hero_stat_3_label: "Rechtsanwaelte",
      timeline_1_year: "1989", timeline_1_title: "Die Gruendung", timeline_1_desc: "RA Dr. Thomas Girardi gruendet nach seiner Ausbildung bei einem renommierten Wirtschaftsanwalt seine eigene Rechtsanwaltskanzlei in Innsbruck.",
      timeline_2_year: "2010", timeline_2_title: "Erster Regiepartner", timeline_2_desc: "RA DI (FH) Mag. Bernd Auer tritt nach seiner Ausbildung bei RA Dr. Thomas Girardi als Regiepartner in die Kanzlei ein.",
      timeline_3_year: "2025", timeline_3_title: "Die naechste Generation", timeline_3_desc: "RA Mag. Anna Girardi tritt nach ihrer Ausbildung in der Kanzlei Girardi & Auer ebenfalls als Regiepartnerin ein.",
      quote_text: "Besonderen Wert legt die Kanzlei auf eine allumfassende Rechtsberatung und den persoenlichen Kontakt zu ihren Klienten.",
      value_1_icon: "Award", value_1_title: "Expertise", value_1_desc: "Die Kanzlei betreut klein- und mittelstaendische Unternehmen sowie Privatpersonen in allen Belangen des Wirtschafts- und Zivilrechts.",
      value_2_icon: "Target", value_2_title: "Qualitaet", value_2_desc: "Unsere langjaehrige Erfahrung und fundierte Ausbildung ermoeglichen es uns, auch komplexe rechtliche Sachverhalte kompetent zu bearbeiten.",
      value_3_icon: "Users", value_3_title: "Persoenlich", value_3_desc: "Zuverlaessig, sachlich und souveraen - unsere Mandanten und ihre Faelle erhalten stets die volle persoenliche Aufmerksamkeit unseres Teams.",
      value_4_icon: "TrendingUp", value_4_title: "Massgeschneidert", value_4_desc: "Wir setzen auf eine enge Zusammenarbeit und entwickeln gemeinsam massgeschneiderte Loesungen fuer jede individuelle Situation.",
      team_badge: "Unser Team",
      team_title: "Die Menschen hinter der Kanzlei",
      team_subtitle: "Lernen Sie die Menschen kennen, die sich mit Leidenschaft und Expertise fuer Ihre rechtlichen Anliegen einsetzen.",
      member_1_name: "Dr. Thomas Girardi", member_1_title: "Rechtsanwalt", member_1_role: "Kanzleigruender", member_1_description: "Dr. Thomas Girardi ist seit 1988 als Rechtsanwalt eingetragen und auf Wirtschaftsrecht mit Schwerpunkt Immobilien-, Vertrags-, Bau-, Miet- und Erbrecht spezialisiert.", member_1_since: "Seit 1989",
      member_1_spec_1: "Wirtschaftsrecht", member_1_spec_2: "Immobilienrecht", member_1_spec_3: "Vertragsrecht", member_1_spec_4: "Baurecht", member_1_spec_5: "Miet- und Erbrecht", member_1_spec_6: "",
      member_2_name: "DI (FH) Mag. Bernd Auer", member_2_title: "Rechtsanwalt", member_2_role: "Regiepartner", member_2_description: "Mag. Bernd Auer ist seit 2010 selbstaendiger Rechtsanwalt und Regiepartner der Kanzleigemeinschaft. Seine Fachgebiete umfassen insbesondere Familien-, Schadenersatz-, Versicherungs-, Erb- und Vertragsrecht.", member_2_since: "Seit 2010",
      member_2_spec_1: "Familienrecht", member_2_spec_2: "Schadenersatzrecht", member_2_spec_3: "Versicherungsrecht", member_2_spec_4: "Erbrecht", member_2_spec_5: "Vertragsrecht", member_2_spec_6: "",
      member_3_name: "Mag. Anna Girardi", member_3_title: "Rechtsanwaeltin", member_3_role: "Regiepartnerin", member_3_description: "Mag. Anna Girardi ist seit April 2025 als selbststaendige Rechtsanwaeltin eingetragen und Regiepartnerin der Kanzleigemeinschaft. Zudem ist sie ausgebildete Mediatorin, Konflikt-Coach und systemischer Coach.", member_3_since: "Seit 2025",
      member_3_spec_1: "Familienrecht", member_3_spec_2: "Mietrecht", member_3_spec_3: "Mediation", member_3_spec_4: "Konflikt-Coaching", member_3_spec_5: "", member_3_spec_6: "",
      member_4_name: "Mag. B.A. Constanze Girardi", member_4_title: "Rechtsanwaltsanwaerterin", member_4_role: "Team", member_4_description: "Constanze Girardi ist als Rechtsanwaltsanwaerterin Teil unseres Teams und unterstuetzt die Kanzlei in allen rechtlichen Belangen.", member_4_since: "Team",
      member_4_spec_1: "", member_4_spec_2: "", member_4_spec_3: "", member_4_spec_4: "", member_4_spec_5: "", member_4_spec_6: "",
      member_5_name: "Monika Girardi", member_5_title: "Kanzleiassistenz", member_5_role: "Team", member_5_description: "Monika Girardi ist seit 1989 als Kanzleiassistenz taetig und die erste Ansprechpartnerin fuer unsere Klienten.", member_5_since: "Seit 1989",
      member_5_spec_1: "", member_5_spec_2: "", member_5_spec_3: "", member_5_spec_4: "", member_5_spec_5: "", member_5_spec_6: "",
      sekretariat_title: "Gemeinsam stark fuer Sie",
      sekretariat_subtitle: "Unser Sekretariat sorgt dafuer, dass alles reibungslos ablaeuft. Sie sind Ihre ersten Ansprechpartner bei Terminvereinbarungen und organisatorischen Fragen.",
      sekretariat_1_name: "Doris Blahut", sekretariat_1_title: "Kanzleiassistenz",
      sekretariat_2_name: "Iva Federfova", sekretariat_2_title: "Kanzleiassistenz",
      sekretariat_3_name: "Carina Schuler", sekretariat_3_title: "Kanzleiassistenz",
      cta_title: "Bereit fuer ein Gespraech?",
      cta_description: "Vereinbaren Sie ein unverbindliches Erstgespraech und lernen Sie uns persoenlich kennen. Wir freuen uns auf Sie.",
      cta_button_text: "Kontakt aufnehmen",
      cta_phone: "+43 512 574095"
    },

    "practice-areas": {
      component: "page_practice_areas",
      seo_title: "Rechtsgebiete - Liegenschaftsrecht, Familienrecht & mehr | Girardi & Auer",
      seo_description: "9 Rechtsgebiete mit Expertise: Liegenschaftsrecht, Baurecht, Familienrecht, Erbrecht, Unternehmensrecht, Schadenersatz & mehr. Erfahrene Anwaelte in Innsbruck",
      seo_keywords: "Liegenschaftsrecht Innsbruck, Familienrecht Tirol, Erbrecht, Baurecht",
      hero_badge: "Unsere Expertise",
      hero_title: "Taetigkeitsbereiche",
      hero_subtitle: "Die Rechtsanwaltskanzlei \"Girardi & Auer\" betreut klein- und mittelstaendische Unternehmen sowie Privatpersonen vor allem in folgenden Rechtsgebieten:",
      area_1_title: "Liegenschaftsrecht", area_1_desc: "Insbesondere Baurecht sowie Kauf-, Uebergabe-, Bautraeger- und Mietvertraege", area_1_icon: "Home",
      area_2_title: "Vergaberecht", area_2_desc: "Beratung und Vertretung in allen Belangen des Vergaberechts", area_2_icon: "FileCheck",
      area_3_title: "Schadenersatzrecht", area_3_desc: "sowie Gewaehrleistungsrecht", area_3_icon: "FileText",
      area_4_title: "Ehe- und Scheidungsrecht", area_4_desc: "sowie Obsorge, Kontakt- und Unterhaltsrecht", area_4_icon: "HeartHandshake",
      area_5_title: "Erbrecht", area_5_desc: "Vertretung im Verlassenschaftsverfahren und Erstellung von letztwilligen Verfuegungen", area_5_icon: "Users",
      area_6_title: "Erwachsenenschutz", area_6_desc: "Erwachsenenvertretung und Beratung bei Vorsorgevollmachten", area_6_icon: "HeartHandshake",
      area_7_title: "Unternehmensgruendung", area_7_desc: "Beratung bei Gruendung und Erstellung von Gesellschaftsvertraegen", area_7_icon: "Building",
      area_8_title: "Inkassowesen und Forderungsbetreibung", area_8_desc: "Professionelle Durchsetzung Ihrer Ansprueche", area_8_icon: "TrendingUp",
      area_9_title: "Rechtsgutachten", area_9_desc: "Fundierte rechtliche Bewertungen und Einschaetzungen", area_9_icon: "Search",
      process_badge: "Unser Vorgehen",
      process_title: "So arbeiten wir mit Ihnen",
      process_subtitle: "Von der ersten Kontaktaufnahme bis zum erfolgreichen Abschluss",
      step_1_title: "Erstgespraech", step_1_desc: "Kostenlose und unverbindliche Erstberatung zu Ihrem Anliegen.", step_1_icon: "Phone",
      step_2_title: "Analyse", step_2_desc: "Sorgfaeltige Pruefung Ihrer Situation und der rechtlichen Lage.", step_2_icon: "ClipboardList",
      step_3_title: "Strategie", step_3_desc: "Entwicklung einer massgeschneiderten Vorgehensweise.", step_3_icon: "Target",
      step_4_title: "Umsetzung", step_4_desc: "Engagierte Vertretung Ihrer Interessen bis zum Ergebnis.", step_4_icon: "Gavel",
      info_title: "Umfassende rechtliche Beratung",
      info_para_1: "Unsere langjaehrige Erfahrung und fundierte Ausbildung ermoeglichen es uns, auch komplexe rechtliche Sachverhalte kompetent und zuverlaessig zu bearbeiten. Wir vertreten Ihre Interessen sowohl aussergerichtlich als auch vor Gericht.",
      info_para_2: "Sollten Sie Fragen zu einem Rechtsgebiet haben, das hier nicht aufgefuehrt ist, kontaktieren Sie uns gerne. Wir beraten Sie umfassend oder vermitteln Ihnen bei Bedarf qualifizierte Kollegen aus unserem Netzwerk.",
      info_cta_text: "Beratungstermin vereinbaren",
      info_cta_link: "/kontakt",
      partner_title: "Ihr verlaesslicher Partner",
      partner_subtitle: "Was Sie von unserer Kanzlei erwarten koennen",
      partner_1_title: "Fundierte Expertise", partner_1_desc: "Profundes rechtliches Fachwissen in allen relevanten Bereichen des Zivil- und Wirtschaftsrechts.", partner_1_icon: "FileCheck",
      partner_2_title: "Individuelle Betreuung", partner_2_desc: "Persoenlicher Ansprechpartner und massgeschneiderte Loesungen fuer Ihre spezifische Situation.", partner_2_icon: "Users",
      partner_3_title: "Engagierte Vertretung", partner_3_desc: "Leidenschaftlicher Einsatz fuer Ihre Rechte - aussergerichtlich und vor Gericht.", partner_3_icon: "Scale"
    },

    contact: {
      component: "page_contact",
      seo_title: "Kontakt - Rechtsberatung in Innsbruck | Girardi & Auer",
      seo_description: "Kontaktieren Sie Rechtsanwaltskanzlei Girardi & Auer. Stainerstrasse 2, 6020 Innsbruck. +43 512 574095. Jetzt Termin vereinbaren!",
      seo_keywords: "Rechtsanwalt Kontakt Innsbruck, Anwalt Termin Innsbruck",
      hero_badge: "Kontakt aufnehmen",
      hero_title_line1: "Lassen Sie uns",
      hero_title_line2: "sprechen",
      hero_description: "Wir freuen uns auf Ihre Anfrage und beraten Sie gerne persoenlich. Vereinbaren Sie noch heute einen Termin fuer ein unverbindliches Erstgespraech.",
      quick_phone_label: "Telefon", quick_phone: "+43 512 574095",
      quick_email_label: "E-Mail", quick_email: "info@girardi-auer.com",
      quick_address_label: "Adresse", quick_address: "Stainerstrasse 2, Innsbruck",
      form_title: "Nachricht senden",
      form_subtitle: "Wir antworten in der Regel innerhalb von 24 Stunden.",
      form_success_title: "Vielen Dank!",
      form_success_text: "Ihre Nachricht wurde erfolgreich gesendet. Wir melden uns in Kuerze bei Ihnen.",
      form_datenschutz_text: "Mit dem Absenden stimmen Sie unserer Datenschutzerklaerung zu.",
      rechtsgebiet_options: "Liegenschaftsrecht,Vergaberecht,Schadenersatzrecht,Ehe- und Scheidungsrecht,Erbrecht,Erwachsenenschutz,Unternehmensgruendung,Inkassowesen,Rechtsgutachten,Sonstiges",
      hours_title: "Oeffnungszeiten",
      hours_1_days: "Mo - Fr", hours_1_time: "08:00 - 12:00",
      hours_2_days: "Mo - Do", hours_2_time: "14:00 - 16:30",
      hours_note: "Termine ausserhalb der Oeffnungszeiten nach Vereinbarung",
      contact_title: "Direkt erreichen",
      contact_phone: "+43 512 574095", contact_fax: "+43 512 574097", contact_email: "info@girardi-auer.com",
      trust_title: "Ihre Vorteile",
      trust_1: "Unverbindliches Erstgespraech",
      trust_2: "Vertrauliche Beratung",
      trust_3: "Antwort innerhalb 24h",
      trust_4: "35+ Jahre Erfahrung",
      address_title: "Adresse",
      address_line1: "Stainerstrasse 2", address_line2: "6020 Innsbruck", address_country: "Oesterreich",
      address_note: "Parkmoeglichkeiten in umliegenden Parkhaeusern. Gut erreichbar mit oeffentlichen Verkehrsmitteln.",
      map_title: "Unser Standort",
      map_subtitle: "Zentral im Herzen von Innsbruck",
      map_embed_url: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2712.0!2d11.3894847!3d47.2666717!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x479d6bfb1e33fb15%3A0x1d6776d64f3b4acb!2sDr.%20Thomas%20Girardi!5e0!3m2!1sde!2sat!4v1710000000000!5m2!1sde!2sat",
      cta_title: "Bereit fuer ein persoenliches Gespraech?",
      cta_description: "Rufen Sie uns direkt an oder schreiben Sie uns - wir freuen uns darauf, Ihnen zu helfen."
    },

    impressum: {
      component: "page_impressum",
      seo_title: "Impressum | Rechtsanwaltskanzlei Girardi & Auer Innsbruck",
      seo_description: "Impressum der Rechtsanwaltskanzlei Girardi & Auer, Stainerstrasse 2, 6020 Innsbruck.",
      hero_title: "Impressum",
      hero_subtitle: "GIRARDI & AUER - Rechtsanwaelte in Regiegemeinschaft",
      kanzlei_name: "Girardi & Auer",
      kanzlei_desc: "Rechtsanwaelte in Regiegemeinschaft",
      address_line1: "Stainerstrasse 2", address_line2: "6020 Innsbruck",
      phone: "+43 (0)512 / 57 40 95", fax: "+43 (0)512 / 57 40 97", email: "info@girardi-auer.com",
      ra_1_name: "RA Dr. Thomas Girardi", ra_1_advm: "R802574", ra_1_uid: "ATU 31367703",
      ra_2_name: "RA DI (FH) Mag. Bernd Auer", ra_2_advm: "R808398", ra_2_uid: "",
      ra_3_name: "RA Mag. Anna Girardi", ra_3_advm: "R818867", ra_3_uid: "",
      berufsbezeichnung: "Rechtsanwalt (verliehen in Oesterreich)",
      kammer_name: "Rechtsanwaltskammer fuer Tirol",
      kammer_address: "Meraner Strasse 3, 6020 Innsbruck",
      kammer_url: "https://www.rechtsanwaelte-tirol.at",
      vorschrift_1: "Rechtsanwaltsordnung (RAO)",
      vorschrift_2: "Allgemeine Bedingungen fuer Rechtsanwaelte",
      vorschrift_3: "Standesregeln der Rechtsanwaelte",
      vorschrift_4: "Disziplinarstatut der Rechtsanwaltskammern",
      vorschriften_url: "https://www.rechtsanwaelte.at",
      haftung_inhalte_title: "Haftung fuer Inhalte",
      haftung_inhalte_text: "Die Inhalte unserer Seiten wurden mit groesster Sorgfalt erstellt. Fuer die Richtigkeit, Vollstaendigkeit und Aktualitaet der Inhalte koennen wir jedoch keine Gewaehr uebernehmen. Als Diensteanbieter sind wir gemaess Paragraph 7 Abs.1 TMG fuer eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich.",
      haftung_links_title: "Haftung fuer Links",
      haftung_links_text: "Trotz sorgfaeltiger inhaltlicher Kontrolle uebernehmen wir keine Haftung fuer die Inhalte externer Links. Fuer den Inhalt der verlinkten Seiten sind ausschliesslich deren Betreiber verantwortlich.",
      urheberrecht_title: "Urheberrecht",
      urheberrecht_text: "Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem oesterreichischen Urheberrecht. Die Vervielfaeltigung, Bearbeitung, Verbreitung und jede Art der Verwertung ausserhalb der Grenzen des Urheberrechtes beduerfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers."
    },

    datenschutz: {
      component: "page_datenschutz",
      seo_title: "Datenschutzerklaerung | Rechtsanwaltskanzlei Girardi & Auer",
      seo_description: "Datenschutzerklaerung der Rechtsanwaltskanzlei Girardi & Auer. Informationen zur Verarbeitung personenbezogener Daten gemaess DSGVO.",
      hero_badge: "DSGVO-konform",
      hero_title: "Datenschutzerklaerung",
      hero_subtitle: "Informationen zur Verarbeitung personenbezogener Daten",
      datenschutz_text: "Der Schutz Ihrer personenbezogenen Daten ist uns ein besonderes Anliegen. Wir verarbeiten Ihre Daten daher ausschliesslich auf Grundlage der gesetzlichen Bestimmungen (DSGVO, TKG 2003). In dieser Datenschutzerklaerung informieren wir Sie ueber die wichtigsten Aspekte der Datenverarbeitung im Rahmen unserer Website.",
      verantwortlicher_name: "Rechtsanwaltskanzlei Girardi & Auer",
      verantwortlicher_address1: "Stainerstrasse 2",
      verantwortlicher_address2: "6020 Innsbruck, Oesterreich",
      verantwortlicher_phone: "+43 (0)512 / 57 40 95",
      verantwortlicher_email: "info@girardi-auer.com",
      cookies_text_1: "Unsere Website verwendet sogenannte Cookies. Dabei handelt es sich um kleine Textdateien, die mit Hilfe des Browsers auf Ihrem Endgeraet abgelegt werden. Sie richten keinen Schaden an.",
      cookies_text_2: "Wir nutzen Cookies dazu, unser Angebot nutzerfreundlich zu gestalten. Einige Cookies bleiben auf Ihrem Endgeraet gespeichert, bis Sie diese loeschen.",
      cookies_text_3: "Wenn Sie dies nicht wuenschen, so koennen Sie Ihren Browser so einrichten, dass er Sie ueber das Setzen von Cookies informiert und Sie dies nur im Einzelfall erlauben. Bei der Deaktivierung von Cookies kann die Funktionalitaet unserer Website eingeschraenkt sein.",
      google_maps_text_1: "Diese Website nutzt ueber eine API den Kartendienst Google Maps. Anbieter ist die Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland.",
      google_maps_text_2: "Zur Nutzung der Funktionen von Google Maps ist es notwendig, Ihre IP-Adresse zu speichern. Diese Informationen werden in der Regel an einen Server von Google in den USA uebertragen und dort gespeichert.",
      google_maps_text_3: "Die Nutzung von Google Maps erfolgt im Interesse einer ansprechenden Darstellung unserer Online-Angebote. Dies stellt ein berechtigtes Interesse im Sinne von Art. 6 Abs. 1 lit. f DSGVO dar.",
      google_maps_link: "https://policies.google.com/privacy",
      kontaktaufnahme_text: "Wenn Sie per Formular auf der Website oder per E-Mail Kontakt mit uns aufnehmen, werden Ihre angegebenen Daten zwecks Bearbeitung der Anfrage und fuer den Fall von Anschlussfragen sechs Monate bei uns gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.",
      server_logs_intro: "Der Provider der Seiten erhebt und speichert automatisch Informationen in so genannten Server-Log-Dateien, die Ihr Browser automatisch an uns uebermittelt:",
      server_log_1: "Browsertyp und Browserversion",
      server_log_2: "Verwendetes Betriebssystem",
      server_log_3: "Referrer URL",
      server_log_4: "Hostname des zugreifenden Rechners",
      server_log_5: "Uhrzeit der Serveranfrage",
      server_log_6: "IP-Adresse",
      server_logs_outro: "Eine Zusammenfuehrung dieser Daten mit anderen Datenquellen wird nicht vorgenommen. Die Erfassung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO.",
      rechte_text: "Ihnen stehen grundsaetzlich die Rechte auf Auskunft, Berichtigung, Loeschung, Einschraenkung, Datenuebertragbarkeit, Widerruf und Widerspruch zu. Wenn Sie glauben, dass die Verarbeitung Ihrer Daten gegen das Datenschutzrecht verstoesst, koennen Sie sich bei der Aufsichtsbehoerde beschweren.",
      rechte_behoerde_name: "Oesterreichische Datenschutzbehoerde",
      rechte_behoerde_address: "Barichgasse 40-42, 1030 Wien",
      rechte_behoerde_phone: "+43 1 52 152-0",
      rechte_behoerde_url: "https://www.dsb.gv.at",
      ssl_text: "Diese Seite nutzt aus Sicherheitsgruenden und zum Schutz der Uebertragung vertraulicher Inhalte eine SSL- bzw. TLS-Verschluesselung. Eine verschluesselte Verbindung erkennen Sie daran, dass die Adresszeile des Browsers von http:// auf https:// wechselt und an dem Schloss-Symbol in Ihrer Browserzeile.",
      speicherdauer_text: "Wir speichern personenbezogene Daten nur so lange, wie dies fuer die Erfuellung des jeweiligen Zwecks erforderlich ist oder gesetzliche Aufbewahrungsfristen dies vorsehen. Nach Wegfall des jeweiligen Zwecks bzw. Ablauf der Fristen werden die entsprechenden Daten routinemaessig geloescht.",
      weitergabe_intro: "Eine Uebermittlung Ihrer persoenlichen Daten an Dritte zu anderen als den im Folgenden aufgefuehrten Zwecken findet nicht statt. Wir geben Ihre persoenlichen Daten nur an Dritte weiter, wenn:",
      weitergabe_1: "Sie Ihre nach Art. 6 Abs. 1 S. 1 lit. a DSGVO ausdrueckliche Einwilligung dazu erteilt haben",
      weitergabe_2: "die Weitergabe nach Art. 6 Abs. 1 S. 1 lit. f DSGVO zur Geltendmachung von Rechtsanspruechen erforderlich ist",
      weitergabe_3: "fuer die Weitergabe nach Art. 6 Abs. 1 S. 1 lit. c DSGVO eine gesetzliche Verpflichtung besteht",
      weitergabe_4: "dies gesetzlich zulaessig und nach Art. 6 Abs. 1 S. 1 lit. b DSGVO fuer die Abwicklung von Vertragsverhaeltnissen erforderlich ist",
      footer_stand: "Maerz 2026",
      footer_text: "Wir behalten uns vor, diese Datenschutzerklaerung anzupassen, damit sie stets den aktuellen rechtlichen Anforderungen entspricht oder um Aenderungen unserer Leistungen in der Datenschutzerklaerung umzusetzen."
    }

  };
}

function populateStories_(storyIds) {
  Logger.log("");
  Logger.log("=== STEP 4: Stories mit Content befuellen ===");
  Logger.log("");

  var seedData = getSeedData_();
  var slugs = Object.keys(seedData);

  for (var idx = 0; idx < slugs.length; idx++) {
    var slug = slugs[idx];
    var content = seedData[slug];
    var storyId = storyIds[slug];

    if (!storyId) {
      Logger.log("  Ueberspringe " + slug + " (keine Story-ID)");
      continue;
    }

    var fieldCount = Object.keys(content).length;
    Logger.log("  Befuelle: pages/" + slug + " (" + fieldCount + " Felder)");

    try {
      // Aktuelle Story laden
      var current = sbApi_("GET", "/stories/" + storyId);
      wait_(300);

      // Content updaten + publizieren
      sbApi_("PUT", "/stories/" + storyId, {
        story: {
          name: current.story.name,
          slug: current.story.slug,
          content: content
        },
        publish: 1
      });
      Logger.log("    DONE: Publiziert");
    } catch (err) {
      Logger.log("    FEHLER: " + err.message);
    }
    wait_(400);
  }

  Logger.log("  DONE: Alle Stories befuellt");
  Logger.log("");
}


// ═════════════════════════════════════════════════════════════════
// HAUPTFUNKTION - Diese in GAS ausfuehren!
// ═════════════════════════════════════════════════════════════════

function runAll() {
  Logger.log("========================================================");
  Logger.log("  Storyblok Setup: Girardi & Auer");
  Logger.log("  Space: " + SPACE_ID);
  Logger.log("========================================================");

  if (MGMT_TOKEN === "DEIN_MANAGEMENT_TOKEN_HIER") {
    Logger.log("");
    Logger.log("FEHLER: Bitte MGMT_TOKEN oben im Script eintragen!");
    Logger.log("Den Management Token findest du in Storyblok unter:");
    Logger.log("  Settings > Access Tokens > Management Token");
    Logger.log("");
    return;
  }

  // Step 1: Clean
  cleanAll_();

  // Step 2: Create Components
  createComponents_();

  // Step 3: Create Folder + Stories
  var storyIds = createFolderAndStories_();

  // Step 4: Populate Content
  populateStories_(storyIds);

  Logger.log("========================================================");
  Logger.log("  FERTIG! Alle 6 Pages erstellt und publiziert.");
  Logger.log("");
  Logger.log("  Naechste Schritte:");
  Logger.log("  1. Storyblok oeffnen -> Content pruefen");
  Logger.log("  2. Website testen (Storyblok Content sollte laden)");
  Logger.log("  3. Bilder in Storyblok hochladen und zuweisen");
  Logger.log("========================================================");
}
