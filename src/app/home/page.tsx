import React from 'react'
import HeroSection from './components/HeroSection'
import AboutSection from './components/AboutSection'
import { RegisterSection } from './components/RegisterationSection'
import ContactSection from './components/ContactSection'

const Home = () => {
  return (
    <div>
        <HeroSection />
        <AboutSection />
        <RegisterSection />
        <ContactSection />
    </div>
  )
}

export default Home