import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

const lessons = [
  {
    id: '11111111-0000-0000-0000-000000000001',
    title: 'Wstęp – Gdzie jesteśmy z AI?',
    duration: '5 min',
    completed: false,
    content: {
      type: 'intro',
      sections: [
        {
          kind: 'hero',
          text: 'Pewnie zastanawiasz się, w jakiej erze Sztucznej Inteligencji obecnie jesteśmy?',
        },
        {
          kind: 'timeline',
          items: [
            {
              era: '2022',
              label: 'Fiat 126p',
              desc: 'Pierwsze ChatGPT i OpenAI – skromny początek, rewolucyjna iskra.',
              color: 'var(--text-muted)',
            },
            {
              era: '2024',
              label: 'BMW E60',
              desc: 'AI przeszło kilka ewolucji, poszerzyła się konkurencja. Modele stały się potężne i dostępne.',
              color: 'var(--cyan)',
            },
            {
              era: '2026',
              label: 'Bugatti 400 km/h',
              desc: 'Samo Anthropic wydało ponad 60 nowych aktualizacji w ciągu 3 miesięcy. Roboty, asystenci offline, analiza wideo, deepfake – AI jest wszędzie.',
              color: 'var(--amber)',
            },
          ],
        },
      ],
    },
  },
  {
    id: '11111111-0000-0000-0000-000000000002',
    title: 'Sztuka i inżynieria Promptowania',
    duration: '15 min',
    completed: false,
    content: {
      type: 'lesson',
      intro: 'W 2026 roku promptowanie to inżynieria kontekstu, a nie "zaklinanie AI". Modele klasy Frontier (Claude 3.5+, Gemini 2.0+) wymagają precyzyjnej struktury, aby dostarczać przewidywalne wyniki.',
      sections: [
        {
          kind: 'framework',
          title: 'Framework C-O-R-E',
          subtitle: 'Każdy profesjonalny prompt powinien przejść przez tę walidację:',
          items: [
            {
              letter: 'C',
              name: 'Context',
              desc: 'Co model musi wiedzieć o otoczeniu zadania?',
              bad: 'Napisz post na LinkedIn o AI.',
              good: 'Jesteś ekspertem od automatyzacji. Piszesz do właścicieli małych firm (SMB), którzy boją się technologii. Celem jest pokazanie, że AI oszczędza 2h dziennie.',
              color: 'var(--cyan)',
            },
            {
              letter: 'O',
              name: 'Objective',
              desc: 'Jasny, mierzalny wynik. Definiuj czasownikami operacyjnymi.',
              good: 'Wygeneruj listę 5 konkretnych narzędzi no-code z linkami.',
              color: '#a78bfa',
            },
            {
              letter: 'R',
              name: 'Rules',
              desc: '"Guardrails" – czego modelowi nie wolno robić.',
              good: 'Nie używaj przymiotników "rewolucyjny", "niesamowity". Odpowiedź musi mieścić się w 150 słowach.',
              color: 'var(--amber)',
            },
            {
              letter: 'E',
              name: 'Examples',
              desc: 'Pokaż, nie tylko opisuj. 2-3 przykłady Input/Output drastycznie zmniejszają ryzyko halucynacji.',
              color: '#34d399',
            },
          ],
        },
        {
          kind: 'tip',
          title: 'Chain-of-Thought (CoT)',
          desc: 'Zmuszanie modelu do "myślenia na głos" przed podaniem wyniku. To bezpiecznik logiczny.',
          code: 'Przeanalizuj krok po kroku proces logiczny wewnątrz tagów <thinking> przed wygenerowaniem finalnej odpowiedzi.',
        },
        {
          kind: 'paths',
          title: 'Zastosowanie według ścieżki',
          noCode: {
            title: 'No-Code: Agenci Autonomiczni',
            items: [
              'Przenieś C-O-R-E do System Instructions GPTs lub Claude Projects',
              'Używaj zmiennych {{dane}} dla automatyzacji w n8n/Make',
            ],
          },
          code: {
            title: 'Kod: LLM jako Silnik Aplikacji',
            items: [
              'JSON Schema Enforcement – używaj response_format w API',
              'XML Tagging – tagi <context>, <instruction>, <data_to_process>',
              'Delimiter Engineering – separatory ### lub --- przeciw Prompt Injection',
            ],
          },
        },
      ],
    },
  },
  {
    id: '11111111-0000-0000-0000-000000000003',
    title: 'Twój nowy zespół – modele webowe',
    duration: '12 min',
    completed: false,
    content: {
      type: 'lesson',
      intro: 'W 2026 roku nie szukasz "jednego modelu do wszystkiego". Budujesz zespół specjalistów, w którym każdy ma unikalne supermoce.',
      sections: [
        {
          kind: 'team',
          title: 'Matrix Wyboru – Kto jest kim?',
          members: [
            {
              name: 'Claude 3.5/4',
              role: 'Architekt & Logik',
              power: 'Najlepsza logika, brak lania wody, precyzyjne struktury. Coworking przez Artifacts.',
              useCases: ['Strategia i planowanie', 'Refaktoryzacja kodu', 'Precyzyjne analizy'],
              color: '#f97316',
              icon: 'C',
            },
            {
              name: 'Gemini 2.0 Pro',
              role: 'Multimodalny Gigant',
              power: 'Gigantyczne okno kontekstowe. Natywna analiza wideo (Veo) i muzyki (Lyria 3).',
              useCases: ['Analiza 2h wideo jednym promptem', 'Debugging w chmurze', 'Google Workspace'],
              color: '#4285f4',
              icon: 'G',
            },
            {
              name: 'NotebookLM',
              role: 'Twoja Cyfrowa Biblioteka',
              power: 'Brak halucynacji dzięki Source Grounding. Tworzy podcasty z Twoich notatek.',
              useCases: ['Praca na własnej wiedzy', 'Generowanie podcastów', 'Infografiki z .md'],
              color: '#0f9d58',
              icon: 'N',
            },
            {
              name: 'Grok',
              role: 'Scout & Copywriter',
              power: 'Dostęp do danych Real-time z X (Twitter). Najbardziej humanizowany język.',
              useCases: ['Trendy w czasie rzeczywistym', 'Copywriting', 'Social media'],
              color: '#1d9bf0',
              icon: 'X',
            },
          ],
        },
        {
          kind: 'workflow',
          title: 'Workflow Synergii (No-Code)',
          flows: [
            {
              title: 'Analiza i Strategia',
              steps: ['10 PDFów → NotebookLM', 'Stwórz podsumowanie', 'Wklej do Claude', 'Finalna strategia'],
            },
            {
              title: 'Social Media Pipeline',
              steps: ['Sprawdź trendy na Grok', 'Analiza wizualna w Gemini', 'Generuj grafiki w Canva AI'],
            },
          ],
        },
      ],
    },
  },
]

