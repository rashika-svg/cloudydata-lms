/* ============================================================
   Site content.

   Contact details, social links, navigation labels, the founder's
   bio and the "Learn By Doing" philosophy are taken from
   cloudydata.in. The site publishes no enrolment figures, ratings or
   testimonials — anything of that kind here is marked DEMO_ and is
   labelled as illustrative wherever it renders.
   ============================================================ */

/* ---- Contact --------------------------------------------
   WhatsApp is the primary channel on the real site, so it is the
   primary call to action here too. */

export const CONTACT = {
  email: 'info@cloudydata.in',
  phoneDisplay: '+91 83406 28990',
  /** Digits only, for wa.me and tel: links. */
  phone: '918340628990',
  phoneAltDisplay: '+91 89209 50783',
  phoneAlt: '918920950783',
  site: 'cloudydata.in',
  linkedin: 'https://www.linkedin.com/in/ajayyadav1996/',
  instagram: 'https://www.instagram.com/cloudydata.ajay/',
  replyTime: 'Usually replies the same day',
}

/** Pre-filled WhatsApp deep link. */
export function whatsappLink(message: string, alt = false): string {
  const number = alt ? CONTACT.phoneAlt : CONTACT.phone
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}

export const WA_GENERAL = 'Hi Ajay, I found CloudyData online and would like details about your live classes.'

export function waCourse(title: string): string {
  return `Hi Ajay, I would like details about the ${title} course — batch dates, fees and what is covered.`
}

/* ---- Navigation ------------------------------------------
   "About Me" rather than "About us" — CloudyData is one instructor,
   and the site is written in the first person. */

export const NAV = [
  { label: 'Home', to: '/' },
  { label: 'Courses', to: '/courses' },
  { label: 'About Me', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

/* ---- Positioning ----------------------------------------- */

export const HERO = {
  eyebrow: 'Live classes · not recordings',
  title: 'The most affordable live classes in data analytics and data science.',
  sub: 'Learn by doing, in live sessions with me — not a recorded playlist. Guided assignments after every concept, real projects in your portfolio, and daily one-on-one doubt clearing until it makes sense.',
}

export const FOUNDER = {
  name: 'Ajay Yadav',
  role: 'Founder & CEO · Manager, Analytics & Data Science',
  experience: '7+ years',
  initials: 'AY',
  mission:
    'Everyone should have the opportunity to learn and excel in the fields of Data Science and Data Analytics.',
  bio: 'I have spent over seven years solving complex business problems with data analytics, and I now lead analytics and data science as a manager. I started CloudyData because good live training was priced like a luxury — and price should never be the reason someone does not start.',
  teaches: 'I teach every live class myself. There is no rotating bench of instructors.',
}

export interface Pillar {
  title: string
  body: string
  icon: 'code' | 'users' | 'target' | 'briefcase' | 'spark' | 'shield'
}

/** The "Learn By Doing" philosophy, from the About page. */
export const PILLARS: Pillar[] = [
  {
    title: 'Learn by doing',
    body: 'Not a traditional online course. Every concept lands through guided assignments and real-world projects you build yourself.',
    icon: 'code',
  },
  {
    title: 'Live, interactive classes',
    body: 'Real sessions where you can interrupt and ask — not a recorded playlist you watch alone at 2x speed.',
    icon: 'users',
  },
  {
    title: 'Daily 1-on-1 doubt clearing',
    body: 'A teaching assistant available every day, so a blocker on Tuesday does not cost you the rest of the week.',
    icon: 'target',
  },
  {
    title: 'Interview prep from day one',
    body: 'CV crafting, LinkedIn and mock interviews run alongside the syllabus, not bolted on at the end.',
    icon: 'briefcase',
  },
  {
    title: 'The most affordable live classes',
    body: 'Quality education should be inclusive. Pricing is set at the lowest level live training can sustainably run at.',
    icon: 'spark',
  },
  {
    title: 'Industry-oriented curriculum',
    body: 'Practical and job-ready. Every module maps to something you will actually be asked to do at work.',
    icon: 'shield',
  },
]

/* ---- Illustrative figures --------------------------------
   The live site publishes none of these. Clearly marked. */

export const DEMO_STATS = [
  { value: 10000, suffix: '+', label: 'Learners taught' },
  { value: 10, suffix: '', label: 'Career tracks' },
  { value: 94, suffix: '%', label: 'Finish their capstone' },
  { value: 24, suffix: 'h', label: 'Typical doubt response' },
]

export interface Testimonial {
  quote: string
  name: string
  role: string
  course: string
  initials: string
}

/** Demo content written for this build — not real reviews. */
export const DEMO_TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'I came from a non-technical support role and had never written a line of Python. The one-on-one format meant I could ask the stupid questions without an audience. Eight months later I am doing analytics full time.',
    name: 'Priya Nandakumar',
    role: 'Data Analyst',
    course: 'Data Analytics One-on-One',
    initials: 'PN',
  },
  {
    quote:
      'The projects are the whole thing. I walked into interviews with a GitHub profile that actually had pipelines in it, and every conversation turned into a discussion about my own work instead of trivia.',
    name: 'Rohit Sharma',
    role: 'Data Engineer',
    course: 'Data Engineering',
    initials: 'RS',
  },
  {
    quote:
      'What surprised me was interview prep starting in week one. By the time I was job hunting, mock interviews were routine rather than terrifying.',
    name: 'Aisha Khan',
    role: 'Business Analyst',
    course: 'Business Analytics + Gen AI',
    initials: 'AK',
  },
  {
    quote:
      'I compared six programmes on price. CloudyData was the cheapest live option by a distance, and it was still the one where an actual human replied to me the same day.',
    name: 'Vikram Desai',
    role: 'Associate Data Scientist',
    course: 'Data Science',
    initials: 'VD',
  },
]

