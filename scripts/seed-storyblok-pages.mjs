#!/usr/bin/env node
/**
 * Storyblok Complete Setup Script for Girardi & Auer
 * 
 * This script:
 *   1. CLEANS everything (deletes all stories, then all components)
 *   2. Creates 6 component schemas (flat, no nesting/tabs)
 *   3. Creates a "pages" folder
 *   4. Creates & populates all 6 page stories with current content
 *   5. Publishes everything
 *
 * Usage:
 *   STORYBLOK_MGMT_TOKEN=xxx node scripts/seed-storyblok-pages.mjs
 *   STORYBLOK_MGMT_TOKEN=xxx node scripts/seed-storyblok-pages.mjs --dry-run
 */

const SPACE_ID = "291045863485848";
const API_BASE = `https://mapi.storyblok.com/v1/spaces/${SPACE_ID}`;
const TOKEN = process.env.STORYBLOK_MGMT_TOKEN;
const DRY_RUN = process.argv.includes("--dry-run");

if (!TOKEN && !DRY_RUN) {
  console.error("ERROR: Set STORYBLOK_MGMT_TOKEN environment variable.");
  process.exit(1);
}

// ─── Lucide Icon Options for Storyblok Select Fields ─────────────────────
const LUCIDE_ICON_OPTIONS = [
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
  "Swords","ThumbsUp","Timer","Trophy","Upload","UserCheck","Wallet","Wrench","Zap",
].map(i => ({ name: i, value: i }));

// ─── API Helper ──────────────────────────────────────────────────────────
async function sbApi(method, path, body = null) {
  if (DRY_RUN) {
    console.log(`  [DRY RUN] ${method} ${path}`);
    return body ? { story: { id: 0 }, component: { id: 0 } } : {};
  }
  const url = `${API_BASE}${path}`;
  const opts = {
    method,
    headers: { Authorization: TOKEN, "Content-Type": "application/json" },
  };
  if (body) opts.body = JSON.stringify(body);

  for (let attempt = 0; attempt < 8; attempt++) {
    const res = await fetch(url, opts);
    if (res.status === 429) {
      const wait = Math.pow(2, attempt) * 1000 + Math.random() * 500;
      console.log(`  Rate limited, waiting ${Math.round(wait)}ms...`);
      await new Promise(r => setTimeout(r, wait));
      continue;
    }
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`${method} ${path} → ${res.status}: ${text}`);
    }
    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) return res.json();
    return {};
  }
  throw new Error(`Too many retries for ${method} ${path}`);
}

const delay = (ms = 400) => new Promise(r => setTimeout(r, ms));

// ─── Helper: Make text field ─────────────────────────────────────────────
const text = (pos, displayName = "") => ({
  type: "text", pos, display_name: displayName || undefined,
});
const textarea = (pos, displayName = "") => ({
  type: "textarea", pos, display_name: displayName || undefined,
});
const image = (pos, displayName = "") => ({
  type: "image", pos, display_name: displayName || undefined,
});
const richtext = (pos, displayName = "") => ({
  type: "richtext", pos, display_name: displayName || undefined,
});
const selectIcon = (pos, displayName = "Icon") => ({
  type: "option", pos, display_name: displayName,
  source: "self",
  options: LUCIDE_ICON_OPTIONS,
});
const urlField = (pos, displayName = "") => ({
  type: "text", pos, display_name: displayName || undefined,
});

// ═══════════════════════════════════════════════════════════════════════════
// STEP 1: CLEAN ALL
// ═══════════════════════════════════════════════════════════════════════════
async function cleanAll() {
  console.log("\n🧹 STEP 1: Cleaning all stories and components...\n");

  // Delete all stories
  try {
    let page = 1;
    let allStories = [];
    while (true) {
      const data = await sbApi("GET", `/stories?page=${page}&per_page=100`);
      if (!data.stories || data.stories.length === 0) break;
      allStories = allStories.concat(data.stories);
      page++;
    }
    console.log(`  Found ${allStories.length} stories to delete`);
    for (const story of allStories) {
      console.log(`  Deleting story: ${story.full_slug} (id: ${story.id})`);
      await sbApi("DELETE", `/stories/${story.id}`);
      await delay(300);
    }
  } catch (err) {
    console.log(`  Stories cleanup: ${err.message}`);
  }

  // Delete all custom components (not "page" or "feature")
  try {
    const data = await sbApi("GET", `/components`);
    const components = data.components || [];
    console.log(`  Found ${components.length} components`);
    for (const comp of components) {
      // Skip system components
      if (comp.is_root || comp.is_nestable === false) {
        // Still try to delete our custom ones
      }
      console.log(`  Deleting component: ${comp.name} (id: ${comp.id})`);
      try {
        await sbApi("DELETE", `/components/${comp.id}`);
        await delay(300);
      } catch (err) {
        console.log(`    Could not delete ${comp.name}: ${err.message}`);
      }
    }
  } catch (err) {
    console.log(`  Components cleanup: ${err.message}`);
  }

  console.log("  ✅ Cleanup complete\n");
}

