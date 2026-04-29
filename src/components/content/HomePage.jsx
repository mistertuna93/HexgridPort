import React, { useState, useEffect } from 'react'
import { usePortfolioStore } from '../../store/usePortfolioStore'
import gangstuna from '../../assets/gangstuna.png'

const injectFonts = () => {
    if (document.getElementById('mt-fonts')) return
    const link = document.createElement('link')
    link.id = 'mt-fonts'
    link.rel = 'stylesheet'
    link.href = 'https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,700;1,300&family=DM+Mono:wght@300;400;500&display=swap'
    document.head.appendChild(link)
}

const skillsData = {
    'Web Dev': { icon: '⬡', items: ['React / Next.js', 'Three.js / WebGL', 'Tailwind CSS', 'TypeScript', 'REST & GraphQL APIs', 'Responsive & Mobile-first'] },
    'Software Dev': { icon: '◈', items: ['Node.js / Express', 'Python', 'PostgreSQL / MongoDB', 'Docker & CI/CD', 'System Architecture', 'Performance Optimization'] },
    'Graphic Design': { icon: '◭', items: ['Brand Identity', 'UI / Visual Systems', 'Motion & Animation', 'Figma & Adobe Suite', 'Typography', '3D & Spatial Design'] },
    'Product Design': { icon: '◉', items: ['UX Research', 'Wireframing & Prototyping', 'User Journey Mapping', 'Design Systems', 'Accessibility (WCAG)', 'Interaction Design'] },
}

const servicesData = [
    {
        title: 'Website & Web App Development', tag: 'Core Offering',
        desc: 'End-to-end builds — from marketing sites to complex data-driven web apps. Clean code, fast loads, memorable interfaces.',
        highlights: ['Custom React / Next.js builds', 'CMS & headless architectures', 'Performance-tuned & SEO-ready', '3D / immersive experiences'],
    },
    {
        title: 'Custom Software Solutions', tag: 'Core Offering',
        desc: 'Bespoke tools built around your exact workflow — APIs, dashboards, automation pipelines, and anything in between.',
        highlights: ['Full-stack application development', 'API design & integrations', 'Database architecture', 'Ongoing support & iteration'],
    },
    {
        title: 'Technical Consulting', tag: 'Advisory',
        desc: 'Strategic guidance on architecture decisions, tech stack selection, and implementation roadmaps.',
        highlights: ['Code review & audits', 'Stack recommendations', 'Scalability planning', 'Prototype to production'],
    },
]

// Vertical rotated label shown when panel is collapsed
const VerticalLabel = ({ children }) => (
    <div className="flex-1 flex items-center justify-center overflow-hidden">
        <span
            style={{
                fontFamily: "'Syne', sans-serif",
                writingMode: 'vertical-rl',
                textOrientation: 'mixed',
                transform: 'rotate(180deg)',
                letterSpacing: '0.22em',
                whiteSpace: 'nowrap',
            }}
            className="text-sm font-extrabold uppercase text-white/20 tracking-widest select-none"
        >
            {children}
        </span>
    </div>
)

