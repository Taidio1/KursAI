import { motion } from 'framer-motion'

const variants = {
  initial: { opacity: 0, scale: 0.97 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.28, ease: 'easeOut' }
  },
  exit: {
    opacity: 0,
    scale: 1.02,
    transition: { duration: 0.2, ease: 'easeIn' }
  }
}

export default function PageTransition({ children }) {
  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{ width: '100%', height: '100%' }}
    >
      {children}
    </motion.div>
  )
}
