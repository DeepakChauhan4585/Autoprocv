/* eslint-disable react/prop-types */
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ResumeInfoContext } from '@/context/ResumeInfoContext'
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  startTransition
} from 'react'
import { useParams } from 'react-router-dom'
import GlobalApi from './../../../../../service/GlobalApi'
import { Brain, LoaderCircle } from 'lucide-react'
import { toast } from 'sonner'
import { AIChatSession } from './../../../../../service/AIModal'

const PROMPT_TMPL =
  'Job Title: {jobTitle}. Based on this job title, give me a JSON array of exactly 3 items for Fresher, Mid, and Senior levels. Each item must have fields "summary" (3-4 lines) and "experience_level". Return ONLY valid JSON.'

const stripCodeFences = (s = '') =>
  s.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '')

function safeJSONParse(str) {
  try {
    return JSON.parse(str)
  } catch {
    return null
  }
}

function Summery({ enabledNext }) {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext)
  const [summaryText, setSummaryText] = useState('')
  const [loading, setLoading] = useState(false)
  const params = useParams()
  const [aiList, setAiList] = useState([])
  const isFirstSync = useRef(true)
  const debounceTimer = useRef(null)

  // 1) Initialize local state from context, cheap sync
  useEffect(() => {
    const incoming = resumeInfo?.summery ?? resumeInfo?.summary ?? ''
    setSummaryText((prev) => (prev === incoming ? prev : incoming))
    isFirstSync.current = true
  }, [resumeInfo?.summery, resumeInfo?.summary])

  // 2) Debounced + low-priority write-back to context
  useEffect(() => {
    if (isFirstSync.current) {
      isFirstSync.current = false
      return
    }

    if (debounceTimer.current) clearTimeout(debounceTimer.current)

    debounceTimer.current = setTimeout(() => {
      const currentInContext =
        resumeInfo?.summery ?? resumeInfo?.summary ?? ''
      if (currentInContext === summaryText) return

      startTransition(() => {
        setResumeInfo((prev) => ({
          ...prev,
          summery: summaryText,
          summary: summaryText,
        }))
      })
    }, 300)

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [summaryText])

  const jobTitle = useMemo(
    () => (resumeInfo?.jobTitle || '').trim(),
    [resumeInfo?.jobTitle]
  )

  const GenerateSummeryFromAI = useCallback(async () => {
    if (!jobTitle) {
      toast('Add a job title first.')
      return
    }
    try {
      setLoading(true)
      const prompt = PROMPT_TMPL.replace('{jobTitle}', jobTitle)
      const result = await AIChatSession.sendMessage(prompt)
      const raw = await result.response.text()
      const parsed = safeJSONParse(stripCodeFences(raw))
      if (!Array.isArray(parsed)) throw new Error('AI did not return a valid JSON array.')
      setAiList(parsed)
    } catch (e) {
      console.error(e)
      toast('AI generation failed. Try again.')
    } finally {
      setLoading(false)
    }
  }, [jobTitle])

  const onSave = useCallback(async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      // Persist both keys for compatibility
      const data = { data: { summary: summaryText, summery: summaryText } }
      await GlobalApi.UpdateResumeDetail(params?.resumeId, data)

      startTransition(() => {
        setResumeInfo((prev) => ({
          ...prev,
          summery: summaryText,
          summary: summaryText,
        }))
      })

      enabledNext?.(true)
      toast('Details updated')
    } catch {
      toast('Save failed')
    } finally {
      setLoading(false)
    }
  }, [summaryText, params?.resumeId, setResumeInfo, enabledNext])

  return (
    <div>
      <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
        <h2 className="font-bold text-lg">Summary</h2>
        <p>Add a short professional summary for your job title.</p>

        <form className="mt-7" onSubmit={onSave}>
          <div className="flex items-end justify-between gap-3">
            <label className="font-medium">Add Summary</label>
            <Button
              variant="outline"
              onClick={GenerateSummeryFromAI}
              type="button"
              size="sm"
              disabled={!jobTitle || loading}
              className="border-primary text-primary flex gap-2 disabled:opacity-60"
            >
              <Brain className="h-4 w-4" /> Generate from AI
            </Button>
          </div>

          <Textarea
            className="mt-5"
            required
            value={summaryText}
            onChange={(e) => setSummaryText(e.target.value)}
            placeholder="3–4 lines highlighting your strengths and tools."
          />

          <div className="mt-2 flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? <LoaderCircle className="animate-spin" /> : 'Save'}
            </Button>
          </div>
        </form>
      </div>

      {Array.isArray(aiList) && aiList.length > 0 && (
        <div className="my-5">
          <h2 className="font-bold text-lg">Suggestions</h2>
          {aiList.map((item, index) => (
            <div
              key={index}
              onClick={() => setSummaryText(item?.summery ?? item?.summary ?? '')}
              className="p-5 shadow-lg my-4 rounded-lg cursor-pointer hover:bg-muted/30 transition"
            >
              <h3 className="font-bold my-1 text-primary">
                Level: {item?.experience_level}
              </h3>
              <p className="whitespace-pre-line">
                {item?.summery ?? item?.summary}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Summery
