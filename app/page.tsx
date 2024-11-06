'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Mail, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

type Photo = {
  src: string
  caption: string
}

export default function Scrapbook() {
  const [vocabularyOpen, setVocabularyOpen] = useState(false)
  const [activityOpen, setActivityOpen] = useState(false)
  const [reflectionOpen, setReflectionOpen] = useState(false)
  const [letterOpen, setLetterOpen] = useState(false)
  const [visiblePhotos, setVisiblePhotos] = useState<number[]>([])

  const photoRefs = useRef<(HTMLDivElement | null)[]>([])

  const photos: Photo[] = [
    { src: '/placeholder.svg?height=300&width=400', caption: 'Dublin Castle' },
    { src: '/placeholder.svg?height=300&width=400', caption: 'Bray Head' },
    { src: '/placeholder.svg?height=300&width=400', caption: 'Trinity College' },
    { src: '/placeholder.svg?height=300&width=400', caption: 'Guinness Storehouse' },
    { src: '/placeholder.svg?height=300&width=400', caption: 'Killiney Hill' },
    { src: '/placeholder.svg?height=300&width=400', caption: 'St. Stephen\'s Green' },
    { src: '/placeholder.svg?height=300&width=400', caption: 'Bray Promenade' },
    { src: '/placeholder.svg?height=300&width=400', caption: 'Ha\'penny Bridge' },
    { src: '/placeholder.svg?height=300&width=400', caption: 'Phoenix Park' },
    { src: '/placeholder.svg?height=300&width=400', caption: 'Dalkey Island' },
  ]

  const observerCallback = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const index = photoRefs.current.findIndex(ref => ref === entry.target)
        setVisiblePhotos(prev => [...new Set([...prev, index])])
      } else {
        const index = photoRefs.current.findIndex(ref => ref === entry.target)
        setVisiblePhotos(prev => prev.filter(i => i !== index))
      }
    })
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(observerCallback, { threshold: 0.5 })

    photoRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [observerCallback])

  const toggleSection = useCallback((setter: React.Dispatch<React.SetStateAction<boolean>>) => {
    setter(prev => !prev)
  }, [])

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-b from-emerald-50 to-teal-100">
      <h1 className="text-4xl font-bold text-center mb-12 text-emerald-800">My Dublin/Bray Scrapbook</h1>

      {/* Photo Gallery */}
      <section className="mb-16" aria-labelledby="photo-memories">
        <h2 id="photo-memories" className="text-3xl font-semibold mb-8 text-emerald-700">Photo Memories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {photos.map((photo, index) => (
            <motion.div
              key={index}
              ref={(el: HTMLDivElement | null) => { photoRefs.current[index] = el }}
              initial={{ opacity: 0, y: 50 }}
              animate={visiblePhotos.includes(index) ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <Card className="overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl bg-white">
                <CardContent className="p-4">
                  <Image src={photo.src} alt={photo.caption} width={400} height={300} className="w-full h-64 object-cover rounded-md" />
                  <p className="mt-4 text-center text-emerald-600 font-medium">{photo.caption}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Sections */}
      <Section
        title="Irish Vocabulary"
        isOpen={vocabularyOpen}
        onToggle={() => toggleSection(setVocabularyOpen)}
        icon="🍀"
      >
        <ul className="list-none space-y-2">
          {[{ word: "Sláinte", meaning: "Cheers" }, { word: "Craic", meaning: "Fun" }, { word: "Go raibh maith agat", meaning: "Thank you" }, { word: "Fáilte", meaning: "Welcome" }, { word: "Dia duit", meaning: "Hello" }]
            .map(({ word, meaning }, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm"
              >
                <span className="font-semibold text-emerald-700">{word}</span>
                <span className="text-teal-600">{meaning}</span>
              </motion.li>
            ))}
        </ul>
      </Section>

      <Section
        title="Favorite Activity"
        isOpen={activityOpen}
        onToggle={() => toggleSection(setActivityOpen)}
        icon="🥾"
      >
        <p className="text-emerald-700 leading-relaxed">
          My favorite activity was hiking up Bray Head. The views of the Irish Sea were breathtaking, and the fresh air was invigorating. We saw so many different types of birds and plants along the way!
        </p>
      </Section>

      <Section
        title="Trip Reflection"
        isOpen={reflectionOpen}
        onToggle={() => toggleSection(setReflectionOpen)}
        icon="🤔"
      >
        <p className="text-emerald-700 leading-relaxed">
          This trip to Dublin and Bray was an unforgettable experience. I learned so much about Irish history and culture, made new friends, and created memories that will last a lifetime. The friendly people, beautiful landscapes, and rich heritage of Ireland have left a lasting impression on me.
        </p>
      </Section>

      {/* Letter */}
      <section className="relative mb-8">
        <Button
          onClick={() => setLetterOpen(true)}
          className="w-full flex justify-center items-center bg-emerald-500 text-white p-4 rounded-lg transition-all duration-300 hover:bg-emerald-600 hover:shadow-lg transform hover:-translate-y-1"
        >
          <Mail className="mr-2 h-6 w-6" />
          <span className="text-xl font-semibold">Open Letter</span>
        </Button>
        <AnimatePresence>
          {letterOpen && (
            <Dialog open={letterOpen} onOpenChange={setLetterOpen}>
              <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden bg-transparent border-none shadow-none">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="bg-emerald-100 p-8 rounded-lg shadow-2xl relative"
                >
                  <DialogHeader>
                    <DialogTitle>
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-3xl font-bold text-emerald-800 mb-4"
                      >
                        Dear Professor Philipp Grasmück,
                      </motion.div>
                    </DialogTitle>
                    <DialogDescription>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="space-y-4 text-emerald-700"
                      >
                        <p>
                          Remember the amazing time you had in Dublin and Bray? The laughter shared with classmates, the awe-inspiring
                          sights, and the sense of adventure that filled each day. Hold onto these memories and let them inspire you to
                          keep exploring and learning about the world around you.
                        </p>
                        <p>
                          Never forget the feeling of standing atop Bray Head, with the wind in your hair and the vast expanse of the
                          Irish Sea before you. Let that moment remind you of the beauty and wonder that exists in the world, waiting
                          for you to discover it.
                        </p>
                        <p className="text-right italic">
                          Yours sincerely,<br />Jonas Pils
                        </p>
                      </motion.div>
                    </DialogDescription>
                  </DialogHeader>
                  <Button
                    onClick={() => setLetterOpen(false)}
                    className="absolute top-4 right-4 bg-transparent hover:bg-emerald-200 text-emerald-800"
                  >
                    <X className="h-6 w-6" />
                    <span className="sr-only">Close</span>
                  </Button>
                </motion.div>
              </DialogContent>
            </Dialog>
          )}
        </AnimatePresence>
      </section>
    </div>
  )
}

interface SectionProps {
  title: string
  isOpen: boolean
  onToggle: () => void
  children: React.ReactNode
  icon: string
}

function Section({ title, isOpen, onToggle, children, icon }: SectionProps) {
  return (
    <section className="mb-8" aria-labelledby={`section-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <Button
        onClick={onToggle}
        className="w-full justify-between items-center bg-white text-emerald-800 p-4 rounded-lg transition-all duration-300 hover:bg-emerald-50 hover:shadow-md"
        aria-expanded={isOpen}
        aria-controls={`content-${title.toLowerCase().replace(/\s+/g, '-')}`}
      >
        <span className="text-xl font-semibold flex items-center" id={`section-${title.toLowerCase().replace(/\s+/g, '-')}`}>
          <span className="mr-2 text-2xl">{icon}</span> {title}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="h-6 w-6" />
        </motion.div>
      </Button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <Card className="mt-2 bg-white shadow-lg">
              <CardContent className="p-4">
                {children}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
