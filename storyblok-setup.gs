/**
 * Storyblok Management API Setup Script - GOOGLE APPS SCRIPT VERSION
 * 
 * ALLE Felder werden FLAT angelegt - KEINE nested components, KEINE tabs!
 * 
 * Setup:
 * 1. Storyblok Space erstellen auf https://app.storyblok.com
 * 2. Management API Token holen: Settings > Access Tokens > Personal Access Tokens
 * 3. STORYBLOK_MANAGEMENT_TOKEN und STORYBLOK_SPACE_ID unten eintragen
 * 4. In Google Apps Script: https://script.google.com
 *    - Neues Projekt erstellen
 *    - Diesen Code einfügen
 *    - Funktion "setupStoryblok" ausführen
 */

// ============================================================================
// KONFIGURATION - HIER DEINE TOKENS EINTRAGEN!
// ============================================================================

var STORYBLOK_MANAGEMENT_TOKEN = 'DEIN_MANAGEMENT_TOKEN_HIER';
var STORYBLOK_SPACE_ID = 'DEINE_SPACE_ID_HIER'; // z.B. '123456'

var API_BASE = 'https://mapi.storyblok.com/v1';

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function apiRequest(endpoint, method, body) {
  method = method || 'GET';
  
  var url = API_BASE + endpoint;
  var options = {
    method: method,
    headers: {
      'Authorization': STORYBLOK_MANAGEMENT_TOKEN,
      'Content-Type': 'application/json'
    },
    muteHttpExceptions: true
  };
  
  if (body) {
    options.payload = JSON.stringify(body);
  }
  
  var response = UrlFetchApp.fetch(url, options);
  var responseCode = response.getResponseCode();
  
  if (responseCode < 200 || responseCode >= 300) {
    throw new Error('API Error: ' + responseCode + ' - ' + response.getContentText());
  }
  
  return JSON.parse(response.getContentText());
}

// ============================================================================
// CLEANUP FUNCTIONS - Löscht ALLES!
// ============================================================================

function cleanupStories() {
  Logger.log('🧹 Cleaning up existing stories...');
  
  try {
    var response = apiRequest('/spaces/' + STORYBLOK_SPACE_ID + '/stories', 'GET');
    var stories = response.stories;
    
    if (!stories || stories.length === 0) {
      Logger.log('   No stories to delete');
      return;
    }
    
    for (var i = 0; i < stories.length; i++) {
      var story = stories[i];
      try {
        apiRequest('/spaces/' + STORYBLOK_SPACE_ID + '/stories/' + story.id, 'DELETE');
        Logger.log('   ✅ Deleted story: ' + story.name);
      } catch (error) {
        Logger.log('   ⚠️  Could not delete story ' + story.name + ': ' + error.message);
      }
    }
  } catch (error) {
    Logger.log('   ⚠️  Error during story cleanup: ' + error.message);
  }
}

function cleanupComponents() {
  Logger.log('🧹 Cleaning up existing components...');
  
  try {
    var response = apiRequest('/spaces/' + STORYBLOK_SPACE_ID + '/components', 'GET');
    var components = response.components;
    
    if (!components || components.length === 0) {
      Logger.log('   No components to delete');
      return;
    }
    
    for (var i = 0; i < components.length; i++) {
      var component = components[i];
      try {
        apiRequest('/spaces/' + STORYBLOK_SPACE_ID + '/components/' + component.id, 'DELETE');
        Logger.log('   ✅ Deleted component: ' + component.name);
      } catch (error) {
        Logger.log('   ⚠️  Could not delete component ' + component.name + ': ' + error.message);
      }
    }
  } catch (error) {
    Logger.log('   ⚠️  Error during component cleanup: ' + error.message);
  }
}

// ============================================================================
// CONTENT TYPE DEFINITIONS - KOMPLETT FLAT!
// ============================================================================

