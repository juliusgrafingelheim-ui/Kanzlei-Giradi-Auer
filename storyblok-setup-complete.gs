/**
 * ====================================================================================================
 * STORYBLOK COMPLETE SETUP SCRIPT - GIRARDI & AUER
 * Vollständig flache Struktur - ALLE Inhalte editierbar
 * ====================================================================================================
 * 
 * ANLEITUNG:
 * 1. Öffnen Sie https://script.google.com/
 * 2. Erstellen Sie ein neues Projekt
 * 3. Fügen Sie diesen Code ein
 * 4. Klicken Sie auf "Ausführen" > "main"
 * 5. Authorisieren Sie beim ersten Mal
 * 
 * ====================================================================================================
 */

const CONFIG = {
  API_TOKEN: 'WLWKP9ZfraLjyPlsjFTkyQtt',
  SPACE_ID: '',
  API_BASE: 'https://mapi.storyblok.com/v1',
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 2000,
  AUTO_PUBLISH: true
};

// ===============================
// HELPER FUNCTIONS
// ===============================

function makeRequest(endpoint, method = 'GET', payload = null, retryCount = 0) {
  const url = CONFIG.API_BASE + endpoint;
  const options = {
    method: method,
    headers: {
      'Authorization': CONFIG.API_TOKEN,
      'Content-Type': 'application/json'
    },
    muteHttpExceptions: true
  };
  
  if (payload) {
    options.payload = JSON.stringify(payload);
  }
  
  try {
    const response = UrlFetchApp.fetch(url, options);
    const code = response.getResponseCode();
    const body = response.getContentText();
    
    if (code >= 200 && code < 300) {
      return JSON.parse(body);
    } else if (code === 422 && body.includes('has already been taken')) {
      Logger.log(`⚠️  Resource already exists - ${endpoint}`);
      return { already_exists: true };
    } else if (code === 404) {
      return { not_found: true };
    } else if (retryCount < CONFIG.RETRY_ATTEMPTS) {
      Logger.log(`⚠️  Request failed (${code}), retrying... (${retryCount + 1}/${CONFIG.RETRY_ATTEMPTS})`);
      Utilities.sleep(CONFIG.RETRY_DELAY);
      return makeRequest(endpoint, method, payload, retryCount + 1);
    } else {
      throw new Error(`HTTP ${code}: ${body}`);
    }
  } catch (error) {
    if (retryCount < CONFIG.RETRY_ATTEMPTS) {
      Logger.log(`⚠️  Error: ${error.message}, retrying...`);
      Utilities.sleep(CONFIG.RETRY_DELAY);
      return makeRequest(endpoint, method, payload, retryCount + 1);
    } else {
      throw error;
    }
  }
}

function getSpaceId() {
  if (CONFIG.SPACE_ID) return CONFIG.SPACE_ID;
  
  const response = makeRequest('/spaces/');
  if (response.spaces && response.spaces.length > 0) {
    CONFIG.SPACE_ID = response.spaces[0].id;
    Logger.log(`✅ Space ID: ${CONFIG.SPACE_ID}`);
    return CONFIG.SPACE_ID;
  }
  throw new Error('No spaces found');
}

// ===============================
// CLEANUP FUNCTIONS
// ===============================

function deleteAllStories() {
  const spaceId = getSpaceId();
  Logger.log('🗑️  Deleting all stories...');
  
  let page = 1;
  let totalDeleted = 0;
  let hasMore = true;
  
  while (hasMore) {
    const response = makeRequest(`/spaces/${spaceId}/stories/?per_page=100&page=${page}`);
    
    if (!response.stories || response.stories.length === 0) {
      hasMore = false;
      break;
    }
    
    for (const story of response.stories) {
      try {
        makeRequest(`/spaces/${spaceId}/stories/${story.id}`, 'DELETE');
        totalDeleted++;
        Logger.log(`   ✓ Deleted: ${story.name}`);
      } catch (error) {
        Logger.log(`   ⚠️  Could not delete: ${story.name}`);
      }
      Utilities.sleep(300);
    }
    
    page++;
  }
  
  Logger.log(`✅ Deleted ${totalDeleted} stories`);
  return totalDeleted;
}

function deleteAllComponents() {
  const spaceId = getSpaceId();
  Logger.log('🗑️  Deleting all components (except "page")...');
  
  const response = makeRequest(`/spaces/${spaceId}/components/`);
  
  if (!response.components || response.components.length === 0) {
    Logger.log('   No components to delete');
    return 0;
  }
  
  let totalDeleted = 0;
  
  for (const component of response.components) {
    // Skip the "page" component as requested
    if (component.name === 'page') {
      Logger.log(`   → Skipping "page" component`);
      continue;
    }
    
    try {
      makeRequest(`/spaces/${spaceId}/components/${component.id}`, 'DELETE');
      totalDeleted++;
      Logger.log(`   ✓ Deleted: ${component.name}`);
    } catch (error) {
      Logger.log(`   ⚠️  Could not delete: ${component.name}`);
    }
    Utilities.sleep(300);
  }
  
  Logger.log(`✅ Deleted ${totalDeleted} components`);
  return totalDeleted;
}

function performCompleteCleanup() {
  Logger.log('\n🧹 ==========================================');
  Logger.log('🧹 PERFORMING COMPLETE CLEANUP');
  Logger.log('🧹 ==========================================\n');
  
  const storiesDeleted = deleteAllStories();
  const componentsDeleted = deleteAllComponents();
  
  Logger.log('\n✅ Cleanup complete!');
  Logger.log(`   - ${storiesDeleted} stories deleted`);
  Logger.log(`   - ${componentsDeleted} components deleted\n`);
}

// ===============================
// COMPONENT CREATION
// ===============================

function createComponent(name, schema, displayName = null) {
  const spaceId = getSpaceId();
  const component = {
    component: {
      name: name,
      display_name: displayName || name,
      schema: schema,
      is_root: true,
      is_nestable: false
    }
  };
  
  Logger.log(`Creating: ${name}...`);
  const result = makeRequest(`/spaces/${spaceId}/components/`, 'POST', component);
  
  if (result.already_exists) {
    Logger.log(`✅ ${name} already exists`);
    return { id: null, already_exists: true };
  }
  
  Logger.log(`✅ ${name} created`);
  return result.component;
}

