'use client'

import { useState, useEffect } from 'react'
import { Play, Pause, RotateCcw, ChevronRight, ChevronLeft, Timer, Check } from 'lucide-react'
import { Step } from '@/types/recipe'

interface CookingModeProps {
  steps: Step[]
  onExit: () => void
}

export function CookingMode({ steps, onExit }: CookingModeProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [startTime] = useState(Date.now())

  const currentStep = steps[currentStepIndex]
  const hasTimer = currentStep?.timer && currentStep.timer > 0
  const isLastStep = currentStepIndex === steps.length - 1
  const isFirstStep = currentStepIndex === 0

  useEffect(() => {
    if (hasTimer && currentStep?.timer) {
      setTimeLeft(currentStep.timer * 60)
    }
  }, [currentStepIndex, hasTimer, currentStep?.timer])

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            setIsTimerRunning(false)
            return 0
          }
          return time - 1
        })
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [isTimerRunning, timeLeft])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning)
  }

  const resetTimer = () => {
    if (currentStep?.timer) {
      setTimeLeft(currentStep.timer * 60)
      setIsTimerRunning(false)
    }
  }

  const nextStep = () => {
    if (!isLastStep) {
      setCurrentStepIndex(currentStepIndex + 1)
      setIsTimerRunning(false)
    }
  }

  const previousStep = () => {
    if (!isFirstStep) {
      setCurrentStepIndex(currentStepIndex - 1)
      setIsTimerRunning(false)
    }
  }

  const finishRecipe = async () => {
    try {
      await fetch('/api/recipes/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipeId: steps[0].recipeId,
          date: new Date().toISOString(),
          duration: Math.round((Date.now() - startTime) / 60000), // Convertir en minutes
          notes: '', // À implémenter plus tard
          rating: null // À implémenter plus tard
        }),
      })
      onExit()
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de la réalisation:', error)
    }
  }

  if (!steps || steps.length === 0) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
        <p className="text-xl text-gray-900 mb-4">Aucune étape disponible</p>
        <button
          onClick={onExit}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retour à la recette
        </button>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      <header className="bg-blue-600 text-white p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={onExit}
            className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20"
          >
            Quitter le mode préparation
          </button>
          <div className="text-lg font-medium">
            Étape {currentStepIndex + 1}/{steps.length}
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 flex flex-col">
        <div className="max-w-2xl mx-auto w-full flex-1">
          <div className="text-xl text-gray-900 text-center mb-8 font-medium">
            {currentStep.description}
          </div>

          {hasTimer && (
            <div className="mt-8 space-y-4">
              <div className="flex items-center justify-center gap-2 text-gray-600">
                <Timer className="w-5 h-5" />
                <span>Temps recommandé : {currentStep.timer} minutes</span>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-xl shadow-sm space-y-4">
                <div className="text-5xl font-mono font-bold text-center text-blue-600">
                  {formatTime(timeLeft)}
                </div>
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={toggleTimer}
                    className="p-4 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  >
                    {isTimerRunning ? (
                      <Pause className="w-6 h-6" />
                    ) : (
                      <Play className="w-6 h-6" />
                    )}
                  </button>
                  <button
                    onClick={resetTimer}
                    className="p-4 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                  >
                    <RotateCcw className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="p-4 border-t bg-gray-50">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <div>
            {!isFirstStep && (
              <button
                onClick={previousStep}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white shadow-sm text-gray-900 hover:bg-gray-50"
              >
                <ChevronLeft className="w-5 h-5" />
                Précédent
              </button>
            )}
          </div>
          
          <button
            onClick={isLastStep ? finishRecipe : nextStep}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-sm ${
              isLastStep 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
          >
            {isLastStep ? (
              <>
                <Check className="w-5 h-5" />
                J'ai terminé
              </>
            ) : (
              <>
                Suivant
                <ChevronRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </footer>
    </div>
  )
} 