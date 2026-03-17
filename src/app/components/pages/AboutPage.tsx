import { Helmet } from "react-helmet-async";
import { Award, Users, Target, TrendingUp, Mail, ArrowRight, Scale, Shield, Briefcase, GraduationCap } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { motion } from "motion/react";
import { Link } from "react-router";
import { useStoryblok } from "../../hooks/useStoryblok";
import * as LucideIcons from "lucide-react";

const getIconComponent = (iconName: string) => {
  const Icon = (LucideIcons as any)[iconName];
  return Icon || Award;
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

const imgOffice1 = "https://images.unsplash.com/photo-1571055931484-22dce9d6c510?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsYXclMjBvZmZpY2UlMjBpbnRlcmlvciUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NzM3NTc5NzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

const teamMembers = [
  {
    name: "Dr. Thomas Girardi",
    title: "Rechtsanwalt",
    role: "Kanzleigründer",
    image: "",
    description:
      "Dr. Thomas Girardi ist seit 1988 als Rechtsanwalt eingetragen und auf Wirtschaftsrecht mit Schwerpunkt Immobilien-, Vertrags-, Bau-, Miet- und Erbrecht spezialisiert.",
    since: "Seit 1989",
    specializations: [
      "Wirtschaftsrecht",
      "Immobilienrecht",
      "Vertragsrecht",
      "Baurecht",
      "Miet- und Erbrecht",
    ],
    isLawyer: true,
  },
  {
    name: "DI (FH) Mag. Bernd Auer",
    title: "Rechtsanwalt",
    role: "Regiepartner",
    image: "",
    description:
      "Mag. Bernd Auer ist seit 2010 selbständiger Rechtsanwalt und Regiepartner der Kanzleigemeinschaft. Seine Fachgebiete umfassen insbesondere Familien-, Schadenersatz-, Versicherungs-, Erb- und Vertragsrecht.",
    since: "Seit 2010",
    specializations: [
      "Familienrecht",
      "Schadenersatzrecht",
      "Versicherungsrecht",
      "Erbrecht",
      "Vertragsrecht",
    ],
    isLawyer: true,
  },
  {
    name: "Mag. Anna Girardi",
    title: "Rechtsanwältin",
    role: "Regiepartnerin",
    image: "",
    description:
      "Mag. Anna Girardi ist seit April 2025 als selbstständige Rechtsanwältin eingetragen und Regiepartnerin der Kanzleigemeinschaft. Zudem ist sie ausgebildete Mediatorin, Konflikt-Coach und systemischer Coach.",
    since: "Seit 2025",
    specializations: [
      "Familienrecht",
      "Mietrecht",
      "Mediation",
      "Konflikt-Coaching",
    ],
    isLawyer: true,
  },
  {
    name: "Mag. B.A. Constanze Girardi",
    title: "Rechtsanwaltsanwärterin",
    role: "Team",
    image: "",
    description:
      "Constanze Girardi ist als Rechtsanwaltsanwärterin Teil unseres Teams und unterstützt die Kanzlei in allen rechtlichen Belangen.",
    since: "Team",
    specializations: [],
    isLawyer: false,
  },
  {
    name: "Monika Girardi",
    title: "Kanzleiassistenz",
    role: "Team",
    image: "",
    description:
      "Monika Girardi ist seit 1989 als Kanzleiassistenz tätig und die erste Ansprechpartnerin für unsere Klienten.",
    since: "Seit 1989",
    specializations: [],
    isLawyer: false,
  },
];

const timeline = [
  {
    year: "1989",
    title: "Die Gründung",
    description: "RA Dr. Thomas Girardi gründet nach seiner Ausbildung bei einem renommierten Wirtschaftsanwalt seine eigene Rechtsanwaltskanzlei in Innsbruck.",
  },
  {
    year: "2010",
    title: "Erster Regiepartner",
    description: "RA DI (FH) Mag. Bernd Auer tritt nach seiner Ausbildung bei RA Dr. Thomas Girardi als Regiepartner in die Kanzlei ein.",
  },
  {
    year: "2025",
    title: "Die nächste Generation",
    description: "RA Mag. Anna Girardi tritt nach ihrer Ausbildung in der Kanzlei Girardi & Auer ebenfalls als Regiepartnerin ein.",
  },
];

export function AboutPage() {
  const { content } = useStoryblok('pages/about');
  const c = content as any;

  // DEBUG: Log entire Storyblok content to see actual field names
  if (c) {
    console.info('[About] Storyblok content keys:', Object.keys(c));
    // Log all fields that contain "image", "foto", "photo", or "member"
    const imageFields = Object.entries(c).filter(([k]) => 
      /image|foto|photo|member|mitglied/i.test(k)
    );
    console.info('[About] Image/member related fields:', imageFields.map(([k, v]) => ({
      key: k,
      type: typeof v,
      value: typeof v === 'object' && v ? (v as any).filename || JSON.stringify(v).slice(0, 100) : v
    })));
  } else {
    console.info('[About] No Storyblok content loaded yet (c is null)');
  }

  // Helper to extract image URL from Storyblok asset field
  // Storyblok can return: { filename: "url" }, "url", "", null, or undefined
  const getAssetUrl = (field: any): string => {
    if (!field) return "";
    if (typeof field === "string") return field;
    if (typeof field === "object" && field.filename) return field.filename;
    return "";
  };

  // Build team: start with hardcoded fallback, then overlay ANY Storyblok fields
  // This ensures images from Storyblok are used even if not all text fields are populated
  const team = teamMembers.map((fallback, idx) => {
    const i = idx + 1;
    if (!c) return fallback;

    // Collect specializations from Storyblok (if any)
    const specs: string[] = [];
    for (let s = 1; s <= 6; s++) {
      const sp = c[`member_${i}_spec_${s}`];
      if (sp) specs.push(sp);
    }

    // Get Storyblok image for this member
    const sbImage = getAssetUrl(c[`member_${i}_image`]);

    // Debug: log what Storyblok returns for this member's image field
    if (import.meta.env.DEV) {
      const raw = c[`member_${i}_image`];
      if (raw) console.info(`[About] member_${i}_image raw:`, raw, '→ resolved:', sbImage);
    }

    return {
      ...fallback,
      name: c[`member_${i}_name`] || fallback.name,
      title: c[`member_${i}_title`] || fallback.title,
      role: c[`member_${i}_role`] || fallback.role,
      image: sbImage || fallback.image,
      description: c[`member_${i}_description`] || fallback.description,
      since: c[`member_${i}_since`] || fallback.since,
      specializations: specs.length > 0 ? specs : fallback.specializations,
    };
  });
}