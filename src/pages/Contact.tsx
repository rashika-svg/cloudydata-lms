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
import { Icon, type IconName } from '../components/ui/Icon'
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
      <section className="phead">
        <div className="wrap">
          <h1>Talk to me before you enrol</h1>
          <p>
            Tell me your background and what you want to be doing in a year. You get a straight recommendation —{' '}
            {CONTACT.replyTime.toLowerCase()}.
          </p>
        </div>
      </section>

      <section className="section section--top">
        <div className="wrap contact">
          <div className="contact__channels">
            {CHANNELS.map((c, i) => (
              <a
                key={c.label}
                className={`channel ${c.primary ? 'channel--primary' : ''} rise`}
                style={{ '--i': i } as React.CSSProperties}
                href={c.href}
                target={c.href.startsWith('mailto:') ? undefined : '_blank'}
                rel="noopener noreferrer"
              >
                <span className="channel__icon">
                  <Icon name={c.icon} size={18} />
                </span>
                <span className="channel__body">
                  <span className="channel__label">{c.label}</span>
                  <strong>{c.value}</strong>
                  {c.note && <span className="channel__note">{c.note}</span>}
                </span>
                <Icon name="arrow-up-right" size={15} className="channel__go" />
              </a>
            ))}

            {/* Copying the number is often what people actually want —
                the label swaps to a tick and swaps back on its own. */}
            <button
              type="button"
              className={`copyrow ${copied ? 'is-copied' : ''}`}
              onClick={() => copy(CONTACT.phoneDisplay)}
            >
              <Icon name={copied ? 'check' : 'clipboard'} size={15} />
              <span>{copied ? 'Number copied' : `Copy ${CONTACT.phoneDisplay}`}</span>
            </button>
          </div>

          <div className="contact__form">
            <form className="form panel" onSubmit={onSubmit} noValidate>
              <h2>Or send a message</h2>
              <p className="form__intro">
                WhatsApp is faster, but if you prefer to write it out, this reaches the same inbox.
              </p>

              <div className="fld__pair">
                <div className={`fld ${err('name') ? 'has-error' : ''}`}>
                  <label htmlFor="name">Your name</label>
                  <input id="name" value={values.name} onChange={set('name')} onBlur={blur('name')} placeholder="Priya N." />
                  {err('name') && <span className="fld__err">{err('name')}</span>}
                </div>

                <div className={`fld ${err('email') ? 'has-error' : ''}`}>
                  <label htmlFor="email">Email address</label>
                  <input
                    id="email"
                    type="email"
                    value={values.email}
                    onChange={set('email')}
                    onBlur={blur('email')}
                    placeholder="you@example.com"
                  />
                  {err('email') && <span className="fld__err">{err('email')}</span>}
                </div>
              </div>

              <div className="fld">
                <label htmlFor="course">Course you are interested in</label>
                <div className="fld__select">
                  <select id="course" value={values.course} onChange={set('course')}>
                    <option value="">Not sure yet — recommend one</option>
                    {COURSES.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                  <Icon name="chevron-down" size={15} />
                </div>
              </div>

              <div className={`fld ${err('message') ? 'has-error' : ''}`}>
                <label htmlFor="message">Where are you now, and where do you want to be?</label>
                <textarea
                  id="message"
                  rows={5}
                  value={values.message}
                  onChange={set('message')}
                  onBlur={blur('message')}
                  placeholder="I work in operations, no coding background, and I want to move into analytics within a year…"
                />
                {err('message') && <span className="fld__err">{err('message')}</span>}
              </div>

              <div className="form__foot">
                <Button
                  type="submit"
                  size="lg"
                  variant="brand"
                  icon={status === 'sent' ? 'check' : 'arrow-right'}
                  {...(status !== 'idle' ? { disabled: true } : {})}
                >
                  {status === 'idle' ? 'Send message' : status === 'sending' ? 'Checking…' : 'Validated'}
                </Button>
                <p className="form__fine">{CONTACT.replyTime}</p>
              </div>

              {status === 'sent' && (
                <p className="form__result" role="status">
                  Passed validation. This is a front-end demo with no server — in a live build it would reach{' '}
                  {CONTACT.email}. To actually reach Ajay, use WhatsApp.
                </p>
              )}
            </form>
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="wrap wrap--narrow">
          <SectionHead eyebrow="Questions" title="Asked most often" center />
          <div className="faq">
            {FAQS.slice(0, 5).map((f, i) => (
              <AccordionItem key={f.q} title={f.q} defaultOpen={i === 0}>
                <p>{f.a}</p>
              </AccordionItem>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