function createStory(name, slug, content) {
  const spaceId = getSpaceId();
  
  const story = {
    story: {
      name: name,
      slug: slug,
      content: content
    },
    publish: CONFIG.AUTO_PUBLISH ? 1 : 0
  };
  
  Logger.log(`Creating story: ${name}...`);
  const result = makeRequest(`/spaces/${spaceId}/stories/`, 'POST', story);
  
  if (result.already_exists) {
    Logger.log(`✅ Story "${name}" already exists`);
    return { id: null, already_exists: true };
  }
  
  Logger.log(`✅ Story "${name}" created`);
  return result.story;
}

// ===============================
// COMPONENT SCHEMAS
// ===============================

function getGlobalSettingsSchema() {
  return {
    law_firm_name: { type: 'text', default_value: 'Girardi & Auer' },
    law_firm_subtitle: { type: 'text', default_value: 'Rechtsanwälte in Regiegemeinschaft' },
    address_street: { type: 'text', default_value: 'Stainerstraße 2' },
    address_city: { type: 'text', default_value: '6020 Innsbruck' },
    phone: { type: 'text', default_value: '+43 (0)512 / 57 40 95' },
    fax: { type: 'text', default_value: '+43 (0)512 / 57 40 97' },
    email: { type: 'text', default_value: 'info@girardi-auer.com' }
  };
}

function getHomePageSchema() {
  return {
    // Hero
    hero_title: { type: 'text', default_value: 'Ihre Rechtsanwälte in Innsbruck' },
    hero_subtitle: { type: 'textarea', default_value: 'Seit 1989 vertreten wir Ihre Interessen mit Kompetenz, Erfahrung und persönlichem Engagement. Vertrauen Sie auf unsere Expertise in allen Rechtsfragen.' },
    hero_cta_text: { type: 'text', default_value: 'Beratungstermin vereinbaren' },
    hero_cta_link: { type: 'text', default_value: '/kontakt' },
    
    // Stats
    stat_1_number: { type: 'text', default_value: '35+' },
    stat_1_label: { type: 'text', default_value: 'Jahre Erfahrung' },
    stat_2_number: { type: 'text', default_value: '9' },
    stat_2_label: { type: 'text', default_value: 'Rechtsgebiete' },
    stat_3_number: { type: 'text', default_value: '5' },
    stat_3_label: { type: 'text', default_value: 'Experten' },
    
    // Expertise Section
    expertise_title: { type: 'text', default_value: 'Unsere Expertise' },
    expertise_subtitle: { type: 'text', default_value: 'Umfassende Rechtsberatung in allen relevanten Bereichen' },
    
    feature_1_title: { type: 'text', default_value: 'Liegenschaftsrecht' },
    feature_1_desc: { type: 'text', default_value: 'Baurecht, Kauf- und Mietverträge' },
    feature_1_icon: { type: 'text', default_value: 'Home' },
    
    feature_2_title: { type: 'text', default_value: 'Familienrecht' },
    feature_2_desc: { type: 'text', default_value: 'Ehe, Scheidung, Obsorge & Unterhalt' },
    feature_2_icon: { type: 'text', default_value: 'HeartHandshake' },
    
    feature_3_title: { type: 'text', default_value: 'Erbrecht' },
    feature_3_desc: { type: 'text', default_value: 'Verlassenschaft & Testamente' },
    feature_3_icon: { type: 'text', default_value: 'Users' },
    
    feature_4_title: { type: 'text', default_value: 'Unternehmensrecht' },
    feature_4_desc: { type: 'text', default_value: 'Gründung & Gesellschaftsverträge' },
    feature_4_icon: { type: 'text', default_value: 'Building' },
    
    // Team Section
    team_section_title: { type: 'text', default_value: 'Unser Team' },
    team_section_subtitle: { type: 'text', default_value: 'Erfahrene Rechtsanwälte mit Engagement und Fachkompetenz' },
    
    // Why Section
    why_title: { type: 'text', default_value: 'Warum Girardi & Auer?' },
    
    why_1_title: { type: 'text', default_value: 'Langjährige Erfahrung' },
    why_1_desc: { type: 'textarea', default_value: 'Seit 1989 betreuen wir erfolgreich Privatpersonen und Unternehmen in Tirol und darüber hinaus.' },
    why_1_icon: { type: 'text', default_value: 'Award' },
    
    why_2_title: { type: 'text', default_value: 'Persönliche Betreuung' },
    why_2_desc: { type: 'textarea', default_value: 'Ihre Anliegen erhalten stets die volle persönliche Aufmerksamkeit unseres erfahrenen Teams.' },
    why_2_icon: { type: 'text', default_value: 'Users' },
    
    why_3_title: { type: 'text', default_value: 'Umfassende Expertise' },
    why_3_desc: { type: 'textarea', default_value: 'Neun Rechtsgebiete und fundierte Ausbildung für kompetente und zuverlässige Beratung.' },
    why_3_icon: { type: 'text', default_value: 'Scale' },
    
    // Location CTA
    location_badge: { type: 'text', default_value: 'Innsbruck Zentrum' },
    location_title: { type: 'text', default_value: 'Brauchen Sie rechtliche Beratung?' },
    location_subtitle: { type: 'textarea', default_value: 'Vereinbaren Sie noch heute einen Termin für ein unverbindliches Erstgespräch.' },
    location_cta_text: { type: 'text', default_value: 'Jetzt Kontakt aufnehmen' },
    location_cta_link: { type: 'text', default_value: '/kontakt' },
    
    // SEO
    seo_title: { type: 'text', default_value: 'Rechtsanwalt Innsbruck | Girardi & Auer | Seit 1989' },
    seo_description: { type: 'textarea', default_value: 'Erfahrene Rechtsanwälte in Innsbruck seit 1989. Spezialisiert auf Liegenschaftsrecht, Baurecht, Vertragsrecht & mehr. ✓ Persönliche Betreuung ✓ Jetzt Termin vereinbaren!' },
    seo_keywords: { type: 'text', default_value: 'Rechtsanwalt Innsbruck, Anwalt Tirol, Rechtsberatung Innsbruck' }
  };
}

