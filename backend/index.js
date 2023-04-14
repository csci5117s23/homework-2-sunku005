
/*
* Auto generated Codehooks (c) example
* Install: npm i codehooks-js codehooks-crudlify yup jwt-decode
*/
import {app, Datastore} from 'codehooks-js'
import {crudlify} from 'codehooks-crudlify'
import { date, object, string, boolean } from 'yup';
import jwtDecode from 'jwt-decode';

const userAuth = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (authorization) {
      const token = authorization.replace('Bearer ','');
      // NOTE this doesn't validate, but we don't need it to. codehooks is doing that for us.
      const token_parsed = jwtDecode(token);
      req.user_token = token_parsed;
    }
    next();
  } catch (error) {
    next(error);
  } 
}
app.use(userAuth)

// test route for https://<PROJECTID>.api.codehooks.io/dev/
app.get('/', (req, res) => {
  res.send('CRUD server ready')
})

const todoSchemaYup = object({
  name: string().required(),
  userId: string().required(),
  lastUpdatedTime: date().default(() => new Date()),
  description: string().required(),
  done: boolean().required()
});


// Use Crudlify to create a REST API for any collection
crudlify(app, {todo: todoSchemaYup})

// bind to serverless runtime
export default app.init();
