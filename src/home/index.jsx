import Header from '@/components/custom/Header'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { AtomIcon, Edit, Share2 } from 'lucide-react'

function Home() {
  return (
    <div>
      <Header />

      {/* Hero */}
      <section className="z-50">
        <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12">
          <div
            className="inline-flex justify-between items-center py-1 px-1 pr-4 mb-7 text-sm text-gray-700
                       bg-gray-100 rounded-full dark:bg-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
            role="alert"
          >
            <span className="text-xs bg-primary rounded-full text-white px-4 py-1.5 mr-3">New</span>
            <span className="text-sm font-medium">AutoProcv</span>
            <svg className="ml-2 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
            Build Your Resume <span className="text-primary">With AI</span>
          </h1>
          <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400">
            Effortlessly craft a standout resume with our AI-powered builder.
          </p>

          <div className="flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
            <Link to="/dashboard">
              <Button className="px-5 py-3">Get Started</Button>
            </Link>

            <a
              href="https://youtu.be/Q5LM985yUmQ"
              target="_blank"
              rel="noreferrer"
              className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center
                         text-gray-900 rounded-lg border border-gray-300 hover:bg-gray-100 focus:ring-4
                         focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700
                         dark:focus:ring-gray-800"
            >
              <svg className="mr-2 -ml-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"></path>
              </svg>
              Watch video
            </a>
          </div>

          {/* Logos row (static SVGs) */}
          <div className="px-4 mx-auto text-center md:max-w-screen-md lg:max-w-screen-lg lg:px-36">
            <span className="font-semibold text-gray-400 uppercase">FEATURED IN</span>
            <div className="flex flex-wrap justify-center items-center mt-8 text-gray-500 sm:justify-between">
              <span className="mr-5 mb-5 lg:mb-0 hover:text-gray-800 dark:hover:text-gray-400">
                {/* logo placeholder */}
                <svg className="h-8" viewBox="0 0 132 29" fill="none" aria-hidden="true">
                  <rect x="2" y="6" width="128" height="17" rx="3" fill="currentColor" />
                </svg>
              </span>
              <span className="mr-5 mb-5 lg:mb-0 hover:text-gray-800 dark:hover:text-gray-400">
                <svg className="h-11" viewBox="0 0 208 42" fill="none" aria-hidden="true">
                  <rect x="2" y="6" width="204" height="30" rx="6" fill="currentColor" />
                </svg>
              </span>
              <span className="mr-5 mb-5 lg:mb-0 hover:text-gray-800 dark:hover:text-gray-400">
                <svg className="h-11" viewBox="0 0 120 41" fill="none" aria-hidden="true">
                  <rect x="2" y="6" width="116" height="28" rx="6" fill="currentColor" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-8 bg-white z-50 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12">
        <h2 className="font-bold text-3xl">How it Works?</h2>
        <h3 className="text-md text-gray-500">Create your AI resume in 3 easy steps</h3>

        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div
            className="block rounded-xl border bg-white border-gray-200 p-8 shadow-xl transition
                       hover:border-pink-500/10 hover:shadow-pink-500/10"
          >
            <AtomIcon className="h-8 w-8 mx-auto" aria-hidden="true" />
            <h4 className="mt-4 text-xl font-bold text-black">Describe your role</h4>
            <p className="mt-1 text-sm text-gray-600">
              Tell us your job title and skills. The AI drafts a tailored resume foundation.
            </p>
          </div>

          <div
            className="block rounded-xl border bg-white border-gray-200 p-8 shadow-xl transition
                       hover:border-pink-500/10 hover:shadow-pink-500/10"
          >
            <Edit className="h-8 w-8 mx-auto" aria-hidden="true" />
            <h4 className="mt-4 text-xl font-bold text-black">Edit & refine</h4>
            <p className="mt-1 text-sm text-gray-600">
              Tweak sections, add achievements, and customize the layout to your style.
            </p>
          </div>

          <div
            className="block rounded-xl border bg-white border-gray-200 p-8 shadow-xl transition
                       hover:border-pink-500/10 hover:shadow-pink-500/10"
          >
            <Share2 className="h-8 w-8 mx-auto" aria-hidden="true" />
            <h4 className="mt-4 text-xl font-bold text-black">Share & download</h4>
            <p className="mt-1 text-sm text-gray-600">
              Download a print-ready resume or share a public link instantly.
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link to="/auth/sign-in">
            <Button className="px-12 py-3">Get Started Today</Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home