function getAboutPageSchema() {
  return {
    // Hero
    hero_badge: { type: 'text', default_value: 'Über uns' },
    hero_title: { type: 'text', default_value: 'Tradition trifft Moderne' },
    hero_subtitle: { type: 'textarea', default_value: 'Seit 1989 stehen wir für kompetente Rechtsberatung mit persönlicher Note. Erfahren Sie mehr über unsere Geschichte, Werte und unser Team.' },
    
    hero_stat_1_number: { type: 'text', default_value: '1989' },
    hero_stat_1_label: { type: 'text', default_value: 'Gegründet' },
    hero_stat_2_number: { type: 'text', default_value: '35+' },
    hero_stat_2_label: { type: 'text', default_value: 'Jahre' },
    hero_stat_3_number: { type: 'text', default_value: '5' },
    hero_stat_3_label: { type: 'text', default_value: 'Team-Member' },
    
    // Geschichte
    history_title: { type: 'text', default_value: 'Unsere Geschichte' },
    
    history_1_year: { type: 'text', default_value: '1989' },
    history_1_title: { type: 'text', default_value: 'Die Gründung' },
    history_1_text: { type: 'textarea', default_value: 'RA Dr. Thomas Girardi hat nach seiner Ausbildung bei einem renommierten Wirtschaftsanwalt seine eigene Rechtsanwaltskanzlei im Jahre 1989 in Innsbruck gegründet.' },
    
    history_2_year: { type: 'text', default_value: '2010' },
    history_2_title: { type: 'text', default_value: 'Erster Regiepartner' },
    history_2_text: { type: 'textarea', default_value: 'RA DI (FH) Mag. Bernd Auer ist nach seiner Ausbildung bei RA Dr. Thomas Girardi in die Kanzlei als Regiepartner eingetreten.' },
    
    history_3_year: { type: 'text', default_value: '2025' },
    history_3_title: { type: 'text', default_value: 'Zweite Regiepartnerin' },
    history_3_text: { type: 'textarea', default_value: 'Frau Mag. Anna Girardi hat sich nach ihrer Ausbildung in der Kanzlei Girardi & Auer im April 2025 als selbstständige Rechtsanwältin eintragen lassen und ist nunmehr ebenfalls Regiepartnerin.' },
    
    // Values
    values_title: { type: 'text', default_value: 'Unsere Werte' },
    
    value_1_title: { type: 'text', default_value: 'Kompetenz' },
    value_1_desc: { type: 'textarea', default_value: 'Fundierte juristische Ausbildung und kontinuierliche Weiterbildung in allen relevanten Rechtsgebieten garantieren höchste fachliche Qualität.' },
    value_1_icon: { type: 'text', default_value: 'Award' },
    
    value_2_title: { type: 'text', default_value: 'Erfahrung' },
    value_2_desc: { type: 'textarea', default_value: 'Über 35 Jahre praktische Erfahrung in der Rechtsberatung und erfolgreiche Vertretung in zahlreichen Mandaten.' },
    value_2_icon: { type: 'text', default_value: 'Users' },
    
    value_3_title: { type: 'text', default_value: 'Engagement' },
    value_3_desc: { type: 'textarea', default_value: 'Persönlicher Einsatz für jeden Mandanten und lösungsorientierte Beratung mit Herz und Verstand.' },
    value_3_icon: { type: 'text', default_value: 'Target' },
    
    value_4_title: { type: 'text', default_value: 'Vertrauen' },
    value_4_desc: { type: 'textarea', default_value: 'Absolute Diskretion und verlässliche Betreuung bilden die Grundlage unserer Mandantenbeziehungen.' },
    value_4_icon: { type: 'text', default_value: 'TrendingUp' },
    
    // Team Section
    team_title: { type: 'text', default_value: 'Unser Team' },
    team_subtitle: { type: 'text', default_value: 'Lernen Sie unsere Rechtsanwälte kennen' },
    
    // SEO
    seo_title: { type: 'text', default_value: 'Über uns - Erfahrene Rechtsanwälte seit 1989 | Girardi & Auer' },
    seo_description: { type: 'textarea', default_value: 'Lernen Sie das Team der Kanzlei Girardi & Auer kennen. Dr. Thomas Girardi, Mag. Bernd Auer & Mag. Anna Girardi – Ihre Rechtsanwälte in Innsbruck seit 1989.' },
    seo_keywords: { type: 'text', default_value: 'Rechtsanwalt Team Innsbruck, Dr. Thomas Girardi, Bernd Auer, Anna Girardi' }
  };
}