function LessonIntro({ content }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {content.sections.map((section, i) => {
        if (section.kind === 'hero') {
          return (
            <div key={i} style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '16px',
              padding: '32px',
              textAlign: 'center',
            }}>
              <p style={{ color: 'var(--text-primary)', fontSize: '20px', lineHeight: '1.7', fontWeight: '500' }}>
                {section.text}
              </p>
            </div>
          )
        }
        if (section.kind === 'timeline') {
          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ color: 'var(--text-secondary)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '4px' }}>
                Ewolucja AI
              </h3>
              {section.items.map((item, j) => (
                <div key={j} style={{
                  display: 'flex',
                  gap: '20px',
                  background: 'var(--bg-surface)',
                  border: `1px solid ${item.color}33`,
                  borderLeft: `3px solid ${item.color}`,
                  borderRadius: '12px',
                  padding: '20px 24px',
                  alignItems: 'flex-start',
                }}>
                  <div style={{ flexShrink: 0, textAlign: 'center' }}>
                    <div style={{ color: item.color, fontWeight: '800', fontSize: '18px' }}>{item.era}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '11px', marginTop: '2px' }}>rok</div>
                  </div>
                  <div>
                    <div style={{ color: item.color, fontWeight: '700', fontSize: '15px', marginBottom: '6px' }}>
                      {item.label}
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>
                      {item.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        }
        if (section.kind === 'callout') {
          return (
            <div key={i} style={{
              background: 'var(--cyan-dim)',
              border: '1px solid var(--cyan-border)',
              borderRadius: '12px',
              padding: '20px 24px',
              display: 'flex',
              gap: '12px',
              alignItems: 'center',
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--cyan-light)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <p style={{ color: 'var(--cyan-light)', fontSize: '15px', fontWeight: '500' }}>{section.text}</p>
            </div>
          )
        }
        return null
      })}
    </div>
  )
}

