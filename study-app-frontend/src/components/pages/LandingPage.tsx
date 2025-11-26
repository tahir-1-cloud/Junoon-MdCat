// app/page.tsx
import Navbar from "@/components/pages/Navbar"

import Header from "@/components/pages/Header"
import CardSection from "@/components/pages/CardSection"
import MockTests from "@/components/pages/MockTests"
import Instructors from "@/components/pages/Instructors"


import Testimonials from "@/components/pages/Testimonials"
import Footer from "@/components/pages/Footer"


export default function LandingPage() {
  return (
    <>
    <Navbar/>
      <Header />
      <CardSection />
      <MockTests/>

      <Testimonials />
      <Instructors/>
      <Footer/>
    </>
  )
}
