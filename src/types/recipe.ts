export interface Recipe {
  id: number
  title: string
  imageUrl?: string | null
  prepTime: number
  cookTime: number
  servings: number
  isFavorite: boolean
  createdAt: Date
  updatedAt: Date
  categoryId: number
  category: Category
}

export interface RecipeCompletion {
  id: number
  recipeId: number
  date: Date
  duration?: number
  notes?: string
  rating?: number
  recipe?: Recipe
}

export interface Category {
  id: number
  name: string
  icon?: string | null
  imageUrl?: string | null
  createdAt: Date
}

export interface Ingredient {
  id: number
  name: string
  amount: number
  unit: string
  recipeId: number
}

export interface Step {
  id: number
  description: string
  order: number
  timer: number | null | undefined
  timerUnit?: string
  isCompleted?: boolean
  recipeId: number
}

export interface Schedule {
  id: number
  date: Date
  recipeId: number
  recipe?: Recipe
} 