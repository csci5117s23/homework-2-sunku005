import Head from 'next/head'
import {useState, useEffect} from 'react'
import Link from 'next/link'
import { useAuth } from '@clerk/nextjs';

// const BACKEND_BASE= "http://localhost:3001/dev/";
const BACKEND_BASE = process.env.NEXT_PUBLIC_BACKEND_BASE_URL

export default function Done() {
    const { isLoaded, userId, sessionId, getToken } = useAuth();
    const [loggedIn, setLoggedIn] = useState(false);
    const [todoList, setTodoList] = useState([]);
    const API_ENDPOINT = BACKEND_BASE + "/todo/";
    const getDoneFromApi = async (authToken) => {
      // TODO BEFORE SUBMITTING SET THIS VALUE FROM AN ENV VARIABLE
      const response = await fetch(API_ENDPOINT, {
        method:'GET',
        headers: {'Authorization': 'Bearer ' + authToken},
      });
      if (response.ok) {
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
          await getDoneFromApi(authToken);
        }
        else{
          console.log("Error user not logged in");
        }
      }
      process();
    }, [isLoaded]);
    

    return (
      <>
        <Head>
          <title>Anoushka's todo list</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main>
          {loggedIn? 
            <div>
              <h1>Items that are Completed</h1>
              <h3>Todo items (see <Link href="/todos">todos</Link> for a list of all todos)</h3>
              {/* <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Done</th>
                    <th>Last Updated Time</th>
                  </tr>
                </thead>
                <tbody>
                {todoList.filter(todoItem => todoItem.done).map(todoItem => <tr><td>{todoItem.name}</td><td>{todoItem.description}</td><td>{todoItem.done? <p>Done</p> : <p>Not Done</p>}</td><td>{todoItem.lastUpdatedTime}</td></tr>)}
                </tbody>
              </table> */}
               {todoList.filter(todoItem => todoItem.done).map(todoItem =>
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
  