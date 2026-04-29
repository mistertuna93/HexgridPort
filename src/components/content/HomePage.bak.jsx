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
        desc: 'End-to-end builds — from marketing sites to complex data-driven web apps.',
        highlights: ['Custom React builds', 'Performance-tuned', '3D experiences'],
    },
    {
        title: 'Custom Software Solutions', tag: 'Core Offering',
        desc: 'Bespoke tools built around your exact workflow.',
        highlights: ['API design', 'Database architecture', 'Full-stack'],
    }
]

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
    useEffect(() => { injectFonts() },)

    const triggerZoom = usePortfolioStore(state => state.triggerZoom)
    const [activeTab, setActiveTab] = useState('nav')
    const [infoTab, setInfoTab] = useState('bio')
    const [activeSkillCat, setActiveSkillCat] = useState('Web Dev')
    const [hoveredPanel, setHoveredPanel] = useState('image')
    const [bottomHovered, setBottomHovered] = useState(false)

    const bioContent = "Full-stack developer crafting high-performance digital environments where bold aesthetics meet functional engineering."

    const isAbout = hoveredPanel === 'about'
    const isHelp = hoveredPanel === 'help'

    // This width represents the Square Image + One Expanded Side Panel (320px)
    const constraintStyles = { maxWidth: 'calc(100vh - 200px + 320px)' }

    return (
        <div className="flex flex-col gap-3 w-full h-full items-center justify-center animate-in fade-in duration-1000 p-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>

            {/* TOP TITLE BAR */}
            <div
                style={constraintStyles}
                className="flex-none w-full bg-white/5 border border-white/10 rounded-[2rem] px-8 py-3 backdrop-blur-sm shadow-xl flex items-center justify-center shrink-0 relative overflow-hidden"
            >
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

            {/* MAIN CONTENT ROW */}
            <div style={constraintStyles} className="flex flex-row gap-3 min-h-0 flex-1 items-center justify-center w-full">

                {/* ABOUT ME PANEL */}
                <div
                    onMouseEnter={() => setHoveredPanel('about')}
                    onMouseLeave={() => setHoveredPanel('image')}
                    style={{
                        width: isAbout ? '320px' : '52px',
                        transition: 'width 0.5s cubic-bezier(0.4,0,0.2,1)',
                    }}
                    className="h-full bg-white/5 border border-white/10 rounded-[2.5rem] flex flex-col overflow-hidden backdrop-blur-sm shadow-2xl shrink-0"
                >
                    {!isAbout && <VerticalLabel>About Me</VerticalLabel>}
                    {isAbout && (
                        <div className="flex flex-col items-center justify-center h-full p-6 w-80">
                            <h2 style={{ fontFamily: "'Syne', sans-serif" }} className="text-base font-extrabold text-white uppercase mb-4">About <span className="text-blue-400">Me</span></h2>
                            <div className="flex gap-1 mb-3">
                                {['bio', 'skills', 'services'].map((key) => (
                                    <button key={key} onClick={() => setInfoTab(key)} className={`text-[9px] px-2.5 py-1 rounded-lg ${infoTab === key ? 'text-blue-400 bg-blue-950/60' : 'text-gray-600'}`}>{key}</button>
                                ))}
                            </div>
                            <div className="bg-black/30 rounded-2xl border border-white/8 px-4 py-3 w-full text-center">
                                <p className="text-xs text-gray-300 font-light">{infoTab === 'bio' ? bioContent : "Technical Expertise & Professional Services"}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* CENTRAL IMAGE PANEL (Square) */}
                <div
                    onMouseEnter={() => setHoveredPanel('image')}
                    className="aspect-square h-full bg-white/5 border border-white/10 rounded-[3rem] flex items-center justify-center overflow-hidden backdrop-blur-sm shadow-2xl relative group shrink-0"
                >
                    <img
                        src={gangstuna}
                        alt="Gangstuna Mascot"
                        className="relative z-10 w-full h-full object-contain p-12 transform group-hover:scale-105 transition-transform duration-700"
                    />
                </div>

                {/* ABOUT THIS SITE PANEL */}
                <div
                    onMouseEnter={() => setHoveredPanel('help')}
                    onMouseLeave={() => setHoveredPanel('image')}
                    style={{
                        width: isHelp ? '320px' : '52px',
                        transition: 'width 0.5s cubic-bezier(0.4,0,0.2,1)',
                    }}
                    className="h-full bg-white/5 border border-white/10 rounded-[2.5rem] flex flex-col overflow-hidden backdrop-blur-sm shadow-2xl shrink-0"
                >
                    {!isHelp && <VerticalLabel>About This Site</VerticalLabel>}
                    {isHelp && (
                        <div className="flex flex-col items-center justify-center h-full p-6 w-80">
                            <h2 style={{ fontFamily: "'Syne', sans-serif" }} className="text-base font-extrabold text-white uppercase mb-4">About <span className="text-blue-400">Site</span></h2>
                            <div className="bg-black/30 rounded-2xl border border-white/8 px-4 py-3 w-full text-center">
                                <p className="text-xs text-gray-300 font-light">Interactive 3D navigation and project exploration guide.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* BOTTOM BAR */}
            <div
                onMouseEnter={() => setBottomHovered(true)}
                onMouseLeave={() => setBottomHovered(false)}
                style={{
                    ...constraintStyles,
                    height: bottomHovered ? '96px' : '36px',
                    transition: 'height 0.4s cubic-bezier(0.4,0,0.2,1)'
                }}
                className="w-full bg-gradient-to-br from-blue-600/20 via-purple-900/20 to-black/40 border border-white/20 rounded-[2rem] px-8 shadow-2xl relative overflow-hidden flex items-center shrink-0 cursor-pointer"
            >
                <div style={{ opacity: bottomHovered ? 0 : 1, transition: 'opacity 0.2s ease' }} className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[10px] uppercase text-gray-400 tracking-[0.25em]">Connect with the developer</span>
                </div>
                <div style={{ opacity: bottomHovered ? 1 : 0, transition: 'opacity 0.3s ease 0.15s' }} className="flex flex-row items-center justify-between w-full relative z-10">
                    <div className="text-left">
                        <h2 className="text-base font-bold text-white">Let's build something.</h2>
                        <p className="text-xs text-gray-400">Technical consulting and custom software development.</p>
                    </div>
                    <button onClick={() => triggerZoom('contact')} className="px-6 py-2 bg-white text-black font-medium rounded-xl uppercase text-[10px]">Contact</button>
                </div>
            </div>
        </div>
    )
}