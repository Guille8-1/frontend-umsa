"use client"

import { RotatingLines } from 'react-loader-spinner'

export default function Loader() {
  return (
    <>
      <section className='flex items-center justify-center mt-40 bg-opacity-100'>
        <RotatingLines
          visible={true}
          height="85"
          width="85"
          color="#075985"
          strokeWidth="5"
          animationDuration="0.75"
          ariaLabel="RotatingLines"
        />
      </section>
    </>
  )
}