function getPracticeAreasPageSchema() {
  return {
    // Hero
    hero_title: { type: 'text', default_value: 'Unsere Rechtsgebiete' },
    hero_subtitle: { type: 'textarea', default_value: 'Umfassende Beratung und Vertretung in allen relevanten Rechtsbereichen' },
    
    // Info
    info_title: { type: 'text', default_value: 'Spezialisierte Rechtsberatung' },
    info_text: { type: 'textarea', default_value: 'Unsere Kanzlei bietet Ihnen kompetente Beratung und Vertretung in neun verschiedenen Rechtsgebieten. Mit langjähriger Erfahrung und fundierter Ausbildung stehen wir Ihnen in allen rechtlichen Belangen zur Seite.' },
    
    // Practice Areas (9 Rechtsgebiete)
    area_1_title: { type: 'text', default_value: 'Liegenschaftsrecht' },
    area_1_desc: { type: 'textarea', default_value: 'Insbesondere Baurecht sowie Kauf-, Übergabe-, Bauträger- und Mietverträge' },
    area_1_icon: { type: 'text', default_value: 'Home' },
    
    area_2_title: { type: 'text', default_value: 'Vergaberecht' },
    area_2_desc: { type: 'textarea', default_value: 'Beratung und Vertretung in allen Belangen des Vergaberechts' },
    area_2_icon: { type: 'text', default_value: 'FileCheck' },
    
    area_3_title: { type: 'text', default_value: 'Schadenersatzrecht' },
    area_3_desc: { type: 'textarea', default_value: 'sowie Gewährleistungsrecht' },
    area_3_icon: { type: 'text', default_value: 'FileText' },
    
    area_4_title: { type: 'text', default_value: 'Ehe- und Scheidungsrecht' },
    area_4_desc: { type: 'textarea', default_value: 'sowie Obsorge, Kontakt- und Unterhaltsrecht' },
    area_4_icon: { type: 'text', default_value: 'HeartHandshake' },
    
    area_5_title: { type: 'text', default_value: 'Erbrecht' },
    area_5_desc: { type: 'textarea', default_value: 'Vertretung im Verlassenschaftsverfahren und Erstellung von letztwilligen Verfügungen' },
    area_5_icon: { type: 'text', default_value: 'Users' },
    
    area_6_title: { type: 'text', default_value: 'Erwachsenenschutz' },
    area_6_desc: { type: 'textarea', default_value: 'Erwachsenenvertretung und Beratung bei Vorsorgevollmachten' },
    area_6_icon: { type: 'text', default_value: 'HeartHandshake' },
    
    area_7_title: { type: 'text', default_value: 'Unternehmensgründung' },
    area_7_desc: { type: 'textarea', default_value: 'Beratung bei Gründung und Erstellung von Gesellschaftsverträgen' },
    area_7_icon: { type: 'text', default_value: 'Building' },
    
    area_8_title: { type: 'text', default_value: 'Inkassowesen und Forderungsbetreibung' },
    area_8_desc: { type: 'textarea', default_value: 'Professionelle Durchsetzung Ihrer Ansprüche' },
    area_8_icon: { type: 'text', default_value: 'TrendingUp' },
    
    area_9_title: { type: 'text', default_value: 'Sonstige Vertretungen' },
    area_9_desc: { type: 'textarea', default_value: 'Außergerichtliche und gerichtliche Vertretung in Zivil- und Strafverfahren' },
    area_9_icon: { type: 'text', default_value: 'Scale' },
    
    // Why Section
    why_title: { type: 'text', default_value: 'Warum Girardi & Auer?' },
    why_subtitle: { type: 'text', default_value: 'Ihre Vorteile bei uns' },
    
    why_1_title: { type: 'text', default_value: 'Breites Spektrum' },
    why_1_desc: { type: 'textarea', default_value: 'Neun Rechtsgebiete unter einem Dach – kompetente Beratung aus einer Hand' },
    
    why_2_title: { type: 'text', default_value: 'Persönliche Betreuung' },
    why_2_desc: { type: 'textarea', default_value: 'Individuelle Lösungen für Ihre rechtlichen Anliegen' },
    
    why_3_title: { type: 'text', default_value: 'Langjährige Erfahrung' },
    why_3_desc: { type: 'textarea', default_value: 'Über 35 Jahre Expertise in der Rechtsberatung' },
    
    // CTA
    cta_text: { type: 'text', default_value: 'Jetzt Beratungstermin vereinbaren' },
    cta_link: { type: 'text', default_value: '/kontakt' },
    
    // SEO
    seo_title: { type: 'text', default_value: 'Rechtsgebiete - Umfassende Beratung | Girardi & Auer Innsbruck' },
    seo_description: { type: 'textarea', default_value: 'Unsere Rechtsgebiete: Liegenschaftsrecht, Vergaberecht, Familienrecht, Erbrecht, Unternehmensrecht & mehr. Kompetente Beratung in Innsbruck seit 1989.' },
    seo_keywords: { type: 'text', default_value: 'Rechtsgebiete Innsbruck, Liegenschaftsrecht, Familienrecht, Erbrecht' }
  };
}

function getContactPageSchema() {
  return {
    hero_title: { type: 'text', default_value: 'Kontakt' },
    hero_subtitle: { type: 'textarea', default_value: 'Wir freuen uns auf Ihre Kontaktaufnahme' },
    
    contact_title: { type: 'text', default_value: 'Vereinbaren Sie einen Termin' },
    
    hours_title: { type: 'text', default_value: 'Öffnungszeiten' },
    hours_text: { type: 'textarea', default_value: 'Montag - Donnerstag: 8:00 - 17:00 Uhr\nFreitag: 8:00 - 14:00 Uhr\n\nTermine außerhalb der Öffnungszeiten nach Vereinbarung möglich.' },
    
    methods_title: { type: 'text', default_value: 'So erreichen Sie uns' },
    
    method_1_title: { type: 'text', default_value: 'Telefonisch' },
    method_1_desc: { type: 'textarea', default_value: 'Rufen Sie uns an für eine erste Beratung oder Terminvereinbarung' },
    
    method_2_title: { type: 'text', default_value: 'Per E-Mail' },
    method_2_desc: { type: 'textarea', default_value: 'Senden Sie uns Ihr Anliegen – wir melden uns zeitnah bei Ihnen' },
    
    method_3_title: { type: 'text', default_value: 'Persönlich' },
    method_3_desc: { type: 'textarea', default_value: 'Besuchen Sie uns in unserer Kanzlei in der Innsbrucker Innenstadt' },
    
    map_title: { type: 'text', default_value: 'Unsere Lage' },
    map_desc: { type: 'text', default_value: 'Zentral gelegen in Innsbruck, nur wenige Gehminuten vom Hauptbahnhof entfernt.' },
    
    seo_title: { type: 'text', default_value: 'Kontakt - Rechtsanwaltskanzlei Girardi & Auer Innsbruck' },
    seo_description: { type: 'textarea', default_value: 'Kontaktieren Sie die Rechtsanwaltskanzlei Girardi & Auer in Innsbruck. Stainerstraße 2, 6020 Innsbruck. Tel: +43 (0)512 / 57 40 95' },
    seo_keywords: { type: 'text', default_value: 'Kontakt Rechtsanwalt Innsbruck, Anwalt Innsbruck Kontakt' }
  };
}

