"use client"

import { RotatingLines } from 'react-loader-spinner'

export default function Loader() {
  return (
    <>
      <section className='flex items-center justify-center mt-40'>
        <RotatingLines
          visible={true}
          height="96"
          width="96"
          color="blue"
          strokeWidth="5"
          animationDuration="0.75"
          ariaLabel="RotatingLines"
        />
      </section>
    </>
  )
}
