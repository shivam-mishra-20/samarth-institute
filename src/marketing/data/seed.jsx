import React from "react";
import {
  FiUsers,
  FiBookOpen,
  FiAward,
  FiClock,
  FiMonitor,
  FiVideo,
} from "react-icons/fi";

export const featuredCourses = [];

export const faculties = [
  {
    id: 1,
    name: "Bhavna Ma'am",
    role: "Mathematics Expert",
    image: "/faculty-images/Bhavna-maam.png",
    specialty: "Mathematics",
    Qualification: "M.Sc. B.Ed",
    courseCount: 15,
    socials: { linkedin: "#", twitter: "#" },
  },
  {
    id: 2,
    name: "Diya Ma'am",
    role: "Science Expert",
    image: "/faculty-images/Diya-maam.png",
    specialty: "Science",
    Qualification: "M.Sc.",
    courseCount: 10,
    socials: { linkedin: "#", twitter: "#" },
  },
  {
    id: 3,
    name: "Kiran Ma'am",
    role: "Biology Specialist",
    image: "/faculty-images/Kiran-maam.jpeg",
    specialty: "Biology",
    Qualification: "M.Sc. Biology",
    courseCount: 18,
    socials: { linkedin: "#", twitter: "#" },
  },
  {
    id: 4,
    name: "Nilam Ma'am",
    role: "Expert Faculty",
    image: "/faculty-images/Nilam-maam.png",
    specialty: "Science",
    Qualification: "B.Ed",
    courseCount: 12,
    socials: { linkedin: "#", twitter: "#" },
  },
  {
    id: 5,
    name: "Rinkal Shah",
    role: "Chemistry Expert",
    image: "/faculty-images/Rinkal-Shah.png",
    specialty: "Chemistry",
    Qualification: "M.Sc. B.Ed",
    courseCount: 16,
    socials: { linkedin: "#", twitter: "#" },
  },
  {
    id: 6,
    name: "Yash Sir",
    role: "Physics Specialist",
    image: "/faculty-images/Yash-sir.png",
    specialty: "Physics",
    Qualification: "M.Tech",
    courseCount: 14,
    socials: { linkedin: "#", twitter: "#" },
  },
  {
    id: 7,
    name: "Diya Parmar",
    role: "Foundation Expert",
    image: "/faculty-images/diya-parmar.png",
    specialty: "Foundation",
    Qualification: "B.Sc.",
    courseCount: 8,
    socials: { linkedin: "#", twitter: "#" },
  },
];

export const stats = [
  { label: "Expert Tutors", value: "50", suffix: "+", icon: "FiUsers" },
  { label: "Top Lessons", value: "1500", suffix: "+", icon: "FiBookOpen" },
  { label: "Over Students", value: "19000", suffix: "+", icon: "FiMonitor" },
  { label: "Pro Videos", value: "3000", suffix: "+", icon: "FiVideo" },
];

export const testimonials = [
  {
    id: 1,
    name: "ritu vikipanjabi",
    role: "Google Review",
    content: "Best institute, must visit before admission anywhere else.",
    avatar:
      "https://lh3.googleusercontent.com/a-/ALV-UjWqYM_Y_Y_Y_Y_Y_Y_Y_Y_Y_Y_Y_Y_Y_Y_Y=w60-h60-p-rp-mo-br100", // Generic Google avatar or placeholder
    rating: 5,
    date: "2024-06-16",
  },
  {
    id: 2,
    name: "Manoj Panchbhave",
    role: "Google Review",
    content:
      "It is very good institute,all teachers are supportive and hard working, really improvement in results.",
    avatar:
      "https://lh3.googleusercontent.com/a-/ALV-UjWqYM_Y_Y_Y_Y_Y_Y_Y_Y_Y_Y_Y_Y_Y_Y_Y=w60-h60-p-rp-mo-br100",
    rating: 5,
    date: "2024-06-16",
  },
  {
    id: 3,
    name: "Dharti Padhiyar",
    role: "Google Review",
    content: "Best tutorial for science, must go there.",
    avatar:
      "https://lh3.googleusercontent.com/a-/ALV-UjWqYM_Y_Y_Y_Y_Y_Y_Y_Y_Y_Y_Y_Y_Y_Y_Y=w60-h60-p-rp-mo-br100",
    rating: 5,
    date: "2024-06-16",
  },
  {
    id: 4,
    name: "Ashmay Panchbhave",
    role: "Google Review",
    content:
      "Overall this institute is fine for science but not that much before science from my experience.",
    avatar: "",
    rating: 3,
    date: "2024-06-16",
  },
  {
    id: 5,
    name: "Urvi Dave",
    role: "Google Review",
    content:
      "Really appreciate to all teachers efforts, specifically to Tejashri mam as a best mentor who guides us on right way of learning.Best for science students.",
    avatar: "",
    rating: 5,
    date: "2024-06-16",
  },
  {
    id: 6,
    name: "Parabha Dodiya",
    role: "Google Review",
    content:
      "All facilities available and best teachers here,best experience of learning with fun.",
    avatar: "",
    rating: 5,
    date: "2024-06-16",
  },
  {
    id: 7,
    name: "Patel Kripa",
    role: "Google Review",
    content: "This place is very good in all things",
    avatar: "",
    rating: 5,
    date: "2024-06-16",
  },
  {
    id: 8,
    name: "Mahendra J",
    role: "Google Review",
    content:
      "Best institute and very experienced teachers,best for science students.",
    avatar: "",
    rating: 5,
    date: "2024-06-16",
  },
];

export const recentBlogs = [
  {
    id: 1,
    title: "Tips to Crack JEE Mains 2026",
    excerpt: "Expert strategies and time management tips for JEE aspirants.",
    date: "Jan 15, 2025",
    cover:
      "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&q=80&w=800",
    slug: "jee-tips-2026",
  },
  {
    id: 2,
    title: "Importance of Foundation Years",
    excerpt:
      "Why starting early in Class 8-10 makes a huge difference in competitive exams.",
    date: "Feb 2, 2025",
    cover:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800",
    slug: "foundation-importance",
  },
  {
    id: 3,
    title: "Science Seminar Highlights",
    excerpt: "A look back at the amazing projects displayed by our students.",
    date: "Mar 10, 2025",
    cover:
      "https://images.unsplash.com/photo-1564325724739-bae0bd08762c?auto=format&fit=crop&q=80&w=800",
    slug: "science-seminar",
  },
];

export const scholarshipDetails = {
  title: "Admission Enquiry?",
  cta: "Call now @ +91 9624225939",
};
