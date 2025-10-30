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
      // handle both: Strapi => { data: [{ id, attributes:{} }] }
      // LocalStorage fallback => { data: [{ id, documentId, attributes:{} }] }
      const raw = resp?.data?.data
      const item = Array.isArray(raw) ? raw[0] : raw

      // If backend returns a single object already
      const attrs = item?.attributes ? item.attributes : item || {}

      // guard: default structure so children don’t crash
      const safe = {
        themeColor: attrs.themeColor || '#4f46e5',
        firstName: attrs.firstName || '',
        lastName: attrs.lastName || '',
        email: attrs.email || '',
        phone: attrs.phone || '',
        summary: attrs.summary || '',
        Experience: Array.isArray(attrs.Experience) ? attrs.Experience : [],
        education: Array.isArray(attrs.education) ? attrs.education : [],
        skills: Array.isArray(attrs.skills) ? attrs.skills : [],
        // keep resumeId if present
        resumeId: attrs.resumeId || resumeId,
      }

      setResumeInfo(safe)
    } catch (e) {
      console.error('GetResumeInfo error:', e)
      setResumeInfo({
        themeColor: '#4f46e5',
        Experience: [],
        education: [],
        skills: [],
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
      <div className="grid grid-cols-1 md:grid-cols-2 p-10 gap-10">
        <FormSection />
        <ResumePreview />
      </div>
    </ResumeInfoContext.Provider>
  )
}

export default EditResume
