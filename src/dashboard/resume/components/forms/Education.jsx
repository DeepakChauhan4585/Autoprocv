import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ResumeInfoContext } from '@/context/ResumeInfoContext'
import { LoaderCircle } from 'lucide-react'
import { useContext, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import GlobalApi from './../../../../../service/GlobalApi'
import { toast } from 'sonner'

// tiny debounce hook (local to this file)
function useDebouncedValue(value, delay = 400) {
  const [debounced, setDebounced] = useState(value)
  const t = useRef()
  useEffect(() => {
    clearTimeout(t.current)
    t.current = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t.current)
  }, [value, delay])
  return debounced
}

function Education() {
  const [loading, setLoading] = useState(false)
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext)
  const params = useParams()

  const [educationalList, setEducationalList] = useState([
    { universityName: '', degree: '', major: '', startDate: '', endDate: '', description: '' },
  ])

  // hydrate once from context (avoid re-render loop)
  useEffect(() => {
    if (resumeInfo?.education?.length) setEducationalList(resumeInfo.education)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleChange = (index, name, value) => {
    setEducationalList((prev) => {
      const copy = prev.slice()
      copy[index] = { ...copy[index], [name]: value }
      return copy
    })
  }

  const AddNewEducation = () => {
    setEducationalList((prev) => [
      ...prev,
      { universityName: '', degree: '', major: '', startDate: '', endDate: '', description: '' },
    ])
  }

  const RemoveEducation = () => {
    setEducationalList((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev))
  }

  const onSave = () => {
    setLoading(true)

    const sanitized = educationalList.map((entry) => {
      const rest = { ...entry }
      delete rest.id
      return rest
    })

    const data = { data: { education: sanitized } }

    GlobalApi.UpdateResumeDetail(params.resumeId, data)
      .then((resp) => {
        console.log(resp)
        setLoading(false)
        toast('Details updated !')
      })
      .catch(() => {
        setLoading(false)
        toast('Server Error, Please try again!')
      })
  }

  // debounced context sync (prevents laggy preview while typing)
  const debouncedEducation = useDebouncedValue(educationalList, 400)
  useEffect(() => {
    setResumeInfo((prev) => ({
      ...prev,
      education: debouncedEducation,
    }))
  }, [debouncedEducation, setResumeInfo])

  return (
    <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
      <h2 className="font-bold text-lg">Education</h2>
      <p className="text-sm text-muted-foreground">Add Your educational details</p>

      <div>
        {educationalList.map((item, index) => (
          <div key={index}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border p-3 my-5 rounded-lg">
              <div className="sm:col-span-2">
                <label>University Name</label>
                <Input
                  name="universityName"
                  value={item.universityName ?? ''}
                  onChange={(e) => handleChange(index, 'universityName', e.target.value)}
                />
              </div>
              <div>
                <label>Degree</label>
                <Input
                  name="degree"
                  value={item.degree ?? ''}
                  onChange={(e) => handleChange(index, 'degree', e.target.value)}
                />
              </div>
              <div>
                <label>Major</label>
                <Input
                  name="major"
                  value={item.major ?? ''}
                  onChange={(e) => handleChange(index, 'major', e.target.value)}
                />
              </div>
              <div>
                <label>Start Date</label>
                <Input
                  type="date"
                  name="startDate"
                  value={item.startDate ?? ''}
                  onChange={(e) => handleChange(index, 'startDate', e.target.value)}
                />
              </div>
              <div>
                <label>End Date</label>
                <Input
                  type="date"
                  name="endDate"
                  value={item.endDate ?? ''}
                  onChange={(e) => handleChange(index, 'endDate', e.target.value)}
                />
              </div>
              <div className="sm:col-span-2">
                <label>Description</label>
                <Textarea
                  name="description"
                  value={item.description ?? ''}
                  onChange={(e) => handleChange(index, 'description', e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="flex gap-2">
          <Button variant="outline" onClick={AddNewEducation} className="text-primary">
            + Add More Education
          </Button>
          <Button variant="outline" onClick={RemoveEducation} className="text-primary">
            - Remove
          </Button>
        </div>
        <Button disabled={loading} onClick={onSave} className="w-full sm:w-auto">
          {loading ? <LoaderCircle className="animate-spin" /> : 'Save'}
        </Button>
      </div>
    </div>
  )
}

export default Education
