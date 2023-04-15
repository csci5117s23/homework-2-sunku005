import Head from 'next/head'
import { useRouter } from "next/router";
import {useState, useEffect} from 'react'
import Link from 'next/link'
import { useAuth } from '@clerk/nextjs';

// const BACKEND_BASE= "http://localhost:3001/dev/";
const BACKEND_BASE = process.env.NEXT_PUBLIC_BACKEND_BASE_URL

export default function Todo() {
    const { isLoaded, userId, sessionId, getToken } = useAuth();
    const [loggedIn, setLoggedIn] = useState(false);
    const TODO_ENDPOINT = BACKEND_BASE + "todo/";
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [done, setDone] = useState(false);
    const [updating, setUpdating] = useState(false);
    const router = useRouter();
    const {id} = router.query;


    const getTodoItemFromApi = async (authToken) => {
      if(id){
        const API_ENDPOINT = TODO_ENDPOINT+id;
        const response = await fetch(API_ENDPOINT, {
          method:'GET',
          headers: {'Authorization': 'Bearer ' + authToken},
        });
        
        if(response.ok){
          const data = await response.json();
          console.log('data');
          console.log(data);
          if(data){
            setName(data.name);
            setDescription(data.description);
            setDone(data.done);
          }
        }
      }
    }

    useEffect(() => {
      async function process() {
        if (userId) {
          console.log("user id", userId);
          const authToken = await getToken({ template: "codehooks" }); // get the token
          console.log("authToken", authToken);
          console.log("userId", userId);
          setLoggedIn(true);
          await getTodoItemFromApi(authToken);
        }
        else{
          console.log("Error user not logged in");
        }
      }
      process();
    }, [isLoaded]);


    const handleSubmit = async (evt) => {
      evt.preventDefault();
      if(id){
        const API_ENDPOINT = TODO_ENDPOINT+id;
        const updatedName = evt.target.name.value;
        const updatedDescription = evt.target.description.value;
        const updatedDone = evt.target.done.checked;
        if((updatedName != name ) || (updatedDescription != description ) || (updatedDone != done )) {
          const data = {
            name: updatedName,
            description: updatedDescription,
            done: updatedDone,
            lastUpdatedTime: new Date(),
          };
          console.log('data', data);
          const response = await fetch(API_ENDPOINT, {
            method:'PATCH',
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
          })
          console.log('response', response);
          if(response.ok){
            setName(updatedName);
            setDescription(updatedDescription);
            setDone(updatedDone);
          }
        }
      }
    }


    return (
      <>
        <Head>
          <title>Anoushka's todo item</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main >
          {loggedIn? 
          <div>
            <h1>TODO item: {name}</h1>
            <h3> description: {description}</h3>
            <form className = "id-update" onSubmit={handleSubmit}>
              <label htmlFor="name">Todo item name:</label><br/>
              <input type="text" id="name" name="name" defaultValue={name}/><br/>
              <label htmlFor="description">Todo item description:</label><br/>
              <input type="text" id="description" name="description" defaultValue={description}/><br/>
              <label htmlFor="done">Todo item done:</label><br/>
              <input type="checkbox" id="done" name="done" defaultChecked={done}/><br/>
              <input type="submit" value="Update Todo"/>
            </form>
            <h4>Return to <Link href="/todos">All todos</Link> for a list of all todos</h4>
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
  