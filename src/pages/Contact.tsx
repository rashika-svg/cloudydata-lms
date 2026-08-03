/* ============================================================
   Contact.

   WhatsApp first, because that is how the real site works. The form
   is secondary and honest: it validates fully on the client and then
   says plainly that a static build cannot send it.
   ============================================================ */

import { useState, type FormEvent } from 'react'
import { COURSES } from '../data/courses'
import { CONTACT, FAQS, WA_GENERAL, whatsappLink } from '../data/site'
import { useApp } from '../store/app'
import { useCopy } from '../hooks/motion'
import { AccordionItem } from '../components/ui/Accordion'
import { Button } from '../components/ui/Button'
import { SelectField, TextField } from '../components/ui/Field'
import { Icon, type IconName } from '../components/ui/Icon'
import { PageHead, Panel, Section, Wrap } from '../components/ui/Layout'
import { SectionHead } from '../components/ui/Primitives'

interface Fields {
  name: string
  email: string
  course: string
  message: string
}

type Errors = Partial<Record<keyof Fields, string>>
type Status = 'idle' | 'sending' | 'sent'

const EMPTY: Fields = { name: '', email: '', course: '', message: '' }

function validate(v: Fields): Errors {
  const e: Errors = {}
  if (!v.name.trim()) e.name = 'Tell me what to call you.'
  if (!v.email.trim()) e.email = 'An email address is required.'
  // Deliberately permissive — the strict RFC pattern rejects valid addresses.
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = 'That does not look like an email.'
  if (v.message.trim().length < 12) e.message = 'A sentence or two, so my reply is useful.'
  return e
}

const CHANNELS: { icon: IconName; label: string; value: string; href: string; note?: string; primary?: boolean }[] = [
  {
    icon: 'whatsapp',
    label: 'WhatsApp',
    value: CONTACT.phoneDisplay,
    href: whatsappLink(WA_GENERAL),
    note: 'Fastest — this is where enrolments actually happen',
    primary: true,
  },
  { icon: 'whatsapp', label: 'WhatsApp (alternate)', value: CONTACT.phoneAltDisplay, href: whatsappLink(WA_GENERAL, true) },
  { icon: 'mail', label: 'Email', value: CONTACT.email, href: `mailto:${CONTACT.email}` },
  { icon: 'linkedin', label: 'LinkedIn', value: 'in/ajayyadav1996', href: CONTACT.linkedin },
  { icon: 'instagram', label: 'Instagram', value: '@cloudydata.ajay', href: CONTACT.instagram },
]

