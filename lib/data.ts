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


export interface Testimonial {
  id: string
  name: string
  role: string
  text: string
  image: string
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
    level: 'beginner'
  },
  {
    id: '2',
    title: 'Daily Habits for Success',
    description: 'Transform your life with small, powerful daily habits.',
    instructor: 'Reham Diva',
    duration: '30 min',
    category: 'habits',
    image: '/images/w2.png',
    level: 'beginner'
  },
  {
    id: '3',
    title: 'Leadership & Career Growth',
    description: 'Unlock your leadership potential and advance your career.',
    instructor: 'Reham Diva',
    duration: '60 min',
    category: 'career',
    image: '/images/w3.png',
    level: 'intermediate'
  },
  {
    id: '4',
    title: 'Mindfulness & Emotional Growth',
    description: 'Find inner peace and emotional balance in your daily life.',
    instructor: 'Reham Diva',
    duration: '40 min',
    category: 'wellness',
    image: '/images/w4.png',
    level: 'beginner'
  },
  {
    id: '5',
    title: 'Healthy Lifestyle Transformation',
    description: 'Create sustainable healthy habits that last a lifetime.',
    instructor: 'Reham Diva',
    duration: '50 min',
    category: 'lifestyle',
    image: '/images/w5.png',
    level: 'intermediate'
  },
  {
    id: '6',
    title: 'Overcoming Self-Doubt',
    description: 'Break free from limiting beliefs and step into your power.',
    instructor: 'Reham Diva',
    duration: '35 min',
    category: 'confidence',
    image: '/images/w6.png',
    level: 'intermediate'
  },
  {
    id: '7',
    title: 'Financial Independence for Women',
    description: 'Master your finances and build wealth for a secure future.',
    instructor: 'Reham Diva',
    duration: '55 min',
    category: 'finance',
    image: '/images/w7.png',
    level: 'intermediate'
  },
  {
    id: '8',
    title: 'Creative Expression & Art Therapy',
    description: 'Discover your creative voice and use art for emotional healing.',
    instructor: 'Reham Diva',
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

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    role: 'Marketing Manager',
    text: 'This platform completely changed the way I consume video content. The smooth navigation, the personalized recommendations, and the high-quality streaming make it stand out from every other service I\'ve tried. It honestly feels like it was built exactly for my needs.',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '2',
    name: 'Ahmed Al-Farsi',
    role: 'Entrepreneur',
    text: 'The VOD service is reliable, fast, and always accessible. I can watch my favorite shows while traveling, working, or relaxing at home without interruptions. It has quickly become an essential part of my daily routine and I truly value the convenience it offers.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '3',
    name: 'Emily Carter',
    role: 'Student',
    text: 'I was looking for an affordable platform with a simple design, but I got much more than that. The user interface is modern, easy to navigate, and fun to use. I enjoy how quickly I can find new content, and I\'ve already recommended it to most of my classmates.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '4',
    name: 'David Kim',
    role: 'Software Engineer',
    text: 'What impressed me the most is the attention to detail throughout the platform. From the streaming quality to the layout and responsiveness, everything feels polished. It\'s rare to find such a seamless blend of technology and design in a streaming service.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  }
]

