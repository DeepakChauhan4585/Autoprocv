import { useState } from 'react'
import PersonalDetail from './forms/PersonalDetail'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, Home } from 'lucide-react'
import Summery from './forms/Summery'
import Experience from './forms/Experience'
import Education from './forms/Education'
import Skills from './forms/Skills'
import { Link, Navigate, useParams } from 'react-router-dom'
import ThemeColor from './ThemeColor'

function FormSection() {
  const MIN_STEP = 1
  const MAX_STEP = 6

  const [activeFormIndex, setActiveFormIndex] = useState(MIN_STEP)
  const [enableNext, setEnableNext] = useState(true)
  const { resumeId } = useParams()

  const goPrev = () => {
    setActiveFormIndex(prev => {
      const nextVal = Math.max(MIN_STEP, prev - 1)
      setEnableNext(true) // reset stale validation state on step change
      return nextVal
    })
  }

  const goNext = () => {
    setActiveFormIndex(prev => {
      const nextVal = Math.min(MAX_STEP, prev + 1)
      setEnableNext(true) // reset stale validation state on step change
      return nextVal
    })
  }
  <Link to="/dashboard">
  <Button><Home /></Button>
</Link>


  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="flex gap-5">
          <Link to="/dashboard">
            <Button aria-label="Go to dashboard">
              <Home />
            </Button>
          </Link>
          <ThemeColor />
        </div>

        <div className="flex gap-2">
          {activeFormIndex > MIN_STEP && (
            <Button size="sm" onClick={goPrev} aria-label="Previous step">
              <ArrowLeft />
            </Button>
          )}

          {activeFormIndex < MAX_STEP && (
            <Button
              disabled={!enableNext}
              className="flex gap-2"
              size="sm"
              onClick={goNext}
              aria-label="Next step"
            >
              Next <ArrowRight />
            </Button>
          )}
        </div>
      </div>

      {/* Forms */}
      {activeFormIndex === 1 ? (
        <PersonalDetail enabledNext={v => setEnableNext(v)} />
      ) : activeFormIndex === 2 ? (
        <Summery enabledNext={v => setEnableNext(v)} />
      ) : activeFormIndex === 3 ? (
        <Experience />
      ) : activeFormIndex === 4 ? (
        <Education />
      ) : activeFormIndex === 5 ? (
        <Skills />
      ) : activeFormIndex === 6 ? (
        <Navigate to={`/my-resume/${resumeId}/view`} replace />
      ) : null}
    </div>
  )
}

export default FormSection
