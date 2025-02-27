'use client'

import { Category } from '@/types/recipe'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, X, Clock } from 'lucide-react'
import { ImageUpload } from '@/components/ui/image-upload'
import { InputWithUnit } from './input-with-unit'

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
  timerUnit?: string
  showTimer?: boolean
}

interface Recipe {
  id?: number
  title: string
  imageUrl: string | null
  categoryId: number
  prepTime: number
  cookTime: number
  servings: number
  ingredients: Ingredient[]
  steps: Step[]
}

interface RecipeFormProps {
  recipe?: Partial<Recipe>
  categories: Category[]
  mode: 'create' | 'edit'
}

const defaultRecipe: Recipe = {
  title: '',
  imageUrl: null,
  categoryId: 0,
  prepTime: 0,
  cookTime: 0,
  servings: 4,
  ingredients: [{ id: 1, name: '', amount: '', unit: 'p' }],
  steps: [{ id: 1, description: '', timer: undefined, timerUnit: 'min' }]
}

export function RecipeForm({ recipe = defaultRecipe, categories, mode }: RecipeFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [ingredients, setIngredients] = useState<Ingredient[]>(
    recipe.ingredients || defaultRecipe.ingredients
  )
  const [steps, setSteps] = useState<Step[]>(
    recipe.steps || defaultRecipe.steps
  )
  const [imageFile, setImageFile] = useState<File | null>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      const formElement = event.currentTarget
      const formData = new FormData(formElement)
      let imageUrl = recipe.imageUrl || null

      if (imageFile) {
        const imageFormData = new FormData()
        imageFormData.append('file', imageFile)
        
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: imageFormData,
        })
        
        if (!uploadResponse.ok) throw new Error('Erreur lors du téléchargement de l\'image')
        
        const imageData = await uploadResponse.json()
        imageUrl = imageData.url
      }

      const recipeData = {
        title: formData.get('title'),
        categoryId: parseInt(formData.get('categoryId') as string),
        imageUrl,
        prepTime: parseInt(formData.get('prepTime') as string),
        cookTime: parseInt(formData.get('cookTime') as string),
        servings: parseInt(formData.get('servings') as string),
        ingredients: ingredients.map(i => ({
          name: i.name,
          amount: parseFloat(i.amount),
          unit: i.unit
        })),
        steps: steps.map((s, index) => ({
          description: s.description,
          order: index + 1,
          timer: s.timer || null,
          timerUnit: s.timerUnit || 'min'
        }))
      }

      const url = mode === 'create' ? '/api/recipes' : `/api/recipes/${recipe.id}`
      const method = mode === 'create' ? 'POST' : 'PUT'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipeData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || `Erreur lors de la ${mode === 'create' ? 'création' : 'modification'} de la recette`)
      }

      const savedRecipe = await response.json()
      router.push(mode === 'create' ? '/recettes' : `/recettes/${recipe.id}`)
      router.refresh()
    } catch (error) {
      console.error('Erreur:', error)
      alert(error instanceof Error ? error.message : `Une erreur s'est produite lors de la ${mode === 'create' ? 'création' : 'modification'} de la recette`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const addIngredient = () => {
    const newId = ingredients.length > 0 ? Math.max(...ingredients.map(i => i.id)) + 1 : 1
    setIngredients([...ingredients, { id: newId, name: '', amount: '', unit: 'p' }])
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
    setSteps([...steps, { id: newId, description: '', timer: undefined, timerUnit: 'min' }])
  }

  const removeStep = (id: number) => {
    if (steps.length > 1) {
      setSteps(steps.filter(s => s.id !== id))
    }
  }

  const updateStep = (id: number, field: keyof Step, value: string | number | boolean) => {
    setSteps(steps.map(s => 
      s.id === id ? { ...s, [field]: value } : s
    ))
  }

  useEffect(() => {
    const textareas = document.querySelectorAll('textarea')
    textareas.forEach(textarea => {
      textarea.style.height = 'auto'
      textarea.style.height = textarea.scrollHeight + 'px'
    })
  }, [steps])

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5">
      <div className="bg-white rounded-lg shadow-sm p-3.5">
        <ImageUpload
          imageUrl={recipe.imageUrl ?? null}
          onImageChange={(file) => setImageFile(file)}
          className="mb-3.5"
        />

        <div className="space-y-3.5">
          <div>
            <label htmlFor="title" className="block text-base font-semibold text-gray-900">
              Titre de la recette
            </label>
            <input
              type="text"
              name="title"
              id="title"
              required
              defaultValue={recipe.title}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3.5 py-3.5 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="categoryId" className="block text-base font-semibold text-gray-900">
              Catégorie
            </label>
            <select
              name="categoryId"
              id="categoryId"
              required
              defaultValue={recipe.categoryId}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3.5 py-3.5 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Sélectionner une catégorie</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-3.5">
            <InputWithUnit
              label="Temps de préparation"
              name="prepTime"
              value={recipe.prepTime}
              required
              min={0}
              options={[
                { value: 'min', label: 'min' },
                { value: 'hrs', label: 'hrs' }
              ]}
            />

            <InputWithUnit
              label="Temps de cuisson"
              name="cookTime"
              value={recipe.cookTime}
              required
              min={0}
              options={[
                { value: 'min', label: 'min' },
                { value: 'hrs', label: 'hrs' }
              ]}
            />

            <InputWithUnit
              label="Nombre de portions"
              name="servings"
              value={recipe.servings}
              required
              min={1}
              options={[{ value: 'pers', label: 'pers' }]}
              hideArrow
            />
          </div>
        </div>
      </div>

      <section className="bg-white rounded-lg shadow-sm p-3.5 space-y-3.5">
        <h2 className="text-lg font-bold text-gray-900">Ingrédients</h2>
        <div className="space-y-8">
          {ingredients.map((ingredient, index) => (
            <div key={ingredient.id} className="flex gap-8 items-start">
              <div className="flex-1 grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={ingredient.name}
                  onChange={(e) => updateIngredient(ingredient.id, 'name', e.target.value)}
                  placeholder="Ingrédient"
                  className="col-span-1 rounded-md border border-gray-300 px-3.5 py-2 text-gray-900"
                  required
                />
                <div className="col-span-1 flex gap-2">
                  <div className="flex-1 relative flex">
                    <input
                      type="number"
                      value={ingredient.amount}
                      onChange={(e) => updateIngredient(ingredient.id, 'amount', e.target.value)}
                      placeholder="Qté"
                      className="w-full rounded-l-md border border-gray-300 px-3.5 py-2 text-gray-900"
                      required
                    />
                    <select
                      value={ingredient.unit}
                      onChange={(e) => updateIngredient(ingredient.id, 'unit', e.target.value)}
                      className="w-20 h-[42px] rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-2.5 text-gray-900"
                      required
                    >
                      <option value="g">g</option>
                      <option value="kg">kg</option>
                      <option value="ml">ml</option>
                      <option value="L">L</option>
                      <option value="p">p</option>
                    </select>
                  </div>
                </div>
              </div>
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeIngredient(ingredient.id)}
                  className="h-10 px-2 text-gray-400 hover:text-red-500 flex items-center"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
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

      <section className="bg-white rounded-lg shadow-sm p-3.5 space-y-3.5">
        <h2 className="text-lg font-bold text-gray-900">Étapes de préparation</h2>
        <div className="space-y-8">
          {steps.map((step, index) => (
            <div key={step.id} className="flex gap-8 items-start">
              <div className="flex-1">
                <div className="relative">
                  <textarea
                    value={step.description}
                    onChange={(e) => {
                      updateStep(step.id, 'description', e.target.value)
                      e.target.style.height = 'auto'
                      e.target.style.height = e.target.scrollHeight + 'px'
                    }}
                    placeholder="Description de l'étape"
                    className="w-full rounded-md border border-gray-300 px-3.5 py-2.5 text-gray-900 pl-12 resize-none overflow-hidden min-h-[40px]"
                    required
                    style={{ height: 'auto' }}
                  />
                  <span className="absolute left-3.5 top-2.5 text-blue-600 font-semibold">
                    {index + 1}.
                  </span>
                </div>
                {step.showTimer ? (
                  <div className="mt-2 flex gap-2 items-center">
                    <div className="relative">
                      <input
                        type="number"
                        value={step.timer || ''}
                        onChange={(e) => updateStep(step.id, 'timer', parseInt(e.target.value) || 0)}
                        placeholder="Durée"
                        className="w-32 rounded-md border border-gray-300 px-3.5 py-3.5 text-gray-900"
                        min="0"
                      />
                      <select
                        value={step.timerUnit || 'min'}
                        onChange={(e) => updateStep(step.id, 'timerUnit', e.target.value)}
                        className="absolute right-0 top-0 h-10 w-20 rounded-r-md border-l border-gray-300 bg-gray-50 pl-3.5 pr-2.5 text-gray-900"
                      >
                        <option value="min">min</option>
                        <option value="hrs">hrs</option>
                      </select>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => updateStep(step.id, 'showTimer', true)}
                    className="mt-2 flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600"
                  >
                    <Clock className="w-4 h-4" />
                    <span>Ajouter un minuteur</span>
                  </button>
                )}
              </div>
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeStep(step.id)}
                  className="h-10 px-2 text-gray-400 hover:text-red-500 flex items-center"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
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

      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (mode === 'create' ? 'Création en cours...' : 'Modification en cours...') : (mode === 'create' ? 'Créer la recette' : 'Modifier la recette')}
        </button>
      </div>
    </form>
  )
}

<style jsx global>{`
  select.appearance-none {
    -webkit-appearance: none !important;
    -moz-appearance: none !important;
    appearance: none !important;
    background-image: none !important;
    padding-right: 0.625rem !important;
  }
  select:not(.appearance-none) {
    background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E");
    background-position: right 0.625rem center;
    background-repeat: no-repeat;
    background-size: 1.5em 1.5em;
    padding-right: 2.5rem;
  }
`}</style>