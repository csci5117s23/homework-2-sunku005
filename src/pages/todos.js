import Head from 'next/head'
import {useState, useEffect} from 'react'
import Link from 'next/link'
import { useAuth } from '@clerk/nextjs';

// const BACKEND_BASE= "http://localhost:3001/dev/";
const BACKEND_BASE = process.env.NEXT_PUBLIC_BACKEND_BASE_URL

export default function Todo() {
    const { isLoaded, userId, sessionId, getToken } = useAuth();
    const [loggedIn, setLoggedIn] = useState(false);
    const [todoList, setTodoList] = useState([]);
    const API_ENDPOINT = BACKEND_BASE + "todo/";
    const getTodosFromApi = async (authToken) => {
      // DON"T FORGET: SET THIS VALUE FROM AN ENV VARIABLE
      const response = await fetch(API_ENDPOINT, {
        method:'GET',
        headers: {'Authorization': 'Bearer ' + authToken},
      });
      if(response.ok){
        const data = await response.json();
        const sorted = data.sort((a, b) => {return new Date(b.lastUpdatedTime) - new Date(a.lastUpdatedTime)});
        console.log("data", sorted);
        setTodoList(sorted);
      }
    };

    useEffect(() => {
      async function process() {
        if (userId) {
          console.log("user id", userId);
          const authToken = await getToken({ template: "codehooks" }); // get the token
          console.log("authToken", authToken);
          console.log("userId", userId);
          setLoggedIn(true);
          await getTodosFromApi(authToken);
        }
        else{
          console.log("Error user not logged in");
        }
      }
      process();
    }, [isLoaded]);

    const handleSubmit = async (evt) => {
      evt.preventDefault();
      const name =  evt.target.name.value;
      const description = evt.target.description.value;
      const done = evt.target.done.checked;

      if(userId&&name&&description){
        const data = {
          name: name, 
          description: description, 
          done: done,
          userId: userId,
        };
        console.log('data', data);
        const authToken = await getToken({ template: "codehooks" }); // get the token
        const response = await fetch(API_ENDPOINT, {
          method:'POST',
          mode: "cors",
          headers: {
            'Content-Type': "application/json",
            'Authorization': 'Bearer ' + authToken
          },
          body: JSON.stringify(data)
        });
        
        if(response.ok){
          console.log('response', response);
          await getTodosFromApi(authToken);
        }

      }
      else {
        console.log("Invalid input. Name and Description must not be empty");
      }
    }

    return (
      <>
        <Head>
          <title>Anoushka's todo list</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main>
          {loggedIn?
            <div>
              <h1>Welcome to the TODO list </h1>
               
              <form className = "add-task-form" onSubmit={handleSubmit}>
              <h3>Add a new task: </h3>   
                <label>
                  Name:
                  <input type="textarea" name="name" />
                </label>
                <br/>
                <label>
                  Description:
                  <input type="textarea" name="description" />
                </label>
                <br/>
                <label>
                  Done:
                  <input type="checkbox" id="done" name="done" value="true"/>
                </label>
                <br/>
                <input type="submit" value="Submit" />
              </form>
              <br/>
              <h3>Todo items (see <Link href="/done">done</Link> for a list of already completed todos)</h3>
              {/* <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Done</th>
                    <th>Last Updated Time</th>
                    <th>Link</th>
                  </tr>
                </thead>
                <tbody>
                {todoList.map(todoItem => 
                <tr>
                  <td>{todoItem.name}</td>
                  <td>{todoItem.description}</td>
                  <td>{todoItem.done? <p>Done</p> : <p>Not Done</p>}</td>
                  <td>{todoItem.lastUpdatedTime}</td>
                  <td><Link href={"/todo/"+todoItem._id}>{todoItem._id}</Link></td>
                  </tr>)}
                </tbody>
              </table> */}



                {todoList.map(todoItem => 
                <div className= "task-item">
                  <div>Task: {todoItem.name}</div>
                  <div>Description: {todoItem.description}</div>
                  <div>Status: {todoItem.done? <p><b>Done</b></p> : <p><b>Not Done</b></p>}</div>
                  <div>{todoItem.lastUpdatedTime}</div>
                  <div><Link href={"/todo/"+todoItem._id}>click for more details</Link></div>
                  </div>)}


            </div>
          :
            <div>
              <Link href="/">Please Sign In</Link>
            </div>
          }
        </main>
      </>
    )
  }
  