/* ---- FAQ ------------------------------------------------- */

export const FAQS = [
  {
    q: 'Are the classes live, or recorded?',
    a: 'Live. Every session has me in it, and the Data Analytics track is delivered one-on-one. Recordings exist for revision, but they are not the course.',
  },
  {
    q: 'I have no coding background. Can I still join?',
    a: 'Yes. The Data Analytics, AI-Driven Analytics, Digital Marketing and Data Super Star tracks all start from first principles. Python and SQL are taught from installation onwards, assuming nothing.',
  },
  {
    q: 'What support do I get outside class hours?',
    a: 'Daily one-on-one doubt clearing with a teaching assistant. You are not left waiting a week for the next session to ask a question.',
  },
  {
    q: 'Do you help with placement?',
    a: 'Interview preparation begins on day one and runs alongside the syllabus — CV crafting, LinkedIn, mock interviews and job search assistance are built into every track.',
  },
  {
    q: 'Why is it so much cheaper than other live programmes?',
    a: 'Because affordability is the point. I run this lean and teach the classes myself, so the price stays at the lowest level live training can sustainably run at.',
  },
  {
    q: 'How do I enrol, and how do I pay?',
    a: 'Message me on WhatsApp and we will talk through which track fits, batch dates and fees. There is no automated checkout — I would rather have a five-minute conversation first.',
  },
  {
    q: 'Do I get a certificate?',
    a: 'Yes, on completion of every track. The portfolio of real projects you finish alongside it tends to do more work in interviews.',
  },
]

/* ---- Tools ticker ---------------------------------------- */

export const TOOL_MARQUEE = [
  'Python',
  'SQL',
  'Power BI',
  'Tableau',
  'pandas',
  'scikit-learn',
  'Airflow',
  'Snowflake',
  'BigQuery',
  'Apache Spark',
  'dbt',
  'AWS',
  'GCP',
  'Excel',
  'DAX',
  'GA4',
  'Google Ads',
  'GitHub',
]
