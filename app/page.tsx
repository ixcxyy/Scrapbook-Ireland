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
    { src: '/School.jpg?height=300&width=400', caption: 'Language School' },
    { src: '/placeholder.svg?height=300&width=400', caption: 'Bray Head' },
    { src: '/placeholder.svg?height=300&width=400', caption: 'Trinity College' },
    { src: '/placeholder.svg?height=300&width=400', caption: 'Guinness Storehouse' },
    { src: '/placeholder.svg?height=300&width=400', caption: 'Killiney Hill' },
    { src: '/placeholder.svg?height=300&width=400', caption: 'St. Stephen&#39;s Green' }, // Escape single quote
    { src: '/placeholder.svg?height=300&width=400', caption: 'Bray Promenade' },
    { src: '/placeholder.svg?height=300&width=400', caption: 'Ha&#39;penny Bridge' }, // Escape single quote
    { src: '/placeholder.svg?height=300&width=400', caption: 'Phoenix Park' },
    { src: '/Donut.jpg?height=300&width=400', caption: 'Best Dish 🍩' },
  ];
  

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
        My favorite activity was going to Dublin. Thrift shopping with Paul and just beein with friends in a city, you have never been to be before was so cool! Also I like the atmosphere and the feeling to be there, you felt safe. Also the tasty donuts, which I of course tried were so good, I immediately checked if they are local or in our area at home too, sadly they are local. The vintage stuff I found there, was pretty cool. I bought a Guiness T-Shirt for only 12 euros! Also I peaked in, of course just for a quick picture, the Temple bar.
        </p>
      </Section>

      <Section
        title="Trip Reflection"
        isOpen={reflectionOpen}
        onToggle={() => toggleSection(setReflectionOpen)}
        icon="🤔"
      >
        <p className="text-emerald-700 leading-relaxed">
          This trip to Dublin and Bray was an unforgettable experience. Our host was very friendly and explained us as quick as possible, how to travell by bus at its best. Beeing allowed to walk around till 22pm and just enjoying Ireland with friends was just great. The view of the cliffs, the feeling of sitting in a train which drives next to the ocean. The autumn atmosphere and of course the people, made the trip unforgettable. Also I have never been to tesco ever before, I am very happy to have checked it out, it has some great deals, for example: 2 liters of Lemonade for just 1 euro! In Glendalough you felt so much connected to the nature. I learned so much about Irish history and culture, it was a you need to be there to understand experience.
          made new friends, and created memories that will last a lifetime. The friendly people, beautiful landscapes
          and the feeling of just beeing alone in a city where you have never been to before, will make me come back again to dublin.
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
                          I have had an amazing week in Ireland, and I want to inform you about, what I did.
                        </p>
                        <p>
                          The people there are so much different compared to them in Austria, everyone is so nice and helps you, if you need help. Everyone thanks the bus driver, when they hop off the bus and crossing the streets is also alot different. The cars just stop and lets you cross the road, even tho there is no crosswalk. Sadly they people there are really strict about rules, especially when it comes to alcohol, I only wanted 1 Guinness... By the way did you know, that the harph of the Guinness Logo is used by Ireland too, but just flipped around because of the Copyright? Probably not, but I can 100% recommend you visiting Bray and Dublin. It was an unforgettable experience.
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