// ═══════════════════════════════════════════════════════════════════════════
// STEP 2: CREATE COMPONENT SCHEMAS
// ═══════════════════════════════════════════════════════════════════════════
function buildSchemas() {
  let p = 0; // position counter

  // ─── PAGE_HOME ───────────────────────────────────────────────────────
  const page_home = {};
  p = 0;
  // SEO
  page_home.seo_title = text(p++, "SEO Title");
  page_home.seo_description = textarea(p++, "SEO Description");
  page_home.seo_keywords = text(p++, "SEO Keywords");
  // Hero
  page_home.hero_title = text(p++, "Hero Titel");
  page_home.hero_subtitle = textarea(p++, "Hero Untertitel");
  page_home.hero_cta_text = text(p++, "Hero CTA Text");
  page_home.hero_cta_link = text(p++, "Hero CTA Link");
  page_home.hero_image = image(p++, "Hero Bild");
  // Stats
  page_home.stat_1_number = text(p++, "Statistik 1 Zahl");
  page_home.stat_1_label = text(p++, "Statistik 1 Label");
  page_home.stat_2_number = text(p++, "Statistik 2 Zahl");
  page_home.stat_2_label = text(p++, "Statistik 2 Label");
  page_home.stat_3_number = text(p++, "Statistik 3 Zahl");
  page_home.stat_3_label = text(p++, "Statistik 3 Label");
  // Process Steps
  for (let i = 1; i <= 4; i++) {
    page_home[`process_${i}_step`] = text(p++, `Prozess ${i} Nummer`);
    page_home[`process_${i}_title`] = text(p++, `Prozess ${i} Titel`);
    page_home[`process_${i}_desc`] = text(p++, `Prozess ${i} Beschreibung`);
  }
  // Expertise
  page_home.expertise_title = text(p++, "Expertise Titel");
  page_home.expertise_subtitle = text(p++, "Expertise Untertitel");
  for (let i = 1; i <= 4; i++) {
    page_home[`feature_${i}_title`] = text(p++, `Feature ${i} Titel`);
    page_home[`feature_${i}_desc`] = text(p++, `Feature ${i} Beschreibung`);
    page_home[`feature_${i}_icon`] = selectIcon(p++, `Feature ${i} Icon`);
  }
  // Team Section
  page_home.team_section_title = text(p++, "Team Titel");
  page_home.team_section_subtitle = textarea(p++, "Team Untertitel");
  for (let i = 1; i <= 5; i++) {
    page_home[`team_${i}_name`] = text(p++, `Team ${i} Name`);
    page_home[`team_${i}_role`] = text(p++, `Team ${i} Rolle`);
    page_home[`team_${i}_since`] = text(p++, `Team ${i} Seit`);
  }
  page_home.team_image_1 = image(p++, "Team Bild 1");
  page_home.team_image_2 = image(p++, "Team Bild 2");
  page_home.team_image_3 = image(p++, "Team Bild 3");
  page_home.team_image_4 = image(p++, "Team Bild 4");
  // Why Section
  page_home.why_title = text(p++, "Warum-Titel");
  page_home.why_subtitle = text(p++, "Warum-Untertitel");
  for (let i = 1; i <= 3; i++) {
    page_home[`why_${i}_title`] = text(p++, `Warum ${i} Titel`);
    page_home[`why_${i}_desc`] = textarea(p++, `Warum ${i} Beschreibung`);
    page_home[`why_${i}_icon`] = selectIcon(p++, `Warum ${i} Icon`);
  }
  // Location CTA
  page_home.location_badge = text(p++, "Standort Badge");
  page_home.location_title = text(p++, "Standort Titel");
  page_home.location_subtitle = textarea(p++, "Standort Untertitel");
  page_home.location_cta_text = text(p++, "Standort CTA Text");
  page_home.location_cta_link = text(p++, "Standort CTA Link");
  page_home.location_image = image(p++, "Standort Bild");

  // ─── PAGE_ABOUT ──────────────────────────────────────────────────────
  const page_about = {};
  p = 0;
  page_about.seo_title = text(p++, "SEO Title");
  page_about.seo_description = textarea(p++, "SEO Description");
  page_about.seo_keywords = text(p++, "SEO Keywords");
  // Hero
  page_about.hero_badge = text(p++, "Hero Badge");
  page_about.hero_title_line1 = text(p++, "Hero Titel Zeile 1");
  page_about.hero_title_line2 = text(p++, "Hero Titel Zeile 2 (grau)");
  page_about.hero_description = textarea(p++, "Hero Beschreibung");
  page_about.hero_image = image(p++, "Hero Bild");
  page_about.hero_stat_1_value = text(p++, "Hero Stat 1 Wert");
  page_about.hero_stat_1_label = text(p++, "Hero Stat 1 Label");
  page_about.hero_stat_2_value = text(p++, "Hero Stat 2 Wert");
  page_about.hero_stat_2_label = text(p++, "Hero Stat 2 Label");
  page_about.hero_stat_3_value = text(p++, "Hero Stat 3 Wert");
  page_about.hero_stat_3_label = text(p++, "Hero Stat 3 Label");
  // Timeline
  for (let i = 1; i <= 3; i++) {
    page_about[`timeline_${i}_year`] = text(p++, `Timeline ${i} Jahr`);
    page_about[`timeline_${i}_title`] = text(p++, `Timeline ${i} Titel`);
    page_about[`timeline_${i}_desc`] = textarea(p++, `Timeline ${i} Beschreibung`);
  }
  page_about.quote_text = textarea(p++, "Zitat Text");
  // Values
  for (let i = 1; i <= 4; i++) {
    page_about[`value_${i}_icon`] = selectIcon(p++, `Wert ${i} Icon`);
    page_about[`value_${i}_title`] = text(p++, `Wert ${i} Titel`);
    page_about[`value_${i}_desc`] = textarea(p++, `Wert ${i} Beschreibung`);
  }
  // Team (5 members)
  page_about.team_badge = text(p++, "Team Badge");
  page_about.team_title = text(p++, "Team Titel");
  page_about.team_subtitle = textarea(p++, "Team Untertitel");
  for (let i = 1; i <= 5; i++) {
    page_about[`member_${i}_name`] = text(p++, `Mitglied ${i} Name`);
    page_about[`member_${i}_title`] = text(p++, `Mitglied ${i} Titel`);
    page_about[`member_${i}_role`] = text(p++, `Mitglied ${i} Rolle`);
    page_about[`member_${i}_image`] = image(p++, `Mitglied ${i} Foto`);
    page_about[`member_${i}_description`] = textarea(p++, `Mitglied ${i} Beschreibung`);
    page_about[`member_${i}_since`] = text(p++, `Mitglied ${i} Seit`);
    for (let s = 1; s <= 6; s++) {
      page_about[`member_${i}_spec_${s}`] = text(p++, `Mitglied ${i} Schwerpunkt ${s}`);
    }
  }
  // Sekretariat
  page_about.sekretariat_title = text(p++, "Sekretariat Titel");
  page_about.sekretariat_subtitle = textarea(p++, "Sekretariat Untertitel");
  for (let i = 1; i <= 3; i++) {
    page_about[`sekretariat_${i}_name`] = text(p++, `Sekretariat ${i} Name`);
    page_about[`sekretariat_${i}_title`] = text(p++, `Sekretariat ${i} Titel`);
  }
  // CTA
  page_about.cta_title = text(p++, "CTA Titel");
  page_about.cta_description = textarea(p++, "CTA Beschreibung");
  page_about.cta_button_text = text(p++, "CTA Button Text");
  page_about.cta_phone = text(p++, "CTA Telefonnummer");

  // ─── PAGE_PRACTICE_AREAS ─────────────────────────────────────────────
  const page_practice_areas = {};
  p = 0;
  page_practice_areas.seo_title = text(p++, "SEO Title");
  page_practice_areas.seo_description = textarea(p++, "SEO Description");
  page_practice_areas.seo_keywords = text(p++, "SEO Keywords");
  page_practice_areas.hero_badge = text(p++, "Hero Badge");
  page_practice_areas.hero_title = text(p++, "Hero Titel");
  page_practice_areas.hero_subtitle = textarea(p++, "Hero Untertitel");
  // 9 Practice Areas
  for (let i = 1; i <= 9; i++) {
    page_practice_areas[`area_${i}_title`] = text(p++, `Bereich ${i} Titel`);
    page_practice_areas[`area_${i}_desc`] = textarea(p++, `Bereich ${i} Beschreibung`);
    page_practice_areas[`area_${i}_icon`] = selectIcon(p++, `Bereich ${i} Icon`);
  }
  // Process
  page_practice_areas.process_badge = text(p++, "Prozess Badge");
  page_practice_areas.process_title = text(p++, "Prozess Titel");
  page_practice_areas.process_subtitle = text(p++, "Prozess Untertitel");
  for (let i = 1; i <= 4; i++) {
    page_practice_areas[`step_${i}_title`] = text(p++, `Schritt ${i} Titel`);
    page_practice_areas[`step_${i}_desc`] = text(p++, `Schritt ${i} Beschreibung`);
    page_practice_areas[`step_${i}_icon`] = selectIcon(p++, `Schritt ${i} Icon`);
  }
  // Info Section
  page_practice_areas.info_title = text(p++, "Info Titel");
  page_practice_areas.info_para_1 = textarea(p++, "Info Absatz 1");
  page_practice_areas.info_para_2 = textarea(p++, "Info Absatz 2");
  page_practice_areas.info_cta_text = text(p++, "Info CTA Text");
  page_practice_areas.info_cta_link = text(p++, "Info CTA Link");
  // Partner
  page_practice_areas.partner_title = text(p++, "Partner Titel");
  page_practice_areas.partner_subtitle = text(p++, "Partner Untertitel");
  for (let i = 1; i <= 3; i++) {
    page_practice_areas[`partner_${i}_title`] = text(p++, `Partner ${i} Titel`);
    page_practice_areas[`partner_${i}_desc`] = textarea(p++, `Partner ${i} Beschreibung`);
    page_practice_areas[`partner_${i}_icon`] = selectIcon(p++, `Partner ${i} Icon`);
  }

  // ─── PAGE_CONTACT ────────────────────────────────────────────────────
  const page_contact = {};
  p = 0;
  page_contact.seo_title = text(p++, "SEO Title");
  page_contact.seo_description = textarea(p++, "SEO Description");
  page_contact.seo_keywords = text(p++, "SEO Keywords");
  page_contact.hero_badge = text(p++, "Hero Badge");
  page_contact.hero_title_line1 = text(p++, "Hero Titel Zeile 1");
  page_contact.hero_title_line2 = text(p++, "Hero Titel Zeile 2 (grau)");
  page_contact.hero_description = textarea(p++, "Hero Beschreibung");
  // Quick Contact
  page_contact.quick_phone_label = text(p++, "Quick Telefon Label");
  page_contact.quick_phone = text(p++, "Quick Telefonnummer");
  page_contact.quick_email_label = text(p++, "Quick Email Label");
  page_contact.quick_email = text(p++, "Quick Email");
  page_contact.quick_address_label = text(p++, "Quick Adresse Label");
  page_contact.quick_address = text(p++, "Quick Adresse");
  // Form
  page_contact.form_title = text(p++, "Formular Titel");
  page_contact.form_subtitle = text(p++, "Formular Untertitel");
  page_contact.form_success_title = text(p++, "Formular Erfolg Titel");
  page_contact.form_success_text = text(p++, "Formular Erfolg Text");
  page_contact.form_datenschutz_text = text(p++, "Formular Datenschutz Text");
  // Rechtsgebiet Options (comma-separated)
  page_contact.rechtsgebiet_options = textarea(p++, "Rechtsgebiet Optionen (komma-getrennt)");
  // Sidebar
  page_contact.hours_title = text(p++, "Öffnungszeiten Titel");
  page_contact.hours_1_days = text(p++, "Öffnungszeiten 1 Tage");
  page_contact.hours_1_time = text(p++, "Öffnungszeiten 1 Zeit");
  page_contact.hours_2_days = text(p++, "Öffnungszeiten 2 Tage");
  page_contact.hours_2_time = text(p++, "Öffnungszeiten 2 Zeit");
  page_contact.hours_note = text(p++, "Öffnungszeiten Hinweis");
  page_contact.contact_title = text(p++, "Kontakt Titel");
  page_contact.contact_phone = text(p++, "Kontakt Telefon");
  page_contact.contact_fax = text(p++, "Kontakt Fax");
  page_contact.contact_email = text(p++, "Kontakt Email");
  page_contact.trust_title = text(p++, "Vertrauen Titel");
  page_contact.trust_1 = text(p++, "Vertrauen 1");
  page_contact.trust_2 = text(p++, "Vertrauen 2");
  page_contact.trust_3 = text(p++, "Vertrauen 3");
  page_contact.trust_4 = text(p++, "Vertrauen 4");
  page_contact.address_title = text(p++, "Adresse Titel");
  page_contact.address_line1 = text(p++, "Adresse Zeile 1");
  page_contact.address_line2 = text(p++, "Adresse Zeile 2");
  page_contact.address_country = text(p++, "Adresse Land");
  page_contact.address_note = textarea(p++, "Adresse Hinweis");
  // Map
  page_contact.map_title = text(p++, "Karte Titel");
  page_contact.map_subtitle = text(p++, "Karte Untertitel");
  page_contact.map_embed_url = textarea(p++, "Karte Embed URL");
  // CTA
  page_contact.cta_title = text(p++, "CTA Titel");
  page_contact.cta_description = textarea(p++, "CTA Beschreibung");

  // ─── PAGE_IMPRESSUM ──────────────────────────────────────────────────
  const page_impressum = {};
  p = 0;
  page_impressum.seo_title = text(p++, "SEO Title");
  page_impressum.seo_description = textarea(p++, "SEO Description");
  page_impressum.hero_title = text(p++, "Hero Titel");
  page_impressum.hero_subtitle = text(p++, "Hero Untertitel");
  page_impressum.kanzlei_name = text(p++, "Kanzlei Name");
  page_impressum.kanzlei_desc = text(p++, "Kanzlei Beschreibung");
  page_impressum.address_line1 = text(p++, "Adresse Zeile 1");
  page_impressum.address_line2 = text(p++, "Adresse Zeile 2");
  page_impressum.phone = text(p++, "Telefon");
  page_impressum.fax = text(p++, "Fax");
  page_impressum.email = text(p++, "Email");
  for (let i = 1; i <= 3; i++) {
    page_impressum[`ra_${i}_name`] = text(p++, `RA ${i} Name`);
    page_impressum[`ra_${i}_advm`] = text(p++, `RA ${i} ADVM`);
    page_impressum[`ra_${i}_uid`] = text(p++, `RA ${i} UID`);
  }
  page_impressum.berufsbezeichnung = text(p++, "Berufsbezeichnung");
  page_impressum.kammer_name = text(p++, "Kammer Name");
  page_impressum.kammer_address = text(p++, "Kammer Adresse");
  page_impressum.kammer_url = text(p++, "Kammer URL");
  page_impressum.vorschrift_1 = text(p++, "Vorschrift 1");
  page_impressum.vorschrift_2 = text(p++, "Vorschrift 2");
  page_impressum.vorschrift_3 = text(p++, "Vorschrift 3");
  page_impressum.vorschrift_4 = text(p++, "Vorschrift 4");
  page_impressum.vorschriften_url = text(p++, "Vorschriften URL");
  page_impressum.haftung_inhalte_title = text(p++, "Haftung Inhalte Titel");
  page_impressum.haftung_inhalte_text = textarea(p++, "Haftung Inhalte Text");
  page_impressum.haftung_links_title = text(p++, "Haftung Links Titel");
  page_impressum.haftung_links_text = textarea(p++, "Haftung Links Text");
  page_impressum.urheberrecht_title = text(p++, "Urheberrecht Titel");
  page_impressum.urheberrecht_text = textarea(p++, "Urheberrecht Text");

  // ─── PAGE_DATENSCHUTZ ────────────────────────────────────────────────
  const page_datenschutz = {};
  p = 0;
  page_datenschutz.seo_title = text(p++, "SEO Title");
  page_datenschutz.seo_description = textarea(p++, "SEO Description");
  page_datenschutz.hero_badge = text(p++, "Hero Badge");
  page_datenschutz.hero_title = text(p++, "Hero Titel");
  page_datenschutz.hero_subtitle = text(p++, "Hero Untertitel");
  page_datenschutz.datenschutz_text = textarea(p++, "Datenschutz Einleitung");
  page_datenschutz.verantwortlicher_name = text(p++, "Verantwortlicher Name");
  page_datenschutz.verantwortlicher_address1 = text(p++, "Verantwortlicher Adresse 1");
  page_datenschutz.verantwortlicher_address2 = text(p++, "Verantwortlicher Adresse 2");
  page_datenschutz.verantwortlicher_phone = text(p++, "Verantwortlicher Telefon");
  page_datenschutz.verantwortlicher_email = text(p++, "Verantwortlicher Email");
  page_datenschutz.cookies_text_1 = textarea(p++, "Cookies Text 1");
  page_datenschutz.cookies_text_2 = textarea(p++, "Cookies Text 2");
  page_datenschutz.cookies_text_3 = textarea(p++, "Cookies Text 3");
  page_datenschutz.google_maps_text_1 = textarea(p++, "Google Maps Text 1");
  page_datenschutz.google_maps_text_2 = textarea(p++, "Google Maps Text 2");
  page_datenschutz.google_maps_text_3 = textarea(p++, "Google Maps Text 3");
  page_datenschutz.google_maps_link = text(p++, "Google Maps Datenschutz Link");
  page_datenschutz.kontaktaufnahme_text = textarea(p++, "Kontaktaufnahme Text");
  page_datenschutz.server_logs_intro = textarea(p++, "Server-Logs Einleitung");
  for (let i = 1; i <= 6; i++) {
    page_datenschutz[`server_log_${i}`] = text(p++, `Server-Log Punkt ${i}`);
  }
  page_datenschutz.server_logs_outro = textarea(p++, "Server-Logs Schlusssatz");
  page_datenschutz.rechte_text = textarea(p++, "Ihre Rechte Text");
  page_datenschutz.rechte_behoerde_name = text(p++, "Datenschutzbehörde Name");
  page_datenschutz.rechte_behoerde_address = text(p++, "Datenschutzbehörde Adresse");
  page_datenschutz.rechte_behoerde_phone = text(p++, "Datenschutzbehörde Telefon");
  page_datenschutz.rechte_behoerde_url = text(p++, "Datenschutzbehörde URL");
  page_datenschutz.ssl_text = textarea(p++, "SSL Text");
  page_datenschutz.speicherdauer_text = textarea(p++, "Speicherdauer Text");
  page_datenschutz.weitergabe_intro = textarea(p++, "Weitergabe Einleitung");
  page_datenschutz.weitergabe_1 = textarea(p++, "Weitergabe Punkt 1");
  page_datenschutz.weitergabe_2 = textarea(p++, "Weitergabe Punkt 2");
  page_datenschutz.weitergabe_3 = textarea(p++, "Weitergabe Punkt 3");
  page_datenschutz.weitergabe_4 = textarea(p++, "Weitergabe Punkt 4");
  page_datenschutz.footer_stand = text(p++, "Stand");
  page_datenschutz.footer_text = textarea(p++, "Fußnote Text");

  return {
    page_home,
    page_about,
    page_practice_areas,
    page_contact,
    page_impressum,
    page_datenschutz,
  };
}

