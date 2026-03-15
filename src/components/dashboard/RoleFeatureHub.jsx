import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, GraduationCap, Users, BookOpen, ShieldCheck } from "lucide-react";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";
import Footer from "../Footer";
import { getFeatureSectionsByRole } from "../../constants/featureHub";

/* ── Per-role hero configuration ───────────────────────────── */
const roleConfig = {
  student: {
    gradient: "from-blue-600 via-indigo-600 to-violet-600",
    orb1: "bg-violet-400/25",
    orb2: "bg-sky-300/20",
    Icon: GraduationCap,
    label: "Student Portal",
  },
  teacher: {
    gradient: "from-emerald-500 via-teal-500 to-cyan-600",
    orb1: "bg-teal-300/25",
    orb2: "bg-emerald-300/20",
    Icon: BookOpen,
    label: "Teacher Portal",
  },
  parent: {
    gradient: "from-violet-600 via-purple-600 to-pink-500",
    orb1: "bg-pink-400/25",
    orb2: "bg-violet-300/20",
    Icon: Users,
    label: "Parent Portal",
  },
  admin: {
    gradient: "from-rose-500 via-orange-500 to-amber-500",
    orb1: "bg-orange-400/25",
    orb2: "bg-rose-300/20",
    Icon: ShieldCheck,
    label: "Admin Portal",
  },
};

/* ── Card accent styles per colour key ─────────────────────── */
const cardAccent = {
  blue:    { icon: "from-blue-500 to-indigo-500",     ring: "ring-blue-200",    hoverBorder: "hover:border-blue-300",    bg: "hover:bg-blue-50",    titleHover: "group-hover:text-blue-700"    },
  cyan:    { icon: "from-cyan-500 to-sky-500",         ring: "ring-cyan-200",    hoverBorder: "hover:border-cyan-300",    bg: "hover:bg-cyan-50",    titleHover: "group-hover:text-cyan-700"    },
  amber:   { icon: "from-amber-500 to-orange-500",    ring: "ring-amber-200",   hoverBorder: "hover:border-amber-300",   bg: "hover:bg-amber-50",   titleHover: "group-hover:text-amber-700"   },
  rose:    { icon: "from-rose-500 to-pink-500",        ring: "ring-rose-200",    hoverBorder: "hover:border-rose-300",    bg: "hover:bg-rose-50",    titleHover: "group-hover:text-rose-700"    },
  indigo:  { icon: "from-indigo-500 to-blue-500",     ring: "ring-indigo-200",  hoverBorder: "hover:border-indigo-300",  bg: "hover:bg-indigo-50",  titleHover: "group-hover:text-indigo-700"  },
  teal:    { icon: "from-teal-500 to-emerald-500",    ring: "ring-teal-200",    hoverBorder: "hover:border-teal-300",    bg: "hover:bg-teal-50",    titleHover: "group-hover:text-teal-700"    },
  orange:  { icon: "from-orange-500 to-red-500",      ring: "ring-orange-200",  hoverBorder: "hover:border-orange-300",  bg: "hover:bg-orange-50",  titleHover: "group-hover:text-orange-700"  },
  emerald: { icon: "from-emerald-500 to-green-500",   ring: "ring-emerald-200", hoverBorder: "hover:border-emerald-300", bg: "hover:bg-emerald-50", titleHover: "group-hover:text-emerald-700" },
  violet:  { icon: "from-violet-500 to-indigo-500",   ring: "ring-violet-200",  hoverBorder: "hover:border-violet-300",  bg: "hover:bg-violet-50",  titleHover: "group-hover:text-violet-700"  },
  yellow:  { icon: "from-yellow-500 to-amber-500",    ring: "ring-yellow-200",  hoverBorder: "hover:border-yellow-300",  bg: "hover:bg-yellow-50",  titleHover: "group-hover:text-yellow-700"  },
  green:   { icon: "from-green-500 to-emerald-500",   ring: "ring-green-200",   hoverBorder: "hover:border-green-300",   bg: "hover:bg-green-50",   titleHover: "group-hover:text-green-700"   },
  pink:    { icon: "from-pink-500 to-rose-500",        ring: "ring-pink-200",    hoverBorder: "hover:border-pink-300",    bg: "hover:bg-pink-50",    titleHover: "group-hover:text-pink-700"    },
};

/* ── Section header accent styles (cycled) ─────────────────── */
const sectionHeaderStyles = [
  "border-blue-500   bg-blue-50   text-blue-800",
  "border-emerald-500 bg-emerald-50 text-emerald-800",
  "border-violet-500 bg-violet-50 text-violet-800",
  "border-pink-500   bg-pink-50   text-pink-800",
];

