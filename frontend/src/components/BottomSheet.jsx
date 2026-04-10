import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export default function BottomSheet({ isOpen, onClose, title, children }) {
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape' && isOpen) onClose() }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border rounded-t-2xl max-h-[80vh] flex flex-col"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'tween', duration: 0.25 }}
          >
            <div className="w-10 h-1 bg-border rounded-full mx-auto my-3 flex-shrink-0" />
            <div className="px-5 pb-3 text-sm font-semibold text-foreground border-b border-border flex-shrink-0">
              {title}
            </div>
            <div className="overflow-y-auto flex-1 p-4">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