function getComponents() {
  return [
    // HomePage - ALLE Felder flat
    {
      name: 'page_home',
      display_name: 'Homepage',
      is_root: true,
      is_nestable: false,
      schema: {
        // SEO Felder (flat, nicht nested!)
        seo_title: { type: 'text', default_value: 'Rechtsanwalt Innsbruck | Girardi & Auer | Seit 1989' },
        seo_description: { type: 'textarea', max_length: 160, default_value: 'Erfahrene Rechtsanwälte in Innsbruck seit 1989. Spezialisiert auf Liegenschaftsrecht, Baurecht, Vertragsrecht & mehr. ✓ Persönliche Betreuung ✓ Jetzt Termin vereinbaren!' },
        seo_keywords: { type: 'text', default_value: 'Rechtsanwalt Innsbruck, Anwalt Tirol, Rechtsberatung Innsbruck' },
        seo_image: { type: 'asset', filetypes: ['images'] },
        
        // Hero Section
        hero_title: { type: 'text', default_value: 'Ihr Recht ist unsere Berufung' },
        hero_subtitle: { type: 'textarea', default_value: 'Professionelle Rechtsberatung mit persönlicher Note. Wir stehen Ihnen mit Erfahrung und Engagement zur Seite.' },
        hero_image: { type: 'asset', filetypes: ['images'] },
        hero_cta_text: { type: 'text', default_value: 'Termin vereinbaren' },
        hero_cta_link: { type: 'text', default_value: '/kontakt' },
        
        // Stats
        stat_1_number: { type: 'text', default_value: '1989' },
        stat_1_label: { type: 'text', default_value: 'Gegründet' },
        stat_2_number: { type: 'text', default_value: '4' },
        stat_2_label: { type: 'text', default_value: 'Rechtsanwälte' },
        stat_3_number: { type: 'text', default_value: '9' },
        stat_3_label: { type: 'text', default_value: 'Rechtsgebiete' },
        stat_4_number: { type: 'text', default_value: '5' },
        stat_4_label: { type: 'text', default_value: 'Team-Member' },
        
        // Services Section
        services_title: { type: 'text', default_value: 'Unsere Expertise' },
        services_subtitle: { type: 'textarea', default_value: 'Umfassende rechtliche Beratung in allen wichtigen Bereichen' },
        
        // Why Choose Us
        why_title: { type: 'text', default_value: 'Warum Girardi & Auer?' },
        why_feature_1_icon: { type: 'text', default_value: 'Award' },
        why_feature_1_title: { type: 'text', default_value: 'Langjährige Erfahrung' },
        why_feature_1_text: { type: 'textarea', default_value: 'Seit 1989 betreuen wir erfolgreich Privatpersonen und Unternehmen in Tirol und darüber hinaus.' },
        why_feature_2_icon: { type: 'text', default_value: 'Users' },
        why_feature_2_title: { type: 'text', default_value: 'Persönliche Betreuung' },
        why_feature_2_text: { type: 'textarea', default_value: 'Ihre Anliegen erhalten stets die volle persönliche Aufmerksamkeit unseres erfahrenen Teams.' },
        why_feature_3_icon: { type: 'text', default_value: 'Scale' },
        why_feature_3_title: { type: 'text', default_value: 'Umfassende Expertise' },
        why_feature_3_text: { type: 'textarea', default_value: 'Neun Rechtsgebiete und fundierte Ausbildung für kompetente und zuverlässige Beratung.' },
        
        // Location CTA
        location_title: { type: 'text', default_value: 'Besuchen Sie uns in Innsbruck' },
        location_subtitle: { type: 'textarea', default_value: 'Unsere Kanzlei befindet sich zentral in der Stainerstraße 2, 6020 Innsbruck. Vereinbaren Sie noch heute einen Termin für ein persönliches Gespräch.' },
        location_address: { type: 'text', default_value: 'Stainerstraße 2, 6020 Innsbruck' },
        location_phone: { type: 'text', default_value: '+43 512 574095' },
        location_email: { type: 'text', default_value: 'info@girardi-auer.com' },
        location_image: { type: 'asset', filetypes: ['images'] }
      }
    },

    // AboutPage - ALLE Felder flat
    {
      name: 'page_about',
      display_name: 'Über Uns Seite',
      is_root: true,
      is_nestable: false,
      schema: {
        // SEO
        seo_title: { type: 'text', default_value: 'Über uns - Erfahrene Rechtsanwälte seit 1989 | Girardi & Auer' },
        seo_description: { type: 'textarea', max_length: 160, default_value: 'Lernen Sie das Team der Kanzlei Girardi & Auer kennen. Dr. Thomas Girardi, Mag. Bernd Auer & Mag. Anna Girardi – Ihre Rechtsanwälte in Innsbruck seit 1989.' },
        seo_keywords: { type: 'text', default_value: 'Rechtsanwalt Team Innsbruck, Dr. Thomas Girardi, Bernd Auer, Anna Girardi' },
        seo_image: { type: 'asset', filetypes: ['images'] },
        
        // Hero
        hero_badge_text: { type: 'text', default_value: 'Über uns' },
        hero_title: { type: 'text', default_value: 'Tradition trifft Moderne' },
        hero_description: { type: 'textarea', default_value: 'Seit 1989 stehen wir für kompetente Rechtsberatung mit persönlicher Note. Erfahren Sie mehr über unsere Geschichte, Werte und unser Team.' },
        hero_image: { type: 'asset', filetypes: ['images'] },
        
        // Stats
        stat_year: { type: 'text', default_value: '1989' },
        stat_year_label: { type: 'text', default_value: 'Gegründet' },
        stat_years: { type: 'text', default_value: '35+' },
        stat_years_label: { type: 'text', default_value: 'Jahre' },
        stat_team: { type: 'text', default_value: '5' },
        stat_team_label: { type: 'text', default_value: 'Team-Member' },
        
        // Geschichte
        history_title: { type: 'text', default_value: 'Unsere Geschichte' },
        history_1989_title: { type: 'text', default_value: 'Die Gründung' },
        history_1989_text: { type: 'richtext', default_value: 'RA Dr. Thomas Girardi hat nach seiner Ausbildung bei einem renommierten Wirtschaftsanwalt seine eigene Rechtsanwaltskanzlei im Jahre 1989 in Innsbruck gegründet.' },
        history_2010_title: { type: 'text', default_value: 'Erster Regiepartner' },
        history_2010_text: { type: 'richtext', default_value: 'RA DI (FH) Mag. Bernd Auer ist nach seiner Ausbildung bei RA Dr. Thomas Girardi in die Kanzlei als Regiepartner eingetreten.' },
        history_2025_title: { type: 'text', default_value: 'Die nächste Generation' },
        history_2025_text: { type: 'richtext', default_value: 'RA Mag. Anna Girardi ist nach ihrer Ausbildung in der Kanzlei Girardi & Auer ebenfalls als Regiepartnerin eingetreten.' },
        history_quote: { type: 'textarea', default_value: 'Besonderen Wert legt die Kanzlei auf eine allumfassende Rechtsberatung und den persönlichen Kontakt zu ihren Klienten.' },
        
        // Werte
        values_title: { type: 'text', default_value: 'Unsere Werte' },
        values_subtitle: { type: 'text', default_value: 'Was uns auszeichnet und antreibt' },
        value_1_icon: { type: 'text', default_value: 'Award' },
        value_1_title: { type: 'text', default_value: 'Expertise' },
        value_1_text: { type: 'textarea', default_value: 'Die Rechtsanwaltskanzlei „Girardi & Auer" betreut klein- und mittelständische Unternehmen sowie Privatpersonen in allen Belangen des Wirtschafts- und Zivilrechts.' },
        value_2_icon: { type: 'text', default_value: 'Target' },
        value_2_title: { type: 'text', default_value: 'Qualität' },
        value_2_text: { type: 'textarea', default_value: 'Unsere langjährige Erfahrung und fundierte Ausbildung ermöglichen es uns, auch komplexe rechtliche Sachverhalte kompetent und zuverlässig zu bearbeiten.' },
        value_3_icon: { type: 'text', default_value: 'Users' },
        value_3_title: { type: 'text', default_value: 'Persönlich' },
        value_3_text: { type: 'textarea', default_value: 'Zuverlässig, sachlich und souverän – unsere Mandanten und ihre Fälle erhalten stets die volle persönliche Aufmerksamkeit unseres Teams.' },
        value_4_icon: { type: 'text', default_value: 'TrendingUp' },
        value_4_title: { type: 'text', default_value: 'Maßgeschneidert' },
        value_4_text: { type: 'textarea', default_value: 'Wir setzen auf eine enge Zusammenarbeit mit unseren Mandanten und entwickeln gemeinsam maßgeschneiderte Lösungen für jede individuelle Situation.' },
        
        // Team
        team_title: { type: 'text', default_value: 'Unser Team' },
        team_subtitle: { type: 'textarea', default_value: 'Lernen Sie die Menschen kennen, die sich mit Leidenschaft und Expertise für Ihre rechtlichen Anliegen einsetzen.' },
        
        // Team Member 1 - Dr. Thomas Girardi
        team1_name: { type: 'text', default_value: 'Dr. Thomas Girardi' },
        team1_title: { type: 'text', default_value: 'Rechtsanwalt' },
        team1_since: { type: 'text', default_value: 'Seit 1989' },
        team1_image: { type: 'asset', filetypes: ['images'] },
        team1_bio: { type: 'richtext', default_value: 'Dr. Thomas Girardi ist seit 1988 als Rechtsanwalt eingetragen. Dr. Thomas Girardi ist auf Wirtschaftsrecht mit Schwerpunkt Immobilien-, Vertrags-, Bau-, Miet- und Erbrecht spezialisiert.' },
        team1_specializations: { type: 'textarea', default_value: 'Wirtschaftsrecht, Immobilienrecht, Vertragsrecht, Baurecht, Miet- und Erbrecht' },
        
        // Team Member 2 - Bernd Auer
        team2_name: { type: 'text', default_value: 'Bernd Auer' },
        team2_title: { type: 'text', default_value: 'Rechtsanwalt · DI (FH) Mag.' },
        team2_since: { type: 'text', default_value: 'Seit 2010' },
        team2_image: { type: 'asset', filetypes: ['images'] },
        team2_bio: { type: 'richtext', default_value: 'Mag. Bernd Auer ist seit 2010 selbständiger Rechtsanwalt und Regiepartner der Kanzleigemeinschaft "Girardi-Auer". Seine Fachgebiete sind insbesondere Ehe-, Scheidungs-, Unterhalts-, Kontakt- und Obsorgrecht, Schadenersatz- und Gewährleistungsrecht, Versicherungsrecht, Erbrecht und Vertragsrecht.' },
        team2_specializations: { type: 'textarea', default_value: 'Familienrecht, Schadenersatzrecht, Versicherungsrecht, Erbrecht, Vertragsrecht' },
        
        // Team Member 3 - Anna Girardi
        team3_name: { type: 'text', default_value: 'Anna Girardi' },
        team3_title: { type: 'text', default_value: 'Rechtsanwältin · Mag.' },
        team3_since: { type: 'text', default_value: 'Seit 2025' },
        team3_image: { type: 'asset', filetypes: ['images'] },
        team3_bio: { type: 'richtext', default_value: 'Frau Mag. Anna Girardi hat sich nach ihrer Ausbildung in der Kanzlei Girardi & Auer im April 2025 als selbstständige Rechtsanwältin eintragen lassen und ist nunmehr Regiepartnerin der Kanzleigemeinschaft "Girardi-Auer". Ihre Fachgebiete sind insbesondere Ehe-, Scheidungs-, Unterhalts-, Kontakt- und Obsorgrecht sowie Mietrecht. Zudem ist sie ausgebildete Mediatorin, Konflikt-Coach und systemischer Coach und bietet somit professionelle Unterstützung, um Konflikte effektiv zu lösen.' },
        team3_specializations: { type: 'textarea', default_value: 'Familienrecht, Mietrecht, Mediation, Konflikt-Coaching, Systemisches Coaching' },
        
        // Team Member 4 - Constanze Girardi
        team4_name: { type: 'text', default_value: 'Constanze Girardi' },
        team4_title: { type: 'text', default_value: 'Rechtsanwaltsanwärterin · Mag., B.A.' },
        team4_since: { type: 'text', default_value: 'Team' },
        team4_image: { type: 'asset', filetypes: ['images'] },
        team4_bio: { type: 'richtext', default_value: 'Constanze Girardi ist als Rechtsanwaltsanwärterin Teil unseres Teams und unterstützt die Kanzlei in allen rechtlichen Belangen.' },
        
        // Team Member 5 - Monika Girardi
        team5_name: { type: 'text', default_value: 'Monika Girardi' },
        team5_title: { type: 'text', default_value: 'Kanzleiassistenz' },
        team5_since: { type: 'text', default_value: 'Seit 1989' },
        team5_image: { type: 'asset', filetypes: ['images'] },
        team5_bio: { type: 'richtext', default_value: 'Monika Girardi ist seit 1989 als Kanzleiassistenz tätig und die erste Ansprechpartnerin für unsere Klienten.' },
        
        // Sekretariat
        secretary_title: { type: 'text', default_value: 'Sekretariat' },
        secretary_names: { type: 'textarea', default_value: 'Doris Blahut, Iva Federfová, Carina Schuler' }
      }
    },

    // PracticeAreasPage - ALLE Felder flat
    {
      name: 'page_practice_areas',
      display_name: 'Rechtsgebiete Seite',
      is_root: true,
      is_nestable: false,
      schema: {
        // SEO
        seo_title: { type: 'text', default_value: 'Rechtsgebiete - Liegenschaftsrecht, Familienrecht & mehr | Girardi & Auer' },
        seo_description: { type: 'textarea', max_length: 160, default_value: '9 Rechtsgebiete mit Expertise: Liegenschaftsrecht, Baurecht, Familienrecht, Erbrecht, Unternehmensrecht, Schadenersatz & mehr. ✓ Erfahrene Anwälte in Innsbruck' },
        seo_keywords: { type: 'text', default_value: 'Liegenschaftsrecht Innsbruck, Familienrecht Tirol, Erbrecht, Baurecht' },
        seo_image: { type: 'asset', filetypes: ['images'] },
        
        // Hero
        hero_badge_text: { type: 'text', default_value: 'Unsere Expertise' },
        hero_title: { type: 'text', default_value: 'Tätigkeitsbereiche' },
        hero_description: { type: 'textarea', default_value: 'Die Rechtsanwaltskanzlei „Girardi & Auer" betreut klein- und mittelständische Unternehmen sowie Privatpersonen vor allem in folgenden Rechtsgebieten:' },
        hero_image: { type: 'asset', filetypes: ['images'] },
        
        // Practice Area 1
        area1_icon: { type: 'text', default_value: 'Home' },
        area1_title: { type: 'text', default_value: 'Liegenschaftsrecht' },
        area1_description: { type: 'textarea', default_value: 'Insbesondere Baurecht sowie Kauf-, Übergabe-, Bauträger- und Mietverträge' },
        
        // Practice Area 2
        area2_icon: { type: 'text', default_value: 'FileCheck' },
        area2_title: { type: 'text', default_value: 'Vergaberecht' },
        area2_description: { type: 'textarea', default_value: 'Beratung und Vertretung in allen Belangen des Vergaberechts' },
        
        // Practice Area 3
        area3_icon: { type: 'text', default_value: 'FileText' },
        area3_title: { type: 'text', default_value: 'Schadenersatzrecht' },
        area3_description: { type: 'textarea', default_value: 'sowie Gewährleistungsrecht' },
        
        // Practice Area 4
        area4_icon: { type: 'text', default_value: 'HeartHandshake' },
        area4_title: { type: 'text', default_value: 'Ehe- und Scheidungsrecht' },
        area4_description: { type: 'textarea', default_value: 'sowie Obsorge, Kontakt- und Unterhaltsrecht' },
        
        // Practice Area 5
        area5_icon: { type: 'text', default_value: 'Users' },
        area5_title: { type: 'text', default_value: 'Erbrecht' },
        area5_description: { type: 'textarea', default_value: 'Vertretung im Verlassenschaftsverfahren und Erstellung von letztwilligen Verfügungen' },
        
        // Practice Area 6
        area6_icon: { type: 'text', default_value: 'HeartHandshake' },
        area6_title: { type: 'text', default_value: 'Erwachsenenschutz' },
        area6_description: { type: 'textarea', default_value: 'Erwachsenenvertretung und Beratung bei Vorsorgevollmachten' },
        
        // Practice Area 7
        area7_icon: { type: 'text', default_value: 'Building' },
        area7_title: { type: 'text', default_value: 'Unternehmensgründung' },
        area7_description: { type: 'textarea', default_value: 'Beratung bei Gründung und Erstellung von Gesellschaftsverträgen' },
        
        // Practice Area 8
        area8_icon: { type: 'text', default_value: 'TrendingUp' },
        area8_title: { type: 'text', default_value: 'Inkassowesen und Forderungsbetreibung' },
        area8_description: { type: 'textarea', default_value: 'Professionelle Durchsetzung Ihrer Ansprüche' },
        
        // Practice Area 9
        area9_icon: { type: 'text', default_value: 'Search' },
        area9_title: { type: 'text', default_value: 'Rechtsgutachten' },
        area9_description: { type: 'textarea', default_value: 'Fundierte rechtliche Bewertungen und Einschätzungen' },
        
        // Additional Info
        info_title: { type: 'text', default_value: 'Umfassende rechtliche Beratung' },
        info_text: { type: 'richtext', default_value: 'Unsere langjährige Erfahrung und fundierte Ausbildung ermöglichen es uns, auch komplexe rechtliche Sachverhalte kompetent und zuverlässig zu bearbeiten. Wir vertreten Ihre Interessen sowohl außergerichtlich als auch vor Gericht.' }
      }
    },

    // ContactPage - ALLE Felder flat
    {
      name: 'page_contact',
      display_name: 'Kontakt Seite',
      is_root: true,
      is_nestable: false,
      schema: {
        // SEO
        seo_title: { type: 'text', default_value: 'Kontakt - Rechtsberatung in Innsbruck | Girardi & Auer' },
        seo_description: { type: 'textarea', max_length: 160, default_value: 'Kontaktieren Sie Rechtsanwaltskanzlei Girardi & Auer ➤ Stainerstraße 2, 6020 Innsbruck ☎ +43 512 574095 ✉ info@girardi-auer.com ✓ Jetzt Termin vereinbaren!' },
        seo_keywords: { type: 'text', default_value: 'Rechtsanwalt Kontakt Innsbruck, Anwalt Termin Innsbruck' },
        seo_image: { type: 'asset', filetypes: ['images'] },
        
        // Hero
        hero_title: { type: 'text', default_value: 'Lassen Sie uns sprechen' },
        hero_description: { type: 'textarea', default_value: 'Wir freuen uns auf Ihre Anfrage und beraten Sie gerne persönlich. Vereinbaren Sie noch heute einen Termin.' },
        
        // Contact Info
        address_title: { type: 'text', default_value: 'Adresse' },
        address_street: { type: 'text', default_value: 'Stainerstraße 2' },
        address_city: { type: 'text', default_value: '6020 Innsbruck' },
        address_country: { type: 'text', default_value: 'Österreich' },
        
        phone: { type: 'text', default_value: '+43 512 574095' },
        fax: { type: 'text', default_value: '+43 512 574097' },
        email: { type: 'text', default_value: 'info@girardi-auer.com' },
        
        // Opening Hours
        hours_title: { type: 'text', default_value: 'Öffnungszeiten' },
        hours_weekday_1: { type: 'text', default_value: 'Mo - Fr: 08:00 - 12:00 Uhr' },
        hours_weekday_2: { type: 'text', default_value: 'Mo - Do: 14:00 - 16:30 Uhr' },
        hours_note: { type: 'textarea', default_value: 'Termine außerhalb der Öffnungszeiten nach Vereinbarung' },
        
        // Map
        map_title: { type: 'text', default_value: 'Unser Standort' },
        map_description: { type: 'textarea', default_value: 'Zentral gelegen im Herzen von Innsbruck – gut erreichbar mit öffentlichen Verkehrsmitteln und dem Auto' },
        map_latitude: { type: 'text', default_value: '47.2654' },
        map_longitude: { type: 'text', default_value: '11.3936' },
        
        // CTA
        cta_title: { type: 'text', default_value: 'Bereit für ein persönliches Gespräch?' },
        cta_text: { type: 'textarea', default_value: 'Vereinbaren Sie noch heute einen Termin und lassen Sie uns gemeinsam die beste Lösung für Ihr rechtliches Anliegen finden.' }
      }
    },

    // ImpressumPage - ALLE Felder flat
    {
      name: 'page_impressum',
      display_name: 'Impressum Seite',
      is_root: true,
      is_nestable: false,
      schema: {
        // SEO
        seo_title: { type: 'text', default_value: 'Impressum | Rechtsanwaltskanzlei Girardi & Auer Innsbruck' },
        seo_description: { type: 'textarea', max_length: 160, default_value: 'Impressum der Rechtsanwaltskanzlei Girardi & Auer, Stainerstraße 2, 6020 Innsbruck. Rechtliche Angaben gemäß österreichischem Recht.' },
        
        title: { type: 'text', default_value: 'Impressum' },
        subtitle: { type: 'text', default_value: 'GIRARDI & AUER' },
        subtitle_2: { type: 'text', default_value: 'Rechtsanwälte in Regiegemeinschaft' },
        
        // Kontaktdaten
        contact_title: { type: 'text', default_value: 'Kontaktdaten' },
        address_street: { type: 'text', default_value: 'Stainerstraße 2' },
        address_city: { type: 'text', default_value: '6020 Innsbruck' },
        phone: { type: 'text', default_value: '+43 (0)512 / 57 40 95' },
        fax: { type: 'text', default_value: '+43 (0)512 / 57 40 97' },
        email: { type: 'text', default_value: 'info@girardi-auer.com' },
        
        // Rechtsanwälte
        lawyers_title: { type: 'text', default_value: 'Rechtsanwälte' },
        lawyer_1_name: { type: 'text', default_value: 'RA Dr. Thomas Girardi' },
        lawyer_1_advm: { type: 'text', default_value: 'ADVM-Code: R802574' },
        lawyer_1_uid: { type: 'text', default_value: 'UID: ATU 31367703' },
        lawyer_2_name: { type: 'text', default_value: 'RA DI (FH) Mag. Bernd Auer' },
        lawyer_2_advm: { type: 'text', default_value: 'ADVM-Code: R808398' },
        lawyer_3_name: { type: 'text', default_value: 'RA Mag. Anna Girardi' },
        lawyer_3_advm: { type: 'text', default_value: 'ADVM-Code: R818867' },
        
        // Berufsrechtliche Angaben
        legal_title: { type: 'text', default_value: 'Berufsrechtliche Angaben' },
        legal_content: { type: 'richtext' },
        
        // Haftungsausschluss
        liability_title: { type: 'text', default_value: 'Haftungsausschluss' },
        liability_content: { type: 'richtext' }
      }
    },

    // DatenschutzPage - ALLE Felder flat
    {
      name: 'page_datenschutz',
      display_name: 'Datenschutz Seite',
      is_root: true,
      is_nestable: false,
      schema: {
        // SEO
        seo_title: { type: 'text', default_value: 'Datenschutzerklärung | Rechtsanwaltskanzlei Girardi & Auer' },
        seo_description: { type: 'textarea', max_length: 160, default_value: 'Datenschutzerklärung der Rechtsanwaltskanzlei Girardi & Auer. Informationen zur Verarbeitung personenbezogener Daten gemäß DSGVO.' },
        
        title: { type: 'text', default_value: 'Datenschutzerklärung' },
        subtitle: { type: 'textarea', default_value: 'Informationen zur Verarbeitung personenbezogener Daten' },
        
        // Content Sections (ALLE als richtext!)
        intro_text: { type: 'richtext' },
        responsible_title: { type: 'text', default_value: 'Verantwortlicher' },
        responsible_content: { type: 'richtext' },
        cookies_title: { type: 'text', default_value: 'Cookies' },
        cookies_content: { type: 'richtext' },
        google_maps_title: { type: 'text', default_value: 'Google Maps' },
        google_maps_content: { type: 'richtext' },
        contact_title: { type: 'text', default_value: 'Kontaktaufnahme' },
        contact_content: { type: 'richtext' },
        server_logs_title: { type: 'text', default_value: 'Server-Log-Dateien' },
        server_logs_content: { type: 'richtext' },
        rights_title: { type: 'text', default_value: 'Ihre Rechte' },
        rights_content: { type: 'richtext' },
        ssl_title: { type: 'text', default_value: 'SSL- bzw. TLS-Verschlüsselung' },
        ssl_content: { type: 'richtext' },
        storage_title: { type: 'text', default_value: 'Speicherdauer' },
        storage_content: { type: 'richtext' },
        data_sharing_title: { type: 'text', default_value: 'Weitergabe von Daten an Dritte' },
        data_sharing_content: { type: 'richtext' },
        footer_note: { type: 'richtext' }
      }
    },

    // Global Settings - ALLE Felder flat
    {
      name: 'settings_global',
      display_name: 'Globale Einstellungen',
      is_root: true,
      is_nestable: false,
      schema: {
        // Site Info
        site_name: { type: 'text', default_value: 'Rechtsanwaltskanzlei Girardi & Auer' },
        site_tagline: { type: 'text', default_value: 'Ihre Rechtsanwälte in Innsbruck' },
        
        // Contact
        phone: { type: 'text', default_value: '+43 (0)512 / 57 40 95' },
        fax: { type: 'text', default_value: '+43 (0)512 / 57 40 97' },
        email: { type: 'text', default_value: 'info@girardi-auer.com' },
        address_street: { type: 'text', default_value: 'Stainerstraße 2' },
        address_city: { type: 'text', default_value: '6020 Innsbruck' },
        address_country: { type: 'text', default_value: 'Österreich' },
        
        // Social Media
        facebook_url: { type: 'text' },
        linkedin_url: { type: 'text' },
        
        // Cookie Banner
        cookie_banner_text: { type: 'textarea', default_value: 'Wir verwenden Cookies, um Ihnen ein optimales Nutzererlebnis zu bieten.' },
        cookie_banner_accept_text: { type: 'text', default_value: 'Alle akzeptieren' },
        cookie_banner_decline_text: { type: 'text', default_value: 'Nur notwendige' }
      }
    }
  ];
}