export const HomePage = () => {
    useEffect(() => { injectFonts() }, [])

    const triggerZoom = usePortfolioStore(state => state.triggerZoom)
    const [activeTab, setActiveTab] = useState('nav')
    const [infoTab, setInfoTab] = useState('bio')
    const [activeSkillCat, setActiveSkillCat] = useState('Web Dev')
    const [hoveredPanel, setHoveredPanel] = useState('image')
    const [bottomHovered, setBottomHovered] = useState(false)
    const [openService, setOpenService] = useState(null)

    const bioContent = "Full-stack developer crafting high-performance digital environments where bold aesthetics meet functional engineering."

    const isAbout = hoveredPanel === 'about'
    const isImage = hoveredPanel === 'image'
    const isHelp = hoveredPanel === 'help'

    return (
        <div className="flex flex-col gap-3 w-full h-full animate-in fade-in duration-1000" style={{ fontFamily: "'DM Sans', sans-serif" }}>

            {/* TOP TITLE BAR */}
            <div className="flex-none w-full bg-white/5 border border-white/10 rounded-[2rem] px-8 py-3 backdrop-blur-sm shadow-xl flex items-center justify-center shrink-0 relative overflow-hidden">
                <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.012)_2px,rgba(255,255,255,0.012)_4px)] pointer-events-none" />
                <div className="flex flex-col items-center gap-0.5 relative z-10">
                    <h1 style={{ fontFamily: "'Syne', sans-serif", letterSpacing: '0.04em' }} className="text-2xl md:text-3xl font-extrabold text-white leading-none">
                        mister<span className="text-blue-400">tuna</span><span className="font-light text-white/25" style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.72em' }}>.dev</span>
                    </h1>
                    <p style={{ fontFamily: "'DM Mono', monospace", letterSpacing: '0.28em' }} className="text-[9px] font-light text-blue-500/70 uppercase">
                        full-stack developer &nbsp;·&nbsp; spatial ui &nbsp;·&nbsp; creative engineering
                    </p>
                </div>
            </div>

            {/* THREE-PANEL ROW */}
            <div className="flex flex-row gap-3 min-h-0 flex-1">

                {/* ── ABOUT ME PANEL ── */}
                <div
                    onMouseEnter={() => setHoveredPanel('about')}
                    onMouseLeave={() => setHoveredPanel('image')}
                    style={{
                        flex: isAbout ? '0 0 auto' : '0 0 52px',
                        width: isAbout ? 'auto' : '52px',
                        transition: 'flex 0.5s cubic-bezier(0.4,0,0.2,1), width 0.5s cubic-bezier(0.4,0,0.2,1)',
                    }}
                    className="bg-white/5 border border-white/10 rounded-[2.5rem] flex flex-col overflow-hidden backdrop-blur-sm shadow-2xl"
                >
                    {/* Collapsed: vertical label only */}
                    {!isAbout && <VerticalLabel>About Me</VerticalLabel>}

                    {/* Expanded: full content */}
                    {isAbout && (
                        <div className="flex flex-col items-center justify-center h-full p-6 w-72">
                            {/* Section title */}
                            <h2 style={{ fontFamily: "'Syne', sans-serif", letterSpacing: '0.08em' }} className="text-base font-extrabold text-white uppercase mb-4 text-center">
                                About <span className="text-blue-400">Me</span>
                            </h2>

                            {/* Tabs */}
                            <div className="flex gap-1 mb-3">
                                {['bio', 'skills', 'services'].map((key) => (
                                    <button
                                        key={key}
                                        onClick={() => setInfoTab(key)}
                                        style={{ fontFamily: "'DM Mono', monospace" }}
                                        className={`text-[9px] uppercase tracking-widest transition-all px-2.5 py-1 rounded-lg ${infoTab === key ? 'text-blue-400 bg-blue-950/60 border border-blue-800/40' : 'text-gray-600 hover:text-gray-300 hover:bg-white/5'}`}
                                    >{key}</button>
                                ))}
                            </div>

                            {/* BIO */}
                            {infoTab === 'bio' && (
                                <div className="bg-black/30 rounded-2xl border border-white/8 px-4 py-3 backdrop-blur-md w-full text-center">
                                    <p className="text-xs text-gray-300 font-light leading-relaxed">{bioContent}</p>
                                </div>
                            )}

                            {/* SKILLS */}
                            {infoTab === 'skills' && (
                                <div className="bg-black/30 rounded-2xl border border-white/8 px-3 py-3 backdrop-blur-md w-full">
                                    <div className="flex gap-1.5 mb-2.5 flex-wrap justify-center">
                                        {Object.keys(skillsData).map((cat) => (
                                            <button key={cat} onClick={() => setActiveSkillCat(cat)}
                                                style={{ fontFamily: "'DM Mono', monospace" }}
                                                className={`text-[8px] uppercase tracking-wider px-2 py-1 rounded-lg transition-all ${activeSkillCat === cat ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-500 hover:text-white hover:bg-white/10'}`}>
                                                {skillsData[cat].icon} {cat}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="flex flex-wrap gap-1.5 justify-center">
                                        {skillsData[activeSkillCat].items.map((skill) => (
                                            <span key={skill} className="text-[10px] text-blue-300 bg-blue-950/50 border border-blue-800/40 px-2.5 py-0.5 rounded-lg">{skill}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* SERVICES */}
                            {infoTab === 'services' && (
                                <div className="bg-black/30 rounded-2xl border border-white/8 px-2 py-2 backdrop-blur-md w-full space-y-1 overflow-y-auto custom-scrollbar" style={{ maxHeight: '260px' }}>
                                    {servicesData.map((s) => {
                                        const isOpen = openService === s.title
                                        return (
                                            <div key={s.title} className="rounded-xl overflow-hidden border border-white/5">
                                                <button onClick={() => setOpenService(isOpen ? null : s.title)}
                                                    className="w-full flex items-center justify-between px-3 py-2 hover:bg-white/5 transition-colors">
                                                    <div className="flex items-center gap-2 min-w-0">
                                                        <span style={{ fontFamily: "'DM Mono', monospace" }} className="text-[7px] uppercase tracking-wider text-blue-500 bg-blue-950/60 border border-blue-800/30 px-1.5 py-0.5 rounded-full whitespace-nowrap shrink-0">{s.tag}</span>
                                                        <span className="text-[10px] font-medium text-white text-left truncate">{s.title}</span>
                                                    </div>
                                                    <span className="text-gray-500 text-xs ml-2 shrink-0 transition-transform duration-300" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▾</span>
                                                </button>
                                                <div style={{ maxHeight: isOpen ? '200px' : '0px', transition: 'max-height 0.35s cubic-bezier(0.4,0,0.2,1)', overflow: 'hidden' }}>
                                                    <div className="px-3 pb-2.5 pt-1 border-t border-white/5">
                                                        <p className="text-[10px] text-gray-400 leading-relaxed mb-2">{s.desc}</p>
                                                        <div className="flex flex-wrap gap-1">
                                                            {s.highlights.map((h) => (
                                                                <span key={h} style={{ fontFamily: "'DM Mono', monospace" }} className="text-[8px] text-gray-500 bg-white/5 border border-white/5 px-2 py-0.5 rounded-md">{h}</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* ── IMAGE PANEL ── */}
                <div
                    onMouseEnter={() => setHoveredPanel('image')}
                    className="flex-1 bg-white/5 border border-white/10 rounded-[3rem] flex items-center justify-center overflow-hidden backdrop-blur-sm shadow-2xl min-w-0 relative group"
                >
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-3/4 h-3/4 bg-blue-600/15 blur-[100px] rounded-full group-hover:bg-blue-600/25 transition-all duration-1000" />
                    </div>
                    <img
                        src={gangstuna}
                        alt="Gangstuna Mascot"
                        className="relative z-10 w-full h-full object-contain drop-shadow-[0_0_60px_rgba(59,130,246,0.7)] transform group-hover:scale-105 transition-transform duration-700 p-4"
                    />
                </div>

                {/* ── ABOUT THIS SITE PANEL ── */}
                <div
                    onMouseEnter={() => setHoveredPanel('help')}
                    onMouseLeave={() => setHoveredPanel('image')}
                    style={{
                        flex: isHelp ? '0 0 auto' : '0 0 52px',
                        width: isHelp ? 'auto' : '52px',
                        transition: 'flex 0.5s cubic-bezier(0.4,0,0.2,1), width 0.5s cubic-bezier(0.4,0,0.2,1)',
                    }}
                    className="bg-white/5 border border-white/10 rounded-[2.5rem] flex flex-col overflow-hidden backdrop-blur-sm shadow-2xl"
                >
                    {/* Collapsed: vertical label */}
                    {!isHelp && <VerticalLabel>About This Site</VerticalLabel>}

                    {/* Expanded */}
                    {isHelp && (
                        <div className="flex flex-col items-center justify-center h-full p-6 w-72">
                            <h2 style={{ fontFamily: "'Syne', sans-serif", letterSpacing: '0.08em' }} className="text-base font-extrabold text-white uppercase mb-4 text-center">
                                About This <span className="text-blue-400">Site</span>
                            </h2>

                            <div className="flex p-1 bg-black/40 rounded-2xl border border-white/5 mb-4 w-full">
                                {['nav', 'interact'].map((tab) => (
                                    <button key={tab} onClick={() => setActiveTab(tab)}
                                        style={{ fontFamily: "'DM Mono', monospace" }}
                                        className={`flex-1 py-2 rounded-xl text-[9px] uppercase tracking-wider transition-all ${activeTab === tab ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-white'}`}>
                                        {tab === 'nav' ? 'Navigation' : 'Interaction'}
                                    </button>
                                ))}
                            </div>

                            <div className="bg-black/30 rounded-2xl border border-white/8 px-4 py-3 backdrop-blur-md w-full text-center">
                                <p className="text-xs text-gray-300 font-light leading-relaxed">
                                    {activeTab === 'nav'
                                        ? 'Move your cursor to the screen edges to pan the 3D camera view and explore the space.'
                                        : 'Click the glowing geometric indicators floating in the scene to zoom into individual project vaults.'
                                    }
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* BOTTOM BAR */}
            <div
                onMouseEnter={() => setBottomHovered(true)}
                onMouseLeave={() => setBottomHovered(false)}
                style={{ height: bottomHovered ? '96px' : '36px', transition: 'height 0.4s cubic-bezier(0.4,0,0.2,1)' }}
                className="w-full bg-gradient-to-br from-blue-600/20 via-purple-900/20 to-black/40 border border-white/20 rounded-[2rem] px-8 shadow-2xl relative overflow-hidden flex items-center shrink-0 cursor-pointer"
            >
                <div style={{ opacity: bottomHovered ? 0 : 1, transition: 'opacity 0.2s ease', pointerEvents: bottomHovered ? 'none' : 'auto' }}
                    className="absolute inset-0 flex items-center justify-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                    <span style={{ fontFamily: "'DM Mono', monospace", letterSpacing: '0.25em' }} className="text-[10px] uppercase text-gray-400">Looking to work with us?</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                </div>
                <div style={{ opacity: bottomHovered ? 1 : 0, transition: 'opacity 0.3s ease 0.15s', pointerEvents: bottomHovered ? 'auto' : 'none' }}
                    className="flex flex-row items-center justify-between gap-8 w-full relative z-10">
                    <div className="flex flex-col text-left">
                        <h2 style={{ fontFamily: "'Syne', sans-serif" }} className="text-base font-bold text-white tracking-tight">Let's build something together.</h2>
                        <p className="text-xs text-gray-400 font-light leading-tight mt-0.5">Reach out about web apps, custom software, or technical consulting.</p>
                    </div>
                    <button onClick={() => triggerZoom('contact')}
                        style={{ fontFamily: "'DM Mono', monospace", letterSpacing: '0.12em' }}
                        className="whitespace-nowrap px-6 py-2 bg-white text-black font-medium rounded-xl uppercase hover:bg-blue-500 hover:text-white transition-all shadow-xl active:scale-95 text-[10px]">
                        Become a VIP
                    </button>
                </div>
            </div>

        </div>
    )
}