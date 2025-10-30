import { useEffect, useState, useCallback } from 'react'
import AddResume from './components/AddResume'
import { useUser } from '@clerk/clerk-react'
import GlobalApi from './../../service/GlobalApi'
import ResumeCardItem from './components/ResumeCardItem'

function Dashboard() {
  const { user } = useUser()
  const [resumeList, setResumeList] = useState([])

  // Fetch list (memoized for proper deps)
  const GetResumesList = useCallback(async () => {
    const email = user?.primaryEmailAddress?.emailAddress
    if (!email) return
    try {
      const resp = await GlobalApi.GetUserResumes(email)
      setResumeList(resp?.data?.data || [])
    } catch (e) {
      console.error('Failed to load resumes', e)
      setResumeList([])
    }
  }, [user?.primaryEmailAddress?.emailAddress])

  useEffect(() => {
    GetResumesList()
  }, [GetResumesList])

  return (
    <div className="p-10 md:px-20 lg:px-32">
      <h2 className="font-bold text-3xl">My Resume</h2>
      <p>Start creating an AI resume for your next job role</p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 mt-10">
        <AddResume />

        {resumeList.length > 0
          ? resumeList.map((resume) => (
              <ResumeCardItem
                key={String(resume.documentId || resume.id)}
                resume={resume}
                refreshData={GetResumesList}
              />
            ))
          : [0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-[280px] rounded-lg bg-slate-200 animate-pulse"
                aria-hidden
              />
            ))}
      </div>
    </div>
  )
}

export default Dashboard
