export type MoodType = 'muy_bien' | 'bien' | 'normal' | 'mal' | 'muy_mal'

export interface MoodResponse {
  label: string
  emoji: string
  title: string
  message: string
  suggestionIcon: string
  suggestionText: string
  bgColor: string
  borderColor: string
  badgeColor: string
}

export const MOOD_RESPONSES: Record<MoodType, MoodResponse> = {
  muy_bien: {
    label: 'Muy bien',
    emoji: '😁',
    title: '¡Increíble trabajo! 🎉',
    message: 'Tu disciplina y constancia están marcando la diferencia. Sigue así, campeón/a.',
    suggestionIcon: '💧',
    suggestionText: 'Recupera tu cuerpo con una buena alimentación e hidratación.',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-300',
    badgeColor: 'bg-emerald-100 text-emerald-800'
  },
  bien: {
    label: 'Bien',
    emoji: '🙂',
    title: 'Vas por buen camino 💪',
    message: 'Cada entrenamiento cuenta. Pequeños pasos hoy, grandes resultados mañana.',
    suggestionIcon: '🌙',
    suggestionText: 'Duerme lo suficiente para que tu cuerpo se recupere.',
    bgColor: 'bg-lime-50',
    borderColor: 'border-lime-300',
    badgeColor: 'bg-lime-100 text-lime-800'
  },
  normal: {
    label: 'Normal',
    emoji: '😐',
    title: 'Es normal tener días así 🌤️',
    message: 'La constancia es más importante que la intensidad del día de hoy. Mañana es una nueva oportunidad.',
    suggestionIcon: '📝',
    suggestionText: 'Anota una meta pequeña para mañana y enfócate en lograrla.',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-300',
    badgeColor: 'bg-amber-100 text-amber-800'
  },
  mal: {
    label: 'Mal',
    emoji: '🙁',
    title: 'No fue tu mejor día, y está bien 🤜🤛',
    message: 'No significa que no puedas, significa que eres humano/a. Respira, aprende y sigue adelante.',
    suggestionIcon: '🧘',
    suggestionText: 'Haz 5 minutos de respiración profunda para calmar tu mente.',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-300',
    badgeColor: 'bg-orange-100 text-orange-800'
  },
  muy_mal: {
    label: 'Muy mal',
    emoji: '😡',
    title: 'Lo estás pasando difícil, pero no estás solo/a 💜',
    message: 'Pide apoyo, descansa y recuerda que esto también pasará.',
    suggestionIcon: '💬',
    suggestionText: 'Habla con alguien de confianza sobre cómo te sientes.',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-300',
    badgeColor: 'bg-rose-100 text-rose-800'
  },
}

export const FEELING_TAGS = ['Energía', 'Confianza', 'Cansancio', 'Estrés', 'Frustración', 'Satisfacción']