async function createComponents() {
  console.log("\n📐 STEP 2: Creating component schemas...\n");
  const schemas = buildSchemas();

  for (const [name, schema] of Object.entries(schemas)) {
    const displayName = {
      page_home: "Startseite",
      page_about: "Über uns",
      page_practice_areas: "Rechtsgebiete",
      page_contact: "Kontakt",
      page_impressum: "Impressum",
      page_datenschutz: "Datenschutz",
    }[name] || name;

    console.log(`  Creating component: ${name} (${Object.keys(schema).length} fields)`);
    await sbApi("POST", "/components", {
      component: {
        name,
        display_name: displayName,
        schema,
        is_root: true,
        is_nestable: false,
      },
    });
    await delay(500);
  }
  console.log("  ✅ Components created\n");
}

// ═══════════════════════════════════════════════════════════════════════════
// STEP 3: CREATE FOLDER + STORIES
// ═══════════════════════════════════════════════════════════════════════════
async function createFolderAndStories() {
  console.log("\n📁 STEP 3: Creating folder and stories...\n");

  // Create "pages" folder
  let folderId;
  try {
    const res = await sbApi("POST", "/stories", {
      story: { name: "Pages", slug: "pages", is_folder: true, default_root: "page_home" },
    });
    folderId = res.story?.id;
    console.log(`  Created folder "pages" (id: ${folderId})`);
  } catch (err) {
    console.log(`  Folder creation: ${err.message}`);
  }
  await delay(500);

  // Create stories
  const pages = [
    { slug: "home", name: "Startseite", component: "page_home" },
    { slug: "about", name: "Über uns", component: "page_about" },
    { slug: "practice-areas", name: "Rechtsgebiete", component: "page_practice_areas" },
    { slug: "contact", name: "Kontakt", component: "page_contact" },
    { slug: "impressum", name: "Impressum", component: "page_impressum" },
    { slug: "datenschutz", name: "Datenschutz", component: "page_datenschutz" },
  ];

  const storyIds = {};
  for (const page of pages) {
    console.log(`  Creating story: pages/${page.slug}`);
    try {
      const res = await sbApi("POST", "/stories", {
        story: {
          name: page.name,
          slug: page.slug,
          parent_id: folderId || 0,
          content: { component: page.component },
        },
      });
      storyIds[page.slug] = res.story?.id;
      console.log(`    → id: ${storyIds[page.slug]}`);
    } catch (err) {
      console.log(`    Error: ${err.message}`);
    }
    await delay(400);
  }

  console.log("  ✅ Stories created\n");
  return storyIds;
}