function getImpressumPageSchema() {
  return {
    hero_title: { type: 'text', default_value: 'Impressum' },
    hero_subtitle: { type: 'text', default_value: 'GIRARDI & AUER\nRechtsanwälte in Regiegemeinschaft' },
    
    // Kontaktdaten
    contact_badge: { type: 'text', default_value: 'Kontaktdaten' },
    contact_address: { type: 'text', default_value: 'Stainerstraße 2\n6020 Innsbruck' },
    contact_phone: { type: 'text', default_value: '+43 (0)512 / 57 40 95' },
    contact_fax: { type: 'text', default_value: '+43 (0)512 / 57 40 97' },
    contact_email: { type: 'text', default_value: 'info@girardi-auer.com' },
    
    // Rechtsanwälte
    lawyers_title: { type: 'text', default_value: 'Rechtsanwälte' },
    
    lawyer_1_name: { type: 'text', default_value: 'RA Dr. Thomas Girardi' },
    lawyer_1_code: { type: 'text', default_value: 'ADVM-Code: R802574' },
    lawyer_1_uid: { type: 'text', default_value: 'UID: ATU 31367703' },
    
    lawyer_2_name: { type: 'text', default_value: 'RA DI (FH) Mag. Bernd Auer' },
    lawyer_2_code: { type: 'text', default_value: 'ADVM-Code: R808398' },
    
    lawyer_3_name: { type: 'text', default_value: 'RA Mag. Anna Girardi' },
    lawyer_3_code: { type: 'text', default_value: 'ADVM-Code: R818867' },
    
    // Berufsrechtliche Angaben
    profession_title: { type: 'text', default_value: 'Berufsrechtliche Angaben' },
    profession_designation: { type: 'text', default_value: 'Rechtsanwalt (verliehen in Österreich)' },
    
    chamber_title: { type: 'text', default_value: 'Kammer' },
    chamber_name: { type: 'text', default_value: 'Rechtsanwaltskammer für Tirol' },
    chamber_address: { type: 'text', default_value: 'Meraner Straße 3, 6020 Innsbruck' },
    chamber_website: { type: 'text', default_value: 'www.rechtsanwaelte-tirol.at' },
    
    regulations_title: { type: 'text', default_value: 'Berufsrechtliche Vorschriften' },
    regulations_list: { type: 'textarea', default_value: 'Rechtsanwaltsordnung (RAO)\nAllgemeine Bedingungen für Rechtsanwälte\nStandesregeln der Rechtsanwälte\nDisziplinarstatut der Rechtsanwaltskammern' },
    regulations_note: { type: 'textarea', default_value: 'Die berufsrechtlichen Vorschriften können auf der Website der Österreichischen Rechtsanwaltskammer unter www.rechtsanwaelte.at eingesehen werden.' },
    
    // Haftungsausschluss
    disclaimer_title: { type: 'text', default_value: 'Haftungsausschluss' },
    disclaimer_content: { type: 'textarea', default_value: 'Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.' },
    disclaimer_service: { type: 'textarea', default_value: 'Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.' },
    
    links_title: { type: 'text', default_value: 'Haftung für Links' },
    links_text: { type: 'textarea', default_value: 'Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Inhalte externer Links. Die Rechtsanwälte Girardi & Auer übernehmen keine Verantwortung für Inhalte auf Websites von unseren Partnern und teilnehmenden Firmen, auf die mittels Links verwiesen wird. Für den Inhalt der verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich.' },
    
    copyright_title: { type: 'text', default_value: 'Urheberrecht' },
    copyright_text: { type: 'textarea', default_value: 'Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem österreichischen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.' },
    
    seo_title: { type: 'text', default_value: 'Impressum | Rechtsanwaltskanzlei Girardi & Auer Innsbruck' },
    seo_description: { type: 'text', default_value: 'Impressum der Rechtsanwaltskanzlei Girardi & Auer, Stainerstraße 2, 6020 Innsbruck. Rechtliche Angaben gemäß österreichischem Recht.' }
  };
}

function getDatenschutzPageSchema() {
  return {
    hero_badge: { type: 'text', default_value: 'DSGVO-konform' },
    hero_title: { type: 'text', default_value: 'Datenschutzerklärung' },
    hero_subtitle: { type: 'text', default_value: 'Informationen zur Verarbeitung personenbezogener Daten' },
    
    intro_title: { type: 'text', default_value: 'Datenschutz' },
    intro_text: { type: 'textarea', default_value: 'Der Schutz Ihrer persönlichen Daten ist uns ein besonderes Anliegen. Wir verarbeiten Ihre Daten daher ausschließlich auf Grundlage der gesetzlichen Bestimmungen (DSGVO, TKG 2003). In diesen Datenschutzinformationen informieren wir Sie über die wichtigsten Aspekte der Datenverarbeitung im Rahmen unserer Website und unserer Dienstleistungen.' },
    
    responsible_title: { type: 'text', default_value: 'Verantwortlicher' },
    responsible_text: { type: 'textarea', default_value: 'Girardi & Auer\nRechtsanwälte in Regiegemeinschaft\nStainerstraße 2\n6020 Innsbruck\nTel: +43 (0)512 / 57 40 95\nE-Mail: info@girardi-auer.com' },
    
    collection_title: { type: 'text', default_value: 'Erhebung und Speicherung personenbezogener Daten' },
    collection_text: { type: 'textarea', default_value: 'Wenn Sie mit uns Kontakt aufnehmen (per E-Mail, Telefon oder Kontaktformular), werden Ihre Angaben zwecks Bearbeitung der Anfrage sowie für den Fall von Anschlussfragen bei uns gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.' },
    
    purpose_title: { type: 'text', default_value: 'Zweck der Datenverarbeitung' },
    purpose_text: { type: 'textarea', default_value: 'Die Verarbeitung personenbezogener Daten erfolgt zu folgenden Zwecken:\n\n- Bearbeitung Ihrer Anfragen\n- Durchführung von Mandaten\n- Kommunikation mit Ihnen\n- Erfüllung gesetzlicher Aufbewahrungspflichten' },
    
    rights_title: { type: 'text', default_value: 'Ihre Rechte' },
    rights_text: { type: 'textarea', default_value: 'Ihnen stehen grundsätzlich die Rechte auf Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit, Widerruf und Widerspruch zu. Wenn Sie glauben, dass die Verarbeitung Ihrer Daten gegen das Datenschutzrecht verstößt oder Ihre datenschutzrechtlichen Ansprüche sonst in einer Weise verletzt worden sind, können Sie sich bei der Aufsichtsbehörde beschweren. In Österreich ist dies die Datenschutzbehörde.' },
    
    contact_title: { type: 'text', default_value: 'Kontakt' },
    contact_text: { type: 'textarea', default_value: 'Bei Fragen zum Datenschutz erreichen Sie uns unter:\n\nE-Mail: info@girardi-auer.com\nTel: +43 (0)512 / 57 40 95' },
    
    seo_title: { type: 'text', default_value: 'Datenschutzerklärung | Rechtsanwaltskanzlei Girardi & Auer' },
    seo_description: { type: 'text', default_value: 'Datenschutzerklärung der Rechtsanwaltskanzlei Girardi & Auer. Informationen zur Verarbeitung personenbezogener Daten gemäß DSGVO.' }
  };
}

// ===============================
// MAIN EXECUTION
// ===============================

