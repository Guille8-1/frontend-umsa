import { useCallback, useEffect, useState } from 'react';
import { RechartsDevtools } from '@recharts/devtools';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts'
import Link from 'next/link';
import { setValue } from "@/src/Store";
import { useDispatch } from "react-redux";

type startDashboard = {
  token: string,
  secret: string
};

const formatAxisTick = (value: any): string => {
  return `${value}`
}

const renderCustomVarLabel = ({ x, y, width, value }: any) => {
  return (
    <>
      <text x={x + width / 2} y={y} fill='#666' textAnchor='middle' dy={- 6}>
        {`${value}`}
      </text>
    </>
  )
};

type SourceNumbers = {
  title: string,
  value: number
}

export function StatsDashboard({ token, secret }: startDashboard) {
  const [prjNumbers, setPrjNumbers] = useState<SourceNumbers[]>([])
  const [actNumbers, setActNumbers] = useState<SourceNumbers[]>([])

  useEffect(() => {
    const controller = new AbortController();
    const gettingPrjNumbers = async () => {
      const url: string = `${secret}/projects/numbers`
      const request = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        signal: controller.signal
      });
      const prjData = await request.json();
      setPrjNumbers(prjData)

      return () => controller.abort();
    };

    gettingPrjNumbers();

    const gettingActNumbers = async () => {
      const url: string = `${secret}/actividades/numbers`
      const request = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        signal: controller.signal
      });
      const actData = await request.json();
      setActNumbers(actData)

      return () => controller.abort();
    };
    gettingActNumbers();
  }, [])

  const datas = [
    {
      name: 'Page A',
      uv: 400,
      pv: 2400,
      amt: 2400,
    },
    {
      name: 'Page B',
      uv: 300,
      pv: 4567,
      amt: 2400,
    },
    {
      name: 'Page C',
      uv: 320,
      pv: 1398,
      amt: 2400,
    },
    {
      name: 'Page D',
      uv: 200,
      pv: 9800,
      amt: 2400,
    },
    {
      name: 'Page E',
      uv: 278,
      pv: 3908,
      amt: 2400,
    },
    {
      name: 'Page F',
      uv: 189,
      pv: 4800,
      amt: 2400,
    },
  ];
  const margin = {
    top: 20,
    right: 30,
    left: 20,
    bottom: 25,
  }
  const constantClass: string = 'border-gray-300 border-solid border-2 p-2 shadow-xl shadow-outline w-auto';

  // const prjNumbers = [
  //   {
  //     title: 'Activos',
  //     value: 4,
  //   },
  //   {
  //     title: 'Cerrados',
  //     value: 5,
  //   },
  // ];

  // const actNumbers = [
  //   {
  //     title: 'Activos',
  //     value: 3,
  //   },
  //   {
  //     title: 'Cerradas',
  //     value: 2,
  //   },
  // ];

  const priorityPrj = [
    {
      title: 'Urgente',
      value: 6
    },
    {
      title: 'Mas Dias Activo',
      value: 9
    },
  ];

  const priorityAct = [
    {
      title: 'Urgente',
      value: 10,
    },
    {
      title: 'Mas Dias Activos',
      value: 12
    }
  ];

  const setMenuSelector = useDispatch();
  const dispatchMenu = () => {
    setTimeout(() => {
      setMenuSelector(setValue("changed"));
    }, 700)
  }


  return (
    <>
      <section className={`flex flex-row mb-8 mt-4 gap-6`}>
        <div className={`${constantClass} rounded-lg py-4 px-3 flex flex-col gap-2 `}>
          <h2 className='text-lg font-bold'>Poryectos </h2>
          <div className='flex flex-row gap-5'>
            {prjNumbers.map((stat) => (
              <section key={stat.title} className='flex flex-row gap-2'>
                <p className='font-bold text-md'>{stat.title}: </p>
                <Link onClick={dispatchMenu} className='text-blue-700 cursor-pointer hover:underline' href={'/dashboard/projects'}>{stat.value}</Link>
              </section>
            ))}
          </div>
        </div>
        <div className={`${constantClass} rounded-lg py-4 px-3 flex flex-col gap-2 `}>
          <h2 className='text-lg font-bold'>Actividades </h2>
          <div className='flex flex-row gap-5'>
            {actNumbers.map((stat) => (
              <section key={stat.title} className='flex flex-row gap-2'>
                <p className='font-bold text-md'>{stat.title}: </p>
                <Link onClick={dispatchMenu} className='text-blue-700 cursor-pointer hover:underline' href={'/dashboard/actividades'}>{stat.value}</Link>
              </section>
            ))}
          </div>
        </div>

        <div className={`${constantClass} rounded-lg py-4 px-3 flex flex-col gap-2`}>
          <h2 className='text-lg font-bold'> Prioridad Projectos </h2>
          <div className='flex flex-row gap-2'>
            {priorityPrj.map((stat) => (
              <section key={stat.title} className='flex flex-row gap-2'>
                <p className='font-bold'>{stat.title}: </p>
                <Link onClick={dispatchMenu} className='text-blue-700 cursor-pointer hover:underline' href={'/dashboard/projects'}>{stat.value}</Link>
              </section>
            ))}
          </div>
        </div>

        <div className={`${constantClass} rounded-lg py-4 px-3 flex flex-col gap-2`}>
          <h2 className='text-lg font-bold'> Prioridad Actividades </h2>
          <div className='flex flex-row gap-2'>
            {priorityAct.map((stat) => (
              <section key={stat.title} className='flex flex-row gap-2'>
                <p className='font-bold'>{stat.title}: </p>
                <Link onClick={dispatchMenu} className='text-blue-700 cursor-pointer hover:underline' href={'/dashboard/actividades'}>{stat.value}</Link>
              </section>
            ))}
          </div>
        </div>
      </section>
      <section className='flex flex-row gap-12'>
        <section className={`${constantClass} flex flex-col rounded-lg`}>
          <p className='text-center'>Titulo primer Cuadro</p>
          <BarChart width={700} height={400} data={datas} margin={margin} >
            <XAxis
              dataKey='name'
              tickFormatter={formatAxisTick}
              label={{ position: 'insideBottomRight', value: 'x titulo', offset: -10 }}
            />
            <YAxis label={{ position: 'insideTopLeft', value: '', angle: -90, dy: 60 }} />
            <CartesianGrid strokeDasharray="3 3" />
            <Bar dataKey="uv" fill="#075985" stackId='a' label={renderCustomVarLabel} />
            <Bar dataKey="pv" fill="#82CA9D" stackId='a' label={renderCustomVarLabel} />
            <Legend />
            <Tooltip />
            <RechartsDevtools />
          </BarChart>
        </section>
      </section>
    </>
  )
}
