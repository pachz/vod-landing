'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { courses } from '@/lib/data'
import { Navbar, SiteFooter } from '@/components/layout'

interface CourseDetailPageProps {
  params: {
    id: string
  }
}

// Sample course data with detailed information
const getCourseDetails = (id: string) => {
  const baseCourse = courses.find(course => course.id === id)
  if (!baseCourse) return null

  return {
    ...baseCourse,
    fullDescription: "هذه الدورة الشاملة مصممة لمساعدتك على بناء ثقة لا تتزعزع من الداخل. من خلال سلسلة من التمارين العملية والأمثلة الواقعية والتقنيات المجربة، ستتعلمين كيفية احتضان ذاتك الحقيقية وتطوير القوة الداخلية اللازمة لتحقيق أحلامك وأهدافك.",
    learningOutcomes: [
      "تطوير فهم عميق لذاتك الحقيقية",
      "بناء ثقة لا تتزعزع في أي موقف",
      "التغلب على الشك الذاتي والمعتقدات المحدودة",
      "إنشاء خطة عمل شخصية للثقة",
      "تعلم التعامل مع النقد والنكسات بكرامة",
      "تطوير ممارسات حديث الذات والتأكيدات القوية"
    ],
    metaData: {
      totalDuration: "ساعتان و 30 دقيقة",
      lessonsCount: 12,
      studentsCount: "2,847",
      level: "مبتدئ",
      language: "العربية",
      lastUpdated: "ديسمبر 2024"
    },
    curriculum: [
      { title: "مرحباً بك في رحلة الثقة", duration: "8:45", isPreview: true },
      { title: "فهم الفرق بين الثقة والغرور", duration: "12:30", isPreview: false },
      { title: "تقييمك الشخصي للثقة", duration: "15:20", isPreview: false },
      { title: "علم الثقة بالنفس", duration: "18:15", isPreview: false },
      { title: "تحديد نقاط قوتك وقيمك", duration: "22:10", isPreview: false },
      { title: "التغلب على متلازمة المحتال", duration: "16:45", isPreview: false },
      { title: "لغة الجسد والحضور", duration: "14:30", isPreview: false },
      { title: "ثقة الصوت والتواصل", duration: "19:25", isPreview: false },
      { title: "وضع وتحقيق الأهداف الشخصية", duration: "21:15", isPreview: false },
      { title: "التعامل مع النقد والملاحظات", duration: "17:40", isPreview: false },
      { title: "بناء الثقة في العلاقات", duration: "20:30", isPreview: false },
      { title: "إنشاء خطة صيانة الثقة", duration: "13:20", isPreview: false }
    ],
    instructor: {
      name: "رهام دیفا",
      title: "مدربة ثقة وحياة",
      bio: "رهام مدربة حياة معتمدة مع أكثر من 8 سنوات من الخبرة في مساعدة النساء على بناء ثقة لا تتزعزع. عملت مع آلاف العملاء للتغلب على الشك الذاتي وتحقيق أهدافهم الشخصية والمهنية.",
      image: "/images/w1.png",
      rating: 4.9,
      studentsCount: "15,000+"
    }
  }
}

