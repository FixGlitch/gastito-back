export enum ExpenseCategoryEnum {
  ALIMENTOS = "alimentos",
  TRANSPORTE = "transporte",
  SUSCRIPCIONES = "suscripciones",
  SERVICIOS = "servicios",
  ENTRETENIMIENTO = "entretenimiento",
  SALUD = "salud",
  EDUCACION = "educacion",
  HOGAR = "hogar",
  ROPA = "ropa",
  OTROS = "otros",
}

export const EXPENSE_CATEGORY_LABELS: Record<ExpenseCategoryEnum, string> = {
  [ExpenseCategoryEnum.ALIMENTOS]: "Alimentos",
  [ExpenseCategoryEnum.TRANSPORTE]: "Transporte",
  [ExpenseCategoryEnum.SUSCRIPCIONES]: "Suscripciones",
  [ExpenseCategoryEnum.SERVICIOS]: "Servicios",
  [ExpenseCategoryEnum.ENTRETENIMIENTO]: "Entretenimiento",
  [ExpenseCategoryEnum.SALUD]: "Salud",
  [ExpenseCategoryEnum.EDUCACION]: "Educación",
  [ExpenseCategoryEnum.HOGAR]: "Hogar",
  [ExpenseCategoryEnum.ROPA]: "Ropa",
  [ExpenseCategoryEnum.OTROS]: "Otros",
};

export const EXPENSE_CATEGORY_COLORS: Record<ExpenseCategoryEnum, string> = {
  [ExpenseCategoryEnum.ALIMENTOS]: "#F59E0B",
  [ExpenseCategoryEnum.TRANSPORTE]: "#8B5CF6",
  [ExpenseCategoryEnum.SUSCRIPCIONES]: "#2563EB",
  [ExpenseCategoryEnum.SERVICIOS]: "#EF4444",
  [ExpenseCategoryEnum.ENTRETENIMIENTO]: "#EC4899",
  [ExpenseCategoryEnum.SALUD]: "#16A34A",
  [ExpenseCategoryEnum.EDUCACION]: "#0EA5E9",
  [ExpenseCategoryEnum.HOGAR]: "#78716C",
  [ExpenseCategoryEnum.ROPA]: "#A855F7",
  [ExpenseCategoryEnum.OTROS]: "#6B7280",
};
