/* eslint-disable react/prop-types */
import { memo } from 'react'

function SummeryPreview({ resumeInfo }) {
  return <p className="text-xs">{resumeInfo?.summery}</p>
}

export default memo(SummeryPreview)
