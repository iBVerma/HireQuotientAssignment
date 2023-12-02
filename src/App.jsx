import { useState } from 'react'
import './App.css'
import axios from "axios"
import Icon from "react-crud-icons"
import Deleteicon from "./assets/delete.png"
import Editicon from "./assets/edit.png"
import ReactPaginate from "react-paginate";
import backward from "./assets/backward.png"
import forward from "./assets/forward.png"
import fastforward from "./assets/fastforward.png"
import backfastforward from "./assets/backfastforward.png"
import { useEffect } from 'react'
import { PieChart,Pie } from 'recharts'
import Stats from './Stats'

function App() {
  const [In, setIn] = useState("");
  const [data,setdata]=useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(10);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [editingId, setEditingId] = useState(null); 
  const [editedUser, setEditedUser] = useState({});
  const [admins,setadmins]=useState(0);
  const [members,setmembers]=useState(0);
  
  const handleinput =(e)=>{
    setIn(e.target.value);
  }

  const handleInputChange = (e, field) => {
    setEditedUser({ ...editedUser, [field]: e.target.value });
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(import.meta.env.VITE_API_ENDPOINT);
        const fetchedData = res.data.sort((a, b) => a.id - b.id);
        const c = fetchedData.filter(user=>user.role==='admin')
        const d = fetchedData.filter(user=>user.role==='member')
        setadmins(c.length);
        setmembers(d.length);
        setdata(fetchedData);
      } catch (error) {
        console.log('Error fetching initial data:', error);
      }
    }

    fetchData(); // Fetch data when the component mounts
  }, []);

  async function handlesearch(){
    try{
      const res =await axios.get(import.meta.env.VITE_API_ENDPOINT);
      const b = res.data.sort((a,b) => a.id-b.id);
      const a = In.toLowerCase().trim()
      console.log(a);
      if(a.length>0){
        const filteredUsers = b.filter((user) =>
          Object.values(user).some(
            (value) =>
              value.toLowerCase().includes(a)
          )
        );
        console.log(filteredUsers);
        const c = filteredUsers.filter(user=>user.role==='admin')
        const d = filteredUsers.filter(user=>user.role==='member')
        setadmins(c.length);
        setmembers(d.length);
        setdata(filteredUsers);
      }else{
        const c= b.filter(user=>user.role==='admin')
        const d = b.filter(user=>user.role==='member')
        setadmins(c.length);
        setmembers(d.length);
        setdata(b);
      }
    }catch{
      console.log("Error on fetching Users");
    }
  }

  const handleRowSelection = (userId) => {
    if (selectedRows.includes(userId)) {
      setSelectedRows(selectedRows.filter(id => id !== userId));
    } else {
      setSelectedRows([...selectedRows, userId]);
    }
  };
  
  const handleDeleteSelected = () => {
    console.log('Deleting selected users:', selectedRows);
    const updatedData = data.filter(user => !selectedRows.includes(user.id));
    setdata(updatedData);
    setSelectedRows([]);
    setSelectAll(false);
  };
  
  const deleteall = ()=>{
    setdata([]);
    setSelectAll(false);
    setSelectedRows([]);
  }
  
  const handleEdit = (user) => {
    setEditingId(user.id);
    setEditedUser(user)
  };

  const handleDelete = (userId) => {
    const updatedUsers = data.filter(user => user.id !== userId);
    setdata(updatedUsers);
    const c = updatedUsers.filter(user=>user.role==='admin')
    const d = updatedUsers.filter(user=>user.role==='member')
    setadmins(c.length);
    setmembers(d.length);
  };

  const handleSave = (userId) => {
    const updatedData = data.map(user => {
      if (user.id === userId) {
        return { ...editedUser };
      }
      return user;
    });

    setdata(updatedData);
    setEditingId(null);
    setEditedUser({});
    
  };
  
  const handleKeyDown = (e, userId) => {
    // console.log(e.key,userId);
    if(userId===undefined&&e.key==='Enter'){
      console.log("here");
      handlesearch();
    }
    else if (e.key === 'Enter') {
      handleSave(userId);
    }
  };
  const pageCount = Math.ceil(data.length / recordsPerPage);
  const indexOfLastPost = currentPage * recordsPerPage;
  const indexOfFirstPost = indexOfLastPost - recordsPerPage;
  const currentrecords = data.slice(indexOfFirstPost, indexOfLastPost);

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setSelectedRows(currentrecords.map(user => user.id));
    } else {
      setSelectedRows([]);
      setSelectAll(false); // Uncheck the "Select All" checkbox
    }
  };
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const nextPage = () => {
    if (currentPage < Math.ceil(data.length / recordsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const goToFirstPage = () => {
    setCurrentPage(1);
  };

  const goToLastPage = () => {
    setCurrentPage(Math.ceil(data.length / recordsPerPage));
  };



  const renderPagination = () => {
    const pageNumbers = [];
    for (let i = 1; i <= pageCount; i++) {
      const isActive = i === currentPage ? 'active-page' : ''; // Check if it's the current page
  
      pageNumbers.push(
        <button key={i} onClick={() => handlePageChange(i)} className={`page-number ${isActive}`}>
          {i}
        </button>
      );
    }
    return <div>{pageNumbers}</div>;
  };


  

  return (
    <>
      <div className="input-bar">
        <input type="text" placeholder="Search" onChange={handleinput} onKeyDown={(e)=>handleKeyDown(e)}/>
        <button className='search-icon' onClick={handlesearch}>Search</button>
      </div>
      <div className='table'>
        <div className='intable'>
          <label>
            <input
              type="checkbox"
              checked={selectAll}
              onChange={toggleSelectAll}
            />
            Select All
          </label>
          <Stats totalusers = {data.length} admins = {admins} members = {members}/>
          <img src={Deleteicon} className='top-delete' onClick={deleteall}/>
        </div>
        <table className='user-table'>
          <thead>
            <tr>
              <th></th>
              <th className='attribute'>Name</th>
              <th className='attribute'>Email</th>
              <th className='attribute'>Role</th>
              <th className='attribute'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(data)&&
              currentrecords.map(i=>{
                const isSelected = selectedRows.includes(i.id);
                return(<tr key={i.id} className={isSelected ? 'selected-row' : ''} >
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(i.id)}
                      onChange={() => handleRowSelection(i.id)}
                    />
                  </td>
                  <td>{editingId === i.id ? (
                    <input
                      type="text"
                      value={editedUser.name}
                      onChange={(e)=>handleInputChange(e,"name")}
                      onKeyDown={(e) => handleKeyDown(e, i.id)}
                      className='table-input'
                    />
                  ) : (
                    i.name
                  )}
                  </td>
                  <td>
                    {editingId === i.id ? (
                      <input
                        type="text"
                        value={editedUser.email || ''}
                        onChange={(e) => handleInputChange(e, 'email')}
                        onBlur={(e)=>handleKeyDown(e,i.id)}
                        onKeyDown={(e) => handleKeyDown(e, i.id)}
                        className='table-input'
                      />
                    ) : (
                      i.email
                    )}
                  </td>
                  <td>
                    {editingId === i.id ? (
                      <input
                        type="text"
                        value={editedUser.role || ''}
                        onChange={(e) => handleInputChange(e, 'role')}
                        onKeyDown={(e) => handleKeyDown(e, i.id)}
                        className='table-input'
                      />
                    ) : (
                      i.role
                    )}
                  </td>
                  <td>
                    <div className='table-actions'>
                      <img src={Editicon} onClick={()=>handleEdit(i)} className='edit'></img>
                      <img src={Deleteicon} onClick={()=>handleDelete(i.id)} className='delete'></img>
                    </div>
                      
                  </td>

                </tr>
                )
              })
            }
          </tbody>
        </table>
        <div className='below-table'>
          <div className='delete-selected'>
            <button onClick={handleDeleteSelected}>Delete Selected</button>
            <h3>{selectedRows.length===0?0:selectedRows.length} of {data.length} rows Selected</h3>
          </div>
          <div className='pagination'>
            <h3>Page {currentPage} of {pageCount}</h3>
            <div className='first-page'>
              <img src={backfastforward} onClick={goToFirstPage}/>
            </div>
            <div className='previous-page'>
              <img src={backward} onClick={prevPage}/>
            </div>
            {renderPagination()}
            <div className='next-page'>
              <img src={forward} onClick={nextPage}/>
            </div>
            <div className='last-page'>
              <img src={fastforward} onClick={goToLastPage}/>
            </div>
          </div>
          
        </div>
      </div>
    </>
  )
}

export default App
