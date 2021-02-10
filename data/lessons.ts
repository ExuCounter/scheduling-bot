export type Lesson = {
  name: string
  time: string
  link: string
  flat: string
  educator: string
}

export type localDayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday'

export type Schedular = {
  [key in localDayOfWeek]: Lesson[]
}

export const lessonsFirstWeek: Schedular = {
  monday: [
    {
      name: 'Специализированные компьютерные системы ( Лекция )',
      time: '13:00',
      link: 'https://meet.google.com/lookup/ax2jmpong2',
      flat: '6.201',
      educator: 'Гамаюн В.П.',
    },
    {
      name: 'Тестирование комплексов IT-проектов ( Практика )',
      time: '14:40',
      link: 'https://meet.google.com/lookup/fsftby66l7',
      flat: '6.110B',
      educator: 'Кирхар Н.В.',
    },
    {
      name: 'Специализированные компьютерные системы ( Практика )',
      time: '16:20',
      link: 'не существует',
      flat: '5.112',
      educator: 'Гамаюн В.П.',
    },
    {
      name: 'Проектирование информационных систем ( Практика )',
      time: '18:00',
      link: 'https://meet.google.com/lookup/gy4ic6wvey',
      flat: '6.211',
      educator: 'Рыбасова Н.О.',
    },
  ],
  tuesday: [],
  wednesday: [
    {
      name: 'Проектирование информационных систем ( Лекция )',
      time: '14:40',
      link: 'https://meet.google.com/lookup/fecc4njrdd',
      flat: '6.201',
      educator: 'Боровик В.М.',
    },
    {
      name: 'Специализированные компьютерные системы ( Лекция )',
      time: '16:20',
      link: 'https://meet.google.com/lookup/chummpwhay',
      flat: '6.302',
      educator: 'Савченко А.С.',
    },
    {
      name: 'Интелектуальный анализ данных ( Лекция )',
      time: '18:00',
      link: 'https://meet.google.com/lookup/dnz56d5rjr',
      flat: '6.202',
      educator: 'Куклинский А.В.',
    },
  ],
  thursday: [
    {
      name: 'Проф. английский',
      time: '14:40',
      link: 'https://meet.google.com/lookup/ccspc3bpcu',
      flat: '8.1301',
      educator: 'Юрченко С.О.',
    },
    {
      name: 'Распределительные та облачные вычисления ( Практика )',
      time: '16:20',
      link: 'https://meet.google.com/lookup/blmwq7ek6t',
      flat: '6.206',
      educator: 'Шевченко О.П.',
    },
    {
      name: 'Компьютерные сети ( Практика )',
      time: '18:00',
      link: 'https://meet.google.com/lookup/h454lu27pf',
      flat: '6.204',
      educator: 'Холявкина Т.В.',
    },
  ],

  friday: [
    {
      name: 'Распределительные та облачные вычисления ( Лекция )',
      time: '14:40',
      link: 'https://meet.google.com/lookup/blmwq7ek6t',
      flat: '6.201',
      educator: 'Шевченко О.П.',
    },
    {
      name: 'Тестирование комплексов IT проектов ( Лекция )',
      time: '16:20',
      link: 'https://meet.google.com/lookup/gr74gcatji',
      flat: '6.201',
      educator: 'Кирхар Н.В.',
    },
  ],
}

export const lessonsSecondWeek: Schedular = {
  monday: [
    {
      name: 'Специализированные компьютерные системы ( Лекция )',
      time: '13:00',
      link: 'https://meet.google.com/lookup/ax2jmpong2',
      flat: '6.201',
      educator: 'Гамаюн В.П.',
    },
    {
      name: 'Специализированные компьютерные системы ( Практика )',
      time: '14:40',
      link: 'не существует',
      flat: '5.112',
      educator: 'Гамаюн В.П.',
    },
  ],
  tuesday: [],
  wednesday: [
    {
      name: 'Тестирование комплексов IT проектов ( Лекция )',
      time: '14:40',
      link: 'https://meet.google.com/lookup/gr74gcatji',
      flat: '6.201',
      educator: 'Кирхар Н.В.',
    },
    {
      name: 'Специализированные компьютерные системы ( Лекция )',
      time: '16:20',
      link: 'https://meet.google.com/lookup/chummpwhay',
      flat: '6.302',
      educator: 'Савченко А.С.',
    },
    {
      name: 'Проектирование информационных систем ( Лекция )',
      time: '18:00',
      link: 'https://meet.google.com/lookup/dnz56d5rjr',
      flat: '6.202',
      educator: 'Куклинский А.В.',
    },
  ],
  thursday: [
    {
      name: 'Тестирование комплексов IT-проектов ( Практика )',
      time: '14:40',
      link: 'https://meet.google.com/lookup/fsftby66l7',
      flat: '6.110A',
      educator: 'Кирхар Н.В.',
    },
    {
      name: 'Компьютерные сети ( Практика )',
      time: '16:20',
      link: 'https://meet.google.com/lookup/h454lu27pf',
      flat: '6.204',
      educator: 'Холявкина Т.В.',
    },
    {
      name: 'Интелектуальный анализ данных ( Лекция )',
      time: '18:00',
      link: 'https://meet.google.com/lookup/dnz56d5rjr',
      flat: '6.110В',
      educator: 'Куклинский А.В.',
    },
  ],
  friday: [
    {
      name: 'Распределительные та облачные вычисления ( Лекция )',
      time: '14:40',
      link: 'https://meet.google.com/lookup/blmwq7ek6t',
      flat: '6.201',
      educator: 'Шевченко О.П.',
    },
    {
      name: 'Тестирование комплексов IT проектов ( Лекция )',
      time: '16:20',
      link: 'https://meet.google.com/lookup/gr74gcatji',
      flat: '6.201',
      educator: 'Кирхар Н.В.',
    },
  ],
}