function main() {
  Logger.log('====================================================================================================');
  Logger.log('🚀 STORYBLOK COMPLETE SETUP - GIRARDI & AUER');
  Logger.log('====================================================================================================');
  
  try {
    const spaceId = getSpaceId();
    
    // CLEANUP
    performCompleteCleanup();
    
    // CREATE COMPONENTS
    Logger.log('\n🔧 Creating Content Types...\n');
    createComponent('settings_global', getGlobalSettingsSchema(), 'Global Settings');
    createComponent('page_home', getHomePageSchema(), 'Page - Home');
    createComponent('page_about', getAboutPageSchema(), 'Page - About');
    createComponent('page_practice_areas', getPracticeAreasPageSchema(), 'Page - Practice Areas');
    createComponent('page_contact', getContactPageSchema(), 'Page - Contact');
    createComponent('page_impressum', getImpressumPageSchema(), 'Page - Impressum');
    createComponent('page_datenschutz', getDatenschutzPageSchema(), 'Page - Datenschutz');
    
    // CREATE STORIES
    Logger.log('\n📝 Creating Stories...\n');
    
    // Global Settings
    createStory('Global Settings', 'global-settings', {
      component: 'settings_global',
      law_firm_name: 'Girardi & Auer',
      law_firm_subtitle: 'Rechtsanwälte in Regiegemeinschaft',
      address_street: 'Stainerstraße 2',
      address_city: '6020 Innsbruck',
      phone: '+43 (0)512 / 57 40 95',
      fax: '+43 (0)512 / 57 40 97',
      email: 'info@girardi-auer.com'
    });
    
    // Home Page - with ALL content
    createStory('Home', 'home', {
      component: 'page_home',
      hero_title: 'Ihre Rechtsanwälte in Innsbruck',
      hero_subtitle: 'Seit 1989 vertreten wir Ihre Interessen mit Kompetenz, Erfahrung und persönlichem Engagement. Vertrauen Sie auf unsere Expertise in allen Rechtsfragen.',
      hero_cta_text: 'Beratungstermin vereinbaren',
      hero_cta_link: '/kontakt',
      stat_1_number: '35+',
      stat_1_label: 'Jahre Erfahrung',
      stat_2_number: '9',
      stat_2_label: 'Rechtsgebiete',
      stat_3_number: '5',
      stat_3_label: 'Experten',
      expertise_title: 'Unsere Expertise',
      expertise_subtitle: 'Umfassende Rechtsberatung in allen relevanten Bereichen',
      feature_1_title: 'Liegenschaftsrecht',
      feature_1_desc: 'Baurecht, Kauf- und Mietverträge',
      feature_1_icon: 'Home',
      feature_2_title: 'Familienrecht',
      feature_2_desc: 'Ehe, Scheidung, Obsorge & Unterhalt',
      feature_2_icon: 'HeartHandshake',
      feature_3_title: 'Erbrecht',
      feature_3_desc: 'Verlassenschaft & Testamente',
      feature_3_icon: 'Users',
      feature_4_title: 'Unternehmensrecht',
      feature_4_desc: 'Gründung & Gesellschaftsverträge',
      feature_4_icon: 'Building',
      team_section_title: 'Unser Team',
      team_section_subtitle: 'Erfahrene Rechtsanwälte mit Engagement und Fachkompetenz',
      why_title: 'Warum Girardi & Auer?',
      why_1_title: 'Langjährige Erfahrung',
      why_1_desc: 'Seit 1989 betreuen wir erfolgreich Privatpersonen und Unternehmen in Tirol und darüber hinaus.',
      why_1_icon: 'Award',
      why_2_title: 'Persönliche Betreuung',
      why_2_desc: 'Ihre Anliegen erhalten stets die volle persönliche Aufmerksamkeit unseres erfahrenen Teams.',
      why_2_icon: 'Users',
      why_3_title: 'Umfassende Expertise',
      why_3_desc: 'Neun Rechtsgebiete und fundierte Ausbildung für kompetente und zuverlässige Beratung.',
      why_3_icon: 'Scale',
      location_badge: 'Innsbruck Zentrum',
      location_title: 'Brauchen Sie rechtliche Beratung?',
      location_subtitle: 'Vereinbaren Sie noch heute einen Termin für ein unverbindliches Erstgespräch.',
      location_cta_text: 'Jetzt Kontakt aufnehmen',
      location_cta_link: '/kontakt',
      seo_title: 'Rechtsanwalt Innsbruck | Girardi & Auer | Seit 1989',
      seo_description: 'Erfahrene Rechtsanwälte in Innsbruck seit 1989. Spezialisiert auf Liegenschaftsrecht, Baurecht, Vertragsrecht & mehr. ✓ Persönliche Betreuung ✓ Jetzt Termin vereinbaren!',
      seo_keywords: 'Rechtsanwalt Innsbruck, Anwalt Tirol, Rechtsberatung Innsbruck'
    });
    
    // About Page
    createStory('Über uns', 'ueber-uns', {
      component: 'page_about',
      hero_badge: 'Über uns',
      hero_title: 'Tradition trifft Moderne',
      hero_subtitle: 'Seit 1989 stehen wir für kompetente Rechtsberatung mit persönlicher Note. Erfahren Sie mehr über unsere Geschichte, Werte und unser Team.',
      hero_stat_1_number: '1989',
      hero_stat_1_label: 'Gegründet',
      hero_stat_2_number: '35+',
      hero_stat_2_label: 'Jahre',
      hero_stat_3_number: '5',
      hero_stat_3_label: 'Team-Member',
      history_title: 'Unsere Geschichte',
      history_1_year: '1989',
      history_1_title: 'Die Gründung',
      history_1_text: 'RA Dr. Thomas Girardi hat nach seiner Ausbildung bei einem renommierten Wirtschaftsanwalt seine eigene Rechtsanwaltskanzlei im Jahre 1989 in Innsbruck gegründet.',
      history_2_year: '2010',
      history_2_title: 'Erster Regiepartner',
      history_2_text: 'RA DI (FH) Mag. Bernd Auer ist nach seiner Ausbildung bei RA Dr. Thomas Girardi in die Kanzlei als Regiepartner eingetreten.',
      history_3_year: '2025',
      history_3_title: 'Zweite Regiepartnerin',
      history_3_text: 'Frau Mag. Anna Girardi hat sich nach ihrer Ausbildung in der Kanzlei Girardi & Auer im April 2025 als selbstständige Rechtsanwältin eintragen lassen und ist nunmehr ebenfalls Regiepartnerin.',
      values_title: 'Unsere Werte',
      value_1_title: 'Kompetenz',
      value_1_desc: 'Fundierte juristische Ausbildung und kontinuierliche Weiterbildung in allen relevanten Rechtsgebieten garantieren höchste fachliche Qualität.',
      value_1_icon: 'Award',
      value_2_title: 'Erfahrung',
      value_2_desc: 'Über 35 Jahre praktische Erfahrung in der Rechtsberatung und erfolgreiche Vertretung in zahlreichen Mandaten.',
      value_2_icon: 'Users',
      value_3_title: 'Engagement',
      value_3_desc: 'Persönlicher Einsatz für jeden Mandanten und lösungsorientierte Beratung mit Herz und Verstand.',
      value_3_icon: 'Target',
      value_4_title: 'Vertrauen',
      value_4_desc: 'Absolute Diskretion und verlässliche Betreuung bilden die Grundlage unserer Mandantenbeziehungen.',
      value_4_icon: 'TrendingUp',
      team_title: 'Unser Team',
      team_subtitle: 'Lernen Sie unsere Rechtsanwälte kennen',
      seo_title: 'Über uns - Erfahrene Rechtsanwälte seit 1989 | Girardi & Auer',
      seo_description: 'Lernen Sie das Team der Kanzlei Girardi & Auer kennen. Dr. Thomas Girardi, Mag. Bernd Auer & Mag. Anna Girardi – Ihre Rechtsanwälte in Innsbruck seit 1989.',
      seo_keywords: 'Rechtsanwalt Team Innsbruck, Dr. Thomas Girardi, Bernd Auer, Anna Girardi'
    });
    
    // Practice Areas - All 9 areas
    createStory('Rechtsgebiete', 'rechtsgebiete', {
      component: 'page_practice_areas',
      hero_title: 'Unsere Rechtsgebiete',
      hero_subtitle: 'Umfassende Beratung und Vertretung in allen relevanten Rechtsbereichen',
      info_title: 'Spezialisierte Rechtsberatung',
      info_text: 'Unsere Kanzlei bietet Ihnen kompetente Beratung und Vertretung in neun verschiedenen Rechtsgebieten. Mit langjähriger Erfahrung und fundierter Ausbildung stehen wir Ihnen in allen rechtlichen Belangen zur Seite.',
      area_1_title: 'Liegenschaftsrecht',
      area_1_desc: 'Insbesondere Baurecht sowie Kauf-, Übergabe-, Bauträger- und Mietverträge',
      area_1_icon: 'Home',
      area_2_title: 'Vergaberecht',
      area_2_desc: 'Beratung und Vertretung in allen Belangen des Vergaberechts',
      area_2_icon: 'FileCheck',
      area_3_title: 'Schadenersatzrecht',
      area_3_desc: 'sowie Gewährleistungsrecht',
      area_3_icon: 'FileText',
      area_4_title: 'Ehe- und Scheidungsrecht',
      area_4_desc: 'sowie Obsorge, Kontakt- und Unterhaltsrecht',
      area_4_icon: 'HeartHandshake',
      area_5_title: 'Erbrecht',
      area_5_desc: 'Vertretung im Verlassenschaftsverfahren und Erstellung von letztwilligen Verfügungen',
      area_5_icon: 'Users',
      area_6_title: 'Erwachsenenschutz',
      area_6_desc: 'Erwachsenenvertretung und Beratung bei Vorsorgevollmachten',
      area_6_icon: 'HeartHandshake',
      area_7_title: 'Unternehmensgründung',
      area_7_desc: 'Beratung bei Gründung und Erstellung von Gesellschaftsverträgen',
      area_7_icon: 'Building',
      area_8_title: 'Inkassowesen und Forderungsbetreibung',
      area_8_desc: 'Professionelle Durchsetzung Ihrer Ansprüche',
      area_8_icon: 'TrendingUp',
      area_9_title: 'Sonstige Vertretungen',
      area_9_desc: 'Außergerichtliche und gerichtliche Vertretung in Zivil- und Strafverfahren',
      area_9_icon: 'Scale',
      why_title: 'Warum Girardi & Auer?',
      why_subtitle: 'Ihre Vorteile bei uns',
      why_1_title: 'Breites Spektrum',
      why_1_desc: 'Neun Rechtsgebiete unter einem Dach – kompetente Beratung aus einer Hand',
      why_2_title: 'Persönliche Betreuung',
      why_2_desc: 'Individuelle Lösungen für Ihre rechtlichen Anliegen',
      why_3_title: 'Langjährige Erfahrung',
      why_3_desc: 'Über 35 Jahre Expertise in der Rechtsberatung',
      cta_text: 'Jetzt Beratungstermin vereinbaren',
      cta_link: '/kontakt',
      seo_title: 'Rechtsgebiete - Umfassende Beratung | Girardi & Auer Innsbruck',
      seo_description: 'Unsere Rechtsgebiete: Liegenschaftsrecht, Vergaberecht, Familienrecht, Erbrecht, Unternehmensrecht & mehr. Kompetente Beratung in Innsbruck seit 1989.',
      seo_keywords: 'Rechtsgebiete Innsbruck, Liegenschaftsrecht, Familienrecht, Erbrecht'
    });
    
    // Contact Page
    createStory('Kontakt', 'kontakt', {
      component: 'page_contact',
      hero_title: 'Kontakt',
      hero_subtitle: 'Wir freuen uns auf Ihre Kontaktaufnahme',
      contact_title: 'Vereinbaren Sie einen Termin',
      hours_title: 'Öffnungszeiten',
      hours_text: 'Montag - Donnerstag: 8:00 - 17:00 Uhr\nFreitag: 8:00 - 14:00 Uhr\n\nTermine außerhalb der Öffnungszeiten nach Vereinbarung möglich.',
      methods_title: 'So erreichen Sie uns',
      method_1_title: 'Telefonisch',
      method_1_desc: 'Rufen Sie uns an für eine erste Beratung oder Terminvereinbarung',
      method_2_title: 'Per E-Mail',
      method_2_desc: 'Senden Sie uns Ihr Anliegen – wir melden uns zeitnah bei Ihnen',
      method_3_title: 'Persönlich',
      method_3_desc: 'Besuchen Sie uns in unserer Kanzlei in der Innsbrucker Innenstadt',
      map_title: 'Unsere Lage',
      map_desc: 'Zentral gelegen in Innsbruck, nur wenige Gehminuten vom Hauptbahnhof entfernt.',
      seo_title: 'Kontakt - Rechtsanwaltskanzlei Girardi & Auer Innsbruck',
      seo_description: 'Kontaktieren Sie die Rechtsanwaltskanzlei Girardi & Auer in Innsbruck. Stainerstraße 2, 6020 Innsbruck. Tel: +43 (0)512 / 57 40 95',
      seo_keywords: 'Kontakt Rechtsanwalt Innsbruck, Anwalt Innsbruck Kontakt'
    });
    
    // Impressum - Complete content
    createStory('Impressum', 'impressum', {
      component: 'page_impressum',
      hero_title: 'Impressum',
      hero_subtitle: 'GIRARDI & AUER\nRechtsanwälte in Regiegemeinschaft',
      contact_badge: 'Kontaktdaten',
      contact_address: 'Stainerstraße 2\n6020 Innsbruck',
      contact_phone: '+43 (0)512 / 57 40 95',
      contact_fax: '+43 (0)512 / 57 40 97',
      contact_email: 'info@girardi-auer.com',
      lawyers_title: 'Rechtsanwälte',
      lawyer_1_name: 'RA Dr. Thomas Girardi',
      lawyer_1_code: 'ADVM-Code: R802574',
      lawyer_1_uid: 'UID: ATU 31367703',
      lawyer_2_name: 'RA DI (FH) Mag. Bernd Auer',
      lawyer_2_code: 'ADVM-Code: R808398',
      lawyer_3_name: 'RA Mag. Anna Girardi',
      lawyer_3_code: 'ADVM-Code: R818867',
      profession_title: 'Berufsrechtliche Angaben',
      profession_designation: 'Rechtsanwalt (verliehen in Österreich)',
      chamber_title: 'Kammer',
      chamber_name: 'Rechtsanwaltskammer für Tirol',
      chamber_address: 'Meraner Straße 3, 6020 Innsbruck',
      chamber_website: 'www.rechtsanwaelte-tirol.at',
      regulations_title: 'Berufsrechtliche Vorschriften',
      regulations_list: 'Rechtsanwaltsordnung (RAO)\nAllgemeine Bedingungen für Rechtsanwälte\nStandesregeln der Rechtsanwälte\nDisziplinarstatut der Rechtsanwaltskammern',
      regulations_note: 'Die berufsrechtlichen Vorschriften können auf der Website der Österreichischen Rechtsanwaltskammer unter www.rechtsanwaelte.at eingesehen werden.',
      disclaimer_title: 'Haftungsausschluss',
      disclaimer_content: 'Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.',
      disclaimer_service: 'Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.',
      links_title: 'Haftung für Links',
      links_text: 'Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Inhalte externer Links. Die Rechtsanwälte Girardi & Auer übernehmen keine Verantwortung für Inhalte auf Websites von unseren Partnern und teilnehmenden Firmen, auf die mittels Links verwiesen wird. Für den Inhalt der verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich.',
      copyright_title: 'Urheberrecht',
      copyright_text: 'Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem österreichischen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.',
      seo_title: 'Impressum | Rechtsanwaltskanzlei Girardi & Auer Innsbruck',
      seo_description: 'Impressum der Rechtsanwaltskanzlei Girardi & Auer, Stainerstraße 2, 6020 Innsbruck. Rechtliche Angaben gemäß österreichischem Recht.'
    });
    
    // Datenschutz - Complete content
    createStory('Datenschutzerklärung', 'datenschutz', {
      component: 'page_datenschutz',
      hero_badge: 'DSGVO-konform',
      hero_title: 'Datenschutzerklärung',
      hero_subtitle: 'Informationen zur Verarbeitung personenbezogener Daten',
      intro_title: 'Datenschutz',
      intro_text: 'Der Schutz Ihrer persönlichen Daten ist uns ein besonderes Anliegen. Wir verarbeiten Ihre Daten daher ausschließlich auf Grundlage der gesetzlichen Bestimmungen (DSGVO, TKG 2003). In diesen Datenschutzinformationen informieren wir Sie über die wichtigsten Aspekte der Datenverarbeitung im Rahmen unserer Website und unserer Dienstleistungen.',
      responsible_title: 'Verantwortlicher',
      responsible_text: 'Girardi & Auer\nRechtsanwälte in Regiegemeinschaft\nStainerstraße 2\n6020 Innsbruck\nTel: +43 (0)512 / 57 40 95\nE-Mail: info@girardi-auer.com',
      collection_title: 'Erhebung und Speicherung personenbezogener Daten',
      collection_text: 'Wenn Sie mit uns Kontakt aufnehmen (per E-Mail, Telefon oder Kontaktformular), werden Ihre Angaben zwecks Bearbeitung der Anfrage sowie für den Fall von Anschlussfragen bei uns gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.',
      purpose_title: 'Zweck der Datenverarbeitung',
      purpose_text: 'Die Verarbeitung personenbezogener Daten erfolgt zu folgenden Zwecken:\n\n- Bearbeitung Ihrer Anfragen\n- Durchführung von Mandaten\n- Kommunikation mit Ihnen\n- Erfüllung gesetzlicher Aufbewahrungspflichten',
      rights_title: 'Ihre Rechte',
      rights_text: 'Ihnen stehen grundsätzlich die Rechte auf Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit, Widerruf und Widerspruch zu. Wenn Sie glauben, dass die Verarbeitung Ihrer Daten gegen das Datenschutzrecht verstößt oder Ihre datenschutzrechtlichen Ansprüche sonst in einer Weise verletzt worden sind, können Sie sich bei der Aufsichtsbehörde beschweren. In Österreich ist dies die Datenschutzbehörde.',
      contact_title: 'Kontakt',
      contact_text: 'Bei Fragen zum Datenschutz erreichen Sie uns unter:\n\nE-Mail: info@girardi-auer.com\nTel: +43 (0)512 / 57 40 95',
      seo_title: 'Datenschutzerklärung | Rechtsanwaltskanzlei Girardi & Auer',
      seo_description: 'Datenschutzerklärung der Rechtsanwaltskanzlei Girardi & Auer. Informationen zur Verarbeitung personenbezogener Daten gemäß DSGVO.'
    });
    
    Logger.log('\n====================================================================================================');
    Logger.log('✅ SETUP COMPLETE!');
    Logger.log('====================================================================================================');
    Logger.log('\n📊 Summary:');
    Logger.log('  ✓ 7 Content Types created');
    Logger.log('  ✓ 7 Stories created with complete content');
    Logger.log('  ✓ All content is now editable in Storyblok');
    Logger.log('\n📝 Next steps:');
    Logger.log('  1. Open Storyblok: https://app.storyblok.com/');
    Logger.log('  2. Review and edit your content');
    Logger.log('  3. Add images from Asset Library');
    Logger.log('  4. Set "home" as startpage manually');
    Logger.log('  5. Frontend will automatically show your changes!');
    Logger.log('\n====================================================================================================');
    
  } catch (error) {
    Logger.log('\n❌ ERROR: ' + error.message);
    Logger.log(error.stack);
    throw error;
  }
}
