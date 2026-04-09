import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

// Helper component for rendering different block types
function RenderBlocks({ blocks }) {
  if (!blocks) return null;

  return blocks.map((block, i) => {
    // Legacy / Special Blocks from Seed
    if (block.kind === 'hero') {
      return (
        <div key={i} style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '16px',
          padding: '32px',
          textAlign: 'center',
          marginBottom: '24px'
        }}>
          <p style={{ color: 'var(--text-primary)', fontSize: '20px', lineHeight: '1.7', fontWeight: '500' }}>
            {block.text}
          </p>
        </div>
      )
    }

    if (block.kind === 'timeline') {
      return (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '4px' }}>
            Ewolucja AI
          </h3>
          {(block.items ?? []).map((item, j) => (
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

    if (block.kind === 'framework') {
      return (
        <div key={i} style={{ marginBottom: '32px' }}>
          <h2 style={{ color: 'var(--text-primary)', fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>
            {block.title}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '20px' }}>{block.subtitle}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {(block.items ?? []).map((item, j) => (
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

    if (block.kind === 'tip') {
      return (
        <div key={i} style={{
          background: 'var(--amber-dim)',
          border: '1px solid var(--amber-border)',
          borderRadius: '12px',
          padding: '20px 24px',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--amber)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            <span style={{ color: 'var(--amber)', fontWeight: '700', fontSize: '14px' }}>{block.title}</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: '1.6', marginBottom: '12px' }}>{block.desc}</p>
          <div style={{
            background: 'rgba(0,0,0,0.3)',
            borderRadius: '8px',
            padding: '12px 16px',
            fontFamily: 'monospace',
            fontSize: '13px',
            color: 'var(--amber-light)',
            lineHeight: '1.6',
          }}>
            {block.code}
          </div>
        </div>
      )
    }

    if (block.kind === 'paths') {
      return (
        <div key={i} style={{ marginBottom: '24px' }}>
          <h3 style={{ color: 'var(--text-primary)', fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>{block.title}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{
              background: 'var(--amber-dim)',
              border: '1px solid var(--amber-border)',
              borderRadius: '12px',
              padding: '18px',
            }}>
              <div style={{ color: 'var(--amber)', fontWeight: '700', fontSize: '13px', marginBottom: '12px' }}>
                🛠 {block.noCode.title}
              </div>
              {(block.noCode?.items ?? []).map((item, k) => (
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
                💻 {block.code.title}
              </div>
              {(block.code?.items ?? []).map((item, k) => (
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

    if (block.kind === 'team') {
      return (
        <div key={i} style={{ marginBottom: '32px' }}>
          <h2 style={{ color: 'var(--text-primary)', fontSize: '20px', fontWeight: '700', marginBottom: '16px' }}>
            {block.title}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {(block.members ?? []).map((member, j) => (
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
                  {(member.useCases ?? []).map((uc, k) => (
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

    if (block.kind === 'workflow') {
      return (
        <div key={i} style={{ marginBottom: '32px' }}>
          <h3 style={{ color: 'var(--text-primary)', fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>{block.title}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {(block.flows ?? []).map((flow, j) => (
              <div key={j} style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                padding: '18px',
              }}>
                <div style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: '13px', marginBottom: '12px' }}>{flow.title}</div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                  {(flow.steps ?? []).map((step, k) => (
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

    if (block.kind === 'markdown') {
      return (
        <div key={i} style={{
          color: 'var(--text-secondary)',
          fontSize: '15px',
          lineHeight: '1.8',
          marginBottom: '24px',
        }}
          className="markdown-content"
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {block.content}
          </ReactMarkdown>
        </div>
      )
    }

    if (block.kind === 'table') {
      return (
        <div key={i} style={{
          overflowX: 'auto',
          marginBottom: '24px',
          borderRadius: '12px',
          border: '1px solid var(--border-subtle)',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {(block.headers ?? []).map((h, j) => (
                  <th key={j} style={{
                    background: 'var(--bg-surface)',
                    color: 'var(--text-primary)',
                    fontWeight: '600',
                    padding: '12px 16px',
                    textAlign: 'left',
                    borderBottom: '1px solid var(--border-subtle)',
                    fontSize: '13px',
                    letterSpacing: '0.3px',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(block.rows ?? []).map((row, j) => (
                <tr key={j} style={{ background: j % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                  {row.map((cell, k) => (
                    <td key={k} style={{
                      color: 'var(--text-secondary)',
                      padding: '10px 16px',
                      borderBottom: j < block.rows.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                      fontSize: '13px',
                      lineHeight: '1.5',
                    }}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    }

    if (block.kind === 'code') {
      return (
        <div key={i} style={{
          background: 'rgba(0,0,0,0.35)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '12px',
          padding: '20px 24px',
          marginBottom: '24px',
        }}>
          {block.label && (
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px',
              paddingBottom: '10px',
              borderBottom: '1px solid rgba(255,255,255,0.07)',
            }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{block.label}</span>
              {block.language && (
                <span style={{
                  color: 'var(--cyan)',
                  fontSize: '11px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}>{block.language}</span>
              )}
            </div>
          )}
          <pre style={{
            margin: 0,
            fontFamily: 'monospace',
            fontSize: '13px',
            color: 'var(--text-secondary)',
            lineHeight: '1.7',
            overflowX: 'auto',
            whiteSpace: 'pre-wrap',
          }}>
            {block.code}
          </pre>
        </div>
      )
    }

    if (block.kind === 'text_block') {
      return (
        <div key={i} style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px'
        }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: '1.8' }}>{block.text}</p>
        </div>
      )
    }

    // New / Standard Blocks from Live Builder
    if (block.type === 'heading') {
      return <h2 key={i} className="text-2xl font-bold text-cyan-400 mb-6 mt-8">{block.value}</h2>
    }

    if (block.type === 'text' || block.type === 'paragraph') {
      return <p key={i} className="text-slate-300 leading-relaxed mb-6 whitespace-pre-wrap">{block.value}</p>
    }

    if (block.type === 'code') {
      return (
        <div key={i} className="mt-4 mb-6 rounded-lg bg-slate-900 border border-slate-800 p-4 font-mono text-sm">
          <div className="flex justify-between mb-2 border-b border-slate-800 pb-2">
            <span className="text-blue-400 text-xs font-bold uppercase">{block.language}</span>
          </div>
          <pre className="text-slate-300 overflow-x-auto">{block.value}</pre>
        </div>
      )
    }

    if (block.type === 'image') {
      return (
        <div key={i} className="mt-4 mb-6 rounded-xl overflow-hidden border border-slate-800 bg-slate-900 shadow-lg">
          <img src={block.url} alt={block.alt || 'Obraz lekcji'} className="w-full h-auto object-cover" />
        </div>
      )
    }

    return null;
  });
}

export default RenderBlocks
