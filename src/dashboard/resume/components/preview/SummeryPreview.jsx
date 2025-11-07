
/* eslint-disable react/prop-types */
import { memo } from 'react'

function SummeryPreview({ resumeInfo }) {
  const text = resumeInfo?.summery ?? resumeInfo?.summary ?? ''
  if (!text) return null

  return (
    <section className="my-6">
      <h2
        className="text-center font-bold text-sm mb-2"
        style={{ color: resumeInfo?.themeColor }}
      >
        Summary
      </h2>
      <hr style={{ borderColor: resumeInfo?.themeColor }} />
      <p className="text-xs mt-2 leading-relaxed whitespace-pre-line">
        {text}
      </p>
    </section>
  )
}

export default memo(SummeryPreview)