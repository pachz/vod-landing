'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { courses as courseCatalog } from '@/lib/data'
import { SiteFooter } from '@/components/layout'
import { useDirection } from '@/providers/DirectionProvider'

interface CourseDetailPageProps {
  params: { id: string }
}

const getCourseDetails = (id: string) => {
  const baseCourse = courseCatalog.find(course => course.id === id)
  if (!baseCourse) return null
  return {
    ...baseCourse,
    // English defaults; Arabic strings overridden in render based on locale
    fullDescription: "This comprehensive course is designed to help you build unshakeable confidence from within. Through a series of practical exercises, real-world examples, and proven techniques, you'll learn to embrace your authentic self and develop the inner strength needed to pursue your dreams and goals.",
    learningOutcomes: [
      "Develop a deep understanding of your authentic self",
      "Build unshakeable confidence in any situation",
      "Overcome self-doubt and limiting beliefs",
      "Create a personal confidence action plan",
      "Learn to handle criticism and setbacks with grace",
      "Develop powerful self-talk and affirmation practices",
    ],
    metaData: {
      totalDuration: '2 hours 30 minutes',
      lessonsCount: 12,
      studentsCount: '2,847',
      level: 'Beginner',
      language: 'English',
      lastUpdated: 'December 2024',
    },
    curriculum: [
      { title: 'Welcome to Your Confidence Journey', duration: '8:45', isPreview: true },
      { title: 'Understanding Confidence vs. Arrogance', duration: '12:30', isPreview: false },
      { title: 'Your Personal Confidence Assessment', duration: '15:20', isPreview: false },
      { title: 'The Science of Self-Confidence', duration: '18:15', isPreview: false },
      { title: 'Identifying Your Strengths and Values', duration: '22:10', isPreview: false },
      { title: 'Overcoming Imposter Syndrome', duration: '16:45', isPreview: false },
      { title: 'Body Language and Presence', duration: '14:30', isPreview: false },
      { title: 'Voice and Communication Confidence', duration: '19:25', isPreview: false },
      { title: 'Setting and Achieving Personal Goals', duration: '21:15', isPreview: false },
      { title: 'Handling Criticism and Feedback', duration: '17:40', isPreview: false },
      { title: 'Building Confidence in Relationships', duration: '20:30', isPreview: false },
      { title: 'Creating Your Confidence Maintenance Plan', duration: '13:20', isPreview: false },
    ],
    instructor: {
      name: 'Reham Diva',
      title: 'Confidence & Life Coach',
      bio: "Reham is a certified life coach with over 8 years of experience helping women build unshakeable confidence. She has worked with thousands of clients to overcome self-doubt and achieve their personal and professional goals.",
      image: '/images/w1.png',
      rating: 4.9,
      studentsCount: '15,000+',
    },
  }
}

