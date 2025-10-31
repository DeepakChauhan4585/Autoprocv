/* eslint-disable react/prop-types */
import { memo } from 'react'

function ExperiencePreview({ resumeInfo }) {
  const color = resumeInfo?.themeColor
  return (
    <div className="my-6">
      <h2 className="text-center font-bold text-sm mb-2" style={{ color }}>
        Professional Experience
      </h2>
      <hr style={{ borderColor: color }} />

      {resumeInfo?.Experience?.map((experience, index) => (
        <div key={index} className="my-5">
          <h2 className="text-sm font-bold" style={{ color }}>
            {experience?.title}
          </h2>
          <h2 className="text-xs flex justify-between">
            {[experience?.companyName, experience?.city, experience?.state]
              .filter(Boolean)
              .join(', ')}
            <span>
              {experience?.startDate} To {experience?.currentlyWorking ? 'Present' : experience?.endDate}
            </span>
          </h2>
          {/* Rich text (already sanitized upstream) */}
          <div className="text-xs my-2" dangerouslySetInnerHTML={{ __html: experience?.workSummery || '' }} />
        </div>
      ))}
    </div>
  )
}

export default memo(ExperiencePreview)
