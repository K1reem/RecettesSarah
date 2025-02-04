-- AlterTable
ALTER TABLE "Step" ADD COLUMN "timer" INTEGER;

-- CreateTable
CREATE TABLE "RecipeCompletion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "recipeId" INTEGER NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "duration" INTEGER,
    "notes" TEXT,
    "rating" INTEGER,
    CONSTRAINT "RecipeCompletion_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
