{/* ── Skills grid ───────────────────────────────────────────────── */}
      <section className="skills-section">
        <div className="section-label" style={{ textAlign: 'center' }}>WHAT WE ANALYZE</div>
        <h2 className="section-heading" style={{ textAlign: 'center' }}>11 Comprehensive SEO Skills</h2>
        <p className="section-sub" style={{ textAlign: 'center', margin: '0 auto' }}>
          Every audit runs all 11 skills in parallel — no cherry-picking, no guesswork.
        </p>

        <div className="skills-grid">
          {SKILLS.map(skill => (
            <div key={skill.key} className="skill-card" style={{ '--skill-color': COLORS[skill.key] }}>
              <div className="skill-card-icon">{skill.icon}</div>
              <div className="skill-card-name">{skill.name}</div>
              <div className="skill-card-desc">{skill.desc}</div>
              <div className="skill-card-bar"></div>
            </div>
          ))}
        </div>
      </section>
