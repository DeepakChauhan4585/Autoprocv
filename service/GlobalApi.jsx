// src/service/GlobalApi.js
import axios from 'axios'

/** ---------- Config ---------- */
const BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').trim()
const hasBackend = !!BASE_URL

/** ---------- LocalStorage helpers (fallback) ---------- */
const LS_KEY = 'resumes_ls'

function lsReadAll() {
  try {
    const raw = localStorage.getItem(LS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function lsWriteAll(list) {
  localStorage.setItem(LS_KEY, JSON.stringify(list))
}

function ensureArray(v) {
  return Array.isArray(v) ? v : v ? [v] : []
}

/** ---------- Axios instance ---------- */
const api = hasBackend
  ? axios.create({
      baseURL: BASE_URL.replace(/\/$/, ''),
      headers: { 'Content-Type': 'application/json' },
    })
  : null

/** ---------- Endpoints (Strapi v4 style) ---------- */
const endpoints = {
  listByEmail: (email) =>
    `/api/resumes?filters[userEmail][$eq]=${encodeURIComponent(email)}`,
  getByResumeId: (resumeId) =>
    `/api/resumes?filters[resumeId][$eq]=${encodeURIComponent(resumeId)}`,
  create: `/api/resumes`,
  update: (id) => `/api/resumes/${id}`,
  delete: (id) => `/api/resumes/${id}`,
}

/** ---------- GlobalApi with safe fallbacks ---------- */
const GlobalApi = {
  /** Create */
  async CreateNewResume(payload) {
    if (api) {
      try {
        const resp = await api.post(endpoints.create, payload)
        return resp
      } catch (err) {
        console.warn('[CreateNewResume] Backend failed, using localStorage.', err)
      }
    }

    // Fallback: localStorage
    const list = lsReadAll()
    const attributes = (payload && payload.data) || {}
    const record = {
      id: crypto.randomUUID(), // internal id
      documentId: attributes.resumeId, // keep your public id
      attributes: {
        ...attributes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        themeColor: attributes.themeColor || '#4f46e5',
      },
    }
    list.push(record)
    lsWriteAll(list)
    return { data: { data: record } }
  },

  /** List by user email */
  async GetUserResumes(email) {
    if (api) {
      try {
        const resp = await api.get(endpoints.listByEmail(email))
        return resp
      } catch (err) {
        console.warn('[GetUserResumes] Backend failed, using localStorage.', err)
      }
    }
    const list = lsReadAll()
    const filtered = list.filter((r) => r?.attributes?.userEmail === email)
    return { data: { data: filtered } }
  },

  /** Get by resumeId (public uuid) */
  async GetResumeById(resumeId) {
    if (api) {
      try {
        const resp = await api.get(endpoints.getByResumeId(resumeId))
        return resp
      } catch (err) {
        console.warn('[GetResumeById] Backend failed, using localStorage.', err)
      }
    }
    const list = lsReadAll()
    const found = list.find(
      (r) =>
        r?.attributes?.resumeId === resumeId ||
        r?.documentId === resumeId ||
        r?.id === resumeId
    )
    // local fallback mimics Strapi filter shape (array)
    return { data: { data: ensureArray(found) } }
  },

  /** Update (by resumeId in fallback; by numeric id in backend) */
  async UpdateResumeDetail(resumeId, payload) {
    if (api) {
      try {
        const found = await api.get(endpoints.getByResumeId(resumeId))
        const item = found?.data?.data?.[0]
        if (!item?.id) throw new Error('Resume not found')
        const resp = await api.put(endpoints.update(item.id), payload)
        return resp
      } catch (err) {
        console.warn('[UpdateResumeDetail] Backend failed, using localStorage.', err)
      }
    }

    const list = lsReadAll()
    const idx = list.findIndex(
      (r) =>
        r?.attributes?.resumeId === resumeId ||
        r?.documentId === resumeId ||
        r?.id === resumeId
    )
    if (idx === -1) throw new Error('Resume not found (LS)')
    const attrs = list[idx].attributes || {}

    list[idx] = {
      ...list[idx],
      attributes: {
        ...attrs,
        ...((payload && payload.data) || {}),
        updatedAt: new Date().toISOString(),
      },
    }
    lsWriteAll(list)
    return { data: { data: list[idx] } }
  },

  /** Delete */
  async DeleteResumeById(resumeIdOrId) {
    if (api) {
      try {
        const found = await api.get(endpoints.getByResumeId(resumeIdOrId))
        const item = found?.data?.data?.[0]
        if (!item?.id) throw new Error('Resume not found')
        const resp = await api.delete(endpoints.delete(item.id))
        return resp
      } catch (err) {
        console.warn('[DeleteResumeById] Backend failed, using localStorage.', err)
      }
    }

    const list = lsReadAll()
    const filtered = list.filter(
      (r) =>
        !(
          r?.attributes?.resumeId === resumeIdOrId ||
          r?.documentId === resumeIdOrId ||
          r?.id === resumeIdOrId
        )
    )
    lsWriteAll(filtered)
    return { data: { data: true } }
  },
}

export default GlobalApi
