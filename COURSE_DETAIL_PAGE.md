# Course Detail Page

## Overview
A static Course Detail Page for the URL `/courses/[id]` with a public view that matches the design and style of the main page.

## Features

### Design & Style
- Uses the same color palette, typography, spacing, and overall vibe from the main page
- Maintains visual hierarchy and consistent branding
- Clean, readable, and well-structured layout
- Responsive design that works on mobile and desktop

### Page Structure

#### 1. Hero / Header Section (Top)
- **Course Title**: Large and prominent at the top
- **Course Description**: Short paragraph under the title
- **"What you'll learn" list**: Bulleted list below the description
- **Course Meta Data**: Horizontally aligned (total duration, number of lessons, number of students)
- **Trial video preview**: Positioned to the right or below text, visually balanced
- **"Enroll Now / Subscribe" button**: Prominent, primary color
- **Share button**: Small icon next to enroll button

#### 2. Tab Section (Below Header)
- **Tabs**: Horizontally aligned at the top: **Overview** | **Curriculum**
- **Tab 1: Overview**
  - Full course description
  - Meta data and learning outcomes
- **Tab 2: Curriculum**
  - List all lessons sequentially
  - Each lesson shows title and duration
  - Collapsible/expandable lesson sections

### Layout Notes
- Header section has clear separation from tab content
- Tabs switch content without page reload
- Buttons and interactive elements have hover/focus states
- Responsive: stacked layout on mobile, side-by-side content on desktop

### Content Placeholders
- Uses placeholder text/images where needed (e.g., trial video, lesson titles)
- Easy to update content dynamically in the future

## File Structure
```
app/courses/
├── [id]/
│   └── page.tsx          # Course detail page
├── page.tsx              # Courses listing page
└── layout.tsx            # Layout wrapper
```

## Usage

### Accessing the Course Detail Page
1. Navigate to `/courses/1` to view the first course
2. Navigate to `/courses` to see all available courses
3. Click on any course from the main page to go to its detail page

### Features Implemented
- ✅ Hero section with course information
- ✅ Tab system for Overview/Curriculum
- ✅ Responsive design
- ✅ Navigation with back button
- ✅ Share functionality
- ✅ Enroll button
- ✅ Instructor information
- ✅ Course metadata display
- ✅ Collapsible curriculum sections
- ✅ Consistent styling with main page

## Sample Data
The page uses sample data from `/lib/data.ts` and includes:
- Course information (title, description, instructor, duration)
- Learning outcomes
- Curriculum with sections and lessons
- Instructor details
- Meta data (duration, lessons count, students count)

## Styling
- Uses Tailwind CSS with custom color palette
- Consistent with main page design system
- Responsive breakpoints for mobile/desktop
- Hover and focus states for interactive elements
- Smooth transitions and animations