/* ══════════════════════════════════════════════════════════════ */
const RoleFeatureHub = ({ role, title, subtitle, userName }) => {
  const navigate = useNavigate();
  const sections = useMemo(() => getFeatureSectionsByRole(role), [role]);
  const cfg = roleConfig[role] || roleConfig.student;
  const HeroIcon = cfg.Icon;

  return (
    <>
      <Navbar />
      <div className="flex flex-col md:flex-row min-h-screen bg-slate-50">
        <Sidebar mobileTopBarMode="inline" />

        <main className="flex-1 pt-3 sm:pt-4 md:pt-28 px-3 sm:px-6 pb-12">
          <div className="mx-auto max-w-7xl space-y-8">

            {/* ── Hero Banner ─────────────────────────────────── */}
            <section
              className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 text-white shadow-2xl bg-linear-to-br ${cfg.gradient}`}
            >
              {/* decorative orbs */}
              <div className={`pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full ${cfg.orb1} blur-3xl`} />
              <div className={`pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full ${cfg.orb2} blur-3xl`} />
              <div className="pointer-events-none absolute right-6 top-6 h-24 w-24 rounded-full border border-white/10 bg-white/5" />
              <div className="pointer-events-none absolute right-24 bottom-4 h-12 w-12 rounded-full border border-white/10 bg-white/5" />

              <div className="relative flex flex-col sm:flex-row sm:items-center gap-6">
                <div className="flex-1 min-w-0">
                  {/* Portal label pill */}
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 ring-1 ring-white/20 px-3 py-1 text-[11px] font-bold uppercase tracking-widest mb-3">
                    <HeroIcon size={11} />
                    {cfg.label}
                  </span>

                  <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight drop-shadow">
                    {title}
                  </h1>
                  <p className="mt-2 text-sm sm:text-base text-white/75 max-w-md leading-relaxed">
                    {subtitle}
                  </p>

                  {/* User badge */}
                  <div className="mt-5 inline-flex items-center gap-2.5 rounded-full bg-white/20 ring-1 ring-white/25 px-4 py-2 text-sm font-semibold backdrop-blur-sm">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-300 shadow shadow-emerald-400/60 animate-pulse" />
                    {userName}
                    <span className="text-white/55 text-xs font-normal">· Online</span>
                  </div>
                </div>

                {/* Large role icon – desktop only */}
                <div className="hidden sm:flex h-28 w-28 shrink-0 items-center justify-center rounded-3xl bg-white/10 ring-1 ring-white/20 backdrop-blur-sm shadow-inner">
                  <HeroIcon size={56} strokeWidth={1.4} className="text-white/90 drop-shadow-lg" />
                </div>
              </div>
            </section>

            {/* ── Feature Sections ────────────────────────────── */}
            {sections.map((section, sIdx) => {
              const headerStyle = sectionHeaderStyles[sIdx % sectionHeaderStyles.length];
              return (
                <section key={section.key}>
                  {/* Section header badge */}
                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border-l-4 text-sm font-bold mb-4 ${headerStyle}`}>
                    {section.title}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const ac = cardAccent[item.accent] || cardAccent.blue;

                      return (
                        <button
                          type="button"
                          key={item.title}
                          onClick={() => navigate(item.route)}
                          className={`group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 text-left shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${ac.hoverBorder} ${ac.bg}`}
                        >
                          {/* Subtle background glow on hover */}
                          <div
                            className={`pointer-events-none absolute -right-5 -bottom-5 h-20 w-20 rounded-full bg-linear-to-br ${ac.icon} opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-300`}
                          />

                          {/* Icon */}
                          <div
                            className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br ${ac.icon} text-white shadow-md ring-4 ${ac.ring}`}
                          >
                            <Icon size={20} strokeWidth={2} />
                          </div>

                          {/* Text + arrow */}
                          <div className="mt-3 flex items-start justify-between gap-1">
                            <div className="min-w-0">
                              <p className={`text-sm sm:text-[15px] font-bold text-slate-800 leading-snug transition-colors duration-150 ${ac.titleHover}`}>
                                {item.title}
                              </p>
                              <p className="mt-0.5 text-xs text-slate-500 leading-snug line-clamp-2">
                                {item.subtitle}
                              </p>
                            </div>
                            <ArrowRight
                              size={14}
                              className="shrink-0 mt-0.5 text-slate-300 transition-all duration-200 group-hover:translate-x-1 group-hover:text-slate-500"
                            />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </section>
              );
            })}

          </div>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default RoleFeatureHub;
