import React, { useState } from 'react'
import { useTaskContext } from '../../context/TaskContext'
import type { SortByType } from '../../type/task_type'
import './info.css'
import InfoCard from '../../common/info card/InfoCard'
import { getClassNameHelper, getTitleHelper } from '../../config/helper'
import Modal from '../../modal/Modal'

const Info: React.FC = () => {
  const { getTaskSummary, setSortBy, sortBy } = useTaskContext()
  const summary: any = getTaskSummary()
  const [open, setOpen] = useState<boolean>(false);
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value as SortByType)
  }

  return (
    <>
      <div className="info-container">
        <div className="info-cards-grid">
          {summary && Object.keys(summary)?.map((key: string, index: number) => {
            return <InfoCard key={index} title={getTitleHelper[key]} value={summary[key]} className={getClassNameHelper[key]} />
          })}
        </div>
        <div className="info-action-bar">
          <button className="info-add-button" onClick={() => setOpen(true)}>
            Add Task
          </button>

          <div className="info-sort-container">
            <label className="info-sort-label">Sort By:</label>
            <select
              value={sortBy}
              onChange={handleSortChange}
              className="info-sort-select"
            >
              <option value="dueDate">Due Date</option>
              <option value="title">Title</option>
            </select>
          </div>
        </div>
      </div>
      {open && <Modal title="Add New Task" open={open} onClose={() => setOpen(prev => !prev)} />}
    </>
  )
}

export default Info