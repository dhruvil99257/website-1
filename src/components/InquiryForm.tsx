"use client";
import { useEffect, useRef, useState } from "react";
import { fleet, services } from "@/config/content";
import { displayPhone, telHref, whatsappHref } from "@/config/site";
import { useDictionary } from "@/i18n/DictionaryProvider";
import { PREFILL_EVENT, type PrefillData } from "@/lib/prefill";
import { SectionHeading } from "./SectionHeading";
import { CheckIcon, PhoneIcon, WhatsAppIcon } from "./Icons";

type Values = {
  name: string; phone: string; pickup: string; destination: string; date: string;
  passengers: string; seating: string; tripType: string; notes: string;
};
type Field = keyof Values;
const empty: Values = { name: "", phone: "", pickup: "", destination: "", date: "", passengers: "", seating: "", tripType: "", notes: "" };
const ORDER: Field[] = ["name", "phone", "pickup", "destination", "date", "passengers", "seating", "tripType", "notes"];

const todayISO = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
};
/** Accepts "98xxxxxxxx", "+91 98xxx xxxxx", "098xxxxxxxx" → 10 digits or null */
const normalisePhone = (v: string) => {
  const digits = v.replace(/\D/g, "").replace(/^(91|0)(?=\d{10}$)/, "");
  return /^[6-9]\d{9}$/.test(digits) ? digits : null;
};

