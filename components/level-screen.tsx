"use client"

import { lazy, Suspense, useEffect } from "react"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Starfield } from "@/components/starfield"
import { minuPoses, type Level } from "@/lib/minu-config"
import { playClick, playNarratorFile, stopNarrator } from "@/lib/audio"
import { useRouter } from "next/navigation"

const LEVEL_INTRO_FILES: Record<number, string> = {
  1: "narrator_level1_intro.mp3",
  2: "narrator_level2_intro.mp3",
  3: "narrator_level3_intro.mp3",
  4: "narrator_level4_intro.mp3",
  5: "narrator_level5_intro.mp3",
}

type LevelScreenProps = {
  level: Level
  onBack: () => void
  onComplete: (levelId: number) => void
}

// Lazy-load Level 5 full module
const Level5 = lazy(() => import("@/components/level-5-image-classification"))

export function LevelScreen({ level, onBack, onComplete }: LevelScreenProps) {
  useEffect(() => {
    const introFile = LEVEL_INTRO_FILES[level.id]
    if (introFile) playNarratorFile(introFile)
    return () => stopNarrator()
  }, [level.id])

  if (level.id === 5) {
    return (
      <Suspense fallback={<PlaceholderLevel level={level} onBack={onBack} onComplete={onComplete} />}>
        <Level5 onComplete={() => onComplete(level.id)} onBack={onBack} />
      </Suspense>
    )
  }

  return <PlaceholderLevel level={level} onBack={onBack} onComplete={onComplete} />
}

/** Placeholder for levels without a module yet. */
function PlaceholderLevel({ level, onBack, onComplete }: LevelScreenProps) {
  const router = useRouter()

  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-background px-4 py-10">
      <Starfield count={70} />

      <header className="absolute left-0 top-0 z-10 px-5 py-5">
        <Button size="icon" variant="secondary" className="rounded-full" aria-label="Back to map" onClick={() => { playClick(); onBack() }}>
          <ArrowLeft className="size-5" />
        </Button>
      </header>

      <div className="animate-pop-in relative z-10 flex max-w-lg flex-col items-center gap-5 text-center">
        <Image
          src={minuPoses.idle || "/placeholder.svg"}
          alt="Minu the alien ready to learn"
          width={170}
          height={170}
          className="animate-float drop-shadow-2xl"
        />
        <span className="font-heading inline-flex items-center gap-2 rounded-full bg-muted px-4 py-1.5 text-sm font-bold text-secondary">
          {level.subtitle}
        </span>
        <h1 className="font-heading text-4xl font-extrabold text-foreground text-balance">{level.title}</h1>
        <p className="text-lg font-semibold text-muted-foreground text-pretty md:text-xl">{level.description}</p>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col gap-4 w-full">
          <Button
            size="lg"
            onClick={() => { playClick(); router.push(`/planet/level${level.id}/watch`) }}
            className="font-heading rounded-full px-8 text-lg font-extrabold bg-purple-600 text-white"
          >
            Watch
          </Button>

          <Button
            size="lg"
            onClick={() => { playClick(); router.push(`/planet/level${level.id}/learn`) }}
            className="font-heading rounded-full px-8 text-lg font-extrabold bg-green-600 text-white"
          >
            Learn
          </Button>

          <Button
            size="lg"
            onClick={() => { playClick(); router.push("/level-quiz") }}
            className="font-heading rounded-full px-8 text-lg font-extrabold bg-orange-500 text-white"
          >
            Quiz
          </Button>
        </div>
      </div>
    </main>
  )
}
