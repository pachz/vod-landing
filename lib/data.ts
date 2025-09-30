export interface Course {
  id: string
  title: string
  description: string
  instructor: string
  duration: string
  category: string
  image: string
  level: 'beginner' | 'intermediate' | 'advanced'
}

export interface Instructor {
  id: string
  name: string
  tagline: string
  statement: string
  image: string
  cta: string
}

export interface FAQ {
  id: string
  question: string
  answer: string
}

export const courses: Course[] = [
  {
    id: '1',
    title: 'Building Confidence from Within',
    description: 'Learn to embrace your authentic self and build unshakeable confidence.',
    instructor: 'Sarah Khalil',
    duration: '45 min',
    category: 'confidence',
    image: '/images/w1.png',
    level: 'beginner'
  },
  {
    id: '2',
    title: 'Daily Habits for Success',
    description: 'Transform your life with small, powerful daily habits.',
    instructor: 'Layla Hassan',
    duration: '30 min',
    category: 'habits',
    image: '/images/w2.png',
    level: 'beginner'
  },
  {
    id: '3',
    title: 'Leadership & Career Growth',
    description: 'Unlock your leadership potential and advance your career.',
    instructor: 'Maya Al Zahra',
    duration: '60 min',
    category: 'career',
    image: '/images/w3.png',
    level: 'intermediate'
  },
  {
    id: '4',
    title: 'Mindfulness & Emotional Growth',
    description: 'Find inner peace and emotional balance in your daily life.',
    instructor: 'Nora Al Sabah',
    duration: '40 min',
    category: 'wellness',
    image: '/images/w4.png',
    level: 'beginner'
  },
  {
    id: '5',
    title: 'Healthy Lifestyle Transformation',
    description: 'Create sustainable healthy habits that last a lifetime.',
    instructor: 'Layla Hassan',
    duration: '50 min',
    category: 'lifestyle',
    image: '/images/w5.png',
    level: 'intermediate'
  },
  {
    id: '6',
    title: 'Overcoming Self-Doubt',
    description: 'Break free from limiting beliefs and step into your power.',
    instructor: 'Sarah Khalil',
    duration: '35 min',
    category: 'confidence',
    image: '/images/w6.png',
    level: 'intermediate'
  },
  {
    id: '7',
    title: 'Financial Independence for Women',
    description: 'Master your finances and build wealth for a secure future.',
    instructor: 'Maya Al Zahra',
    duration: '55 min',
    category: 'finance',
    image: '/images/w7.png',
    level: 'intermediate'
  },
  {
    id: '8',
    title: 'Creative Expression & Art Therapy',
    description: 'Discover your creative voice and use art for emotional healing.',
    instructor: 'Nora Al Sabah',
    duration: '40 min',
    category: 'creativity',
    image: '/images/w8.png',
    level: 'beginner'
  }
]

export const instructors: Instructor[] = [
  {
    id: '1',
    name: 'Maya Al Zahra',
    tagline: 'Career & Leadership Coach',
    statement: 'Unlock your potential, lead with purpose, and inspire others.',
    image: '/images/w3.png',
    cta: 'Start Learning'
  },
  {
    id: '2',
    name: 'Sarah Khalil',
    tagline: 'Motivational Speaker & Life Coach',
    statement: 'I believe every woman has the strength to design her future. Let\'s take the first step together.',
    image: '/images/w6.png',
    cta: 'Watch Her Story'
  },
  {
    id: '3',
    name: 'Nora Al Sabah',
    tagline: 'Mindfulness & Emotional Growth',
    statement: 'Inner peace is the foundation of true success.',
    image: '/images/w8.png',
    cta: 'Join Her Sessions'
  }
]

export const faqs: FAQ[] = [
  {
    id: '1',
    question: 'What is vod lady?',
    answer: 'A motivational video platform with structured courses, chapters, and short episodes led by inspiring women.'
  },
  {
    id: '2',
    question: 'Do I need to subscribe to access the videos?',
    answer: 'You can start exploring courses for free. Some advanced features may be added later.'
  },
  {
    id: '3',
    question: 'Can I watch on my phone?',
    answer: 'Yes — vod lady works on desktop, tablet, and mobile devices.'
  },
  {
    id: '4',
    question: 'Are new courses added regularly?',
    answer: 'Yes — new motivational content will be added every month.'
  },
  {
    id: '5',
    question: 'Can I download videos to watch offline?',
    answer: 'Offline mode will be available in the near future.'
  }
]