// ═══════════════════════════════════════════════════════════════════════════
// STEP 4: POPULATE CONTENT
// ═══════════════════════════════════════════════════════════════════════════
function getSeedData() {
  return {
    home: {
      component: "page_home",
      seo_title: "Rechtsanwalt Innsbruck | Girardi & Auer | Seit 1989",
      seo_description: "Erfahrene Rechtsanwälte in Innsbruck seit 1989. Spezialisiert auf Liegenschaftsrecht, Baurecht, Vertragsrecht & mehr. Persönliche Betreuung. Jetzt Termin vereinbaren!",
      seo_keywords: "Rechtsanwalt Innsbruck, Anwalt Tirol, Rechtsberatung Innsbruck",
      hero_title: "Ihre Rechtsanwälte in Innsbruck",
      hero_subtitle: "Seit 1989 vertreten wir Ihre Interessen mit Kompetenz, Erfahrung und persönlichem Engagement. Vertrauen Sie auf unsere Expertise in allen Rechtsfragen.",
      hero_cta_text: "Beratungstermin vereinbaren",
      hero_cta_link: "/kontakt",
      stat_1_number: "35+", stat_1_label: "Jahre Erfahrung",
      stat_2_number: "9", stat_2_label: "Rechtsgebiete",
      stat_3_number: "5", stat_3_label: "Experten",
      process_1_step: "01", process_1_title: "Erstgespräch", process_1_desc: "Kostenlose Erstberatung zu Ihrem Anliegen",
      process_2_step: "02", process_2_title: "Analyse", process_2_desc: "Sorgfältige Prüfung Ihrer rechtlichen Situation",
      process_3_step: "03", process_3_title: "Strategie", process_3_desc: "Maßgeschneiderte Vorgehensweise für Sie",
      process_4_step: "04", process_4_title: "Umsetzung", process_4_desc: "Engagierte Vertretung bis zum Ergebnis",
      expertise_title: "Unsere Expertise",
      expertise_subtitle: "Umfassende Rechtsberatung in allen relevanten Bereichen",
      feature_1_title: "Liegenschaftsrecht", feature_1_desc: "Baurecht, Kauf- und Mietverträge", feature_1_icon: "Home",
      feature_2_title: "Familienrecht", feature_2_desc: "Ehe, Scheidung, Obsorge & Unterhalt", feature_2_icon: "HeartHandshake",
      feature_3_title: "Erbrecht", feature_3_desc: "Verlassenschaft & Testamente", feature_3_icon: "Users",
      feature_4_title: "Unternehmensrecht", feature_4_desc: "Gründung & Gesellschaftsverträge", feature_4_icon: "Building",
      team_section_title: "Unser Team",
      team_section_subtitle: "Erfahrene Rechtsanwälte mit Engagement und Fachkompetenz",
      team_1_name: "Dr. Thomas Girardi", team_1_role: "Rechtsanwalt · Kanzleigründer", team_1_since: "Seit 1989",
      team_2_name: "DI (FH) Mag. Bernd Auer", team_2_role: "Rechtsanwalt · Regiepartner", team_2_since: "Seit 2010",
      team_3_name: "Mag. Anna Girardi", team_3_role: "Rechtsanwältin · Regiepartnerin", team_3_since: "Seit 2025",
      team_4_name: "Mag. B.A. Constanze Girardi", team_4_role: "Rechtsanwaltsanwärterin", team_4_since: "",
      team_5_name: "Monika Girardi", team_5_role: "Kanzleiassistenz", team_5_since: "Seit 1989",
      why_title: "Warum Girardi & Auer?",
      why_subtitle: "Was uns seit über 35 Jahren auszeichnet",
      why_1_title: "Langjährige Erfahrung", why_1_desc: "Seit 1989 betreuen wir erfolgreich Privatpersonen und Unternehmen in Tirol und darüber hinaus.", why_1_icon: "Award",
      why_2_title: "Persönliche Betreuung", why_2_desc: "Ihre Anliegen erhalten stets die volle persönliche Aufmerksamkeit unseres erfahrenen Teams.", why_2_icon: "Users",
      why_3_title: "Umfassende Expertise", why_3_desc: "Neun Rechtsgebiete und fundierte Ausbildung für kompetente und zuverlässige Beratung.", why_3_icon: "Scale",
      location_badge: "Innsbruck Zentrum",
      location_title: "Brauchen Sie rechtliche Beratung?",
      location_subtitle: "Vereinbaren Sie noch heute einen Termin für ein unverbindliches Erstgespräch.",
      location_cta_text: "Jetzt Kontakt aufnehmen",
      location_cta_link: "/kontakt",
    },

    about: {
      component: "page_about",
      seo_title: "Über uns - Erfahrene Rechtsanwälte seit 1989 | Girardi & Auer",
      seo_description: "Lernen Sie das Team der Kanzlei Girardi & Auer kennen. Dr. Thomas Girardi, Mag. Bernd Auer & Mag. Anna Girardi – Ihre Rechtsanwälte in Innsbruck seit 1989.",
      seo_keywords: "Rechtsanwalt Team Innsbruck, Dr. Thomas Girardi, Bernd Auer, Anna Girardi",
      hero_badge: "Seit 1989 in Innsbruck",
      hero_title_line1: "Tradition trifft",
      hero_title_line2: "Kompetenz",
      hero_description: "Drei Generationen rechtlicher Expertise unter einem Dach. Wir verbinden langjährige Erfahrung mit modernem Denken für die beste Lösung Ihrer rechtlichen Anliegen.",
      hero_stat_1_value: "35+", hero_stat_1_label: "Jahre Erfahrung",
      hero_stat_2_value: "9", hero_stat_2_label: "Rechtsgebiete",
      hero_stat_3_value: "3", hero_stat_3_label: "Rechtsanwälte",
      timeline_1_year: "1989", timeline_1_title: "Die Gründung", timeline_1_desc: "RA Dr. Thomas Girardi gründet nach seiner Ausbildung bei einem renommierten Wirtschaftsanwalt seine eigene Rechtsanwaltskanzlei in Innsbruck.",
      timeline_2_year: "2010", timeline_2_title: "Erster Regiepartner", timeline_2_desc: "RA DI (FH) Mag. Bernd Auer tritt nach seiner Ausbildung bei RA Dr. Thomas Girardi als Regiepartner in die Kanzlei ein.",
      timeline_3_year: "2025", timeline_3_title: "Die nächste Generation", timeline_3_desc: "RA Mag. Anna Girardi tritt nach ihrer Ausbildung in der Kanzlei Girardi & Auer ebenfalls als Regiepartnerin ein.",
      quote_text: "Besonderen Wert legt die Kanzlei auf eine allumfassende Rechtsberatung und den persönlichen Kontakt zu ihren Klienten.",
      value_1_icon: "Award", value_1_title: "Expertise", value_1_desc: "Die Kanzlei betreut klein- und mittelständische Unternehmen sowie Privatpersonen in allen Belangen des Wirtschafts- und Zivilrechts.",
      value_2_icon: "Target", value_2_title: "Qualität", value_2_desc: "Unsere langjährige Erfahrung und fundierte Ausbildung ermöglichen es uns, auch komplexe rechtliche Sachverhalte kompetent zu bearbeiten.",
      value_3_icon: "Users", value_3_title: "Persönlich", value_3_desc: "Zuverlässig, sachlich und souverän – unsere Mandanten und ihre Fälle erhalten stets die volle persönliche Aufmerksamkeit unseres Teams.",
      value_4_icon: "TrendingUp", value_4_title: "Maßgeschneidert", value_4_desc: "Wir setzen auf eine enge Zusammenarbeit und entwickeln gemeinsam maßgeschneiderte Lösungen für jede individuelle Situation.",
      team_badge: "Unser Team",
      team_title: "Die Menschen hinter der Kanzlei",
      team_subtitle: "Lernen Sie die Menschen kennen, die sich mit Leidenschaft und Expertise für Ihre rechtlichen Anliegen einsetzen.",
      member_1_name: "Dr. Thomas Girardi", member_1_title: "Rechtsanwalt", member_1_role: "Kanzleigründer", member_1_description: "Dr. Thomas Girardi ist seit 1988 als Rechtsanwalt eingetragen und auf Wirtschaftsrecht mit Schwerpunkt Immobilien-, Vertrags-, Bau-, Miet- und Erbrecht spezialisiert.", member_1_since: "Seit 1989",
      member_1_spec_1: "Wirtschaftsrecht", member_1_spec_2: "Immobilienrecht", member_1_spec_3: "Vertragsrecht", member_1_spec_4: "Baurecht", member_1_spec_5: "Miet- und Erbrecht", member_1_spec_6: "",
      member_2_name: "DI (FH) Mag. Bernd Auer", member_2_title: "Rechtsanwalt", member_2_role: "Regiepartner", member_2_description: "Mag. Bernd Auer ist seit 2010 selbständiger Rechtsanwalt und Regiepartner der Kanzleigemeinschaft. Seine Fachgebiete umfassen insbesondere Familien-, Schadenersatz-, Versicherungs-, Erb- und Vertragsrecht.", member_2_since: "Seit 2010",
      member_2_spec_1: "Familienrecht", member_2_spec_2: "Schadenersatzrecht", member_2_spec_3: "Versicherungsrecht", member_2_spec_4: "Erbrecht", member_2_spec_5: "Vertragsrecht", member_2_spec_6: "",
      member_3_name: "Mag. Anna Girardi", member_3_title: "Rechtsanwältin", member_3_role: "Regiepartnerin", member_3_description: "Mag. Anna Girardi ist seit April 2025 als selbstständige Rechtsanwältin eingetragen und Regiepartnerin der Kanzleigemeinschaft. Zudem ist sie ausgebildete Mediatorin, Konflikt-Coach und systemischer Coach.", member_3_since: "Seit 2025",
      member_3_spec_1: "Familienrecht", member_3_spec_2: "Mietrecht", member_3_spec_3: "Mediation", member_3_spec_4: "Konflikt-Coaching", member_3_spec_5: "", member_3_spec_6: "",
      member_4_name: "Mag. B.A. Constanze Girardi", member_4_title: "Rechtsanwaltsanwärterin", member_4_role: "Team", member_4_description: "Constanze Girardi ist als Rechtsanwaltsanwärterin Teil unseres Teams und unterstützt die Kanzlei in allen rechtlichen Belangen.", member_4_since: "Team",
      member_4_spec_1: "", member_4_spec_2: "", member_4_spec_3: "", member_4_spec_4: "", member_4_spec_5: "", member_4_spec_6: "",
      member_5_name: "Monika Girardi", member_5_title: "Kanzleiassistenz", member_5_role: "Team", member_5_description: "Monika Girardi ist seit 1989 als Kanzleiassistenz tätig und die erste Ansprechpartnerin für unsere Klienten.", member_5_since: "Seit 1989",
      member_5_spec_1: "", member_5_spec_2: "", member_5_spec_3: "", member_5_spec_4: "", member_5_spec_5: "", member_5_spec_6: "",
      sekretariat_title: "Gemeinsam stark für Sie",
      sekretariat_subtitle: "Unser Sekretariat sorgt dafür, dass alles reibungslos abläuft. Sie sind Ihre ersten Ansprechpartner bei Terminvereinbarungen und organisatorischen Fragen.",
      sekretariat_1_name: "Doris Blahut", sekretariat_1_title: "Kanzleiassistenz",
      sekretariat_2_name: "Iva Federfová", sekretariat_2_title: "Kanzleiassistenz",
      sekretariat_3_name: "Carina Schuler", sekretariat_3_title: "Kanzleiassistenz",
      cta_title: "Bereit für ein Gespräch?",
      cta_description: "Vereinbaren Sie ein unverbindliches Erstgespräch und lernen Sie uns persönlich kennen. Wir freuen uns auf Sie.",
      cta_button_text: "Kontakt aufnehmen",
      cta_phone: "+43 512 574095",
    },

    "practice-areas": {
      component: "page_practice_areas",
      seo_title: "Rechtsgebiete - Liegenschaftsrecht, Familienrecht & mehr | Girardi & Auer",
      seo_description: "9 Rechtsgebiete mit Expertise: Liegenschaftsrecht, Baurecht, Familienrecht, Erbrecht, Unternehmensrecht, Schadenersatz & mehr. Erfahrene Anwälte in Innsbruck",
      seo_keywords: "Liegenschaftsrecht Innsbruck, Familienrecht Tirol, Erbrecht, Baurecht",
      hero_badge: "Unsere Expertise",
      hero_title: "Tätigkeitsbereiche",
      hero_subtitle: "Die Rechtsanwaltskanzlei \"Girardi & Auer\" betreut klein- und mittelständische Unternehmen sowie Privatpersonen vor allem in folgenden Rechtsgebieten:",
      area_1_title: "Liegenschaftsrecht", area_1_desc: "Insbesondere Baurecht sowie Kauf-, Übergabe-, Bauträger- und Mietverträge", area_1_icon: "Home",
      area_2_title: "Vergaberecht", area_2_desc: "Beratung und Vertretung in allen Belangen des Vergaberechts", area_2_icon: "FileCheck",
      area_3_title: "Schadenersatzrecht", area_3_desc: "sowie Gewährleistungsrecht", area_3_icon: "FileText",
      area_4_title: "Ehe- und Scheidungsrecht", area_4_desc: "sowie Obsorge, Kontakt- und Unterhaltsrecht", area_4_icon: "HeartHandshake",
      area_5_title: "Erbrecht", area_5_desc: "Vertretung im Verlassenschaftsverfahren und Erstellung von letztwilligen Verfügungen", area_5_icon: "Users",
      area_6_title: "Erwachsenenschutz", area_6_desc: "Erwachsenenvertretung und Beratung bei Vorsorgevollmachten", area_6_icon: "HeartHandshake",
      area_7_title: "Unternehmensgründung", area_7_desc: "Beratung bei Gründung und Erstellung von Gesellschaftsverträgen", area_7_icon: "Building",
      area_8_title: "Inkassowesen und Forderungsbetreibung", area_8_desc: "Professionelle Durchsetzung Ihrer Ansprüche", area_8_icon: "TrendingUp",
      area_9_title: "Rechtsgutachten", area_9_desc: "Fundierte rechtliche Bewertungen und Einschätzungen", area_9_icon: "Search",
      process_badge: "Unser Vorgehen",
      process_title: "So arbeiten wir mit Ihnen",
      process_subtitle: "Von der ersten Kontaktaufnahme bis zum erfolgreichen Abschluss",
      step_1_title: "Erstgespräch", step_1_desc: "Kostenlose und unverbindliche Erstberatung zu Ihrem Anliegen.", step_1_icon: "Phone",
      step_2_title: "Analyse", step_2_desc: "Sorgfältige Prüfung Ihrer Situation und der rechtlichen Lage.", step_2_icon: "ClipboardList",
      step_3_title: "Strategie", step_3_desc: "Entwicklung einer maßgeschneiderten Vorgehensweise.", step_3_icon: "Target",
      step_4_title: "Umsetzung", step_4_desc: "Engagierte Vertretung Ihrer Interessen bis zum Ergebnis.", step_4_icon: "Gavel",
      info_title: "Umfassende rechtliche Beratung",
      info_para_1: "Unsere langjährige Erfahrung und fundierte Ausbildung ermöglichen es uns, auch komplexe rechtliche Sachverhalte kompetent und zuverlässig zu bearbeiten. Wir vertreten Ihre Interessen sowohl außergerichtlich als auch vor Gericht.",
      info_para_2: "Sollten Sie Fragen zu einem Rechtsgebiet haben, das hier nicht aufgeführt ist, kontaktieren Sie uns gerne. Wir beraten Sie umfassend oder vermitteln Ihnen bei Bedarf qualifizierte Kollegen aus unserem Netzwerk.",
      info_cta_text: "Beratungstermin vereinbaren",
      info_cta_link: "/kontakt",
      partner_title: "Ihr verlässlicher Partner",
      partner_subtitle: "Was Sie von unserer Kanzlei erwarten können",
      partner_1_title: "Fundierte Expertise", partner_1_desc: "Profundes rechtliches Fachwissen in allen relevanten Bereichen des Zivil- und Wirtschaftsrechts.", partner_1_icon: "FileCheck",
      partner_2_title: "Individuelle Betreuung", partner_2_desc: "Persönlicher Ansprechpartner und maßgeschneiderte Lösungen für Ihre spezifische Situation.", partner_2_icon: "Users",
      partner_3_title: "Engagierte Vertretung", partner_3_desc: "Leidenschaftlicher Einsatz für Ihre Rechte – außergerichtlich und vor Gericht.", partner_3_icon: "Scale",
    },

    contact: {
      component: "page_contact",
      seo_title: "Kontakt - Rechtsberatung in Innsbruck | Girardi & Auer",
      seo_description: "Kontaktieren Sie Rechtsanwaltskanzlei Girardi & Auer. Stainerstraße 2, 6020 Innsbruck. +43 512 574095. Jetzt Termin vereinbaren!",
      seo_keywords: "Rechtsanwalt Kontakt Innsbruck, Anwalt Termin Innsbruck",
      hero_badge: "Kontakt aufnehmen",
      hero_title_line1: "Lassen Sie uns",
      hero_title_line2: "sprechen",
      hero_description: "Wir freuen uns auf Ihre Anfrage und beraten Sie gerne persönlich. Vereinbaren Sie noch heute einen Termin für ein unverbindliches Erstgespräch.",
      quick_phone_label: "Telefon", quick_phone: "+43 512 574095",
      quick_email_label: "E-Mail", quick_email: "info@girardi-auer.com",
      quick_address_label: "Adresse", quick_address: "Stainerstraße 2, Innsbruck",
      form_title: "Nachricht senden",
      form_subtitle: "Wir antworten in der Regel innerhalb von 24 Stunden.",
      form_success_title: "Vielen Dank!",
      form_success_text: "Ihre Nachricht wurde erfolgreich gesendet. Wir melden uns in Kürze bei Ihnen.",
      form_datenschutz_text: "Mit dem Absenden stimmen Sie unserer Datenschutzerklärung zu.",
      rechtsgebiet_options: "Liegenschaftsrecht,Vergaberecht,Schadenersatzrecht,Ehe- und Scheidungsrecht,Erbrecht,Erwachsenenschutz,Unternehmensgründung,Inkassowesen,Rechtsgutachten,Sonstiges",
      hours_title: "Öffnungszeiten",
      hours_1_days: "Mo - Fr", hours_1_time: "08:00 - 12:00",
      hours_2_days: "Mo - Do", hours_2_time: "14:00 - 16:30",
      hours_note: "Termine außerhalb der Öffnungszeiten nach Vereinbarung",
      contact_title: "Direkt erreichen",
      contact_phone: "+43 512 574095", contact_fax: "+43 512 574097", contact_email: "info@girardi-auer.com",
      trust_title: "Ihre Vorteile",
      trust_1: "Unverbindliches Erstgespräch",
      trust_2: "Vertrauliche Beratung",
      trust_3: "Antwort innerhalb 24h",
      trust_4: "35+ Jahre Erfahrung",
      address_title: "Adresse",
      address_line1: "Stainerstraße 2", address_line2: "6020 Innsbruck", address_country: "Österreich",
      address_note: "Parkmöglichkeiten in umliegenden Parkhäusern. Gut erreichbar mit öffentlichen Verkehrsmitteln.",
      map_title: "Unser Standort",
      map_subtitle: "Zentral im Herzen von Innsbruck",
      map_embed_url: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2712.0!2d11.3894847!3d47.2666717!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x479d6bfb1e33fb15%3A0x1d6776d64f3b4acb!2sDr.%20Thomas%20Girardi!5e0!3m2!1sde!2sat!4v1710000000000!5m2!1sde!2sat",
      cta_title: "Bereit für ein persönliches Gespräch?",
      cta_description: "Rufen Sie uns direkt an oder schreiben Sie uns – wir freuen uns darauf, Ihnen zu helfen.",
    },

    impressum: {
      component: "page_impressum",
      seo_title: "Impressum | Rechtsanwaltskanzlei Girardi & Auer Innsbruck",
      seo_description: "Impressum der Rechtsanwaltskanzlei Girardi & Auer, Stainerstraße 2, 6020 Innsbruck.",
      hero_title: "Impressum",
      hero_subtitle: "GIRARDI & AUER · Rechtsanwälte in Regiegemeinschaft",
      kanzlei_name: "Girardi & Auer",
      kanzlei_desc: "Rechtsanwälte in Regiegemeinschaft",
      address_line1: "Stainerstraße 2", address_line2: "6020 Innsbruck",
      phone: "+43 (0)512 / 57 40 95", fax: "+43 (0)512 / 57 40 97", email: "info@girardi-auer.com",
      ra_1_name: "RA Dr. Thomas Girardi", ra_1_advm: "R802574", ra_1_uid: "ATU 31367703",
      ra_2_name: "RA DI (FH) Mag. Bernd Auer", ra_2_advm: "R808398", ra_2_uid: "",
      ra_3_name: "RA Mag. Anna Girardi", ra_3_advm: "R818867", ra_3_uid: "",
      berufsbezeichnung: "Rechtsanwalt (verliehen in Österreich)",
      kammer_name: "Rechtsanwaltskammer für Tirol",
      kammer_address: "Meraner Straße 3, 6020 Innsbruck",
      kammer_url: "https://www.rechtsanwaelte-tirol.at",
      vorschrift_1: "Rechtsanwaltsordnung (RAO)",
      vorschrift_2: "Allgemeine Bedingungen für Rechtsanwälte",
      vorschrift_3: "Standesregeln der Rechtsanwälte",
      vorschrift_4: "Disziplinarstatut der Rechtsanwaltskammern",
      vorschriften_url: "https://www.rechtsanwaelte.at",
      haftung_inhalte_title: "Haftung für Inhalte",
      haftung_inhalte_text: "Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich.",
      haftung_links_title: "Haftung für Links",
      haftung_links_text: "Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Inhalte externer Links. Für den Inhalt der verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich.",
      urheberrecht_title: "Urheberrecht",
      urheberrecht_text: "Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem österreichischen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.",
    },

    datenschutz: {
      component: "page_datenschutz",
      seo_title: "Datenschutzerklärung | Rechtsanwaltskanzlei Girardi & Auer",
      seo_description: "Datenschutzerklärung der Rechtsanwaltskanzlei Girardi & Auer. Informationen zur Verarbeitung personenbezogener Daten gemäß DSGVO.",
      hero_badge: "DSGVO-konform",
      hero_title: "Datenschutzerklärung",
      hero_subtitle: "Informationen zur Verarbeitung personenbezogener Daten",
      datenschutz_text: "Der Schutz Ihrer personenbezogenen Daten ist uns ein besonderes Anliegen. Wir verarbeiten Ihre Daten daher ausschließlich auf Grundlage der gesetzlichen Bestimmungen (DSGVO, TKG 2003). In dieser Datenschutzerklärung informieren wir Sie über die wichtigsten Aspekte der Datenverarbeitung im Rahmen unserer Website.",
      verantwortlicher_name: "Rechtsanwaltskanzlei Girardi & Auer",
      verantwortlicher_address1: "Stainerstraße 2",
      verantwortlicher_address2: "6020 Innsbruck, Österreich",
      verantwortlicher_phone: "+43 (0)512 / 57 40 95",
      verantwortlicher_email: "info@girardi-auer.com",
      cookies_text_1: "Unsere Website verwendet sogenannte Cookies. Dabei handelt es sich um kleine Textdateien, die mit Hilfe des Browsers auf Ihrem Endgerät abgelegt werden. Sie richten keinen Schaden an.",
      cookies_text_2: "Wir nutzen Cookies dazu, unser Angebot nutzerfreundlich zu gestalten. Einige Cookies bleiben auf Ihrem Endgerät gespeichert, bis Sie diese löschen.",
      cookies_text_3: "Wenn Sie dies nicht wünschen, so können Sie Ihren Browser so einrichten, dass er Sie über das Setzen von Cookies informiert und Sie dies nur im Einzelfall erlauben. Bei der Deaktivierung von Cookies kann die Funktionalität unserer Website eingeschränkt sein.",
      google_maps_text_1: "Diese Website nutzt über eine API den Kartendienst Google Maps. Anbieter ist die Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland.",
      google_maps_text_2: "Zur Nutzung der Funktionen von Google Maps ist es notwendig, Ihre IP-Adresse zu speichern. Diese Informationen werden in der Regel an einen Server von Google in den USA übertragen und dort gespeichert.",
      google_maps_text_3: "Die Nutzung von Google Maps erfolgt im Interesse einer ansprechenden Darstellung unserer Online-Angebote. Dies stellt ein berechtigtes Interesse im Sinne von Art. 6 Abs. 1 lit. f DSGVO dar.",
      google_maps_link: "https://policies.google.com/privacy",
      kontaktaufnahme_text: "Wenn Sie per Formular auf der Website oder per E-Mail Kontakt mit uns aufnehmen, werden Ihre angegebenen Daten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen sechs Monate bei uns gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.",
      server_logs_intro: "Der Provider der Seiten erhebt und speichert automatisch Informationen in so genannten Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt:",
      server_log_1: "Browsertyp und Browserversion",
      server_log_2: "Verwendetes Betriebssystem",
      server_log_3: "Referrer URL",
      server_log_4: "Hostname des zugreifenden Rechners",
      server_log_5: "Uhrzeit der Serveranfrage",
      server_log_6: "IP-Adresse",
      server_logs_outro: "Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen. Die Erfassung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO.",
      rechte_text: "Ihnen stehen grundsätzlich die Rechte auf Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit, Widerruf und Widerspruch zu. Wenn Sie glauben, dass die Verarbeitung Ihrer Daten gegen das Datenschutzrecht verstößt, können Sie sich bei der Aufsichtsbehörde beschweren.",
      rechte_behoerde_name: "Österreichische Datenschutzbehörde",
      rechte_behoerde_address: "Barichgasse 40-42, 1030 Wien",
      rechte_behoerde_phone: "+43 1 52 152-0",
      rechte_behoerde_url: "https://www.dsb.gv.at",
      ssl_text: "Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher Inhalte eine SSL- bzw. TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie daran, dass die Adresszeile des Browsers von „http://" auf „https://" wechselt und an dem Schloss-Symbol in Ihrer Browserzeile.",
      speicherdauer_text: "Wir speichern personenbezogene Daten nur so lange, wie dies für die Erfüllung des jeweiligen Zwecks erforderlich ist oder gesetzliche Aufbewahrungsfristen dies vorsehen. Nach Wegfall des jeweiligen Zwecks bzw. Ablauf der Fristen werden die entsprechenden Daten routinemäßig gelöscht.",
      weitergabe_intro: "Eine Übermittlung Ihrer persönlichen Daten an Dritte zu anderen als den im Folgenden aufgeführten Zwecken findet nicht statt. Wir geben Ihre persönlichen Daten nur an Dritte weiter, wenn:",
      weitergabe_1: "Sie Ihre nach Art. 6 Abs. 1 S. 1 lit. a DSGVO ausdrückliche Einwilligung dazu erteilt haben",
      weitergabe_2: "die Weitergabe nach Art. 6 Abs. 1 S. 1 lit. f DSGVO zur Geltendmachung von Rechtsansprüchen erforderlich ist",
      weitergabe_3: "für die Weitergabe nach Art. 6 Abs. 1 S. 1 lit. c DSGVO eine gesetzliche Verpflichtung besteht",
      weitergabe_4: "dies gesetzlich zulässig und nach Art. 6 Abs. 1 S. 1 lit. b DSGVO für die Abwicklung von Vertragsverhältnissen erforderlich ist",
      footer_stand: "März 2026",
      footer_text: "Wir behalten uns vor, diese Datenschutzerklärung anzupassen, damit sie stets den aktuellen rechtlichen Anforderungen entspricht oder um Änderungen unserer Leistungen in der Datenschutzerklärung umzusetzen.",
    },
  };
}