export default function ArabicCourseDetailPage({ params }: CourseDetailPageProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'curriculum'>('overview')
  
  const course = getCourseDetails(params.id)
  
  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-purple-900 mb-4">الدورة غير موجودة</h1>
          <p className="text-purple-700 mb-6">الدورة التي تبحثين عنها غير موجودة.</p>
          <Button onClick={() => window.history.back()}>
            العودة
          </Button>
        </div>
      </div>
    )
  }


  const handleEnroll = () => {
    // Handle enrollment logic
    console.log('Enrolling in course:', course.id)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: course.title,
        text: course.description,
        url: window.location.href
      })
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href)
      alert('تم نسخ رابط الدورة!')
    }
  }

  return (
    <div className="min-h-screen bg-neutral-bg" dir="rtl">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-white pt-16">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12 lg:py-16">
          {/* Back Button */}
          <div className="mb-6">
            <Link 
              href="/ar/courses"
              className="inline-flex items-center text-purple-600 hover:text-purple-800 transition-colors"
            >
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              العودة إلى الدورات
            </Link>
          </div>
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Left Column - Course Info */}
            <div className="space-y-6">
              {/* Course Title */}
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-purple-900 leading-tight mb-4">
                  {course.title}
                </h1>
                <p className="text-lg text-purple-700 leading-relaxed mb-6">
                  {course.fullDescription}
                </p>
              </div>

              {/* What You'll Learn */}
              <div>
                <h3 className="text-xl font-semibold text-purple-900 mb-4">ما ستتعلمينه</h3>
                <ul className="space-y-2">
                  {course.learningOutcomes.map((outcome, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-purple-700">{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Course Meta Data */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-6 border-t border-b border-purple-100">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-900">{course.metaData.totalDuration}</div>
                  <div className="text-sm text-purple-600">المدة الإجمالية</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-900">{course.metaData.lessonsCount}</div>
                  <div className="text-sm text-purple-600">الدروس</div>
                </div>
                <div className="text-center sm:col-span-1 col-span-2">
                  <div className="text-2xl font-bold text-purple-900">{course.metaData.studentsCount}</div>
                  <div className="text-sm text-purple-600">الطلاب</div>
                </div>
              </div>

              {/* Pricing & Enrollment Section */}
              <div className="bg-white border border-purple-200 rounded-xl p-6 shadow-sm">
                {/* Primary Enrollment Option */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-purple-900">شراء لمرة واحدة</h3>
                      <p className="text-sm text-purple-600">احصلي على وصول مدى الحياة لهذه الدورة</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-purple-900">8.5 د.ك</div>
                      <div className="text-sm text-purple-600">دفعة واحدة</div>
                    </div>
                  </div>
                  <Button 
                    size="lg" 
                    onClick={handleEnroll}
                    className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 text-lg"
                  >
                    اشتراك الآن - 8.5 د.ك
                  </Button>
                  
                  {/* Secure Payment Note */}
                  <div className="flex flex-col items-center mt-3 text-sm text-purple-600">
                    <span style={{ color: '#665BFF' }}>دفع آمن</span>
                    <Image
                      src="/images/stripe.png"
                      alt="Stripe"
                      width={150}
                      height={35}
                      className="mb-2"
                    />
                  </div>
                </div>

                {/* Trust Signals */}
                <div className="pt-4 border-t border-purple-100">
                  <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                    <div className="flex items-center text-sm text-purple-700">
                      <svg className="w-4 h-4 text-green-500 ml-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      ضمان استرداد الأموال لمدة 30 يوماً
                    </div>
                    <div className="flex items-center text-sm text-purple-700">
                      <svg className="w-4 h-4 text-green-500 ml-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      وصول مدى الحياة لهذه الدورة
                    </div>
                    <div className="flex items-center text-sm text-purple-700">
                      <svg className="w-4 h-4 text-green-500 ml-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      الوصول على الهاتف والكمبيوتر
                    </div>
                    <div className="flex items-center text-sm text-purple-700">
                      <svg className="w-4 h-4 text-green-500 ml-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      شهادة إتمام
                    </div>
                  </div>
                </div>
              </div>

              {/* Share Button */}
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={handleShare}
                  className="w-full border-purple-300 text-purple-700 hover:bg-purple-50"
                >
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                  مشاركة الدورة
                </Button>
              </div>
            </div>

            {/* Right Column - Video Preview */}
            <div className="space-y-6">
              <div className="relative aspect-video bg-purple-100 rounded-xl overflow-hidden">
                {/* Placeholder for Vimeo embed */}
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-200 to-pink-200">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white/80 rounded-full flex items-center justify-center mb-4 mx-auto">
                      <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                    <p className="text-purple-700 font-medium">معاينة الدورة</p>
                    <p className="text-sm text-purple-600">معاينة 2:30 متاحة</p>
                  </div>
                </div>
              </div>

              {/* Instructor Info */}
              <div className="bg-white border border-purple-100 rounded-xl p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <Image
                    src={course.instructor.image}
                    alt={course.instructor.name}
                    width={60}
                    height={60}
                    className="rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-purple-900">{course.instructor.name}</h4>
                    <p className="text-sm text-purple-600">{course.instructor.title}</p>
                    <div className="flex items-center space-x-2 mt-1">
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
                activeTab === 'overview'
                  ? 'border-pink-500 text-pink-600'
                  : 'border-transparent text-purple-600 hover:text-purple-800'
              }`}
            >
              نظرة عامة
            </button>
            <button
              onClick={() => setActiveTab('curriculum')}
              className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'curriculum'
                  ? 'border-pink-500 text-pink-600'
                  : 'border-transparent text-purple-600 hover:text-purple-800'
              }`}
            >
              المنهج
            </button>
          </div>

          {/* Tab Content */}
          <div className="py-8">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Full Description */}
                <div>
                  <h3 className="text-2xl font-semibold text-purple-900 mb-4">حول هذه الدورة</h3>
                  <p className="text-purple-700 leading-relaxed">
                    {course.fullDescription}
                  </p>
                </div>

                {/* Learning Outcomes */}
                <div>
                  <h3 className="text-2xl font-semibold text-purple-900 mb-4">نتائج التعلم</h3>
                  <ul className="space-y-3">
                    {course.learningOutcomes.map((outcome, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-purple-700">{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Course Details */}
                <div>
                  <h3 className="text-2xl font-semibold text-purple-900 mb-4">تفاصيل الدورة</h3>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-purple-600">المستوى:</span>
                        <span className="text-purple-900 font-medium">{course.metaData.level}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-600">اللغة:</span>
                        <span className="text-purple-900 font-medium">{course.metaData.language}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-600">المدة:</span>
                        <span className="text-purple-900 font-medium">{course.metaData.totalDuration}</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-purple-600">الدروس:</span>
                        <span className="text-purple-900 font-medium">{course.metaData.lessonsCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-600">الطلاب:</span>
                        <span className="text-purple-900 font-medium">{course.metaData.studentsCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-600">آخر تحديث:</span>
                        <span className="text-purple-900 font-medium">{course.metaData.lastUpdated}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'curriculum' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-semibold text-purple-900">منهج الدورة</h3>
                  <div className="text-sm text-purple-600">
                    {course.curriculum.length} دروس • {course.metaData.totalDuration}
                  </div>
                </div>
                
                <div className="bg-white border border-purple-100 rounded-xl overflow-hidden shadow-sm">
                  {course.curriculum.map((lesson, index) => (
                    <div
                      key={index}
                      className={`px-6 py-4 flex items-center justify-between transition-colors ${
                        index !== course.curriculum.length - 1 ? 'border-b border-purple-50' : ''
                      } hover:bg-purple-25`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-semibold text-purple-700">{index + 1}</span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <h5 className="font-medium text-purple-900">{lesson.title}</h5>
                            {lesson.isPreview && (
                              <span className="text-xs bg-pink-100 text-pink-600 px-2 py-1 rounded-full font-medium">
                                معاينة
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 mt-1">
                            <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z"/>
                            </svg>
                            <span className="text-sm text-purple-500">درس فيديو</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                          {lesson.duration}
                        </span>
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