function LessonContent({ content }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '12px',
        padding: '24px',
      }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: '1.8' }}>{content.intro}</p>
      </div>

      {content.sections.map((section, i) => {
        if (section.kind === 'framework') {
          return (
            <div key={i}>
              <h2 style={{ color: 'var(--text-primary)', fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>
                {section.title}
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '20px' }}>{section.subtitle}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {section.items.map((item, j) => (
                  <div key={j} style={{
                    background: 'var(--bg-surface)',
                    border: `1px solid ${item.color}33`,
                    borderRadius: '12px',
                    padding: '20px',
                  }}>
                    <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        background: `${item.color}22`,
                        border: `1px solid ${item.color}55`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: item.color,
                        fontWeight: '800',
                        fontSize: '18px',
                        flexShrink: 0,
                      }}>
                        {item.letter}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'baseline', marginBottom: '6px' }}>
                          <span style={{ color: item.color, fontWeight: '700', fontSize: '15px' }}>{item.name}</span>
                          <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>({item.letter})</span>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: '1.6', marginBottom: item.bad || item.good ? '12px' : '0' }}>
                          {item.desc}
                        </p>
                        {item.bad && (
                          <div style={{ marginBottom: '8px' }}>
                            <span style={{ color: '#ef4444', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Źle: </span>
                            <span style={{ color: 'var(--text-muted)', fontSize: '13px', fontStyle: 'italic' }}>{item.bad}</span>
                          </div>
                        )}
                        {item.good && (
                          <div>
                            <span style={{ color: '#34d399', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Dobrze: </span>
                            <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{item.good}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        }

        if (section.kind === 'tip') {
          return (
            <div key={i} style={{
              background: 'var(--amber-dim)',
              border: '1px solid var(--amber-border)',
              borderRadius: '12px',
              padding: '20px 24px',
            }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--amber)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
                <span style={{ color: 'var(--amber)', fontWeight: '700', fontSize: '14px' }}>{section.title}</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: '1.6', marginBottom: '12px' }}>{section.desc}</p>
              <div style={{
                background: 'rgba(0,0,0,0.3)',
                borderRadius: '8px',
                padding: '12px 16px',
                fontFamily: 'monospace',
                fontSize: '13px',
                color: 'var(--amber-light)',
                lineHeight: '1.6',
              }}>
                {section.code}
              </div>
            </div>
          )
        }

        if (section.kind === 'paths') {
          return (
            <div key={i}>
              <h3 style={{ color: 'var(--text-primary)', fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>{section.title}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{
                  background: 'var(--amber-dim)',
                  border: '1px solid var(--amber-border)',
                  borderRadius: '12px',
                  padding: '18px',
                }}>
                  <div style={{ color: 'var(--amber)', fontWeight: '700', fontSize: '13px', marginBottom: '12px' }}>
                    🛠 {section.noCode.title}
                  </div>
                  {section.noCode.items.map((item, k) => (
                    <div key={k} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                      <span style={{ color: 'var(--amber)', flexShrink: 0, marginTop: '2px' }}>›</span>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: '1.5' }}>{item}</span>
                    </div>
                  ))}
                </div>
                <div style={{
                  background: 'var(--cyan-dim)',
                  border: '1px solid var(--cyan-border)',
                  borderRadius: '12px',
                  padding: '18px',
                }}>
                  <div style={{ color: 'var(--cyan-light)', fontWeight: '700', fontSize: '13px', marginBottom: '12px' }}>
                    💻 {section.code.title}
                  </div>
                  {section.code.items.map((item, k) => (
                    <div key={k} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                      <span style={{ color: 'var(--cyan)', flexShrink: 0, marginTop: '2px' }}>›</span>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: '1.5' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        }

        if (section.kind === 'team') {
          return (
            <div key={i}>
              <h2 style={{ color: 'var(--text-primary)', fontSize: '20px', fontWeight: '700', marginBottom: '16px' }}>
                {section.title}
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {section.members.map((member, j) => (
                  <div key={j} style={{
                    background: 'var(--bg-surface)',
                    border: `1px solid ${member.color}33`,
                    borderRadius: '12px',
                    padding: '20px',
                  }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
                      <div style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        background: `${member.color}22`,
                        border: `1px solid ${member.color}55`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: member.color,
                        fontWeight: '800',
                        fontSize: '16px',
                        flexShrink: 0,
                      }}>
                        {member.icon}
                      </div>
                      <div>
                        <div style={{ color: member.color, fontWeight: '700', fontSize: '14px' }}>{member.name}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{member.role}</div>
                      </div>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: '1.6', marginBottom: '12px' }}>
                      {member.power}
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {member.useCases.map((uc, k) => (
                        <div key={k} style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                          <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: member.color, flexShrink: 0 }} />
                          <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{uc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        }

        if (section.kind === 'workflow') {
          return (
            <div key={i}>
              <h3 style={{ color: 'var(--text-primary)', fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>{section.title}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {section.flows.map((flow, j) => (
                  <div key={j} style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '12px',
                    padding: '18px',
                  }}>
                    <div style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: '13px', marginBottom: '12px' }}>{flow.title}</div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                      {flow.steps.map((step, k) => (
                        <div key={k} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <div style={{
                            background: 'var(--cyan-dim)',
                            border: '1px solid var(--cyan-border)',
                            borderRadius: '8px',
                            padding: '6px 12px',
                            color: 'var(--cyan-light)',
                            fontSize: '12px',
                            fontWeight: '500',
                          }}>
                            {step}
                          </div>
                          {k < flow.steps.length - 1 && (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                            </svg>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        }

        return null
      })}
    </div>
  )
}

export default function CoursePage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activeLesson, setActiveLesson] = useState(0)
  const [completedLessons, setCompletedLessons] = useState(new Set())
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarPinned, setSidebarPinned] = useState(false)

  const lesson = lessons[activeLesson]
  const progress = Math.round((completedLessons.size / lessons.length) * 100)

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/login')
  }

  function markComplete() {
    setCompletedLessons(prev => new Set([...prev, activeLesson]))
    if (activeLesson < lessons.length - 1) {
      setActiveLesson(activeLesson + 1)
    }
  }

  return (
    <div style={{ height: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* Header */}
      <header style={{
        padding: '12px 24px',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexShrink: 0,
        gap: '16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              background: 'transparent',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '6px 10px',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              flexShrink: 0,
              cursor: 'pointer',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
            </svg>
            Dashboard
          </button>
          <span style={{ color: 'var(--border-subtle)' }}>/</span>
          <span style={{ color: 'var(--cyan-light)', fontWeight: '700', fontSize: '14px', whiteSpace: 'nowrap' }}>
            Ścieżka Wspólna
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Progress bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '100px', height: '4px', background: 'var(--bg-surface-hover)', borderRadius: '999px', overflow: 'hidden' }}>
              <div style={{
                width: `${progress}%`,
                height: '100%',
                background: 'var(--cyan-gradient)',
                borderRadius: '999px',
                transition: 'width 0.4s ease',
              }} />
            </div>
            <span style={{ color: 'var(--text-muted)', fontSize: '12px', whiteSpace: 'nowrap' }}>{progress}% ukończono</span>
          </div>
          <button
            onClick={handleLogout}
            style={{
              background: 'transparent',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              color: 'var(--text-muted)',
              padding: '6px 14px',
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            Wyloguj
          </button>
        </div>
      </header>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>

        {/* Sidebar */}
        <aside
          onMouseEnter={() => { if (!sidebarPinned) setSidebarOpen(true) }}
          onMouseLeave={() => { if (!sidebarPinned) setSidebarOpen(false) }}
          style={{
            width: sidebarPinned || sidebarOpen ? '280px' : '56px',
            flexShrink: 0,
            borderRight: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            transition: 'width 0.22s ease',
          }}
        >
          {/* Sidebar header */}
          <div style={{
            padding: (sidebarPinned || sidebarOpen) ? '20px 16px 12px' : '20px 0 12px',
            borderBottom: '1px solid var(--border-subtle)',
            flexShrink: 0,
            display: 'flex',
            justifyContent: (sidebarPinned || sidebarOpen) ? 'flex-start' : 'center',
            overflow: 'hidden',
            transition: 'padding 0.22s ease',
          }}>
            {(sidebarPinned || sidebarOpen) ? (
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '4px', whiteSpace: 'nowrap' }}>
                  Lekcje
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '12px', whiteSpace: 'nowrap' }}>
                  {completedLessons.size} / {lessons.length} ukończone
                </div>
              </div>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
            )}
          </div>

          <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '8px' }}>
            {lessons.map((l, idx) => {
              const isActive = idx === activeLesson
              const isDone = completedLessons.has(idx)
              const expanded = sidebarPinned || sidebarOpen
              return (
                <button
                  key={l.id}
                  onClick={() => setActiveLesson(idx)}
                  title={!expanded ? l.title : undefined}
                  style={{
                    width: '100%',
                    background: isActive ? 'var(--cyan-dim)' : 'transparent',
                    border: isActive ? '1px solid var(--cyan-border)' : '1px solid transparent',
                    borderRadius: '10px',
                    padding: expanded ? '12px 14px' : '10px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    gap: expanded ? '12px' : '0',
                    alignItems: 'center',
                    justifyContent: expanded ? 'flex-start' : 'center',
                    marginBottom: '4px',
                    transition: 'background 0.15s, border-color 0.15s, padding 0.22s ease',
                    overflow: 'hidden',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'var(--bg-surface)'
                      e.currentTarget.style.borderColor = 'var(--border-subtle)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.borderColor = 'transparent'
                    }
                  }}
                >
                  {/* Status indicator */}
                  <div style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: isDone
                      ? 'var(--cyan)'
                      : isActive
                        ? 'var(--cyan-dim)'
                        : 'var(--bg-surface)',
                    border: `1.5px solid ${isDone ? 'var(--cyan)' : isActive ? 'var(--cyan-border)' : 'var(--border-subtle)'}`,
                  }}>
                    {isDone ? (
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <span style={{ color: isActive ? 'var(--cyan-light)' : 'var(--text-muted)', fontSize: '10px', fontWeight: '700' }}>
                        {idx + 1}
                      </span>
                    )}
                  </div>

                  {/* Labels – hidden when collapsed */}
                  <div style={{
                    flex: 1,
                    minWidth: 0,
                    overflow: 'hidden',
                    opacity: expanded ? 1 : 0,
                    transition: 'opacity 0.15s ease',
                    pointerEvents: expanded ? 'auto' : 'none',
                  }}>
                    <div style={{
                      color: isActive ? 'var(--cyan-light)' : isDone ? 'var(--text-secondary)' : 'var(--text-primary)',
                      fontSize: '13px',
                      fontWeight: isActive ? '600' : '400',
                      lineHeight: '1.4',
                      marginBottom: '4px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      {l.title}
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '11px', whiteSpace: 'nowrap' }}>{l.duration}</div>
                  </div>
                </button>
              )
            })}
          </div>
        </aside>

        {/* Pin button – outside aside so hovering it doesn't trigger sidebar hover */}
        <button
          onClick={() => {
            setSidebarPinned(p => !p)
            setSidebarOpen(false)
          }}
          title={sidebarPinned ? 'Zwiń sidebar' : 'Przypnij sidebar'}
          style={{
            position: 'absolute',
            left: (sidebarPinned || sidebarOpen) ? '268px' : '44px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: sidebarPinned ? 'var(--cyan)' : 'var(--bg-secondary)',
            border: `1px solid ${sidebarPinned ? 'var(--cyan)' : 'var(--border-subtle)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'left 0.22s ease, background 0.15s, border-color 0.15s',
            padding: 0,
          }}
        >
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke={sidebarPinned ? 'white' : 'var(--text-muted)'}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ transform: sidebarPinned ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.22s ease' }}
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

        {/* Main Content */}
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Lesson Header */}
          <div style={{
            padding: '24px 32px 20px',
            borderBottom: '1px solid var(--border-subtle)',
            flexShrink: 0,
          }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{
                background: 'var(--cyan-dim)',
                border: '1px solid var(--cyan-border)',
                borderRadius: '999px',
                padding: '2px 10px',
                color: 'var(--cyan-light)',
                fontSize: '11px',
                fontWeight: '600',
                letterSpacing: '0.5px',
              }}>
                Lekcja {activeLesson + 1} z {lessons.length}
              </span>
              <span style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '999px',
                padding: '2px 10px',
                color: 'var(--text-muted)',
                fontSize: '11px',
              }}>
                {lesson.duration}
              </span>
            </div>
            <h1 style={{ color: 'var(--text-primary)', fontSize: '22px', fontWeight: '800', lineHeight: '1.3' }}>
              {lesson.title}
            </h1>
          </div>

          {/* Scrollable Content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '28px 32px 40px' }}>
            {lesson.content.type === 'intro'
              ? <LessonIntro content={lesson.content} />
              : <LessonContent content={lesson.content} />
            }

            {/* Navigation Buttons */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '40px',
              paddingTop: '24px',
              borderTop: '1px solid var(--border-subtle)',
            }}>
              <button
                onClick={() => setActiveLesson(Math.max(0, activeLesson - 1))}
                disabled={activeLesson === 0}
                style={{
                  background: 'transparent',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  padding: '10px 20px',
                  color: activeLesson === 0 ? 'var(--text-disabled)' : 'var(--text-secondary)',
                  fontSize: '14px',
                  cursor: activeLesson === 0 ? 'default' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  opacity: activeLesson === 0 ? 0.4 : 1,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
                </svg>
                Poprzednia
              </button>

              {completedLessons.has(activeLesson) ? (
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: '#34d399', fontSize: '14px' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Ukończono
                </div>
              ) : (
                <button
                  onClick={markComplete}
                  style={{
                    background: 'var(--cyan-gradient)',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '10px 24px',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'opacity 0.15s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.85' }}
                  onMouseLeave={(e) => { e.currentTarget.style.opacity = '1' }}
                >
                  Oznacz jako ukończone
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </button>
              )}

              <button
                onClick={() => setActiveLesson(Math.min(lessons.length - 1, activeLesson + 1))}
                disabled={activeLesson === lessons.length - 1}
                style={{
                  background: 'transparent',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  padding: '10px 20px',
                  color: activeLesson === lessons.length - 1 ? 'var(--text-disabled)' : 'var(--text-secondary)',
                  fontSize: '14px',
                  cursor: activeLesson === lessons.length - 1 ? 'default' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  opacity: activeLesson === lessons.length - 1 ? 0.4 : 1,
                }}
              >
                Następna
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
