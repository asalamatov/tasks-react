import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FaCheck, FaTrash, FaExclamation } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import bg from './assets/bg.png';

const getTasks = () => {
  const storedTasks = JSON.parse(localStorage.getItem('tasks'));
  return storedTasks || [
    {
      id: uuidv4(),
      name: 'Earn $1.000.000',
      dueDate: '2024-09-01',
      priority: 'low',
      status: 'pending'
    },
    {
      id: uuidv4(),
      name: 'Make a trip to Mars',
      dueDate: '2024-09-02',
      priority: 'medium',
      status: 'completed'
    },
    {
      id: uuidv4(),
      name: 'Buy a new island',
      dueDate: '2024-09-03',
      priority: 'high',
      status: 'pending'
    }
  ];
}

const App = () => {

  const [tasks, setTasks] = useState(getTasks);
  const [newTask, setNewTask] = useState({
    name: '',
    dueDate: '',
    priority: 'low',
    status: 'pending'
  });

  useEffect(() => {
    // Load tasks from local storage on initial render
    const storedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (storedTasks) {
      setTasks(storedTasks);
    }
  }, []);

  useEffect(() => {
    // Save tasks to local storage whenever tasks state changes
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]); // Add tasks as a dependency

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTask(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newTask.name.trim() === ''
      // || newTask.dueDate.trim() === ''
    ) {
      // alert('Please provide task name and due date.');
      return;
    }
    setTasks(prevState => [...prevState, { ...newTask, id: uuidv4() }]);
    setNewTask({
      name: '',
      dueDate: '',
      priority: 'low',
      status: 'pending'
    });
  };

  //sort by parameter either name, dueDate, priority or status
  const handleSort = (parameter) => {
    const sortedTasks = tasks.sort((a, b) => {
      if (a[parameter] < b[parameter]) {
        return -1;
      }
      if (a[parameter] > b[parameter]) {
        return 1;
      }
      return 0;
    });
    setTasks([...sortedTasks]);
  };


  const handleEditName = (id, newName) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, name: newName } : task
    );
    setTasks(updatedTasks);
  };

  const handleEditDueDate = (id, newDueDate) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, dueDate: newDueDate } : task
    );
    setTasks(updatedTasks);
  };

  const handleEditStatus = (id) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, status: task.status === 'completed' ? 'pending' : 'completed' } : task
    );
    setTasks(updatedTasks);
  };

  const handleDelete = (id) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
  };

  return (
    <div className='flex justify-center items-center h-full min-h-screen'>
      <div className="mx-auto w-full mb-10">
        <div className='sticky top-0 py-4 mx-auto bg-white w-full shadow-lg border-b-2 border-dashed border-blue-300'>
          <h1 className="text-3xl font-semibold my-4 text-center">Task Manager</h1>
          <form onSubmit={handleSubmit} className="mb-4 flex flex-wrap justify-center items-center flex-row gap-4">
            <input required type="text" name="name" placeholder="Enter task name" value={newTask.name} onChange={handleChange} className="text-lg font-semibold mr-2 border border-gray-300 rounded-full px-4 py-2" />
            <input type="date" name="dueDate" value={newTask.dueDate} onChange={handleChange} className="text-lg font-semibold mr-2 border border-gray-300 rounded-full px-4 py-2" />
            <select required name="priority" value={newTask.priority} onChange={handleChange} className="text-lg font-semibold mr-2 border border-gray-300 rounded-full px-4 py-2">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <button type="submit" className="mr-2 p-2 bg-blue-500 text-white rounded-full border-2 border-white hover:bg-blue-600 hover:font-bold px-4 py-2.5">+ Add Task</button>
          </form>
          <div className='flex flex-row justify-center flex-wrap gap-5'>
            <p onClick={()=>handleSort('name')} className='cursor-pointer mr-2 p-2 bg-blue-500 text-white rounded-full border-2 border-white hover:bg-blue-600 hover:font-bold px-4 py-2.5'>
              sort by name
            </p>
            <p onClick={() => handleSort('dueDate')} className='cursor-pointer mr-2 p-2 bg-blue-500 text-white rounded-full border-2 border-white hover:bg-blue-600 hover:font-bold px-4 py-2.5'>
              sort by due date
            </p>
            <p onClick={() => handleSort('priority')} className='cursor-pointer mr-2 p-2 bg-blue-500 text-white rounded-full border-2 border-white hover:bg-blue-600 hover:font-bold px-4 py-2.5'>
              sort by priority
            </p>
            <p onClick={() => handleSort('status')} className='cursor-pointer mr-2 p-2 bg-blue-500 text-white rounded-full border-2 border-white hover:bg-blue-600 hover:font-bold px-4 py-2.5'>
              sort by status
            </p>
          </div>
        </div>
        <div className='p-4 select-none'>
          {tasks.map(task => (
            <div key={task.id} className="mb-4 p-4 border rounded-full max-lg:rounded-3xl shadow-md flex justify-between items-center"
              {
                ...task.status === 'completed' ? { style: { background: 'linear-gradient(to right, #0ccda3, #c1fcd3)' } } : { style: { background: 'linear-gradient(to right, #f6ea41, #f048c6)' } }
              }
            >
              <div className='flex flex-row gap-4 items-center flex-wrap'>
                  <input type="text" value={task.name} onChange={(e) => handleEditName(task.id, e.target.value)} className="text-lg font-semibold mr-2 border-b border-gray-300 rounded-full px-4 py-2" />
                  <input type="date" value={task.dueDate} onChange={(e) => handleEditDueDate(task.id, e.target.value)} className="text-sm text-gray-500 mr-2 border-b border-gray-300 rounded-full px-4 py-3" />
                <p onClick={() => handleEditStatus(task.id)} className={`cursor-pointer select-none bg-white px-4 py-3 rounded-full text-sm ${task.status === 'completed' ? 'text-green-500' : 'text-red-500'}`}>{task.status}</p>
                {
                  task.priority === 'medium' ? <FaExclamation className="text-sm text-yellow-500" /> :
                    task.priority === 'high' && <FaExclamation className="text-sm text-red-500" />
                }
              </div>
              <div className='flex flex-row flex-wrap gap-4 justify-end'>
                <button onClick={() => handleEditStatus(task.id)} className="mr-2 p-2 bg-blue-500 text-white rounded-full flex flex-row items-center border-2 border-white hover:bg-blue-600 hover:font-bold px-4 py-2.5">
                  {task.status === 'completed' ? <FaCheck /> : <ImCross />}
                  <span className="ml-1">{task.status === 'completed' ? 'Reopen' : 'Close'}</span>
                </button>
                <button onClick={() => handleDelete(task.id)} className="p-2 bg-red-500 text-white rounded-full flex flex-row items-center border-2 border-white hover:bg-red-600 hover:font-bold px-4 py-2.5">
                  <FaTrash />
                  <span className="ml-1">Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="fixed bottom-0 w-full bg-gray-800 text-white text-center p-4">
        <p>Azamat Salamatov &copy; {new Date().getFullYear()}</p>
      </div>
    </div>
  );
};

export default App;