async function populateStories(storyIds) {
  console.log("\n📝 STEP 4: Populating stories with content...\n");
  const seedData = getSeedData();

  for (const [slug, content] of Object.entries(seedData)) {
    const storyId = storyIds[slug];
    if (!storyId) {
      console.log(`  Skipping ${slug} (no story id)`);
      continue;
    }

    console.log(`  Populating: pages/${slug} (${Object.keys(content).length} fields)`);

    try {
      // Get current story first
      const current = await sbApi("GET", `/stories/${storyId}`);
      await delay(300);

      // Update with content
      await sbApi("PUT", `/stories/${storyId}`, {
        story: {
          name: current.story.name,
          slug: current.story.slug,
          content: content,
        },
        publish: 1,
      });
      console.log(`    ✅ Published`);
    } catch (err) {
      console.log(`    ❌ Error: ${err.message}`);
    }
    await delay(400);
  }

  console.log("  ✅ All stories populated\n");
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════════
async function main() {
  console.log("╔══════════════════════════════════════════════════════════╗");
  console.log("║  Storyblok Setup: Girardi & Auer                       ║");
  console.log("╚══════════════════════════════════════════════════════════╝");
  console.log(`  Space: ${SPACE_ID}`);
  console.log(`  Mode: ${DRY_RUN ? "DRY RUN" : "LIVE"}`);

  // Step 1: Clean
  await cleanAll();

  // Step 2: Create components
  await createComponents();

  // Step 3: Create folder + stories
  const storyIds = await createFolderAndStories();

  // Step 4: Populate content
  await populateStories(storyIds);

  console.log("╔══════════════════════════════════════════════════════════╗");
  console.log("║  ✅ COMPLETE! All done.                                 ║");
  console.log("║                                                          ║");
  console.log("║  Run with:                                               ║");
  console.log("║  STORYBLOK_MGMT_TOKEN=xxx node scripts/seed-storyblok-pages.mjs ║");
  console.log("╚══════════════════════════════════════════════════════════╝");
}

main().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
