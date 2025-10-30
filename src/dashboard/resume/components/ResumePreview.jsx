import { ResumeInfoContext } from '@/context/ResumeInfoContext'
import { useContext } from 'react'
import PersonalDetailPreview from './preview/PersonalDetailPreview'
import SummeryPreview from './preview/SummeryPreview'
import ExperiencePreview from './preview/ExperiencePreview'
import EducationalPreview from './preview/EducationalPreview'
import SkillsPreview from './preview/SkillsPreview'

function ResumePreview() {
  const { resumeInfo } = useContext(ResumeInfoContext)

  return (
    <div
      className="shadow-lg h-full p-14 border-t-[20px]"
      style={{ borderColor: resumeInfo?.themeColor || '#000' }}
    >
      <PersonalDetailPreview resumeInfo={resumeInfo} />
      <SummeryPreview resumeInfo={resumeInfo} />
      {Array.isArray(resumeInfo?.Experience) && resumeInfo.Experience.length > 0 && (
        <ExperiencePreview resumeInfo={resumeInfo} />
      )}
      {Array.isArray(resumeInfo?.education) && resumeInfo.education.length > 0 && (
        <EducationalPreview resumeInfo={resumeInfo} />
      )}
      {Array.isArray(resumeInfo?.skills) && resumeInfo.skills.length > 0 && (
        <SkillsPreview resumeInfo={resumeInfo} />
      )}
    </div>
  )
}

export default ResumePreview