export default function Contact() {
  const [values, setValues] = useState<Fields>(EMPTY)
  const [touched, setTouched] = useState<Partial<Record<keyof Fields, boolean>>>({})
  const [status, setStatus] = useState<Status>('idle')
  const { pushToast } = useApp()
  const { copied, copy } = useCopy()

  const errors = validate(values)
  const err = (k: keyof Fields) => (touched[k] ? errors[k] : undefined)

  const set =
    (k: keyof Fields) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setValues((v) => ({ ...v, [k]: e.target.value }))

  const blur = (k: keyof Fields) => () => setTouched((t) => ({ ...t, [k]: true }))

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    setTouched({ name: true, email: true, course: true, message: true })
    if (Object.keys(errors).length > 0) return

    setStatus('sending')
    window.setTimeout(() => {
      setStatus('sent')
      pushToast('Validated', { detail: 'No backend in this demo — use WhatsApp to actually reach Ajay.', tone: 'warn' })
    }, 800)
  }

  return (
    <>
      <PageHead title="Talk to me before you enrol">
        Tell me your background and what you want to be doing in a year. You get a straight recommendation —{' '}
        {CONTACT.replyTime.toLowerCase()}.
      </PageHead>

      <Section top>
        <Wrap className="grid items-start gap-8 wide:grid-cols-[340px_minmax(0,1fr)]">
          <div className="flex flex-col gap-3 wide:sticky wide:top-23">
            {CHANNELS.map((c, i) => (
              <a
                key={c.label}
                className={`group rise flex items-center gap-4 rounded-lg border p-4 transition-[border-color,box-shadow] duration-500 ease-decelerate hover:shadow-e1 ${
                  c.primary
                    ? 'border-wa/45 bg-wa/8'
                    : 'border-outline-variant glass ring-1 ring-[var(--glass-edge)] ring-inset hover:border-outline'
                }`}
                style={{ '--i': i } as React.CSSProperties}
                href={c.href}
                target={c.href.startsWith('mailto:') ? undefined : '_blank'}
                rel="noopener noreferrer"
              >
                <span
                  className={`grid size-10.5 flex-none place-items-center rounded-md ${
                    c.primary ? 'bg-wa text-wa-ink' : 'bg-surface-container text-on-surface-variant'
                  }`}
                >
                  <Icon name={c.icon} size={18} />
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-px">
                  <span className="text-[0.6875rem] text-outline">{c.label}</span>
                  <strong className="text-sm">{c.value}</strong>
                  {c.note && <span className="text-[0.6875rem] font-medium text-wa-dark">{c.note}</span>}
                </span>
                <Icon
                  name="arrow-up-right"
                  size={15}
                  className="flex-none text-outline transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
            ))}

            {/* Copying the number is often what people actually want —
                the label swaps to a tick and swaps back on its own. */}
            <button
              type="button"
              className={`inline-flex items-center justify-center gap-2 rounded-full border border-dashed px-4 py-2.5 text-xs transition-colors duration-200 ${
                copied
                  ? 'border-ok text-ok'
                  : 'border-outline-variant text-on-surface-variant hover:border-outline hover:text-on-surface'
              }`}
              onClick={() => copy(CONTACT.phoneDisplay)}
            >
              <Icon name={copied ? 'check' : 'clipboard'} size={15} />
              <span>{copied ? 'Number copied' : `Copy ${CONTACT.phoneDisplay}`}</span>
            </button>
          </div>

          <Panel>
            <form className="flex flex-col gap-4" onSubmit={onSubmit} noValidate>
              <div>
                <h2 className="text-h3">Or send a message</h2>
                <p className="mt-1 text-sm text-on-surface-variant">
                  WhatsApp is faster, but if you prefer to write it out, this reaches the same inbox.
                </p>
              </div>

              <div className="grid gap-4 min-[560px]:grid-cols-2">
                <TextField
                  label="Your name"
                  value={values.name}
                  onChange={set('name')}
                  onBlur={blur('name')}
                  placeholder="Priya N."
                  error={err('name')}
                />
                <TextField
                  label="Email address"
                  type="email"
                  value={values.email}
                  onChange={set('email')}
                  onBlur={blur('email')}
                  placeholder="you@example.com"
                  error={err('email')}
                />
              </div>

              <SelectField label="Course you are interested in" value={values.course} onChange={set('course')}>
                <option value="">Not sure yet — recommend one</option>
                {COURSES.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.title}
                  </option>
                ))}
              </SelectField>

              <TextField
                textarea
                label="Where are you now, and where do you want to be?"
                rows={5}
                value={values.message}
                onChange={set('message')}
                onBlur={blur('message')}
                placeholder="I work in operations, no coding background, and I want to move into analytics within a year…"
                error={err('message')}
              />

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Button
                  type="submit"
                  size="lg"
                  variant="brand"
                  icon={status === 'sent' ? 'check' : 'arrow-right'}
                  {...(status !== 'idle' ? { disabled: true } : {})}
                >
                  {status === 'idle' ? 'Send message' : status === 'sending' ? 'Checking…' : 'Validated'}
                </Button>
                <p className="text-xs text-outline">{CONTACT.replyTime}</p>
              </div>

              {status === 'sent' && (
                <p className="rounded-md bg-ok-container px-4 py-3 text-xs text-ok" role="status">
                  Passed validation. This is a front-end demo with no server — in a live build it would reach{' '}
                  {CONTACT.email}. To actually reach Ajay, use WhatsApp.
                </p>
              )}
            </form>
          </Panel>
        </Wrap>
      </Section>

      <Section tone="alt">
        <Wrap narrow>
          <SectionHead eyebrow="Questions" title="Asked most often" />
          <div className="flex flex-col">
            {FAQS.slice(0, 5).map((f, i) => (
              <AccordionItem key={f.q} title={f.q} defaultOpen={i === 0}>
                <p>{f.a}</p>
              </AccordionItem>
            ))}
          </div>
        </Wrap>
      </Section>
    </>
  )
}
