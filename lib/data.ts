export interface Course {
  id: string
  title: string
  description: string
  instructor: string
  duration: string
  category: string
  image: string
  level: 'beginner' | 'intermediate' | 'advanced'
  // Arabic-localized fields for dynamic display
  titleAr?: string
  descriptionAr?: string
  instructorAr?: string
  durationAr?: string
}

export interface Instructor {
  id: string
  name: string
  tagline: string
  statement: string
  image: string
  cta: string
}


export const courses: Course[] = [
  {
    id: '1',
    title: 'Building Confidence from Within',
    description: 'Learn to embrace your authentic self and build unshakeable confidence.',
    instructor: 'Reham Diva',
    duration: '45 min',
    category: 'confidence',
    image: '/images/w1.png',
    level: 'beginner',
    titleAr: 'برنامج أنوثة الديفا',
    descriptionAr: 'طريقك للتوازن بين الأنوثة والذكورة',
    instructorAr: 'رهام دیفا',
    durationAr: '45 دقيقة'
  },
  {
    id: '2',
    title: 'Daily Habits for Success',
    description: 'Transform your life with small, powerful daily habits.',
    instructor: 'Reham Diva',
    duration: '30 min',
    category: 'habits',
    image: '/images/w2.png',
    level: 'beginner',
    titleAr: 'برنامج سحر الديفا',
    descriptionAr: 'رحلتك للعودة إلى حب الذات',
    instructorAr: 'رهام دیفا',
    durationAr: '30 دقيقة'
  },
  {
    id: '3',
    title: 'Leadership & Career Growth',
    description: 'Unlock your leadership potential and advance your career.',
    instructor: 'Reham Diva',
    duration: '60 min',
    category: 'career',
    image: '/images/w3.png',
    level: 'intermediate',
    titleAr: 'برنامج جمال الديفا',
    descriptionAr: 'ارفعي من وعيك الجمالي وجاذبيتك',
    instructorAr: 'رهام دیفا',
    durationAr: '60 دقيقة'
  },
  {
    id: '4',
    title: 'Mindfulness & Emotional Growth',
    description: 'Find inner peace and emotional balance in your daily life.',
    instructor: 'Reham Diva',
    duration: '40 min',
    category: 'wellness',
    image: '/images/w4.png',
    level: 'beginner',
    titleAr: 'برنامج قلب الديفا',
    descriptionAr: 'البرنامج الذي يساعدك في اتخاذ القرار في حكمة القلب',
    instructorAr: 'رهام دیفا',
    durationAr: '40 دقيقة'
  },
  {
    id: '5',
    title: 'Healthy Lifestyle Transformation',
    description: 'Create sustainable healthy habits that last a lifetime.',
    instructor: 'Reham Diva',
    duration: '50 min',
    category: 'lifestyle',
    image: '/images/w5.png',
    level: 'intermediate',
    titleAr: 'برنامج نوايا الديفا',
    descriptionAr: 'البرنامج الذي يساعدك في تفعيل قوة النية',
    instructorAr: 'رهام دیفا',
    durationAr: '50 دقيقة'
  },
  {
    id: '6',
    title: 'Overcoming Self-Doubt',
    description: 'Break free from limiting beliefs and step into your power.',
    instructor: 'Reham Diva',
    duration: '35 min',
    category: 'confidence',
    image: '/images/w6.png',
    level: 'intermediate',
    titleAr: 'برنامج روح الديفا',
    descriptionAr: 'تعرفي على أهم إنسان في حياتك تعرفي عليك',
    instructorAr: 'رهام دیفا',
    durationAr: '35 دقيقة'
  },
  {
    id: '7',
    title: 'Financial Independence for Women',
    description: 'Master your finances and build wealth for a secure future.',
    instructor: 'Reham Diva',
    duration: '55 min',
    category: 'finance',
    image: '/images/w7.png',
    level: 'intermediate',
    titleAr: 'برنامج رهام حب',
    descriptionAr: 'رحلتك في الحب الروحي من الروح إلى الجسد',
    instructorAr: 'رهام دیفا',
    durationAr: '55 دقيقة'
  },
  {
    id: '8',
    title: 'Creative Expression & Art Therapy',
    description: 'Discover your creative voice and use art for emotional healing.',
    instructor: 'Reham Diva',
    duration: '40 min',
    category: 'creativity',
    image: '/images/w8.png',
    level: 'beginner',
    titleAr: 'برنامج أسطورتك الذاتية',
    descriptionAr: 'خططي لحياتك واكتشفي رسالتك',
    instructorAr: 'رهام دیفا',
    durationAr: '40 دقيقة'
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
