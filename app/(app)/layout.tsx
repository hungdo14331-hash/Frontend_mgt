'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Sidebar } from '@/components/sidebar'
import { motion, AnimatePresence } from 'framer-motion'
import { ChatStateProvider } from '@/lib/chat-state-context'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <ChatStateProvider>
      <div className="flex h-screen">
        {/* Desktop Sidebar */}
        <div className="hidden md:block md:w-64 md:flex-shrink-0">
          <Sidebar isOpen={true} />
        </div>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile Header with Hamburger */}
          <div className="md:hidden h-16 bg-card border-b border-border flex items-center px-4 gap-3 flex-shrink-0 z-40">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-sidebar-accent/50 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {sidebarOpen ? (
                <X className="w-5 h-5 text-foreground" />
              ) : (
                <Menu className="w-5 h-5 text-foreground" />
              )}
            </button>
            <h1 className="text-lg font-semibold text-foreground">Magic Team AI</h1>
          </div>

          {/* Page Content */}
          <div className="flex-1 overflow-auto">{children}</div>
        </main>

        {/* Mobile Sidebar Drawer */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/50 md:hidden z-30"
                onClick={() => setSidebarOpen(false)}
              />

              {/* Drawer */}
              <motion.div
                initial={{ x: -256 }}
                animate={{ x: 0 }}
                exit={{ x: -256 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="fixed left-0 top-0 h-screen w-64 z-40 md:hidden"
              >
                <Sidebar isOpen={true} onClose={() => setSidebarOpen(false)} />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </ChatStateProvider>
  )
}
