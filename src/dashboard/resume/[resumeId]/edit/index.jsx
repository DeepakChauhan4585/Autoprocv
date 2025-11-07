import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import FormSection from '../../components/FormSection'
import ResumePreview from '../../components/ResumePreview'
import { ResumeInfoContext } from '@/context/ResumeInfoContext'
import GlobalApi from './../../../../../service/GlobalApi'

function EditResume() {
  const { resumeId } = useParams()
  const [resumeInfo, setResumeInfo] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    GetResumeInfo()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resumeId])

  const GetResumeInfo = async () => {
    try {
      const resp = await GlobalApi.GetResumeById(resumeId)

      // Strapi usually: { data: { id, attributes:{} } } OR array
      const raw = resp?.data?.data
      const item = Array.isArray(raw) ? raw[0] : raw
      const attrs = item?.attributes ? item.attributes : (item || {})

      // ---- Normalizations ----
      // support both spellings and ensure both are present in state
      const normalizedSummary = attrs?.summery ?? attrs?.summary ?? ''

      // some projects use "experience" or "Experience"
      const experienceArr =
        Array.isArray(attrs?.experience) ? attrs.experience
        : Array.isArray(attrs?.Experience) ? attrs.Experience
        : []

      const educationArr = Array.isArray(attrs?.education) ? attrs.education : []
      const skillsArr = Array.isArray(attrs?.skills) ? attrs.skills : []

      const safe = {
        // theme
        themeColor: attrs?.themeColor || '#4f46e5',

        // personal
        firstName: attrs?.firstName || '',
        lastName : attrs?.lastName  || '',
        email    : attrs?.email     || '',
        phone    : attrs?.phone     || '',
        jobTitle : attrs?.jobTitle  || '',          // ✅ keep for print
        address  : attrs?.address   || '',          // ✅ keep for print

        // summary (both keys so every component sees it)
        summary : normalizedSummary,
        summery : normalizedSummary,

        // sections
        experience: experienceArr,                  // prefer lowercase in state
        Experience: experienceArr,                  // backward compatibility
        education : educationArr,
        skills    : skillsArr,

        // ids
        id: attrs?.id || item?.id || undefined,
        resumeId: attrs?.resumeId || resumeId,
      }

      setResumeInfo(safe)
    } catch (e) {
      console.error('GetResumeInfo error:', e)
      setResumeInfo({
        themeColor: '#4f46e5',
        firstName: '', lastName: '',
        email: '', phone: '',
        jobTitle: '', address: '',
        summary: '', summery: '',
        experience: [], Experience: [],
        education: [], skills: [],
        resumeId,
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 p-10 gap-10">
        <div className="h-[360px] bg-slate-100 animate-pulse rounded-lg" />
        <div className="h-[360px] bg-slate-100 animate-pulse rounded-lg" />
      </div>
    )
  }

  return (
    <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo }}>
      <div className="grid grid-cols-1 md:grid-cols-2 p-4 md:p-10 gap-6 md:gap-10">
        <FormSection />
        <ResumePreview />
      </div>
    </ResumeInfoContext.Provider>
  )
}

export default EditResume
