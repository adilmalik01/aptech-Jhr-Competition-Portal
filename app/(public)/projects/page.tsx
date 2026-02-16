'use client'

import { useState } from 'react'
import Link from 'next/link'

const webDesignProjects = [
  {
    id: 1,
    label: 'Website Design Reference 1',
    title: 'SadaPay Landing Page',
    description: 'Recreate the SadaPay homepage with modern UI/UX principles',
    url: 'https://sadapay.pk/',
    icon: '🏦'
  },
  {
    id: 2,
    label: 'Website Design Reference 2',
    title: 'NayaPay Landing Page',
    description: 'Design a frontend clone of NayaPay\'s homepage',
    url: 'https://www.nayapay.com/',
    icon: '💳'
  },
  {
    id: 3,
    label: 'Website Design Reference 3',
    title: 'Amazon Landing Page',
    description: 'Build a responsive homepage inspired by Amazon',
    url: 'https://www.amazon.com/',
    icon: '🛒'
  }
]

const fullStackProjects = [
  {
    id: 1,
    label: 'Project Idea 1',
    title: 'Coming Soon',
    notAssigned: true
  },
  {
    id: 2,
    label: 'Project Idea 2',
    title: 'Coming Soon',
    notAssigned: true
  },
  {
    id: 3,
    label: 'Project Idea 3',
    title: 'Coming Soon',
    notAssigned: true
  }
]

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1e2e] via-[#112436] to-[#0d1b28]">
      {/* Navigation */}
      <nav className="bg-[#0a1e2e]/80 backdrop-blur-md border-b border-cyan-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <span className="text-cyan-400 text-2xl font-bold">&gt;</span>
              <div>
                <h2 className="text-white font-bold text-lg">AJCC</h2>
                <p className="text-cyan-400 text-xs uppercase tracking-wider">Coding Comp</p>
              </div>
            </Link>

            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-slate-400 hover:text-cyan-400 font-medium transition-colors">
                Home
              </Link>
              <Link href="/registration" className="text-slate-400 hover:text-cyan-400 font-medium transition-colors">
                Registration
              </Link>
              <Link href="/categories" className="text-cyan-400 font-medium">
                Categories
              </Link>
              <Link href="/submission" className="text-slate-400 hover:text-cyan-400 font-medium transition-colors">
                Submission
              </Link>
              <Link href="/results" className="text-slate-400 hover:text-cyan-400 font-medium transition-colors">
                Check Result
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Page Header */}
      <div className="text-center py-16 px-4">
        <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 px-6 py-2 rounded-full text-sm font-semibold mb-6">
          <span>⚡</span>
          Innovate for Impact
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">
          Competition Categories
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Choose your track and showcase your skills. Each category offers unique challenges to demonstrate your creativity and technical expertise.
        </p>
      </div>

      {/* Categories Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Web Designing Category */}
          <CategoryCard
            icon="🎨"
            title="Web Designing"
            description="Create stunning, responsive landing pages using HTML, CSS, Bootstrap, or Tailwind CSS. Focus on UI/UX, creativity, and clean code."
            instructions={[
              'Use HTML, CSS, Bootstrap, or Tailwind CSS',
              'Only frontend development (landing page)',
              'Focus on responsive design and clean code',
              'You can choose any ONE of the above references'
            ]}
            projects={webDesignProjects}
          />

          {/* Full Stack Web Development Category */}
          <CategoryCard
            icon="💻"
            title="Full Stack Web Development"
            description="Build complete web applications with frontend, backend, and database integration. Demonstrate your end-to-end development skills."
            instructions={[
              'Full stack development (Frontend + Backend + Database)',
              'Choose any modern tech stack',
              'Project ideas will be announced soon',
              'Check back regularly for updates'
            ]}
            projects={fullStackProjects}
          />

        </div>
      </div>
    </div>
  )
}

function CategoryCard({ icon, title, description, instructions, projects }: any) {
  return (
    <div className="bg-[#112436]/60 backdrop-blur-md border border-cyan-500/20 rounded-2xl p-6 md:p-8 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 hover:-translate-y-1">
      {/* Category Header */}
      <div className="flex items-start gap-6 mb-6">
        <div className="w-16 h-16 bg-cyan-500/10 border-2 border-cyan-500/30 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">
          {icon}
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{title}</h2>
          <p className="text-slate-400 text-sm">{description}</p>
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-4 mb-6">
        {projects.map((project: any) => (
          <ProjectItem key={project.id} project={project} />
        ))}
      </div>

      {/* Instructions */}
      <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-xl p-5">
        <h3 className="text-cyan-400 font-semibold mb-3 flex items-center gap-2">
          📋 Instructions
        </h3>
        <ul className="space-y-2">
          {instructions.map((instruction: any, index: number) => (
            <li key={index} className="text-slate-400 text-sm flex items-start gap-2">
              <span className="text-cyan-400 font-bold">✓</span>
              <span>{instruction}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function ProjectItem({ project }: any) {
  if (project.notAssigned) {
    return (
      <div className="bg-[#0a1e2e]/50 border border-cyan-500/15 rounded-xl p-5">
        <div className="text-cyan-400 text-xs uppercase tracking-wider font-semibold mb-1">
          {project.label}
        </div>
        <div className="text-white font-semibold text-lg mb-2">{project.title}</div>
        <span className="inline-block bg-red-500/10 border border-red-500/30 text-red-400 px-3 py-1 rounded-md text-sm font-semibold">
          📌 Not Assigned Yet
        </span>
      </div>
    )
  }

  return (
    <a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-[#0a1e2e]/50 border border-cyan-500/15 rounded-xl p-5 hover:bg-[#0a1e2e]/80 hover:border-cyan-500/40 transition-all duration-300 group hover:translate-x-1"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="text-cyan-400 text-xs uppercase tracking-wider font-semibold mb-1">
            {project.label}
          </div>
          <div className="text-white font-semibold text-lg mb-1">{project.title}</div>
          <div className="text-slate-400 text-sm">{project.description}</div>
        </div>
        <span className="text-cyan-400 text-xl group-hover:translate-x-1 transition-transform">
          →
        </span>
      </div>
    </a>
  )
}