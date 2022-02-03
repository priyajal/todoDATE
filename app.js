const express = require("express");

const app = express();

module.exports = app;

const path = require("path");

const { open } = require("sqlite");

const sqlite3 = require("sqlite3");

let dbPath = path.join(__dirname, "todoApplication.db");

let db = null;

app.use(express.json());

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,

      driver: sqlite3.Database,
    });

    app.listen(3000, () => {
      console.log("Server has started");
    });
  } catch (e) {
    console.log(`DbError: ${e.message}`);

    process.exit(1);
  }
};

initializeDbAndServer();

app.get("/todos/:todoId/", async (request, response) => {
  try {
    const { todoId } = request.params;

    const getTodoIdQuery = `
    select
    *
    from todo
    where id = ${todoId}
    `;
    const getTodo = await db.get(getTodoIdQuery);
    response.send(getTodo);
  } catch (e) {
    console.log(e.message);
  }
});

//API GET TODO

app.get("/todos/", async (request, response) => {
  try {
    const {
      search_q = "",
      category = "",
      priority = "",
      status = "",
    } = request.query;

    const getTodoQuery = `
    select
    *
    from todo
    where todo like '%${search_q}%' and category like '%${category}%' and priority like '%${priority}%' and status like '%${status}%'
    `;
    const getTodoArray = await db.all(getTodoQuery);
    response.send(getTodoArray);
  } catch (e) {
    console.log(e.message);
  }
});

//API GET AGENDA

app.get("/agenda/", async (request, response) => {
  try {
    const { date } = request.query;

    const getTodoAgendaQuery = `
    select
    *
    from todo
    where due_date = ${date}
    `;
    const getTodoAgenda = await db.get(getTodoAgendaQuery);
    response.send(getTodoAgenda);
  } catch (e) {
    console.log(e.message);
  }
});

//API CREATE TODO

app.post("/todos/", async (request, response) => {
  try {
    const { id, todo, category, priority, status, dueDate } = request.body;

    const getTodoQuery = `
    insert into todo(id,todo,category,priority,status,due_date)
    values(${id},'${todo}','${category}','${priority}','${status}','${dueDate}')
    
    `;
    await db.run(getTodoQuery);
    response.send("Todo Successfully Added");
  } catch (e) {
    console.log(e.message);
  }
});

//API UPDATE TODO

app.get("/todos/:todoId/", async (request, response) => {
  try {
    const { todoId } = request.params;
    const { todo, category, priority, status, dueDate } = request.body;

    if (todo !== undefined) {
      const updateTodoQuery = `
    update todo
    set todo = '${todo}'
    where id = ${todoId}
    `;
      await db.run(updateTodoQuery);
      response.send("Todo Updated");
    }

    if (status !== undefined) {
      const updateTodoQuery = `
    update todo
    set status = '${status}'
    where id = ${todoId}
    `;
      await db.run(updateTodoQuery);
      response.send("Status Updated");
    }
    if (category !== undefined) {
      const updateTodoQuery = `
    update todo
    set category = '${category}'
    where id = ${todoId}
    `;
      await db.run(updateTodoQuery);
      response.send("Category Updated");
    }
    if (priority !== undefined) {
      const updateTodoQuery = `
    update todo
    set priority = '${priority}'
    where id = ${todoId}
    `;
      await db.run(updateTodoQuery);
      response.send("Priority Updated");
    }
    if (dueDate !== undefined) {
      const updateTodoQuery = `
    update todo
    set due_date = '${dueDate}'
    where id = ${todoId}
    `;
      await db.run(updateTodoQuery);
      response.send("Due Date Updated");
    }
  } catch (e) {
    console.log(e.message);
  }
});

//API DELTE TODO

app.get("/todos/:todoId/", async (request, response) => {
  try {
    const { todoId } = request.params;

    const getTodoIdQuery = `
    delete
    from todo
    where id = ${todoId}
    `;
    db.run(getTodoIdQuery);
    response.send("Todo Deleted");
  } catch (e) {
    console.log(e.message);
  }
});