export function InquiryForm() {
  const { dict } = useDictionary();
  const t = dict.plan;
  const [v, setV] = useState<Values>(empty);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [tried, setTried] = useState(false);
  const [flash, setFlash] = useState<Field[]>([]);
  const [sentUrl, setSentUrl] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const [minDate, setMinDate] = useState("");

  useEffect(() => setMinDate(todayISO()), []);

  // Prefill from "Enquire" / "Plan this trip" buttons elsewhere on the page.
  useEffect(() => {
    const onPrefill = (e: Event) => {
      const d = (e as CustomEvent<PrefillData>).detail;
      const changed: Field[] = [];
      setSentUrl(null);
      setV((prev) => {
        const next = { ...prev };
        if (d.tripType) { next.tripType = d.tripType; changed.push("tripType"); }
        if (d.seating) { next.seating = d.seating; changed.push("seating"); }
        if (d.destination) { next.destination = d.destination; changed.push("destination"); }
        return next;
      });
      setFlash(changed);
      window.setTimeout(() => setFlash([]), 1600);
    };
    window.addEventListener(PREFILL_EVENT, onPrefill);
    return () => window.removeEventListener(PREFILL_EVENT, onPrefill);
  }, []);

  const validate = (vals: Values) => {
    const e: Partial<Record<Field, string>> = {};
    (["name", "pickup", "destination", "date", "passengers", "tripType"] as Field[]).forEach((f) => {
      if (!vals[f].trim()) e[f] = t.errors.required;
    });
    if (!vals.phone.trim()) e.phone = t.errors.required;
    else if (!normalisePhone(vals.phone)) e.phone = t.errors.phone;
    if (vals.passengers && !e.passengers) {
      const n = Number(vals.passengers);
      if (!Number.isInteger(n) || n < 1 || n > 56) e.passengers = t.errors.passengers;
    }
    if (vals.date && !e.date && minDate && vals.date < minDate) e.date = t.errors.date;
    return e;
  };

  const set = (f: Field) => (ev: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const next = { ...v, [f]: ev.target.value };
    setV(next);
    if (tried) setErrors(validate(next));
  };

  const buildMessage = () => {
    const f = t.fields;
    const [y, m, d] = v.date.split("-");
    const seating = v.seating ? (v.seating === "any" ? t.notSure : dict.fleet.items[v.seating as keyof typeof dict.fleet.items]?.name) : t.notSure;
    const trip = dict.services.items[v.tripType as keyof typeof dict.services.items]?.title ?? v.tripType;
    const lines = [
      t.message.greeting,
      "",
      `*${f.name}:* ${v.name.trim()}`,
      `*${f.phone}:* ${normalisePhone(v.phone)}`,
      `*${f.pickup}:* ${v.pickup.trim()}`,
      `*${f.destination}:* ${v.destination.trim()}`,
      `*${f.date}:* ${d}/${m}/${y}`,
      `*${f.passengers}:* ${v.passengers}`,
      `*${f.seating}:* ${seating}`,
      `*${f.tripType}:* ${trip}`,
    ];
    if (v.notes.trim()) lines.push(`*${f.notes}:* ${v.notes.trim()}`);
    lines.push("", `— ${t.message.footer}`);
    return lines.join("\n");
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTried(true);
    const errs = validate(v);
    setErrors(errs);
    const first = ORDER.find((f) => errs[f]);
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    try {
      const res = await fetch("/api/submit-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(v),
      });

      if (!res.ok) {
        const error = await res.json();
        setErrors({ name: error.error || "Submission failed. Please try again." });
        return;
      }

      const url = whatsappHref(buildMessage());
      window.open(url, "_blank", "noopener,noreferrer");
      setSentUrl(url);
      requestAnimationFrame(() => successRef.current?.focus());
    } catch (error) {
      setErrors({ name: "Network error. Please check your connection and try again." });
      console.error("[FORM_ERROR]", error);
    }
  };

  const reset = () => {
    setV(empty);
    setErrors({});
    setTried(false);
    setSentUrl(null);
  };

  const fieldCls = (f: Field) =>
    `w-full min-h-12 rounded-xl border bg-white px-3.5 py-2.5 text-base text-charcoal placeholder:text-muted/70 transition-[border-color,box-shadow] duration-200 focus:outline-none focus:ring-4 ${
      errors[f] ? "border-red-600 focus:ring-red-600/15" : "border-navy/20 focus:border-navy focus:ring-saffron/30"
    } ${flash.includes(f) ? "ring-4 ring-saffron/60 border-saffron" : ""}`;

  const Label = ({ f, optional }: { f: Field; optional?: boolean }) => (
    <label htmlFor={`f-${f}`} className="mb-1.5 block text-sm font-semibold text-navy">
      {t.fields[f]} {optional ? <span className="font-normal text-muted">({t.optional})</span> : <span className="text-red-700" aria-hidden>*</span>}
    </label>
  );
  const Err = ({ f }: { f: Field }) =>
    errors[f] ? (
      <p id={`e-${f}`} className="mt-1 text-sm font-medium text-red-700">
        {errors[f]}
      </p>
    ) : null;
  const a11y = (f: Field) => ({
    id: `f-${f}`,
    name: f,
    "aria-invalid": !!errors[f] || undefined,
    "aria-describedby": errors[f] ? `e-${f}` : undefined,
  });

  return (
    <section id="plan" aria-labelledby="plan-title" className="relative bg-navy pt-4 pb-16 text-white sm:pb-24">
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] gap-10 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14 lg:px-8">
        <div>
          <SectionHeading id="plan-title" eyebrow={t.eyebrow} title={t.title} intro={t.intro} light />
          <ol className="mt-8 hidden space-y-4 lg:block" data-reveal>
            {[t.fields.pickup, t.fields.destination, t.submit].map((s, i) => (
              <li key={i} className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-saffron font-display font-bold text-navy-900">{i + 1}</span>
                <span className="text-white/85">{s}</span>
              </li>
            ))}
          </ol>
          <div className="mt-8 flex flex-wrap items-center gap-3 text-white/80" data-reveal>
            <a href={telHref} className="press inline-flex min-h-11 items-center gap-2 rounded-full px-1 font-semibold text-saffron hover:text-white">
              <PhoneIcon size={18} /> {displayPhone}
            </a>
          </div>
        </div>

        <div className="rounded-3xl bg-cream p-5 text-charcoal shadow-2xl sm:p-7" data-reveal>
          {sentUrl ? (
            <div ref={successRef} tabIndex={-1} className="flex flex-col items-center py-8 text-center outline-none" role="status">
              <span className="grid h-16 w-16 place-items-center rounded-full bg-whatsapp text-white">
                <CheckIcon size={32} />
              </span>
              <h3 className="mt-4 text-2xl font-bold text-navy">{t.success.title}</h3>
              <p className="mt-2 max-w-sm text-muted">{t.success.text}</p>
              <a
                href={sentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="press mt-6 inline-flex min-h-12 items-center gap-2 rounded-xl bg-whatsapp px-5 font-bold text-white"
              >
                <WhatsAppIcon /> {t.success.retry}
              </a>
              <button type="button" onClick={reset} className="press mt-3 min-h-11 px-4 font-semibold text-navy underline underline-offset-4">
                {t.success.again}
              </button>
            </div>
          ) : (
            <form ref={formRef} onSubmit={onSubmit} noValidate className="grid gap-4 sm:grid-cols-2">
              {tried && Object.keys(errors).length > 0 && (
                <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-800 sm:col-span-2">
                  {t.errors.summary}
                </p>
              )}
              <div>
                <Label f="name" />
                <input {...a11y("name")} value={v.name} onChange={set("name")} autoComplete="name" placeholder={t.placeholders.name} className={fieldCls("name")} />
                <Err f="name" />
              </div>
              <div>
                <Label f="phone" />
                <input {...a11y("phone")} value={v.phone} onChange={set("phone")} type="tel" inputMode="tel" autoComplete="tel" placeholder={t.placeholders.phone} maxLength={16} className={fieldCls("phone")} />
                <Err f="phone" />
              </div>
              <div>
                <Label f="pickup" />
                <input {...a11y("pickup")} value={v.pickup} onChange={set("pickup")} autoComplete="address-level2" placeholder={t.placeholders.pickup} className={fieldCls("pickup")} />
                <Err f="pickup" />
              </div>
              <div>
                <Label f="destination" />
                <input {...a11y("destination")} value={v.destination} onChange={set("destination")} placeholder={t.placeholders.destination} className={fieldCls("destination")} />
                <Err f="destination" />
              </div>
              <div>
                <Label f="date" />
                <input {...a11y("date")} value={v.date} onChange={set("date")} type="date" min={minDate || undefined} className={fieldCls("date")} />
                <Err f="date" />
              </div>
              <div>
                <Label f="passengers" />
                <input {...a11y("passengers")} value={v.passengers} onChange={set("passengers")} type="number" inputMode="numeric" min={1} max={56} placeholder={t.placeholders.passengers} className={fieldCls("passengers")} />
                <Err f="passengers" />
              </div>
              <div>
                <Label f="seating" optional />
                <select {...a11y("seating")} value={v.seating} onChange={set("seating")} className={fieldCls("seating")}>
                  <option value="">{t.notSure}</option>
                  {fleet.map((x) => (
                    <option key={x.id} value={x.id}>
                      {dict.fleet.items[x.id].name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label f="tripType" />
                <select {...a11y("tripType")} value={v.tripType} onChange={set("tripType")} className={fieldCls("tripType")}>
                  <option value="" disabled>
                    {t.select}
                  </option>
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {dict.services.items[s.id].title}
                    </option>
                  ))}
                </select>
                <Err f="tripType" />
              </div>
              <div className="sm:col-span-2">
                <Label f="notes" optional />
                <textarea {...a11y("notes")} value={v.notes} onChange={set("notes")} rows={3} placeholder={t.placeholders.notes} className={`${fieldCls("notes")} resize-y`} />
              </div>
              <div className="sm:col-span-2">
                <button type="submit" className="press inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-whatsapp px-6 text-lg font-bold text-white shadow-lg hover:brightness-110">
                  <WhatsAppIcon size={22} /> {t.submit}
                </button>
                <p className="mt-2 text-center text-xs text-muted">{t.privacy}</p>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
