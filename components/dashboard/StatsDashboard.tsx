"use client";

import { useEffect, useState } from 'react';
import { RechartsDevtools } from '@recharts/devtools';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, Rectangle, ResponsiveContainer } from 'recharts'
import Link from 'next/link';
import { setValue } from "@/src/Store";
import { useDispatch, useSelector } from "react-redux";
import { requestHandler } from './requests';
import { RootState } from '@/src/Store/valueSlice';
import Loader from "../loader/Spinner";

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

type DataCount = {
  name: string,
  Activo: number,
  Cerrado: number
}

type priorityCount = {
  title: string,
  value: number
}

export function StatsDashboard({ token, secret }: startDashboard) {
  const [prjNumbers, setPrjNumbers] = useState<SourceNumbers[]>([])
  const [actNumbers, setActNumbers] = useState<SourceNumbers[]>([])
  const [dataCount, setDataCount] = useState<DataCount[]>([])
  const [priority, setPriority] = useState<priorityCount[]>([])
  const [priorityAct, setPriorityAct] = useState<priorityCount[]>([])
  const [actCount, setActCount] = useState<DataCount[]>([])

  useEffect(() => {
    const controller = new AbortController();
    const gettingPrjNumbers = async () => {
      const endPoint: string = '/projects/numbers'
      const prjData = await requestHandler(endPoint, token, secret)
      setPrjNumbers(prjData)
      return () => controller.abort();
    };
    gettingPrjNumbers();

    const gettingActNumbers = async () => {
      const endPoint: string = '/actividades/numbers';
      const actData = await requestHandler(endPoint, token, secret);
      setActNumbers(actData);
      return () => controller.abort();
    };
    gettingActNumbers();

    const gettingDataCount = async () => {
      const endPoint: string = '/projects/stats'
      const countData = await requestHandler(endPoint, token, secret)
      setDataCount(countData);
      return () => controller.abort();
    }
    gettingDataCount();

    const actDataCount = async () => {
      const endPoint: string = '/actividades/stats'
      const countActData = await requestHandler(endPoint, token, secret)
      setActCount(countActData);
      return () => controller.abort();
    }
    actDataCount();

    const gettingUrgency = async () => {
      const endPoint: string = '/projects/urgency';
      const urgencyReq = await requestHandler(endPoint, token, secret);
      setPriority(urgencyReq);
      return () => controller.abort();
    }
    gettingUrgency();

    const gettingActPriority = async () => {
      const endPoint: string = '/actividades/priority';
      const priorityAct = await requestHandler(endPoint, token, secret);

      setPriorityAct(priorityAct);
      return () => controller.abort();
    }
    gettingActPriority();
  }, [])

  const navSignal = useSelector((state: RootState) => state.value.eventId)
  const url = window.location.href;
  const splitUrl = url.split('/');
  const validatesUrl = splitUrl[splitUrl.length - 1];
  const urlLocator = 'dashboard'
  const [loadChange, setLoadChange] = useState<boolean>(false);
  useEffect(() => {
    setTimeout(() => {
      if (urlLocator != validatesUrl) {
        setLoadChange(true);
      }
    }, 400)
    console.log('testing')
  }, [navSignal])

  const constantClass: string = 'border-gray-300 border-solid border-2 p-2 shadow-xl shadow-outline w-auto';

  const setMenuSelector = useDispatch();
  const dispatchMenu = () => {
    setTimeout(() => {
      setMenuSelector(setValue("changed"));
    }, 700)
  }


  return (
    <>
      <section className={`flex flex-row mb-8 mt-4 gap-6 ${loadChange ? 'opacity-15' : ''}`}>
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
            {priority.map((stat) => (
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
      <section className='flex flex-col gap-10'>
        <section className={`${constantClass} flex flex-col rounded-lg`} style={{ width: "100%" }}>
          <h2 className='text-center font-semibold'>Grafica Proyectos</h2>
          <div style={{ width: "100%", overflowX: 'auto' }} >
            <BarChart
              width={Math.max(dataCount.length * 80)}
              height={460}
              data={dataCount}>
              <XAxis
                dataKey='name'
                tickFormatter={formatAxisTick}
                angle={-15}
                textAnchor='end'
                height={80}
                interval={0}
              />
              <YAxis label={{ position: 'insideTopLeft', angle: -45, dy: 60 }} />
              <CartesianGrid strokeDasharray="3 3" />
              <Bar dataKey="Cerrados" fill="#075985" activeBar={<Rectangle fill='#0284C7' stroke='#075985' />} radius={[10, 10, 0, 0]} />
              <Bar dataKey="Activos" fill="#82CA9D" activeBar={<Rectangle fill='#4ade80' stroke='#16a34a' />} radius={[10, 10, 0, 0]} />
              <Legend />
              <Tooltip />
              <RechartsDevtools />
            </BarChart>
          </div>
        </section>
        <section className={`${constantClass} flex flex-col rounded-lg`} style={{ width: "100%" }}>
          <h2 className='text-center font-semibold'>Grafica Actividades</h2>
          <div style={{ width: "100%", overflowX: 'auto' }} >
            <BarChart
              width={Math.max(actCount.length * 80)}
              height={460}
              data={actCount}>
              <XAxis
                dataKey='name'
                tickFormatter={formatAxisTick}
                angle={-15}
                textAnchor='end'
                height={80}
                interval={0}
              />
              <YAxis label={{ position: 'insideTopLeft', angle: -45, dy: 60 }} />
              <CartesianGrid strokeDasharray="3 3" />
              <Bar dataKey="Cerrados" fill="#075985" activeBar={<Rectangle fill='#0284C7' stroke='#075985' />} radius={[10, 10, 0, 0]} />
              <Bar dataKey="Activos" fill="#82CA9D" activeBar={<Rectangle fill='#4ade80' stroke='#16a34a' />} radius={[10, 10, 0, 0]} />
              <Legend />
              <Tooltip />
              <RechartsDevtools />
            </BarChart>
          </div>
        </section>
      </section>
      <section className={`${loadChange ? 'flex' : 'hidden'} relative justify-center items-center mx-auto bottom-[400px]`}>
        <Loader />
      </section>
    </>
  )
}