export default function LangCourseDetailPage({ params }: CourseDetailPageProps) {
  const { locale } = useDirection()
  const isAr = locale === 'ar'
  const [activeTab, setActiveTab] = useState<'overview' | 'curriculum'>('overview')
  const course = getCourseDetails(params.id)
  const base = courseCatalog.find(c => c.id === params.id)

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center" dir={isAr ? 'rtl' : 'ltr'}>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-purple-900 mb-4">{isAr ? 'الدورة غير موجودة' : 'Course Not Found'}</h1>
          <p className="text-purple-700 mb-6">{isAr ? 'الدورة التي تبحثين عنها غير موجودة.' : "The course you're looking for doesn't exist."}</p>
          <Button onClick={() => window.history.back()}>
            {isAr ? 'العودة' : 'Go Back'}
          </Button>
        </div>
      </div>
    )
  }

  // Arabic overrides for dynamic text fields
  const ar = {
    fullDescription: 'هذه الدورة الشاملة مصممة لمساعدتك على بناء ثقة لا تتزعزع من الداخل. من خلال سلسلة من التمارين العملية والأمثلة الواقعية والتقنيات المجربة، ستتعلمين كيفية احتضان ذاتك الحقيقية وتطوير القوة الداخلية اللازمة لتحقيق أحلامك وأهدافك.',
    learningOutcomes: [
      'تطوير فهم عميق لذاتك الحقيقية',
      'بناء ثقة لا تتزعزع في أي موقف',
      'التغلب على الشك الذاتي والمعتقدات المحدودة',
      'إنشاء خطة عمل شخصية للثقة',
      'تعلم التعامل مع النقد والنكسات بكرامة',
      'تطوير ممارسات حديث الذات والتأكيدات القوية',
    ],
    metaData: {
      totalDuration: 'ساعتان و 30 دقيقة',
      lessonsCount: 12,
      studentsCount: '2,847',
      level: 'مبتدئ',
      language: 'العربية',
      lastUpdated: 'ديسمبر 2024',
    },
    curriculum: [
      'مرحباً بك في رحلة الثقة',
      'فهم الفرق بين الثقة والغرور',
      'تقييمك الشخصي للثقة',
      'علم الثقة بالنفس',
      'تحديد نقاط قوتك وقيمك',
      'التغلب على متلازمة المحتال',
      'لغة الجسد والحضور',
      'ثقة الصوت والتواصل',
      'وضع وتحقيق الأهداف الشخصية',
      'التعامل مع النقد والملاحظات',
      'بناء الثقة في العلاقات',
      'إنشاء خطة صيانة الثقة',
    ],
  }

  const backHref = `/${locale}/courses`
  const displayTitle = isAr ? (base?.titleAr || course.title) : course.title
  const instructorDisplayName = isAr ? (base?.instructorAr || course.instructor.name) : course.instructor.name

  return (
    <div className="min-h-screen bg-neutral-bg" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Hero Section */}
      <section className="bg-white pt-16">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12 lg:py-16">
          {/* Back Button */}
          <div className="mb-6">
            <Link 
              href={backHref}
              className="inline-flex items-center text-purple-600 hover:text-purple-800 transition-colors"
            >
              <svg className={cnIcon(isAr, 'w-5 h-5 mr-2', 'w-5 h-5 ml-2')} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isAr ? 'M9 5l7 7-7 7' : 'M15 19l-7-7 7-7'} />
              </svg>
              {isAr ? 'العودة إلى الدورات' : 'Back to Courses'}
            </Link>
          </div>
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Left Column - Course Info */}
            <div className="space-y-6">
              {/* Course Title */}
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-purple-900 leading-tight mb-4">
                  {displayTitle}
                </h1>
                <p className="text-lg text-purple-700 leading-relaxed mb-6">
                  {isAr ? ar.fullDescription : course.fullDescription}
                </p>
              </div>

              {/* What You'll Learn */}
              <div>
                <h3 className="text-xl font-semibold text-purple-900 mb-4">{isAr ? 'ما ستتعلمينه' : "What you'll learn"}</h3>
                <ul className="space-y-2">
                  {(isAr ? ar.learningOutcomes : course.learningOutcomes).map((outcome, index) => (
                    <li key={index} className={isAr ? 'flex items-start space-x-reverse space-x-3' : 'flex items-start space-x-3'}>
                      <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-purple-700">{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Course Meta Data */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-6 border-t border-b border-purple-100">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-900">{(isAr ? ar.metaData.totalDuration : course.metaData.totalDuration)}</div>
                  <div className="text-sm text-purple-600">{isAr ? 'المدة الإجمالية' : 'Total Duration'}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-900">{course.metaData.lessonsCount}</div>
                  <div className="text-sm text-purple-600">{isAr ? 'الدروس' : 'Lessons'}</div>
                </div>
                <div className="text-center sm:col-span-1 col-span-2">
                  <div className="text-2xl font-bold text-purple-900">{course.metaData.studentsCount}</div>
                  <div className="text-sm text-purple-600">{isAr ? 'الطلاب' : 'Students'}</div>
                </div>
              </div>

              {/* Pricing & Enrollment Section */}
              <div className="bg-white border border-purple-200 rounded-xl p-6 shadow-sm">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-purple-900">{isAr ? 'شراء لمرة واحدة' : 'One-time Purchase'}</h3>
                      <p className="text-sm text-purple-600">{isAr ? 'احصلي على وصول مدى الحياة لهذه الدورة' : 'Get lifetime access to this course'}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-purple-900">{isAr ? '8.5 د.ك' : '8.5 KWD'}</div>
                      <div className="text-sm text-purple-600">{isAr ? 'دفعة واحدة' : 'One-time payment'}</div>
                    </div>
                  </div>
                  <Button 
                    size="lg" 
                    onClick={() => console.log('Enroll', course.id)}
                    className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 text-lg"
                  >
                    {isAr ? 'اشتراك الآن - 8.5 د.ك' : 'Enroll Now - 8.5 KWD'}
                  </Button>
                  <div className="flex flex-col items-center mt-3 text-sm text-purple-600">
                    <span style={{ color: '#665BFF' }}>{isAr ? 'دفع آمن' : 'Secure payment'}</span>
                    <Image src="/images/stripe.png" alt="Stripe" width={150} height={35} className="mb-2" />
                  </div>
                </div>
                <div className="pt-4 border-top border-purple-100">
                  <div className={isAr ? 'grid grid-cols-2 gap-x-8 gap-y-4 text-right' : 'grid grid-cols-2 gap-x-8 gap-y-4'}>
                    <div className="flex items-center text-sm text-purple-700">
                      <svg className={isAr ? 'w-4 h-4 text-green-500 ml-3 flex-shrink-0' : 'w-4 h-4 text-green-500 mr-3 flex-shrink-0'} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {isAr ? 'ضمان استرداد الأموال لمدة 30 يوماً' : '30-day money-back guarantee'}
                    </div>
                    <div className="flex items-center text-sm text-purple-700">
                      <svg className={isAr ? 'w-4 h-4 text-green-500 ml-3 flex-shrink-0' : 'w-4 h-4 text-green-500 mr-3 flex-shrink-0'} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {isAr ? 'وصول مدى الحياة لهذه الدورة' : 'Lifetime access to this course'}
                    </div>
                    <div className="flex items-center text-sm text-purple-700">
                      <svg className={isAr ? 'w-4 h-4 text-green-500 ml-3 flex-shrink-0' : 'w-4 h-4 text-green-500 mr-3 flex-shrink-0'} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {isAr ? 'الوصول على الهاتف والكمبيوتر' : 'Access on mobile & desktop'}
                    </div>
                    <div className="flex items-center text-sm text-purple-700">
                      <svg className={isAr ? 'w-4 h-4 text-green-500 ml-3 flex-shrink-0' : 'w-4 h-4 text-green-500 mr-3 flex-shrink-0'} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {isAr ? 'شهادة إتمام' : 'Certificate of completion'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Share Button */}
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({ title: course.title, text: course.description, url: window.location.href })
                    } else {
                      navigator.clipboard.writeText(window.location.href)
                      alert(isAr ? 'تم نسخ رابط الدورة!' : 'Course link copied to clipboard!')
                    }
                  }}
                  className="w-full border-purple-300 text-purple-700 hover:bg-purple-50"
                >
                  <svg className={isAr ? 'w-5 h-5 ml-2' : 'w-5 h-5 mr-2'} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                  {isAr ? 'مشاركة الدورة' : 'Share Course'}
                </Button>
              </div>
            </div>

            {/* Right Column - Video Preview */}
            <div className="space-y-6">
              <div className="relative aspect-video bg-purple-100 rounded-xl overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-200 to-pink-200">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white/80 rounded-full flex items-center justify-center mb-4 mx-auto">
                      <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                    <p className="text-purple-700 font-medium">{isAr ? 'معاينة الدورة' : 'Course Preview'}</p>
                    <p className="text-sm text-purple-600">{isAr ? 'معاينة 2:30 متاحة' : '2:30 preview available'}</p>
                  </div>
                </div>
              </div>

              {/* Instructor Info */}
              <div className="bg-white border border-purple-100 rounded-xl p-6">
                <div className={isAr ? 'flex items-center space-x-reverse space-x-4 mb-4' : 'flex items-center space-x-4 mb-4'}>
                  <Image src={course.instructor.image} alt={course.instructor.name} width={60} height={60} className="rounded-full object-cover" />
                  <div>
                    <h4 className="font-semibold text-purple-900">{instructorDisplayName}</h4>
                    <p className="text-sm text-purple-600">{course.instructor.title}</p>
                    <div className={isAr ? 'flex items-center space-x-reverse space-x-2 mt-1' : 'flex items-center space-x-2 mt-1'}>
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm text-purple-600">{course.instructor.rating}</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-purple-700">{course.instructor.bio}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tab Section */}
      <section className="bg-white border-t border-purple-100">
        <div className="max-w-7xl mx-auto px-4">
          {/* Tab Navigation */}
          <div className="flex border-b border-purple-100">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'overview' ? 'border-pink-500 text-pink-600' : 'border-transparent text-purple-600 hover:text-purple-800'
              }`}
            >
              {isAr ? 'نظرة عامة' : 'Overview'}
            </button>
            <button
              onClick={() => setActiveTab('curriculum')}
              className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'curriculum' ? 'border-pink-500 text-pink-600' : 'border-transparent text-purple-600 hover:text-purple-800'
              }`}
            >
              {isAr ? 'المنهج' : 'Curriculum'}
            </button>
          </div>

          {/* Tab Content */}
          <div className="py-8">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-semibold text-purple-900 mb-4">{isAr ? 'حول هذه الدورة' : 'About This Course'}</h3>
                  <p className="text-purple-700 leading-relaxed">{isAr ? ar.fullDescription : course.fullDescription}</p>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-purple-900 mb-4">{isAr ? 'نتائج التعلم' : 'Learning Outcomes'}</h3>
                  <ul className="space-y-3">
                    {(isAr ? ar.learningOutcomes : course.learningOutcomes).map((outcome, index) => (
                      <li key={index} className={isAr ? 'flex items-start space-x-reverse space-x-3' : 'flex items-start space-x-3'}>
                        <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-purple-700">{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-purple-900 mb-4">{isAr ? 'تفاصيل الدورة' : 'Course Details'}</h3>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex justify-between"><span className="text-purple-600">{isAr ? 'المستوى:' : 'Level:'}</span><span className="text-purple-900 font-medium">{isAr ? ar.metaData.level : course.metaData.level}</span></div>
                      <div className="flex justify-between"><span className="text-purple-600">{isAr ? 'اللغة:' : 'Language:'}</span><span className="text-purple-900 font-medium">{isAr ? ar.metaData.language : course.metaData.language}</span></div>
                      <div className="flex justify-between"><span className="text-purple-600">{isAr ? 'المدة:' : 'Duration:'}</span><span className="text-purple-900 font-medium">{isAr ? ar.metaData.totalDuration : course.metaData.totalDuration}</span></div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between"><span className="text-purple-600">{isAr ? 'الدروس:' : 'Lessons:'}</span><span className="text-purple-900 font-medium">{course.metaData.lessonsCount}</span></div>
                      <div className="flex justify-between"><span className="text-purple-600">{isAr ? 'الطلاب:' : 'Students:'}</span><span className="text-purple-900 font-medium">{course.metaData.studentsCount}</span></div>
                      <div className="flex justify-between"><span className="text-purple-600">{isAr ? 'آخر تحديث:' : 'Updated:'}</span><span className="text-purple-900 font-medium">{isAr ? ar.metaData.lastUpdated : course.metaData.lastUpdated}</span></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'curriculum' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-semibold text-purple-900">{isAr ? 'منهج الدورة' : 'Course Curriculum'}</h3>
                  <div className="text-sm text-purple-600">{course.curriculum.length} {isAr ? 'دروس' : 'lessons'} • {isAr ? ar.metaData.totalDuration : course.metaData.totalDuration}</div>
                </div>
                <div className="bg-white border border-purple-100 rounded-xl overflow-hidden shadow-sm">
                  {course.curriculum.map((lesson, index) => (
                    <div key={index} className={`px-6 py-4 flex items-center justify-between transition-colors ${index !== course.curriculum.length - 1 ? 'border-b border-purple-50' : ''} hover:bg-purple-25`}>
                      <div className={isAr ? 'flex items-center space-x-reverse space-x-4' : 'flex items-center space-x-4'}>
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-semibold text-purple-700">{index + 1}</span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className={isAr ? 'flex items-center space-x-reverse space-x-3' : 'flex items-center space-x-3'}>
                            <h5 className="font-medium text-purple-900">{isAr ? ar.curriculum[index] : lesson.title}</h5>
                            {lesson.isPreview && (
                              <span className="text-xs bg-pink-100 text-pink-600 px-2 py-1 rounded-full font-medium">{isAr ? 'معاينة' : 'Preview'}</span>
                            )}
                          </div>
                          <div className={isAr ? 'flex items-center space-x-reverse space-x-2 mt-1' : 'flex items-center space-x-2 mt-1'}>
                            <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z"/>
                            </svg>
                            <span className="text-sm text-purple-500">{isAr ? 'درس فيديو' : 'Video lesson'}</span>
                          </div>
                        </div>
                      </div>
                      <div className={isAr ? 'flex items-center space-x-reverse space-x-3' : 'flex items-center space-x-3'}>
                        <span className="text-sm font-medium text-purple-600 bg-purple-50 px-3 py-1 rounded-full">{lesson.duration}</span>
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}

function cnIcon(isAr: boolean, ltr: string, rtl: string) {
  return isAr ? rtl : ltr
}


