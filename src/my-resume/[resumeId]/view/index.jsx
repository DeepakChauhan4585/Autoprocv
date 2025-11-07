import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Header from '@/components/custom/Header'
import { Button } from '@/components/ui/button'
import { ResumeInfoContext } from '@/context/ResumeInfoContext'
import ResumePreview from '@/dashboard/resume/components/ResumePreview'
import GlobalApi from './../../../../service/GlobalApi'
import { RWebShare } from 'react-web-share'

function ViewResume() {
  const [resumeInfo, setResumeInfo] = useState(null)
  const { resumeId } = useParams()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await GlobalApi.GetResumeById(resumeId)
        const raw = resp?.data?.data
        const item = Array.isArray(raw) ? raw[0] : raw
        const attrs = item?.attributes ? item.attributes : item || {}

        setResumeInfo({
          themeColor: attrs.themeColor || '#4f46e5',
          firstName: attrs.firstName || '',
          lastName: attrs.lastName || '',
          email: attrs.email || '',
          phone: attrs.phone || '',
          summary: attrs.summary || '',
          Experience: Array.isArray(attrs.Experience) ? attrs.Experience : [],
          education: Array.isArray(attrs.education) ? attrs.education : [],
          skills: Array.isArray(attrs.skills) ? attrs.skills : [],
          resumeId: attrs.resumeId || resumeId,
        })
      } catch (e) {
        console.error('GetResumeInfo error:', e)
        setResumeInfo({
          themeColor: '#4f46e5',
          Experience: [],
          education: [],
          skills: [],
          resumeId,
        })
      }
    }

    fetchData()
  }, [resumeId])

  const HandleDownload = () => requestAnimationFrame(() => window.print())

  const shareUrl = `${import.meta.env.VITE_BASE_URL}/my-resume/${resumeId}/view`

  return (
    <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo }}>
      <div id="no-print">
        <Header />
        <div className="my-10 mx-10 md:mx-20 lg:mx-36">
          <h2 className="text-center text-2xl font-medium">
            Congrats! AI Generated Resume is ready! Autoprocv !
          </h2>
          <p className="text-center text-gray-400">
            Now you can download or share your resume link.
          </p>

          <div className="flex justify-between px-10 md:px-44 my-10">
            <Button onClick={HandleDownload}>Download</Button>
            <RWebShare
              data={{
                text: 'Hello Everyone, this is my resume:',
                url: shareUrl,
                title: `${resumeInfo?.firstName || ''} ${resumeInfo?.lastName || ''} Resume`,
              }}
            >
              <Button>Share</Button>
            </RWebShare>
          </div>
        </div>
      </div>

      <div className="my-10 mx-10 md:mx-20 lg:mx-36">
        <div id="print-area" className="bg-white">
          <ResumePreview />
        </div>
      </div>
    </ResumeInfoContext.Provider>
  )
}

export default ViewResume
