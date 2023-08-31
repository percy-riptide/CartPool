# Setting up backend in local machine

> Connecting to database using workbench and NodeJS

- Connect the DEV instance of the database provided by Dalhousie to Workbench.
- Run the `server.js` file of the backend in your IDE. <em>Note: You can use command `npm start`</em>.

* To access database in your React app via API, use URL: `http://localhost:3001/CSCI5308_26_DEVINT/{operation}`, where `{operation}` is defined further in the file.

&nbsp;
# Running Test Cases
To run test cases using jest, type the following command in the command prompt in the backend directory:
> ### npm install jest
To run all the test suites:
>### npm test
To generate coverage level report:
>### jest --coverage

&nbsp;

# API Specifications

Access database for different CRUD operations

> ## Create

- `POST` request
- URL: `http://localhost:3001/CSCI5308_26_DEVINT/create`
- Pass the table name in `table` key
- Pass the values to insert under the key `setValues` and `key` should be the atribute name and `value` should be the actual value that needs to be inserted.

Eg (Body of POST request):

```yaml
{
  "table": "customers",
  "setValues":
    { "id": "2", "fname": "Jane", "lname": "Doe", "phone": "1234567890" },
}
```

&nbsp;

> ## Read

- `POST` request
- URL: `http://localhost:3001/CSCI5308_26_DEVINT/fetch`
- Pass the table name in `table` key

&nbsp;

> > For reading specific row(s):

- Pass the attribute name in `attribute` key
- Pass the value for that attribute in `value` key
- Pass the operator for comparison in `operator` key

Eg (Body of POST request):

```yaml
{ "table": "customers", "attribute": "id", "value": "1", "operator": ">" }
```

> > For reading all rows without conditions:

- Pass the `true` for in `allRows` key

Eg (Body of POST request):

```yaml
{ "table": "customers", "allRows": true }
```

> ## Update

- `POST` request
- URL: `http://localhost:3001/CSCI5308_26_DEVINT/update`
- Pass the table name in `table` key
- Pass the attribute name in `attribute` key for comparison in SQL purposes
- Pass the value for that attribute in `value` key
- Pass the operator for comparison in `operator` key
- Pass the values to update under the key `setValues` and `key` should be the atribute name and `value` should be the actual value that needs to be updated.

Eg (Body of POST request):

```yaml
{
  "table": "customers",
  "attribute": "id",
  "value": "0",
  "operator": ">",
  "setValues": { "phone": "1234567899" },
}
```

> ## Delete

- `POST` request
- URL: `http://localhost:3001/CSCI5308_26_DEVINT/delete`
- Pass the attribute name in `attribute` key
- Pass the value for that attribute in `value` key
- Pass the operator for comparison in `operator` key

Eg (Body of POST request):

```yml
{ "table": "customers", "attribute": "fname", "value": "Jane", "operator": "=" }
```
