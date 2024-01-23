import React, { createContext, useContext, useEffect, useState } from 'react'
import './App.css'


const ContextValue = createContext<Value>({ taskCompleate: [], taskNotCompleated: [] })

const useContextValue = () => useContext(ContextValue)

interface Task {
  id: number;
  taskName: string;
  taskWhen: Date;
}
interface Value {
  taskCompleate: Task[];
  taskNotCompleated: Task[];
}


function App() {
  const [value, setValue] = useState<Value>({
    taskCompleate: [],
    taskNotCompleated: [],
  })

  type ModeQuerry = 'notcompleate' | 'compleate'

  const onClickDelete = (id: number, mode: ModeQuerry) => {
    let t: Task[]
    let hasil: Value

    if (mode === 'compleate') {
      t = value.taskCompleate.filter((item) => item.id !== id)
      hasil = {
        ...value,
        taskCompleate: t
      }
      setValue(hasil)
    }
    if (mode === 'notcompleate') {
      t = value.taskNotCompleated.filter((item) => item.id !== id)
      hasil = {
        ...value,
        taskNotCompleated: t
      }
      setValue(hasil)
    }
  }

  const onClickCheck = (id: number, mode: ModeQuerry) => {
    // move value 
    const val: Task = {
      id: 1,
      taskName: '',
      taskWhen: new Date()
    }
    const anu = (mode === 'compleate' ? value.taskCompleate.filter((item) => item.id === id) : value.taskNotCompleated.filter((item) => item.id === id))[0]
    val['id'] = anu.id
    val['taskName'] = anu.taskName
    val['taskWhen'] = anu.taskWhen

    const n: Task[] = [...mode === 'compleate' ? value.taskNotCompleated : value.taskCompleate, val]

    if (mode === 'compleate') setValue({ taskCompleate: value.taskCompleate.filter((item) => item.id !== val.id), taskNotCompleated: n })
    if (mode === 'notcompleate') setValue({ taskCompleate: n, taskNotCompleated: value.taskNotCompleated.filter((item) => item.id !== val.id) })
  }

  return (
    <ContextValue.Provider value={value} >
      <Container>
        <div className=''>
          <div>
            <h1 className='text-lg md:text-xl'>Let's Add new Value Task</h1>
            <InputTaskNew value={value} setValue={setValue} />
          </div>
          <div className='grid grid-rows-2 md:grid-cols-2'>
            <div className='border-b-2 md:border-r-2 border-black py-2'>
              <div className='border-t-2 border-black mt-2'>
                <h1 className='text-xl'>Those value has not been checked</h1>
                <div className='mt-2 px-4 flex flex-col gap-2'>
                  {
                    value.taskNotCompleated.map((item) => {
                      return (
                        <div className='flex flex-row gap-2 text-center items-center justify-between'>
                          <div className='flex flex-row gap-2 items-center'>
                            <input type="checkbox" name={item.taskName + item.id} id={item.taskName + item.id}
                              onChange={(): void => onClickCheck(item.id, 'notcompleate')}
                            />
                            <label htmlFor={item.taskName + item.id}>{item.taskName}</label>
                          </div>
                          <button className='text-xl bg-red-500/80 px-3 rounded hover:bg-gray-400' onClick={(): void => onClickDelete(item.id, 'notcompleate')}>X</button>
                        </div>
                      )
                    })
                  }
                </div>
              </div>
            </div>
            <div className='md:text-end items-center py-2'>
              <h1 className='text-xl'>Those value has been checked</h1>
              <div className='mt-2 px-4 flex flex-col gap-2'>
                {
                  value.taskCompleate.map((item) => {
                    return (
                      <div className='flex flex-row gap-2 text-center items-center justify-between'>
                        <div className='flex flex-row gap-2 items-center'>
                          <input type="checkbox" name={item.taskName + item.id} id={item.taskName + item.id}
                            onChange={(): void => onClickCheck(item.id, 'compleate')}
                            checked
                          />
                          <label htmlFor={item.taskName + item.id}>{item.taskName}</label>
                        </div>
                        <button className='text-xl bg-red-500/80 px-3 rounded hover:bg-gray-400' onClick={(): void => onClickDelete(item.id, 'compleate')}>X</button>
                      </div>
                    )
                  })
                }
              </div>
            </div>
          </div>
        </div>
      </Container>
    </ContextValue.Provider>
  )
}

export default App


const Container = ({ children }: { children: React.ReactNode }) => {
  const value = useContextValue();

  useEffect(() => {
    console.log(value)
  }, [value])
  return (
    <>
      <div className='py-2'>
        <div className='flex flex-row justify-between border-2 border-black border-x-0 items-center py-2 px-2'>
          <h1 className='text-2xl uppercase'>TO DO LIST - By Nyuuk</h1>
          <span>Compleated Task : {value.taskCompleate.length}</span>
        </div>
        <div className='px-2'>
          {children}
        </div>
      </div>
    </>
  )
}


interface InputTaskNewProps {
  value: Value;
  setValue: React.Dispatch<React.SetStateAction<Value>>;
}

const InputTaskNew: React.FC<InputTaskNewProps> = ({ value, setValue }) => {
  const [inputValue, setInputValue] = useState<string>('')
  const [idLast, setIdLast] = useState(0)


  const onSubmit = (event: React.FormEvent) => {

    event.preventDefault()

    const idLastFunction = (): void => {
      const t: number[] = [];

      let idL: number = 1

      value.taskNotCompleated.map((item) => {
        t.push(item.id)
      })

      let status: boolean = false;
      // get t to ber-urut
      do {
        status = false;
        for (let i: number = 0; i < t.length - 1; i++) {
          const temp: number = t[i]
          t[i] = t[i + 1]
          t[1 + i] = temp
          status = true
        }
      } while (status)
      // find number is not happen
      for (let i: number = 0; i < t.length - 1; i++) {
        if (t[i] !== idL) {
          idL = t[i]
          break
        }
        ++idL
      }
      setIdLast(idL);
    }

    idLastFunction()


    setValue({ ...value, taskNotCompleated: [...value.taskNotCompleated, { id: idLast, taskName: inputValue, taskWhen: new Date() }] })
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // console.log(e.target.value)
    setInputValue(e.target.value)
  }

  return (
    <>
      <form onSubmit={onSubmit}>
        <div className="mt-5 w-60">
          <label htmlFor="newTask" className="block mb-2 text-sm font-medium text-gray-900">ADD NEW TASK : </label>
          <input
            type="text"
            id="newTask"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="New Task here :)"
            onChange={onChange}
          />
        </div>
      </form>
    </>
  )
}