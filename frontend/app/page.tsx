'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import Footer from '@/layout/Footer'
import LandingHeader from '@/layout/LandingHeader'
import React from 'react';

import { ArrowRight, Play, Eye, GitBranch, Zap, Brain, Database, Lightbulb } from 'lucide-react'

export default function LandingPage() {

  const features = [
    {
      icon: <Eye className="w-6 h-6" />,
      title: 'Visual Code Explanation',
      description: 'See what your code does with interactive visual representations and highlighted execution paths.'
    },
    {
      icon: <GitBranch className="w-6 h-6" />,
      title: 'Code Flowchart Generator',
      description: 'Automatically generate flowcharts that visualize the logic and control flow of your code.'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Step-by-Step Execution',
      description: 'Watch your code execute line-by-line with variable values, memory state, and program flow visualization.'
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: 'AI Code Explanations',
      description: 'Get detailed AI-powered explanations and intelligent suggestions for improvements and best practices.'
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: 'Data Structure Visualizer',
      description: 'Visualize arrays, linked lists, trees, graphs, and complex data structures as they change in real-time.'
    },
    {
      icon: <Lightbulb className="w-6 h-6" />,
      title: 'Smart Suggestions',
      description: 'Get AI-powered recommendations for optimization, refactoring, and best practices in your code.'
    }
  ]

  return (
    <main className="bg-background text-foreground">
      {/* HEADER */}

      <LandingHeader />
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-b from-card/50 to-background opacity-30" />
        
        {/* Abstract Glowing Blobs */}
        <div className="absolute top-1/4 -left-10 w-96 h-96 bg-primary/20 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-1/4 -right-10 w-96 h-96 bg-accent/20 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="inline-block mb-6 px-4 py-2 bg-secondary/30 border border-secondary/50 rounded-full">
            <p className="text-sm text-secondary-foreground font-medium">🚀 For Developers & Learners</p>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 text-balance leading-tight">
            Paste Code, Get
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              Visual Insights Instantly
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto text-balance leading-relaxed">
            Understand any code through visual flowcharts, step-by-step execution flows, AI explanations, and interactive data structure visualizations. Perfect for learning, debugging, and teaching.
          </p>

          <div className="mt-16 pt-12 border-t border-secondary/30">
            <p className="text-sm text-muted-foreground mb-4">Trusted by developers at</p>
            <div className="flex flex-wrap justify-center gap-8 items-center opacity-70">
              <span className="font-semibold text-foreground">GitHub</span>
              <span className="font-semibold text-foreground">GitLab</span>
              <span className="font-semibold text-foreground">Vercel</span>
              <span className="font-semibold text-foreground">Stripe</span>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-card/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
              Understand Code Like Never Before
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
              From visual flowcharts to AI-powered explanations, explore every aspect of your code with powerful visualization and analysis tools.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="bg-background border-border hover:border-secondary/50 transition-all duration-300 hover:shadow-lg p-6"
              >
                <div className="text-primary mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-secondary/30 to-card/30 border border-secondary/50 rounded-2xl p-12 md:p-16 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
              Ready to Master Your Codebase?
            </h2>

            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto text-balance">
              Join thousands of developers who are already visualizing and understanding their code faster and smarter with Code Navigator.
            </p>

            {/* <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8">
                Start Free Trial <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-secondary/50 text-foreground hover:bg-secondary/20 rounded-full px-8"
              >
                Talk to Sales
              </Button>
            </div>

            <p className="text-sm text-muted-foreground mt-8">
              No credit card required. 7-day free trial.
            </p> */}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </main>
  )
}