function getStories() {
  return [
    {
      name: 'home',
      slug: 'home',
      content: {
        component: 'page_home'
      },
      parent_id: 0
      // is_startpage wird NICHT gesetzt - manuell in Storyblok einstellen!
    },
    {
      name: 'ueber-uns',
      slug: 'ueber-uns',
      content: {
        component: 'page_about'
      },
      parent_id: 0
    },
    {
      name: 'rechtsgebiete',
      slug: 'rechtsgebiete',
      content: {
        component: 'page_practice_areas'
      },
      parent_id: 0
    },
    {
      name: 'kontakt',
      slug: 'kontakt',
      content: {
        component: 'page_contact'
      },
      parent_id: 0
    },
    {
      name: 'impressum',
      slug: 'impressum',
      content: {
        component: 'page_impressum'
      },
      parent_id: 0
    },
    {
      name: 'datenschutz',
      slug: 'datenschutz',
      content: {
        component: 'page_datenschutz'
      },
      parent_id: 0
    },
    {
      name: 'global-settings',
      slug: 'global-settings',
      content: {
        component: 'settings_global'
      },
      parent_id: 0
    }
  ];
}

// ============================================================================
// MAIN FUNCTION - Diese Funktion ausführen!
// ============================================================================

function setupStoryblok() {
  Logger.log('🚀 Starting Storyblok Setup (FLAT VERSION)...\n');
  
  try {
    // Validierung
    if (STORYBLOK_MANAGEMENT_TOKEN === 'DEIN_MANAGEMENT_TOKEN_HIER') {
      throw new Error('Bitte trage dein Management Token oben im Script ein!');
    }
    if (STORYBLOK_SPACE_ID === 'DEINE_SPACE_ID_HIER') {
      throw new Error('Bitte trage deine Space ID oben im Script ein!');
    }
    
    // Cleanup existing stories and components
    Logger.log('⚠️  CLEANUP MODE: Deleting all existing content...\n');
    cleanupStories();
    cleanupComponents();
    
    // Wait a bit for cleanup to complete
    Logger.log('\n⏳ Waiting 3 seconds for cleanup to complete...\n');
    Utilities.sleep(3000);
    
    // Create Components
    Logger.log('📦 Creating Components...');
    var components = getComponents();
    var createdComponents = 0;
    for (var i = 0; i < components.length; i++) {
      var component = components[i];
      try {
        apiRequest('/spaces/' + STORYBLOK_SPACE_ID + '/components', 'POST', {
          component: component
        });
        Logger.log('✅ Created component: ' + component.display_name);
        createdComponents++;
      } catch (error) {
        Logger.log('❌ Failed to create component ' + component.display_name + ': ' + error.message);
      }
    }
    Logger.log('📦 Created ' + createdComponents + '/' + components.length + ' components\n');
    
    // Wait a bit for components to be ready
    Logger.log('⏳ Waiting 2 seconds for components to be ready...\n');
    Utilities.sleep(2000);

    // Create Stories
    Logger.log('📄 Creating Stories...');
    var stories = getStories();
    var createdStories = 0;
    for (var j = 0; j < stories.length; j++) {
      var story = stories[j];
      try {
        var result = apiRequest('/spaces/' + STORYBLOK_SPACE_ID + '/stories', 'POST', {
          story: story,
          publish: 1
        });
        Logger.log('✅ Created story: ' + story.name + ' (slug: ' + story.slug + ')');
        createdStories++;
      } catch (error) {
        Logger.log('❌ Failed to create story ' + story.name + ': ' + error.message);
      }
    }
    Logger.log('📄 Created ' + createdStories + '/' + stories.length + ' stories\n');

    Logger.log('\n✅ Setup completed successfully!');
    Logger.log('\n📊 Summary:');
    Logger.log('   Components: ' + createdComponents + '/' + components.length);
    Logger.log('   Stories: ' + createdStories + '/' + stories.length);
    Logger.log('\n📝 Next Steps:');
    Logger.log('1. Go to https://app.storyblok.com');
    Logger.log('2. Navigate to your space');
    Logger.log('3. Check the created content types - ALL fields are FLAT!');
    Logger.log('4. Upload team photos and other images');
    Logger.log('5. Fill in the richtext fields (Impressum, Datenschutz)');
    Logger.log('6. Get your Preview Token from Settings > Access Tokens');
    Logger.log('7. Add VITE_STORYBLOK_TOKEN to your .env file');

  } catch (error) {
    Logger.log('❌ Error during setup: ' + error.message);
    throw error;
  }
}