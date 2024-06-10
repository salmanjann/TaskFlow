import { useState, useEffect } from 'react'
import './App.css'
import { FaPlus, FaPencilAlt, FaTrash } from 'react-icons/fa';

function App() {

  const [todos, setTodos] = useState(() => { return [] })
  useEffect(() => {
    const getTodos = async () => {
      const res = await fetch('/api/todos')
      const Todos = await res.json();

      // console.log(Todos)
      setTodos(Todos);
    }
    getTodos();
  }, [])

  const [input, setInput] = useState(() => { return '' })
  const [editId, setEditId] = useState(() => { return -1 })

  const addTodo = async (e) => {

    try {
      if (input.trim() !== '') {
        const res = await fetch("/api/todos", {
          method: "POST",
          body: JSON.stringify({ content: input }),
          headers: {
            "Content-Type": "application/json"
          },
        });

        const newTodo = await res.json();
        setTodos([...todos, newTodo]);

        setInput('')
      }
    } catch (err) {
      console.log(err.message)
    }
  }

  const deleteTodo = async (_id) => {
    try {
      const res = await fetch(`/api/todos/${_id}`, {
        method: "DELETE"
      });

      const deletedTodo = await res.json();
      if (deletedTodo.acknowledged) {
        // console.log(todos);
        const newTodos = todos.filter((todo) => {
          return todo._id !== _id;
        })
        // console.log(newTodos)
        setTodos(newTodos)
      }

      setInput('')
    } catch (err) {
      console.log(err.message)
    }
  }

  const editTodo = (index) => {
    try {
      setEditId(index)
      setInput(todos[index].content)

    } catch (err) {
      console.log(err.message)
    }
  }

  const updateTodo = async (e) => {
    try {
      const id = todos[editId]._id;
      const res = await fetch(`/api/todos/${id}`, {
        method: "PUT",
        body: JSON.stringify({ content: input }),
        headers: {
          "Content-Type": "application/json"
        },
      });

      const updatedTodo = await res.json();
      if (updatedTodo.acknowledged) {
        let updatedTodos = todos;
        updatedTodos[editId].content = input;
        setTodos(updatedTodos)
        setInput('')
        setEditId(-1)
      }


    } catch (err) {
      console.log(err.message)
    }
  }

  const toggleTodoStatus = async (_id, _status) => {
    try {
      const res = await fetch(`/api/todos/${_id}`, {
        method: "PUT",
        body: JSON.stringify({ status: !_status }),
        headers: {
          "Content-Type": "application/json"
        },
      });

      const updatedTodo = await res.json();
      if (updatedTodo.acknowledged) {
        const newTodos = todos.map((todo) =>
          todo._id === _id ? { ...todo, status: !_status } : todo
        );

        setTodos(newTodos);
      }
    } catch (err) {
      console.log(err.message);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId === -1) {
      addTodo();
    } else {
      updateTodo();
    }
  }

  return (
    <>
      <div className='flex flex-col gap-4 min-h-screen items-center justify-center p-5 bg-customBg-_black'>
        <div className='bg-customBg-_blue rounded w-full max-w-lg lg:w-2/4 p-6'>
          <div className='flex items-center justify-center mb-4'>
          <img src="list.png" alt="icon" className='w-10' />
          <h1 className='text-4xl text-white font-bold ml-2'>TaskFlow</h1>
        </div>
          <form className='flex' onSubmit={handleSubmit}>
            <input type="text" placeholder='Add To-do' className='font-bold py-3 px-3 rounded w-full focus:outline-none mr-2 bg-white placeholder:text-customBg-_black required ' onChange={(e) => setInput(e.target.value)} value={input} />
            <button type='submit' className='bg-customBg-_green rounded px-3 text-customBg-_black'>{editId === -1 ? <FaPlus /> : <FaPencilAlt />}</button>
          </form>
        </div>
        {
          todos.length > 0 ? (
            <div className='bg-customBg-_blue rounded w-full max-w-lg lg:w-2/4 p-6 max-h-[50vh] overflow-y-auto'>
              <ul>
                {todos.map((todo, index) => (
                  <li key={todo._id} className='flex items-center justify-between gap-2 mb-2'>

                    <span className={`flex-grow font-bold bg-white py-3 px-3 rounded flex items-center w-full cursor-pointer ${todo.status ? 'line-through' : ''} overflow-hidden`} onClick={() => toggleTodoStatus(todo._id, todo.status)}>
                      {todo.content}
                    </span>

                    <div className='flex-shrink-0 flex'>
                      {!todo.status && (
                        <button className='bg-customBg-_green rounded px-4 py-2 text-customBg-_black mr-2' onClick={() => { editTodo(index) }}>
                          <FaPencilAlt />
                        </button>
                      )}
                      <button className='bg-customBg-_red rounded px-4 py-4 text-customBg-_black' onClick={() => { deleteTodo(todo._id) }}>
                        <FaTrash />
                      </button>
                    </div>
                  </li>

                ))}
              </ul>
            </div>
          ) : (null)
        }
      </div>
    </>
  )
}

export default App
