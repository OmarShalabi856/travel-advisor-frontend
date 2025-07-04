import React from 'react'

export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 text-gray-800">
      <div className="flex flex-col items-center gap-4">
        <img className="h-16 w-auto" src="/travel-logo.jpg" alt="Travel Advisor Logo" />
        <h1 className="text-3xl font-bold">About Travel Advisor</h1>

        <p className="text-md leading-7">
          <strong>Travel Advisor</strong> is a full-stack web application built using <strong>React Router v7</strong> on the frontend and <strong>ASP.NET Core</strong> on the backend. It features secure authentication powered by <strong>JWT (JSON Web Tokens)</strong> and uses <strong>PostgreSQL</strong> as the primary database.
        </p>

        <p className="text-md leading-7">
          Images uploaded to the platform are handled via <strong>Cloudinary</strong>, enabling efficient and scalable media management.
        </p>

        <p className="text-md leading-7">
          The backend and API are hosted on <strong>Heroku</strong>, and the app supports responsive layouts optimized for both desktop and mobile, along with form validation and dynamic content loading.
        </p>

        <p className="text-md leading-7">
          This project serves as a <strong>portfolio</strong> piece to demonstrate my capabilities in full-stack development using modern technologies and scalable architecture.
        </p>

        <p className="text-md leading-7">
          You can find the source code and more of my work on my GitHub: 
          <a 
            href="https://github.com/OmarShalabi856" 
            className="text-blue-600 underline ml-1" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            github.com/OmarShalabi856
          </a>.
        </p>
      </div>
    </div>
  )
}
