'use client'

import { Category } from '@/types/recipe'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, X } from 'lucide-react'
import { ImageUpload } from '@/components/ui/image-upload'

interface RecipeFormProps {
  categories: Category[]
}

interface Ingredient {
  id: number
  name: string
  amount: string
  unit: string
}

interface Step {
  id: number
  description: string
  timer?: number
}

export function RecipeForm({ categories }: RecipeFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [ingredients, setIngredients] = useState<Ingredient[]>([{ id: 1, name: '', amount: '', unit: '' }])
  const [steps, setSteps] = useState<Step[]>([{ id: 1, description: '' }])
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData(e.currentTarget)
      const response = await fetch('/api/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.get('title'),
          categoryId: parseInt(formData.get('categoryId') as string),
          prepTime: parseInt(formData.get('prepTime') as string),
          cookTime: parseInt(formData.get('cookTime') as string),
          servings: parseInt(formData.get('servings') as string),
          imageUrl,
          ingredients: ingredients.map(i => ({
            name: i.name,
            amount: parseFloat(i.amount),
            unit: i.unit
          })),
          steps: steps.map((s, index) => ({
            description: s.description,
            order: index + 1,
            timer: s.timer
          }))
        }),
      })

      if (!response.ok) throw new Error('Erreur lors de la création de la recette')
      router.push('/recettes')
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const addIngredient = () => {
    const newId = ingredients.length > 0 ? Math.max(...ingredients.map(i => i.id)) + 1 : 1
    setIngredients([...ingredients, { id: newId, name: '', amount: '', unit: '' }])
  }

  const removeIngredient = (id: number) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter(i => i.id !== id))
    }
  }

  const updateIngredient = (id: number, field: keyof Ingredient, value: string) => {
    setIngredients(ingredients.map(i => 
      i.id === id ? { ...i, [field]: value } : i
    ))
  }

  const addStep = () => {
    const newId = steps.length > 0 ? Math.max(...steps.map(s => s.id)) + 1 : 1
    setSteps([...steps, { id: newId, description: '' }])
  }

  const removeStep = (id: number) => {
    if (steps.length > 1) {
      setSteps(steps.filter(s => s.id !== id))
    }
  }

  const updateStep = (id: number, field: keyof Step, value: string | number) => {
    setSteps(steps.map(s => 
      s.id === id ? { ...s, [field]: value } : s
    ))
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
      <section className="bg-white rounded-lg shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-bold text-gray-900">Informations générales</h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-semibold text-gray-900">
              Titre de la recette
            </label>
            <input
              type="text"
              name="title"
              id="title"
              required
              placeholder="Spaghetti Bolognaise"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="categoryId" className="block text-sm font-semibold text-gray-900">
              Catégorie
            </label>
            <select
              name="categoryId"
              id="categoryId"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Sélectionner une catégorie</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-900">
              Image de la recette
            </label>
            <ImageUpload onChange={setImageUrl} value={imageUrl} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="prepTime" className="block text-sm font-semibold text-gray-900">
                Temps de préparation
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="prepTime"
                  id="prepTime"
                  min="0"
                  required
                  placeholder="30"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">min</span>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="cookTime" className="block text-sm font-semibold text-gray-900">
                Temps de cuisson
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="cookTime"
                  id="cookTime"
                  min="0"
                  required
                  placeholder="45"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">min</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="servings" className="block text-sm font-semibold text-gray-900">
              Nombre de portions
            </label>
            <input
              type="number"
              name="servings"
              id="servings"
              min="1"
              required
              defaultValue="4"
              placeholder="4"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      </section>

      <section className="bg-white rounded-lg shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-bold text-gray-900">Ingrédients</h2>
        <div className="space-y-4">
          {ingredients.map((ingredient) => (
            <div key={ingredient.id} className="flex gap-2 items-start">
              <div className="flex-1 grid grid-cols-3 gap-2">
                <input
                  type="text"
                  value={ingredient.name}
                  onChange={(e) => updateIngredient(ingredient.id, 'name', e.target.value)}
                  placeholder="Ingrédient"
                  className="col-span-1 rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
                <input
                  type="text"
                  value={ingredient.amount}
                  onChange={(e) => updateIngredient(ingredient.id, 'amount', e.target.value)}
                  placeholder="Quantité"
                  className="col-span-1 rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
                <input
                  type="text"
                  value={ingredient.unit}
                  onChange={(e) => updateIngredient(ingredient.id, 'unit', e.target.value)}
                  placeholder="Unité"
                  className="col-span-1 rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
              <button
                type="button"
                onClick={() => removeIngredient(ingredient.id)}
                className="p-2 text-gray-400 hover:text-red-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addIngredient}
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700"
          >
            <Plus className="w-4 h-4 mr-1" />
            Ajouter un ingrédient
          </button>
        </div>
      </section>

      <section className="bg-white rounded-lg shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-bold text-gray-900">Étapes de préparation</h2>
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex gap-4 items-start">
              <div className="flex-none">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold">
                  {index + 1}
                </span>
              </div>
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={step.description}
                  onChange={(e) => updateStep(step.id, 'description', e.target.value)}
                  placeholder="Description de l'étape"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={step.timer || ''}
                    onChange={(e) => updateStep(step.id, 'timer', parseInt(e.target.value) || 0)}
                    placeholder="Temps (en minutes)"
                    className="w-32 rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    min="0"
                  />
                  <span className="text-sm text-gray-500">minutes</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeStep(step.id)}
                className="p-2 text-gray-400 hover:text-red-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addStep}
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700"
          >
            <Plus className="w-4 h-4 mr-1" />
            Ajouter une étape
          </button>
        </div>
      </section>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Création en cours...' : 'Créer la recette'}
      </button>
    </form>
  )
} 